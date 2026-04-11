import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApproachTooltipButton } from "@/components/ApproachTooltip";
import { findApproach } from "@/data/approaches";

/* ── Types ── */
type Track = "personal" | "career" | "both";

interface CardOption { id: string; title: string; subtitle: string; }
interface StepDef { headline: string; subtext?: string; cards: CardOption[]; }
interface Practitioner { name: string; initials: string; title: string; tags: string[]; price: string; }
interface Recommendation { primary: { title: string; description: string }; practitioners: Practitioner[]; }

/* ── Step data ── */
const STEP1: StepDef = {
  headline: "מה מביא אותך לכאן היום?",
  subtext: "אין תשובה נכונה או לא נכונה",
  cards: [
    { id: "personal", title: "משהו אישי", subtitle: "זוגיות, זהות, מערכות יחסים" },
    { id: "career", title: "משהו מקצועי", subtitle: "קריירה, שינוי, חרדת AI" },
    { id: "both", title: "שניהם שזורים יחד", subtitle: "הפנימי והחיצוני קשורים" },
    { id: "unsure", title: "אני לא בטוח/ת", subtitle: "פשוט יודע/ת שמשהו לא עובד" },
  ],
};

const PERSONAL_STEPS: StepDef[] = [
  {
    headline: "מה הכי מדויק לתאר את מה שאת/ה מרגיש/ה?",
    cards: [
      { id: "stuck", title: "תקוע/ה", subtitle: "יודע/ת שמשהו לא עובד אבל לא יודע/ת מה" },
      { id: "transition", title: "בתקופת מעבר", subtitle: "סיום, התחלה, שינוי גדול" },
      { id: "relationship", title: "קושי במערכת יחסים", subtitle: "עם בן/בת זוג, משפחה, עצמי" },
      { id: "identity", title: "מחפש/ת זהות וייעוד", subtitle: "מי אני, לאן אני הולך/ת" },
    ],
  },
  {
    headline: "כשקשה לך — מה עוזר לך יותר?",
    cards: [
      { id: "talk", title: "לדבר עם מישהו שמקשיב", subtitle: "להרגיש מובן/ת" },
      { id: "tools", title: "לקבל כלים ולעבוד לבד", subtitle: "בקצב שלי" },
      { id: "body", title: "לעשות משהו — תנועה, טבע, חוויה", subtitle: "עם הגוף" },
      { id: "learn", title: "ללמוד ולהבין מה קורה לי", subtitle: "ידע נותן שליטה" },
    ],
  },
  {
    headline: "מה מרגיש לך יותר נכון?",
    cards: [
      { id: "individual", title: "עבודה אישית", subtitle: "רק אני ואיש המקצוע" },
      { id: "group", title: "קבוצה", subtitle: "לשמוע אחרים, לא להיות לבד" },
      { id: "intensive", title: "חוויה מרוכזת", subtitle: "ריטריט או סדנה אינטנסיבית" },
    ],
  },
  {
    headline: "מה טווח ההשקעה שנוח לך?",
    cards: [
      { id: "low", title: "עד 300 ש״ח לחודש", subtitle: "" },
      { id: "mid", title: "300–800 ש״ח לחודש", subtitle: "" },
      { id: "high", title: "מעל 800 ש״ח — אם זה הדבר הנכון", subtitle: "" },
    ],
  },
];

const CAREER_STEPS: StepDef[] = [
  {
    headline: "איך תגדיר/י את המצב שלך?",
    cards: [
      { id: "ai-change", title: "AI משנה את המקצוע שלי", subtitle: "צריך/ה להסתגל מהר" },
      { id: "career-change", title: "רוצה לשנות קריירה", subtitle: "AI הוא רק הזרז" },
      { id: "fired", title: "פיטורים או חוסר כיוון", subtitle: "מחפש/ת נחיתה רכה" },
      { id: "meaning", title: "עובד/ת אבל חסר/ת משמעות", subtitle: "הכל בסדר על הנייר" },
    ],
  },
  {
    headline: "מה יותר דחוף עבורך עכשיו?",
    cards: [
      { id: "identity", title: "להבין מי אני מחוץ לתפקיד שלי", subtitle: "זהות עמוקה" },
      { id: "strategy", title: "כלים מעשיים לשוק העבודה החדש", subtitle: "אסטרטגיה" },
      { id: "both", title: "שניהם — הפנימי והחיצוני קשורים", subtitle: "גישה מלאה" },
    ],
  },
  {
    headline: "איך את/ה מעדיפ/ה לעבוד על זה?",
    cards: [
      { id: "coach", title: "אחד על אחד עם מאמן/ת", subtitle: "אישי ומעמיק" },
      { id: "peer", title: "קבוצת עמיתים", subtitle: "אנשים שעוברים אותו דבר" },
      { id: "course", title: "קורס עצמאי", subtitle: "בקצב שלי" },
      { id: "combo", title: "שילוב של עבודה פנימית ואסטרטגיה", subtitle: "הכל" },
    ],
  },
  {
    headline: "מה טווח ההשקעה שנוח לך?",
    cards: [
      { id: "low", title: "עד 300 ש״ח לחודש", subtitle: "" },
      { id: "mid", title: "300–800 ש״ח לחודש", subtitle: "" },
      { id: "high", title: "מעל 800 ש״ח — אם זה הדבר הנכון", subtitle: "" },
    ],
  },
];

/* ── Animation variants ── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

/* ── Answer card ── */
const AnswerCard = ({
  card, selected, onSelect,
}: { card: CardOption; selected: boolean; onSelect: () => void; }) => (
  <motion.button
    onClick={onSelect}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full text-right overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 glass-card-light !p-6"
    style={{
      border: selected ? "1px solid #FAF6EE" : "1px solid rgba(200,184,154,0.15)",
    }}
  >
    <h3 className="font-display text-xl font-bold text-cream mb-1">{card.title}</h3>
    {card.subtitle && <p className="font-body text-sm text-sand">{card.subtitle}</p>}
  </motion.button>
);

/* ── Main component ── */
const Questionnaire = () => {
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [freeText, setFreeText] = useState("");
  const [direction, setDirection] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const getTrackSteps = useCallback((): StepDef[] => {
    if (!track) return [];
    if (track === "both") return [...PERSONAL_STEPS, ...CAREER_STEPS];
    return track === "personal" ? PERSONAL_STEPS : CAREER_STEPS;
  }, [track]);

  const totalSteps = 1 + (track ? getTrackSteps().length : 0) + (track ? 1 : 0);
  const progress = track ? ((stepIndex + 1) / totalSteps) * 100 : 0;

  const handleGateSelect = (id: string) => {
    setAnswers({ 0: id });
    if (id === "career") setTrack("career");
    else if (id === "both") setTrack("both");
    else setTrack("personal");
    setDirection(1);
    setStepIndex(1);
  };

  const handleCardSelect = (id: string) => {
    setAnswers((prev) => ({ ...prev, [stepIndex]: id }));
    setTimeout(() => {
      setDirection(1);
      const trackSteps = getTrackSteps();
      if (stepIndex - 1 < trackSteps.length - 1) {
        setStepIndex((s) => s + 1);
      } else {
        setStepIndex(1 + trackSteps.length);
      }
    }, 350);
  };

  const goBack = () => {
    setDirection(-1);
    if (stepIndex === 1) { setTrack(null); setStepIndex(0); }
    else { setStepIndex((s) => s - 1); }
  };

  const handleSubmit = async () => {
    if (!track) return;
    setIsLoading(true);
    try {
      const { data: inserted, error: insertError } = await supabase
        .from("questionnaire_responses")
        .insert({ track, answers, free_text: freeText })
        .select("id").single();
      if (insertError) throw insertError;
      const { data: fnData, error: fnError } = await supabase.functions.invoke(
        "generate-recommendation",
        { body: { responseId: inserted.id, track, answers, freeText } }
      );
      if (fnError) throw fnError;
      if (fnData?.recommendation) setRecommendation(fnData.recommendation);
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      toast.error("אירעה שגיאה, מציג המלצות ברירת מחדל");
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
          setShowResults(false); setStepIndex(0); setTrack(null);
          setAnswers({}); setFreeText(""); setRecommendation(null);
        }}
      />
    );
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col overflow-x-hidden photo-section">
      {/* Background */}
      <div className="photo-bg">
        <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80" alt="" />
        <div className="photo-overlay" />
      </div>

      {/* Progress bar */}
      {track && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: "rgba(200,184,154,0.2)" }}>
          <motion.div
            className="h-full rounded-l-full"
            style={{ background: "#C9A96E" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Nav */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3 relative">
        {stepIndex > 0 && (
          <button onClick={goBack} className="text-sand hover:text-cream transition-colors font-body text-sm">
            חזרה
          </button>
        )}
        <button onClick={() => navigate("/")} className="text-sand hover:text-cream transition-colors font-body text-sm">
          דף הבית
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          {stepIndex === 0 && (
            <motion.div key="gate" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-2xl">
              <h1 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-cream text-center mb-3">{STEP1.headline}</h1>
              <p className="font-body text-sand text-center mb-12">{STEP1.subtext}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STEP1.cards.map((card) => (
                  <AnswerCard key={card.id} card={card} selected={answers[0] === card.id} onSelect={() => handleGateSelect(card.id)} />
                ))}
              </div>
            </motion.div>
          )}

          {currentStep && !isFreeTextStep && (
            <motion.div key={`step-${stepIndex}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-2xl">
              <h1 className="font-display text-[1.8rem] md:text-[2.5rem] font-bold text-cream text-center mb-10">{currentStep.headline}</h1>
              <div className={`grid grid-cols-1 ${currentStep.cards.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4`}>
                {currentStep.cards.map((card) => (
                  <AnswerCard key={card.id} card={card} selected={answers[stepIndex] === card.id} onSelect={() => handleCardSelect(card.id)} />
                ))}
              </div>
            </motion.div>
          )}

          {isFreeTextStep && (
            <motion.div key="freetext" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-2xl">
              <h1 className="font-display text-[1.8rem] md:text-[2.5rem] font-bold text-cream text-center mb-3">
                במשפט אחד — מה את/ה מחפש/ת?
              </h1>
              <p className="font-body text-sand text-center mb-10">זה עוזר לנו לדייק את ההמלצה שלך</p>
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="לדוגמה: אני רוצה להרגיש שאני יודע/ת לאן אני הולך/ת..."
                className="w-full min-h-[160px] rounded-2xl p-6 font-body text-cream text-lg placeholder:text-sand/50 focus:outline-none resize-none"
                style={{ background: "rgba(61,36,16,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(200,184,154,0.15)" }}
              />
              <div className="mt-8 text-center">
                <button onClick={handleSubmit} disabled={isLoading} className="btn-primary text-lg inline-flex items-center gap-3">
                  {isLoading ? "מייצר המלצה מותאמת אישית..." : "הראה לי את המסלול שלי"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Fallback data ── */
const FALLBACK_PRACTITIONERS: Practitioner[] = [
  { name: "ד״ר נועה לוי", initials: "נל", title: "פסיכולוגית קלינית", tags: ["CBT", "חרדה", "מעברי חיים"], price: "350–500 ש״ח" },
  { name: "עמית כהן", initials: "עכ", title: "מאמן אישי ומקצועי", tags: ["NLP", "קריירה", "מנהיגות"], price: "300–450 ש״ח" },
  { name: "מיכל אברהם", initials: "מא", title: "מטפלת בתנועה", tags: ["סומטי", "טראומה", "גוף-נפש"], price: "280–400 ש״ח" },
];

/* ── Results page ── */
const ResultsPage = ({
  track, recommendation, onRestart,
}: { track: Track; recommendation: Recommendation | null; onRestart: () => void; }) => {
  const headline = track === "career"
    ? "את/ה בצומת מקצועית — הנה הכיוון שלך:"
    : "לפי מה שסיפרת — המסלול שמתאים לך:";

  const primary = recommendation?.primary ?? {
    title: track === "career" ? "אימון קריירה + עבודה פנימית" : "טיפול פסיכולוגי אינטגרטיבי",
    description: track === "career"
      ? "שילוב של מיפוי מקצועי עם עבודה על זהות — כדי שהצעד הבא יהיה גם חכם וגם נכון."
      : "גישה שמשלבת הקשבה עמוקה עם כלים מעשיים — כדי שתרגיש/י שינוי אמיתי כבר מהפגישה הראשונה.",
  };

  const practitioners = recommendation?.practitioners ?? FALLBACK_PRACTITIONERS;

  return (
    <div dir="rtl" className="min-h-screen photo-section">
      <div className="photo-bg">
        <img src="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=1920&q=80" alt="" />
        <div className="photo-overlay" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 relative z-10">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-[1.8rem] md:text-[2.5rem] font-bold text-cream text-center mb-12">
          {headline}
        </motion.h1>

        {/* Recommendation card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card mb-12" style={{ background: "rgba(232,133,74,0.15)", border: "1px solid rgba(232,133,74,0.3)" }}>
          <h2 className="font-display text-2xl font-bold text-cream mb-2 inline-flex items-center gap-2">
            {primary.title}
            {findApproach(primary.title) && <ApproachTooltipButton tag={primary.title} className="text-cream/60 hover:text-cream" />}
          </h2>
          <p className="font-body text-sand leading-relaxed">{primary.description}</p>
        </motion.div>

        <h3 className="font-display text-xl font-bold text-cream mb-6">מומחים שמתאימים לך</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {practitioners.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="glass-card">
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-display text-xl font-bold mb-4" style={{ background: "#4D3520", color: "#C9A96E" }}>
                {p.initials}
              </div>
              <h4 className="font-display text-lg font-bold text-cream">{p.name}</h4>
              <p className="font-body text-sm text-sand mb-3">{p.title}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs font-body px-3 py-1 rounded-full" style={{ border: "1px solid rgba(200,184,154,0.2)", color: "#C9A96E" }}>
                    {tag}
                    {findApproach(tag) && <ApproachTooltipButton tag={tag} />}
                  </span>
                ))}
              </div>
              <p className="font-body text-sm text-sand mb-4">{p.price}</p>
              <button className="btn-secondary w-full !py-2 text-sm">לפנייה</button>
            </motion.div>
          ))}
        </div>

        {/* Info card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card mb-8 text-center">
          <p className="font-body text-sand text-sm leading-relaxed">
            רוצים להבין יותר על הגישות השונות? לחצו על סימן ה-? ליד כל גישה בקטלוג המומחים
          </p>
        </motion.div>

        <div className="text-center">
          <button onClick={onRestart} className="font-body text-sand hover:text-cream transition-colors text-sm">
            רוצה לנסות מסלול אחר? חזור לשאלון
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
