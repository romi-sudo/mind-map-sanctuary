
-- Allow authenticated role to reach the table via the API; the policy below filters rows.
GRANT SELECT ON public.early_access_signups TO authenticated;

-- Only the admin email may read signups
CREATE POLICY "Admin can view signups"
ON public.early_access_signups
FOR SELECT
TO authenticated
USING (lower(coalesce(auth.jwt() ->> 'email', '')) = 'romi@people360.co.il');
