

## Root cause

The `handle_new_user()` function exists in the database, but the **trigger that calls it on `auth.users` insert is missing**. I confirmed via `information_schema.triggers` — there are zero triggers on the `auth` schema. As a result:

- 3 users exist in `auth.users` (including 1 Google OAuth signup `romi@people360.co.il`)
- Only **1** row exists in `profiles` and `user_roles`
- Google/Apple users don't go through our Signup form (they only hit the OAuth callback), so no profile is created — only the trigger could populate it.

## Fix (one migration)

1. **Recreate the trigger on `auth.users`** so it fires for every new signup (email + OAuth):
   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

2. **Harden `handle_new_user()`** to also read OAuth-provided fields:
   - Pull `full_name` from `raw_user_meta_data.full_name` OR `name` (Google) OR `raw_user_meta_data.user_metadata.full_name`.
   - Pull `avatar_url` from `raw_user_meta_data.avatar_url` OR `picture` (Google).
   - Wrap each insert in its own exception block so a failure on `company_profiles` never blocks profile creation (which is what currently kills the whole signup silently for some flows).

3. **Backfill existing OAuth users** that are missing rows:
   ```sql
   INSERT INTO public.profiles (id, full_name, email, avatar_url)
   SELECT u.id,
          COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
          u.email,
          COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture')
   FROM auth.users u
   LEFT JOIN public.profiles p ON p.id = u.id
   WHERE p.id IS NULL;

   INSERT INTO public.user_roles (user_id, role)
   SELECT u.id, COALESCE((u.raw_user_meta_data->>'role')::public.app_role, 'consumer')
   FROM auth.users u
   LEFT JOIN public.user_roles r ON r.user_id = u.id
   WHERE r.user_id IS NULL;
   ```

## No client-side code changes needed

The `AuthContext` `pending_role` fallback already handles role assignment for OAuth users where the trigger defaults to `consumer`. Once the trigger is restored, every new signup — email, Google, or Apple — will get a `profiles` row + `user_roles` row automatically, and existing orphaned users will be backfilled.

## Files

- **New migration**: recreate trigger, harden function, backfill rows.

