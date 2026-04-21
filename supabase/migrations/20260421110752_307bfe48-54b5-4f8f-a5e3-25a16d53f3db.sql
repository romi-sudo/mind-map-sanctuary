CREATE POLICY "Practitioners update own leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (therapist_id = (auth.uid())::text)
WITH CHECK (therapist_id = (auth.uid())::text);