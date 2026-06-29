
CREATE TABLE public.early_access_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL,
  social_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.early_access_signups TO anon, authenticated;
GRANT SELECT ON public.early_access_signups TO authenticated;
GRANT ALL ON public.early_access_signups TO service_role;

ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit signup"
  ON public.early_access_signups
  FOR INSERT
  TO public
  WITH CHECK (true);
