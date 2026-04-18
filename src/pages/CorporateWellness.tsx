import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Sparkles, Building2, Users, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FormData {
  companyName: string;
  companySize: string;
  needs: string[];
  format: string;
  budget: string;
  expectations: string;
}

interface Activity { title: string; description: string; format: string; duration: string; }
interface RecPractitioner { name: string; title: string; tags: string[]; matchReason: string; }
interface Recommendation { summary: string; activities: Activity[]; practitioners: RecPractitioner[]; }

const COMPANY_SIZES = ["עד 10 עובדים", "10-50 עובדים", "50-200 עובדים", "200+ עובדים"];
const NEEDS = ["פעילות חברתית", "גיבוש צוות", "מנהיגות", "חוסן נפשי", "יצירתיות", "רווחת עובדים", "אחר"];
const FORMATS = ["סדנה חד-פעמית", "קורס", "ריטריט", "אונליין", "היברידי"];
const BUDGETS = ['עד 2,000 ש"ח', '2,000-5,000 ש"ח', '5,000-15,000 ש"ח', '15,000+ ש"ח'];

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const CorporateWellness = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [data, setData] = useState<FormData>({
    companyName: "",
    companySize: "",
    needs: [],
    format: "",
    budget: "",
    expectations: "",
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const validateStep = (): string | null => {
    if (step === 1) {
      if (data.companyName.trim().length < 2) return "אנא הזן את שם החברה";
      if (!data.companySize) return "אנא בחר את מספר העובדים";
    }
    if (step === 2 && data.needs.length === 0) return "אנא בחר לפחות צורך אחד";
    if (step === 3) {
      if (!data.format) return "אנא בחר פורמט מועדף";
      if (!data.budget) return "אנא בחר תקציב משוער";
    }
    if (step === 4 && data.expectations.trim().length < 6) return "אנא כתוב כמה מילים על הציפיות";
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { toast.error(err); return; }
    setStep((s) => Math.min(totalSteps, s + 1));
  };
  const back = () => { setStep((s) => Math.max(1, s - 1)); };

  const toggleNeed = (need: string) => {
    setData((d) => ({
      ...d,
      needs: d.needs.includes(need) ? d.needs.filter((n) => n !== need) : [...d.needs, need],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    setStep(5);
    try {
      const { data: fnData, error } = await supabase.functions.invoke("corporate-recommendation", {
        body: data,
      });
      if (error) throw error;
      if (fnData?.recommendation) setRecommendation(fnData.recommendation);
    } catch (e) {
      console.error(e);
      toast.error("אירעה שגיאה. מציג המלצות גנריות.");
      setRecommendation({
        summary: `${data.companyName} מחפשת לחזק את ${data.needs.slice(0, 2).join(" ו")}.`,
        activities: [
          { title: "סדנת גיבוש", description: "יום חוויה בטבע לחיזוק הצוות.", format: "סדנה", duration: "6 שעות" },
        ],
        practitioners: [
          { name: "רותם בן-דוד", title: "מנחת גיבוש", tags: ["צוות", "טבע"], matchReason: "התאמה גבוהה" },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="relative min-h-screen overflow-x-hidden bg-leaves nature-overlay ambient-leaves ambient-mist">
      <Navbar />

      {/* Progress bar */}
      <div className="fixed top-[68px] left-0 right-0 z-40 h-1 bg-foreground/10">
        <motion.div
          className="h-full rounded-l-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-2 mb-4 border border-border/40">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="font-body text-sm text-muted-foreground">לחברות וארגונים</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
            רווחת עובדים, מותאמת לחברה שלך
          </h1>
          <p className="font-body text-muted-foreground">
            ענה על מספר שאלות קצרות וקבל המלצה מותאמת אישית מבוססת AI
          </p>
        </div>

        
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="s1" {...fadeIn} transition={{ duration: 0.25 }} className="spa-card !p-8 md:!p-10">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">פרטי החברה</h2>
              </div>

              <label className="block mb-6">
                <span className="font-body text-sm text-foreground mb-2 block">שם החברה</span>
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => setData({ ...data, companyName: e.target.value })}
                  placeholder="לדוגמה: טכנו פתרונות בע״מ"
                  className="w-full rounded-2xl border border-border bg-background/70 px-5 py-3 font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </label>

              <label className="block">
                <span className="font-body text-sm text-foreground mb-3 block">מספר עובדים</span>
                <div className="grid grid-cols-2 gap-3">
                  {COMPANY_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setData({ ...data, companySize: size })}
                      className={`card-nature rounded-2xl p-4 text-right font-body text-sm transition-all ${
                        data.companySize === size
                          ? "border-primary bg-card shadow-md"
                          : "bg-card/70 hover:border-primary/30"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </label>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" {...fadeIn} transition={{ duration: 0.25 }} className="spa-card !p-8 md:!p-10">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">מה הצורך?</h2>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-6">ניתן לבחור כמה אפשרויות</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {NEEDS.map((need) => {
                  const selected = data.needs.includes(need);
                  return (
                    <button
                      key={need}
                      type="button"
                      onClick={() => toggleNeed(need)}
                      className={`card-nature flex items-center justify-between rounded-2xl p-4 text-right font-body transition-all ${
                        selected ? "border-primary bg-card shadow-md" : "bg-card/70 hover:border-primary/30"
                      }`}
                    >
                      <span>{need}</span>
                      {selected && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="s3" {...fadeIn} transition={{ duration: 0.25 }} className="spa-card !p-8 md:!p-10">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">פורמט ותקציב</h2>
              </div>

              <div className="mb-6">
                <span className="font-body text-sm text-foreground mb-3 block">פורמט מועדף</span>
                <div className="flex flex-wrap gap-2">
                  {FORMATS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setData({ ...data, format: f })}
                      className={`pill !text-sm ${data.format === f ? "active" : ""}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-body text-sm text-foreground mb-3 block">תקציב משוער</span>
                <div className="grid grid-cols-2 gap-3">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setData({ ...data, budget: b })}
                      className={`card-nature rounded-2xl p-4 text-right font-body text-sm transition-all ${
                        data.budget === b ? "border-primary bg-card shadow-md" : "bg-card/70 hover:border-primary/30"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div key="s4" {...fadeIn} transition={{ duration: 0.25 }} className="spa-card !p-8 md:!p-10">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">ציפיות ויעדים</h2>
              <p className="font-body text-sm text-muted-foreground mb-6">
                ספר/י לנו בחופשיות מה הייתם רוצים להשיג מהפעילות
              </p>
              <textarea
                value={data.expectations}
                onChange={(e) => setData({ ...data, expectations: e.target.value })}
                placeholder="לדוגמה: אנחנו צוות צעיר שגדל מהר ומרגישים שאיבדנו את החיבור הבין-אישי. הייתי רוצה יום שבו כולם ייצאו עם תחושת שייכות מחודשת ועם כלים מעשיים לתקשורת טובה יותר..."
                className="w-full min-h-[200px] rounded-2xl border border-border bg-background/70 p-5 font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </motion.div>
          )}

          {/* STEP 5 — Results */}
          {step === 5 && (
            <motion.div key="s5" {...fadeIn} transition={{ duration: 0.3 }}>
              {isLoading || !recommendation ? (
                <div className="spa-card !p-12 text-center">
                  <Sparkles className="h-10 w-10 text-primary mx-auto mb-4 animate-pulse" />
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    בונים עבורך המלצה מותאמת...
                  </h2>
                  <p className="font-body text-muted-foreground">
                    ה-AI שלנו מנתח את הצרכים של {data.companyName} ומוצא את ההתאמות הטובות ביותר
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="spa-card !p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="font-body text-sm text-muted-foreground">המלצה מותאמת ל-{data.companyName}</span>
                    </div>
                    <p className="font-display text-xl text-foreground leading-relaxed">{recommendation.summary}</p>
                  </div>

                  {/* Activities */}
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">פעילויות מומלצות</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendation.activities.map((a, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="card-nature rounded-2xl p-6 bg-card/80"
                        >
                          <h4 className="font-display text-lg font-bold text-foreground mb-2">{a.title}</h4>
                          <p className="font-body text-sm text-muted-foreground mb-4">{a.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="pill !py-1 !px-3 !text-xs">{a.format}</span>
                            <span className="pill !py-1 !px-3 !text-xs">{a.duration}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Practitioners */}
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-4">מנחים מומלצים</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendation.practitioners.map((p, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="card-nature rounded-2xl p-6 bg-card/80"
                        >
                          <h4 className="font-display text-lg font-bold text-foreground">{p.name}</h4>
                          <p className="font-body text-sm text-primary mb-3">{p.title}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {p.tags.map((t) => (
                              <span key={t} className="pill !py-1 !px-2 !text-xs">{t}</span>
                            ))}
                          </div>
                          <p className="font-body text-xs text-muted-foreground italic">"{p.matchReason}"</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="spa-card !p-8 text-center">
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">
                      רוצים לקדם את הפעילות?
                    </h3>
                    <p className="font-body text-muted-foreground mb-5">
                      נחזור אליכם תוך 24 שעות עם הצעת מחיר מפורטת
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <button onClick={() => navigate("/practitioners")} className="btn-primary">
                        עיון בכל המנחים
                      </button>
                      <button
                        onClick={() => {
                          setStep(1);
                          setRecommendation(null);
                          setData({ companyName: "", companySize: "", needs: [], format: "", budget: "", expectations: "" });
                        }}
                        className="btn-secondary"
                      >
                        להתחיל מחדש
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        

        {/* Navigation */}
        {step < 5 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={back}
              disabled={step === 1}
              className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight className="h-4 w-4" />
              חזרה
            </button>

            <span className="font-body text-xs text-muted-foreground">
              שלב {step} מתוך {totalSteps}
            </span>

            {step < 4 ? (
              <button
                onClick={next}
                disabled={!canContinue()}
                className="btn-primary !py-2.5 !px-6 inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                המשך
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canContinue()}
                className="btn-primary !py-2.5 !px-6 inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                קבלת המלצה
              </button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CorporateWellness;
