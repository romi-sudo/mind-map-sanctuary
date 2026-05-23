import { forwardRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApproachTooltipButton } from "@/components/ApproachTooltip";
import { findApproach } from "@/data/approaches";

type Track = "personal" | "career" | "both";

interface CardOption { id: string; title: string; subtitle: string; }
interface StepDef { headline: string; subtext?: string; cards: CardOption[]; }
interface Practitioner { id?: string; name: string; initials: string; title: string; tags: string[]; price: string; }
interface Recommendation { primary: { title: string; description: string }; practitioners: Practitioner[]; }

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

interface AnswerCardProps {
  card: CardOption;
  selected: boolean;
  onSelect: () => void;
  align: "right" | "left";
}

const AnswerCard = forwardRef<HTMLButtonElement, AnswerCardProps>(({ card, selected, onSelect, align }, ref) => (
  <motion.button
    ref={ref}
    type="button"
    onClick={onSelect}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`card-nature w-full cursor-pointer overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
      align === "right" ? "text-right" : "text-left"
    } ${
      selected
        ? "border-primary bg-card shadow-lg"
        : "bg-card/80 hover:border-primary/30 hover:shadow-lg"
    }`}
  >
    <h3 className="font-display text-xl font-bold text-foreground mb-1">{card.title}</h3>
    {card.subtitle && <p className="font-body text-sm text-muted-foreground">{card.subtitle}</p>}
  </motion.button>
));

AnswerCard.displayName = "AnswerCard";

const Questionnaire = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "he";
  const dir = isRtl ? "rtl" : "ltr";
  const align = isRtl ? "right" : "left";
  const backArrow = isRtl ? "←" : "→";

  const STEP1 = t("questionnaire.gate", { returnObjects: true }) as StepDef;
  const PERSONAL_STEPS = t("questionnaire.personalSteps", { returnObjects: true }) as StepDef[];
  const CAREER_STEPS = t("questionnaire.careerSteps", { returnObjects: true }) as StepDef[];

  const [track, setTrack] = useState<Track | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [freeText, setFreeText] = useState("");
  const [seekerEmail, setSeekerEmail] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const getTrackSteps = useCallback((): StepDef[] => {
    if (!track) return [];
    if (track === "both") return [...PERSONAL_STEPS, ...CAREER_STEPS];
    return track === "personal" ? PERSONAL_STEPS : CAREER_STEPS;
  }, [track, PERSONAL_STEPS, CAREER_STEPS]);

  const totalSteps = 1 + (track ? getTrackSteps().length : 0) + (track ? 1 : 0);
  const progress = track ? ((stepIndex + 1) / totalSteps) * 100 : 0;

  const handleGateSelect = (id: string) => {
    setAnswers({ 0: id });
    if (id === "career") setTrack("career");
    else if (id === "both") setTrack("both");
    else setTrack("personal");
    setStepIndex(1);
  };

  const handleCardSelect = (id: string) => {
    setAnswers((prev) => ({ ...prev, [stepIndex]: id }));
    setTimeout(() => {
      const trackSteps = getTrackSteps();
      if (stepIndex - 1 < trackSteps.length - 1) {
        setStepIndex((s) => s + 1);
      } else {
        setStepIndex(1 + trackSteps.length);
      }
    }, 350);
  };

  const goBack = () => {
    if (stepIndex === 1) {
      setTrack(null);
      setStepIndex(0);
    } else {
      setStepIndex((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    if (!track) return;
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: inserted, error: insertError } = await supabase
        .from("questionnaire_responses")
        .insert({ track, answers, free_text: freeText, user_id: user?.id ?? null, seeker_email: seekerEmail || null })
        .select("id")
        .single();
      if (insertError) throw insertError;
      const { data: fnData, error: fnError } = await supabase.functions.invoke(
        "generate-recommendation",
        { body: { responseId: inserted.id, track, answers, freeText, language: i18n.language } }
      );
      if (fnError) throw fnError;
      if (fnData?.recommendation) setRecommendation(fnData.recommendation);
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      toast.error(t("questionnaire.errorSubmit"));
      setRecommendation(null);
    } finally {
      setIsLoading(false);
      setShowResults(true);
    }
  };

  const currentTrackSteps = getTrackSteps();
  const isFreeTextStep = track && stepIndex === 1 + currentTrackSteps.length;
  const currentStep = stepIndex > 0 && stepIndex <= currentTrackSteps.length ? currentTrackSteps[stepIndex - 1] : null;

  if (showResults) {
    return (
      <ResultsPage
        track={track!}
        recommendation={recommendation}
        onRestart={() => {
          setShowResults(false);
          setStepIndex(0);
          setTrack(null);
          setAnswers({});
          setFreeText("");
          setRecommendation(null);
        }}
      />
    );
  }

  return (
    <div dir={dir} className="relative min-h-screen overflow-x-hidden bg-leaves nature-overlay ambient-leaves ambient-mist">
      {track && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-foreground/10">
          <motion.div
            className={`h-full bg-primary ${isRtl ? "rounded-l-full" : "rounded-r-full"}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      )}

      <div className={`fixed top-6 ${isRtl ? "right-6" : "left-6"} z-[60] flex items-center gap-3 pointer-events-auto`}>
        {stepIndex > 0 && (
          <button type="button" onClick={goBack} className="glass-card-light !rounded-full !px-4 !py-2 font-body text-sm text-foreground hover:text-primary transition-colors cursor-pointer">
            {t("questionnaire.back")}
          </button>
        )}
        <button type="button" onClick={() => navigate("/")} className="glass-card-light !rounded-full !px-4 !py-2 font-body text-sm text-foreground hover:text-primary transition-colors cursor-pointer">
          {t("questionnaire.home")}
        </button>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24">
        {stepIndex === 0 && (
          <motion.div key="gate" {...fadeIn} transition={{ duration: 0.25 }} className="w-full max-w-3xl">
            <h1 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-foreground text-center mb-3">{STEP1.headline}</h1>
            <p className="font-body text-muted-foreground text-center mb-12">{STEP1.subtext}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STEP1.cards.map((card) => (
                <AnswerCard key={card.id} card={card} align={align} selected={answers[0] === card.id} onSelect={() => handleGateSelect(card.id)} />
              ))}
            </div>
          </motion.div>
        )}

        {currentStep && !isFreeTextStep && (
          <motion.div key={`step-${stepIndex}`} {...fadeIn} transition={{ duration: 0.25 }} className="w-full max-w-3xl">
            <h1 className="font-display text-[1.8rem] md:text-[2.5rem] font-bold text-foreground text-center mb-10">{currentStep.headline}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentStep.cards.map((card) => (
                <AnswerCard key={card.id} card={card} align={align} selected={answers[stepIndex] === card.id} onSelect={() => handleCardSelect(card.id)} />
              ))}
            </div>
          </motion.div>
        )}

        {isFreeTextStep && (
          <motion.div key="freetext" {...fadeIn} transition={{ duration: 0.25 }} className="w-full max-w-2xl spa-card !p-8 md:!p-10">
            <h1 className="font-display text-[1.8rem] md:text-[2.5rem] font-bold text-foreground text-center mb-3">
              {t("questionnaire.freeText.headline")}
            </h1>
            <p className="font-body text-muted-foreground text-center mb-10">{t("questionnaire.freeText.subtext")}</p>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder={t("questionnaire.freeText.placeholder")}
              className="w-full min-h-[160px] rounded-2xl border border-border bg-background/70 p-6 font-body text-foreground text-lg placeholder:text-muted-foreground/50 focus:outline-none resize-none"
            />
            <div className="mt-4 border-b border-border/60">
              <input
                type="email"
                value={seekerEmail}
                onChange={(e) => setSeekerEmail(e.target.value)}
                placeholder={t("questionnaire.freeText.emailPlaceholder")}
                className="w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/40 focus:outline-none font-body text-sm"
              />
            </div>
            <div className="mt-8 text-center">
              <button onClick={handleSubmit} disabled={isLoading} className="btn-primary text-lg inline-flex items-center gap-3">
                {isLoading ? t("questionnaire.freeText.submitting") : t("questionnaire.freeText.submit")}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ResultsPage = ({
  track, recommendation, onRestart,
}: { track: Track; recommendation: Recommendation | null; onRestart: () => void; }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "he";
  const dir = isRtl ? "rtl" : "ltr";
  const backArrow = isRtl ? "←" : "→";
  const fwdArrow = isRtl ? "←" : "→";

  const headline = track === "career"
    ? t("questionnaire.results.headlineCareer")
    : t("questionnaire.results.headlineDefault");

  const primary = recommendation?.primary ?? {
    title: track === "career" ? t("questionnaire.results.primaryCareerTitle") : t("questionnaire.results.primaryDefaultTitle"),
    description: track === "career" ? t("questionnaire.results.primaryCareerDesc") : t("questionnaire.results.primaryDefaultDesc"),
  };

  const fallbackPractitioners = t("questionnaire.results.fallback", { returnObjects: true }) as Practitioner[];
  const practitioners = recommendation?.practitioners ?? fallbackPractitioners;

  return (
    <div dir={dir} className="relative min-h-screen bg-sand nature-overlay ambient-leaves">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="mb-8">
          <button
            onClick={onRestart}
            className="font-body text-sm text-primary hover:underline transition-colors inline-flex items-center gap-1"
          >
            {backArrow} {t("questionnaire.results.back")}
          </button>
        </div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-[1.8rem] md:text-[2.5rem] font-bold text-foreground text-center mb-12">
          {headline}
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="spa-card mb-12 border-s-4 border-primary">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2 inline-flex items-center gap-2">
            {primary.title}
            {findApproach(primary.title) && <ApproachTooltipButton tag={primary.title} className="text-muted-foreground hover:text-foreground" />}
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed">{primary.description}</p>
        </motion.div>

        <h3 className="font-display text-xl font-bold text-foreground mb-6">{t("questionnaire.results.expertsTitle")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {practitioners.map((p, i) => {
            const slug = p.id ?? p.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <Link
                  to={`/practitioners/${slug}`}
                  className="card-nature p-6 block cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-display text-xl font-bold mb-4 bg-muted text-primary">
                    {p.initials}
                  </div>
                  <h4 className="font-display text-lg font-bold text-foreground">{p.name}</h4>
                  <p className="font-body text-sm text-muted-foreground mb-3">{p.title}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs font-body px-3 py-1 rounded-full border border-border text-primary">
                        {tag}
                        {findApproach(tag) && <ApproachTooltipButton tag={tag} />}
                      </span>
                    ))}
                  </div>
                  <p className="font-body text-sm text-muted-foreground mb-4">{p.price}</p>
                  <div className="pt-3 border-t border-border text-center">
                    <span className="font-body text-sm text-primary font-medium">{t("questionnaire.results.fullProfile")} {fwdArrow}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="spa-card mb-8 text-center">
          <p className="font-body text-muted-foreground text-sm leading-relaxed">
            {t("questionnaire.results.tooltipHint")}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-12">
          <h3 className="font-display text-xl font-bold text-foreground mb-2 text-center">{t("questionnaire.results.courseTitle")}</h3>
          <p className="font-body text-muted-foreground text-sm text-center mb-6">{t("questionnaire.results.courseSubtitle")}</p>

          <div className="card-nature overflow-hidden max-w-sm mx-auto">
            <div className="h-36 relative overflow-hidden rounded-t-2xl bg-secondary/25">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-6xl font-bold text-primary/10">A</span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-display text-lg font-bold text-foreground mb-1">{t("questionnaire.results.courseName")}</h4>
              <p className="text-muted-foreground text-sm mb-4">{t("questionnaire.results.courseAuthor")}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-body px-3 py-1 rounded-full bg-primary text-primary-foreground">{t("questionnaire.results.courseAudience")}</span>
                <span className="text-xs font-body px-3 py-1 rounded-full border border-border text-primary">{t("questionnaire.results.courseFormat")}</span>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                <span>{t("questionnaire.results.courseDuration")}</span>
                <span className="font-display font-bold text-foreground">₪350</span>
              </div>
            </div>
            <button className="w-full border-t border-border px-4 py-3 text-sm font-body text-center text-primary transition-colors duration-300 hover:bg-primary/5">
              {t("questionnaire.results.courseDetails")}
            </button>
          </div>

          <p className="text-center mt-4">
            <Link to="/practitioners?tab=courses" className="font-body text-sm text-primary hover:underline transition-colors">
              {t("questionnaire.results.allCourses")} {fwdArrow}
            </Link>
          </p>
        </motion.div>

        <div className="text-center">
          <button onClick={onRestart} className="font-body text-muted-foreground hover:text-foreground transition-colors text-sm">
            {t("questionnaire.results.tryAnother")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
