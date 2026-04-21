ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';

ALTER TABLE public.leads
DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE public.leads
ADD CONSTRAINT leads_status_check
CHECK (status IN ('new', 'contacted', 'closed'));

-- Allow a practitioner to view leads addressed to them.
-- therapist_id is a text slug (e.g. "oren-cohen") OR the practitioner's user_id.
-- We match by user_id::text so a practitioner can read their own leads.
DROP POLICY IF EXISTS "Practitioners view own leads" ON public.leads;
CREATE POLICY "Practitioners view own leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (therapist_id = auth.uid()::text);