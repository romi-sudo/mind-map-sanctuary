CREATE TABLE public.course_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  professional_title text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  course_name text NOT NULL,
  course_description text,
  topic text NOT NULL,
  level text NOT NULL,
  format text NOT NULL,
  duration text,
  price numeric NOT NULL DEFAULT 0,
  free_intro boolean NOT NULL DEFAULT false,
  tools text[] DEFAULT '{}',
  teaching_experience text,
  sample_link text,
  website text,
  whatsapp text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.course_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert course applications"
  ON public.course_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);