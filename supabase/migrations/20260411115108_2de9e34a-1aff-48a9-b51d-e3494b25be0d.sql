
CREATE TABLE public.questionnaire_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  track TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  free_text TEXT DEFAULT '',
  recommendation JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit questionnaire"
  ON public.questionnaire_responses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read responses"
  ON public.questionnaire_responses
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update responses"
  ON public.questionnaire_responses
  FOR UPDATE
  USING (true);
