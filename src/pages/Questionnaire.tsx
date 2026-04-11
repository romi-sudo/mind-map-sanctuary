import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ApproachTooltipButton } from "@/components/ApproachTooltip";
import { findApproach } from "@/data/approaches";
import cardFlowers from "@/assets/card-flowers.jpg";
import cardSeashells from "@/assets/card-seashells.jpg";
import cardBridge from "@/assets/card-bridge.jpg";
import cardSunset from "@/assets/card-sunset.jpg";

/* ── Types ── */
type Track = "personal" | "career" | "both";

interface CardOption {
  id: string;
  title: string;
  subtitle: string;
}

interface StepDef {
  headline: string;
  subtext?: string;
  cards: CardOption[];
}

interface Practitioner {
  name: string;
  initials: string;
  title: string;
  tags: string[];
  price: string;
}

interface Recommendation {
  primary: { title: string; description: string };
  practitioners: Practitioner[];
}

/* ── Gate card images (cycle through) ── */
const CARD_IMAGES = [cardFlowers, cardSeashells, cardBridge, cardSunset];

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

/* ── Nature Answer card with background image ── */
const NatureAnswerCard = ({
  card,
  selected,
  onSelect,
  imageIndex,
}: {
  card: CardOption;
  selected: boolean;
  onSelect: () => void;
  imageIndex: number;
}) => {
  const img = CARD_IMAGES[imageIndex % CARD_IMAGES.length];

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`nature-card relative w-full text-right overflow-hidden border-2 transition-all duration-300 cursor-pointer
        ${selected ? "border-primary ring-2 ring-primary/30" : "border-border/50 hover:border-primary/40"}`}
    >
      {/* Background nature image */}
      <div className="absolute inset-0">
        <img src={img} alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-card/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7l3 3 5-5" stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
        <h3 className="font-hebrew text-xl font-bold text-foreground mb-1">{card.title}</h3>
        {card.subtitle && <p className="font-body text-sm text-muted-foreground">{card.subtitle}</p>}
      </div>
    </motion.button>
  );
};

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
      const { data: inserted, error: insertError } = await supabase
        .from("questionnaire_responses")
        .insert({ track, answers, free_text: freeText })
        .select("id")
        .single();

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
    <div dir="rtl" className="min-h-screen bg-background grain-overlay flex flex-col overflow-x-hidden">
      {track && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-muted">
          <motion.div
            className="h-full bg-primary rounded-l-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      )}

      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {stepIndex > 0 && (
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה
          </button>
        )}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
        >
          ← דף הבית
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <AnimatePresence mode="wait" custom={direction}>
          {stepIndex === 0 && (
            <motion.div
              key="gate"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
            >
              <h1 className="font-hebrew text-4xl md:text-5xl font-bold text-foreground text-center mb-3">
                {STEP1.headline}
              </h1>
              <p className="font-body text-muted-foreground text-center mb-12">{STEP1.subtext}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STEP1.cards.map((card, i) => (
                  <NatureAnswerCard key={card.id} card={card} selected={answers[0] === card.id} onSelect={() => handleGateSelect(card.id)} imageIndex={i} />
                ))}
              </div>
            </motion.div>
          )}

          {currentStep && !isFreeTextStep && (
            <motion.div
              key={`step-${stepIndex}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
            >
              <h1 className="font-hebrew text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
                {currentStep.headline}
              </h1>
              <div className={`grid grid-cols-1 ${currentStep.cards.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4`}>
                {currentStep.cards.map((card, i) => (
                  <NatureAnswerCard key={card.id} card={card} selected={answers[stepIndex] === card.id} onSelect={() => handleCardSelect(card.id)} imageIndex={i + stepIndex} />
                ))}
              </div>
            </motion.div>
          )}

          {isFreeTextStep && (
            <motion.div
              key="freetext"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
            >
              <h1 className="font-hebrew text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
                במשפט אחד — מה את/ה מחפש/ת?
              </h1>
              <p className="font-body text-muted-foreground text-center mb-10">
                זה עוזר לנו לדייק את ההמלצה שלך
              </p>
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="לדוגמה: אני רוצה להרגיש שאני יודע/ת לאן אני הולך/ת..."
                className="w-full min-h-[160px] rounded-2xl border-2 border-border bg-card p-6 font-body text-foreground text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <div className="mt-8 text-center">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn-glow inline-flex items-center gap-3 bg-primary text-primary-foreground font-body font-medium text-lg px-12 py-4 rounded-full hover:bg-primary-hover transition-colors disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      מייצר המלצה מותאמת אישית...
                    </>
                  ) : (
                    "הראה לי את המסלול שלי ←"
                  )}
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
  track,
  recommendation,
  onRestart,
}: {
  track: Track;
  recommendation: Recommendation | null;
  onRestart: () => void;
}) => {
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
    <div dir="rtl" className="min-h-screen bg-background grain-overlay">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-hebrew text-3xl md:text-4xl font-bold text-foreground text-center mb-12"
        >
          {headline}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border-2 border-primary bg-card p-8 mb-12 shadow-warm"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xl">🌿</div>
            <div>
              <h2 className="font-hebrew text-2xl font-bold text-foreground mb-2">{primary.title}</h2>
              <p className="font-body text-muted-foreground leading-relaxed">{primary.description}</p>
            </div>
          </div>
        </motion.div>

        <h3 className="font-hebrew text-xl font-bold text-foreground mb-6">מומחים שמתאימים לך</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {practitioners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 card-luxury"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center font-hebrew text-xl font-bold text-primary mb-4">
                {p.initials}
              </div>
              <h4 className="font-hebrew text-lg font-bold text-foreground">{p.name}</h4>
              <p className="font-body text-sm text-muted-foreground mb-3">{p.title}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs font-body bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                    {tag}
                    {findApproach(tag) && <ApproachTooltipButton tag={tag} />}
                  </span>
                ))}
              </div>
              <p className="font-body text-sm text-muted-foreground mb-4">{p.price}</p>
              <button className="w-full border border-primary text-primary font-body text-sm py-2.5 rounded-full hover:bg-primary/5 transition-colors">
                לפנייה
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={onRestart} className="font-body text-muted-foreground hover:text-primary transition-colors text-sm">
            רוצה לנסות מסלול אחר? ← חזור לשאלון
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
