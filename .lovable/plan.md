

## Plan: Unified registration, Apple login, profiles & linked data

### 1. Database (one migration)

**Enum + roles**
- `app_role` enum: `'consumer' | 'practitioner' | 'company'`
- `user_roles(id, user_id → auth.users ON DELETE CASCADE, role, unique(user_id, role))`
- `has_role(_user_id, _role)` SECURITY DEFINER function

**Profiles**
- `profiles(id PK = auth.users.id, full_name, email, phone, avatar_url, created_at, updated_at)` — RLS owner-only
- `company_profiles(id, user_id unique → auth.users, company_name, company_size, contact_role, website, phone, industry, notes, timestamps)` — RLS owner-only

**Trigger `handle_new_user()`** — on `auth.users` insert:
- Insert into `profiles` from `raw_user_meta_data`
- Insert role into `user_roles` (default `consumer` if missing — for OAuth)
- If role = `company` and metadata has company fields, insert into `company_profiles`

**Link existing tables**
- Add nullable `user_id uuid REFERENCES auth.users(id)` to `questionnaire_responses`, `practitioner_applications`, `course_applications`
- New `corporate_inquiries(id, user_id, company_id → company_profiles, needs[], format, budget, expectations, recommendation jsonb, created_at)` — RLS owner-only
- Tighten RLS on `questionnaire_responses`: keep anonymous insert, but SELECT only own rows when `user_id IS NOT NULL` (drop the public read-all)

### 2. Unified Signup (`src/pages/Signup.tsx`)

3 tabs: **משתמש/ת | מומחה/ית | חברה/ארגון**
- Common: full name, email, password, confirm, T&Cs
- Practitioner: + professional title, phone
- Company: + company name, company size (dropdown), contact role, website (optional), phone

Submit → `supabase.auth.signUp` with `options.data = { full_name, role, ...extras }`. Trigger handles profiles + role + company_profiles. Redirect: consumer→`/`, practitioner→`/join-as-practitioner`, company→`/corporate`.

### 3. OAuth (Google + Apple) with role prompt

- Add Apple button on `Login.tsx` and `Signup.tsx` (alongside Google) using `lovable.auth.signInWithOAuth("apple", …)`
- **On signup page**, before triggering OAuth, show a small role-picker modal ("איך תרצו להירשם?") with the 3 options. Selected role is stored in `sessionStorage` as `pending_role`.
- After OAuth callback completes (in `AuthContext` or a small post-login hook), if `pending_role` exists and the user has no role yet, insert into `user_roles` and clear the flag.
- On `Login.tsx`, OAuth just signs in (no prompt) — role already exists.

### 4. Companies require login on `/corporate`

- `/corporate` wrapped in an auth gate: if not logged in → redirect to `/signup?role=company&next=/corporate` (signup pre-selects company tab).
- On submit, write to new `corporate_inquiries` with `user_id` + linked `company_id` (looked up from `company_profiles`).

### 5. Link existing forms to user

- `Questionnaire.tsx`, `PractitionerForm`, `CourseForm` → include `user_id: user?.id ?? null` in inserts.

### 6. Navbar greeting + logout

- New `useProfile()` hook reads `profiles.full_name` (fallback to `user.user_metadata.full_name`).
- When logged in, replace login/signup buttons with a pill: `שלום, {firstName}` + `יציאה`. Same in mobile menu.

### Files

**New:** migration; `src/hooks/useProfile.ts`; small `RolePickerModal` component for OAuth signup.
**Modified:** `Signup.tsx`, `Login.tsx`, `Navbar.tsx`, `AuthContext.tsx` (handle pending_role after OAuth), `Questionnaire.tsx`, `CorporateWellness.tsx` (auth gate + persist), `PractitionerForm.tsx`, `CourseForm.tsx`.
**Cloud config:** run Configure Social Login to enable Apple alongside Google.

### Out of scope (can be next)

- Account/settings page to view/edit profile or change role
- Admin dashboard for reviewing applications
- Backfilling existing anonymous rows to users

