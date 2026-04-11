
CREATE TABLE public.practitioner_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  professional_title TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  profile_image_url TEXT,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  service_types TEXT[] NOT NULL DEFAULT '{}',
  approaches TEXT[] NOT NULL DEFAULT '{}',
  format TEXT NOT NULL DEFAULT 'both',
  languages TEXT[] NOT NULL DEFAULT '{hebrew}',
  price_per_session INTEGER NOT NULL DEFAULT 300,
  area TEXT,
  accepting_new_clients BOOLEAN NOT NULL DEFAULT true,
  bio TEXT,
  whatsapp TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.practitioner_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit application"
ON public.practitioner_applications
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Applications are not publicly readable"
ON public.practitioner_applications
FOR SELECT
TO public
USING (false);
