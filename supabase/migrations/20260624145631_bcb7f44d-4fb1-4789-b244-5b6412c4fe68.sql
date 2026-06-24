
CREATE TYPE public.event_category AS ENUM ('festival','lecture','enrichment','team_building','personal');
CREATE TYPE public.event_visibility AS ENUM ('public','members_only');
CREATE TYPE public.event_source AS ENUM ('manual','scraped');

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category public.event_category NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  end_date timestamptz,
  location text,
  price numeric,
  is_free boolean NOT NULL DEFAULT false,
  visibility public.event_visibility NOT NULL DEFAULT 'public',
  image_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  source public.event_source NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public events readable by all"
ON public.events FOR SELECT
USING (visibility = 'public');

CREATE POLICY "Members-only events readable by authenticated"
ON public.events FOR SELECT
TO authenticated
USING (visibility = 'members_only');

CREATE POLICY "Corporate users can insert events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = created_by
  AND public.has_role(auth.uid(), 'company')
);

CREATE POLICY "Creator or corporate can update"
ON public.events FOR UPDATE
TO authenticated
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'company'))
WITH CHECK (auth.uid() = created_by OR public.has_role(auth.uid(), 'company'));

CREATE POLICY "Creator or corporate can delete"
ON public.events FOR DELETE
TO authenticated
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'company'));

CREATE INDEX events_event_date_idx ON public.events (event_date);
CREATE INDEX events_category_idx ON public.events (category);
