CREATE TABLE public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id text NOT NULL,
  seeker_name text NOT NULL,
  seeker_email text NOT NULL,
  seeker_phone text,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "No public read"
  ON public.leads FOR SELECT
  TO anon, authenticated
  USING (false);