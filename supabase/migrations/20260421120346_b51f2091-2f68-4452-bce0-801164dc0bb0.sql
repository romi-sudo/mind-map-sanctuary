-- Drop and recreate INSERT policy with explicit roles
DROP POLICY IF EXISTS "Anyone can submit questionnaire" ON public.questionnaire_responses;

CREATE POLICY "Anyone can submit questionnaire"
ON public.questionnaire_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL)
  OR (auth.uid() = user_id)
  OR (auth.uid() IS NOT NULL AND user_id IS NULL)
);