-- 1. Roles enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('consumer', 'practitioner', 'company');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 2. Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- 3. Company profiles
CREATE TABLE public.company_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  company_size text,
  contact_role text,
  website text,
  phone text,
  industry text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own company profile"
  ON public.company_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own company profile"
  ON public.company_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own company profile"
  ON public.company_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 4. updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at
  BEFORE UPDATE ON public.company_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role public.app_role;
  meta jsonb;
BEGIN
  meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);

  -- Insert profile
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    meta->>'full_name',
    NEW.email,
    meta->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Determine role (default consumer)
  user_role := COALESCE((meta->>'role')::public.app_role, 'consumer');

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Company profile if applicable
  IF user_role = 'company' AND meta ? 'company_name' THEN
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
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Link existing tables to users
ALTER TABLE public.questionnaire_responses ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.practitioner_applications ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.course_applications ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Tighten RLS on questionnaire_responses
DROP POLICY IF EXISTS "Anyone can read responses" ON public.questionnaire_responses;
DROP POLICY IF EXISTS "Anyone can update responses" ON public.questionnaire_responses;

CREATE POLICY "Users view own responses"
  ON public.questionnaire_responses FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own responses"
  ON public.questionnaire_responses FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow practitioners to view their own applications
CREATE POLICY "Users view own practitioner application"
  ON public.practitioner_applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users view own course application"
  ON public.course_applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 7. corporate_inquiries
CREATE TABLE public.corporate_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.company_profiles(id) ON DELETE SET NULL,
  company_name text,
  company_size text,
  needs text[] NOT NULL DEFAULT '{}',
  format text,
  budget text,
  expectations text,
  recommendation jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.corporate_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own inquiries"
  ON public.corporate_inquiries FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own inquiries"
  ON public.corporate_inquiries FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
