
-- 1. Harden handle_new_user to support OAuth metadata variants
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role public.app_role;
  meta jsonb;
  v_full_name text;
  v_avatar_url text;
BEGIN
  meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);

  v_full_name := COALESCE(
    meta->>'full_name',
    meta->>'name',
    meta#>>'{user_metadata,full_name}'
  );
  v_avatar_url := COALESCE(
    meta->>'avatar_url',
    meta->>'picture'
  );

  -- Profile
  BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, avatar_url)
    VALUES (NEW.id, v_full_name, NEW.email, meta->>'phone', v_avatar_url)
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'profiles insert failed for %: %', NEW.id, SQLERRM;
  END;

  -- Role
  BEGIN
    user_role := COALESCE((meta->>'role')::public.app_role, 'consumer');
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'user_roles insert failed for %: %', NEW.id, SQLERRM;
    user_role := 'consumer';
  END;

  -- Company profile
  IF user_role = 'company' AND meta ? 'company_name' THEN
    BEGIN
      INSERT INTO public.company_profiles (
        user_id, company_name, company_size, contact_role, website, phone, industry
      )
      VALUES (
        NEW.id,
        meta->>'company_name',
        meta->>'company_size',
        meta->>'contact_role',
        meta->>'website',
        meta->>'phone',
        meta->>'industry'
      )
      ON CONFLICT (user_id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'company_profiles insert failed for %: %', NEW.id, SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$function$;

-- 2. (Re)create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill missing profiles
INSERT INTO public.profiles (id, full_name, email, avatar_url)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
       u.email,
       COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- 4. Backfill missing roles
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, COALESCE((u.raw_user_meta_data->>'role')::public.app_role, 'consumer')
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL;
