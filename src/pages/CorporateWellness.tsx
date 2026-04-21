import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Sparkles, Building2, Users, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState<RecPractitioner | null>(null);
  const [contactForm, setContactForm] = useState({ contactName: '', contactEmail: '', contactPhone: '' });
  const [inquirySent, setInquirySent] = useState(false);
  const [data, setData] = useState<FormData>({
    companyName: "",
    companySize: "",
    needs: [],
    format: "",
    budget: "",
    expectations: "",
  });

  const sendInquiry = async () => {
    if (!contactForm.contactName.trim() || !contactForm.contactEmail.trim()) {
      toast.error("אנא מלאו שם ואימייל");
      return;
    }
    try {
      if (user && selectedPractitioner) {
        await supabase.from("corporate_inquiries").insert({
          user_id: user.id,
          company_name: data.companyName,
          company_size: data.companySize,
          needs: data.needs,
          format: data.format,
          budget: data.budget,
          expectations: `${data.expectations}\n\n--- פנייה למומחה ---\nמומחה נבחר: ${selectedPractitioner.name}\nאיש קשר: ${contactForm.contactName}\nאימייל: ${contactForm.contactEmail}\nטלפון: ${contactForm.contactPhone}`,
          recommendation: { selectedPractitioner, contactForm } as any,
        });
      }
      setInquirySent(true);
      toast.success("הפנייה נשלחה! נחזור אליכם תוך 24 שעות");
    } catch (e) {
      console.error(e);
      toast.error("שגיאה בשליחת הפנייה");
    }
  };

  // Restore saved form data after login
  useEffect(() => {
    const saved = sessionStorage.getItem('corporate_form_data');
    if (saved && user) {
      try {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed }));
        sessionStorage.removeItem('corporate_form_data');
        setStep(5);
      } catch (e) {}
    }
  }, [user]);

  // Pre-fill company name from company_profiles if available
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: cp } = await supabase
        .from("company_profiles")
        .select("company_name, company_size")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cp) {
        setData((d) => ({
          ...d,
          companyName: d.companyName || cp.company_name || "",
          companySize: d.companySize || cp.company_size || "",
        }));
      }
    })();
  }, [user]);

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
    if (!user) {
      sessionStorage.setItem('corporate_form_data', JSON.stringify(data));
      navigate('/signup?role=company&next=/corporate');
      return;
    }
    setIsLoading(true);

    setStep(5);
    let recResult: Recommendation | null = null;
    try {
      const { data: fnData, error } = await supabase.functions.invoke("corporate-recommendation", {
        body: data,
      });
      if (error) throw error;
      if (fnData?.recommendation) {
        recResult = fnData.recommendation;
        setRecommendation(fnData.recommendation);
      }
    } catch (e) {
      console.error(e);
      toast.error("אירעה שגיאה. מציג המלצות גנריות.");
      recResult = {
        summary: `${data.companyName} מחפשת לחזק את ${data.needs.slice(0, 2).join(" ו")}.`,
        activities: [
          { title: "סדנת גיבוש", description: "יום חוויה בטבע לחיזוק הצוות.", format: "סדנה", duration: "6 שעות" },
        ],
        practitioners: [
          { name: "רותם בן-דוד", title: "מנחת גיבוש", tags: ["צוות", "טבע"], matchReason: "התאמה גבוהה" },
        ],
      };
      setRecommendation(recResult);
    } finally {
      setIsLoading(false);
    }

    // Persist inquiry linked to user + company
    if (user) {
      try {
        const { data: cp } = await supabase
          .from("company_profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        await supabase.from("corporate_inquiries").insert({
          user_id: user.id,
          company_id: cp?.id ?? null,
          company_name: data.companyName,
          company_size: data.companySize,
          needs: data.needs,
          format: data.format,
          budget: data.budget,
          expectations: data.expectations,
          recommendation: recResult as any,
        });
      } catch (err) {
        console.error("Failed to save inquiry:", err);
      }
    }
  };

  const scrollToForm = () =>
    document.getElementById('corporate-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div dir="rtl" className="relative min-h-screen overflow-x-hidden bg-leaves">
      <Navbar />

      {/* HERO */}
      <section className="bg-shadow-leaves nature-overlay ambient-leaves ambient-mist py-28">
        <div className="max-w-3xl mx-auto text-center px-6 relative z-10 pt-16">
          <p className="font-body text-sm tracking-widest uppercase text-primary mb-6">
            לחברות וארגונים
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            חברות שמשקיעות בעובדים — MapSoul עובדת בשבילן
          </h1>
          <div className="gold-line mx-auto my-8" />
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            במקום לבזבז שעות בקבוצות פייסבוק ולעבור על המלצות פזורות — MapSoul עושה עבורכם את העבודה. התאמה מדויקת למומחה הנכון, לתקציב שלכם, לאופי הארגון.
          </p>
          <button onClick={scrollToForm} className="btn-primary text-lg">
            מצאו את המומחה הבא לארגון שלכם — בחינם לחלוטין
          </button>
        </div>
      </section>

      {/* WHY US */}
      <div className="section-divider" />
      <section className="py-24 bg-sand">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
            למה לבחור ב-MapSoul?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "התאמה חכמה מבוססת AI", body: "המערכת מנתחת את הצרכים הספציפיים שלכם — סוג ההכשרה, הפורמט, הגישה והתקציב — ומייצרת התאמה מדויקת." },
              { title: "מומחים נבחרים בלבד", body: "כל מומחה עובר תהליך קבלה קפדני הכולל המלצות מאומתות וראיון — כדי להבטיח איכות ואמון ללא פשרות." },
              { title: "חינם לחלוטין לארגון", body: "השירות לחברות וארגונים הוא ללא עלות ישירה. כלי טכנולוגי מתקדם שלא פוגע בתקציב הרווחה שלכם." },
            ].map((c) => (
              <div key={c.title} className="spa-card text-center">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{c.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div className="section-divider" />
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">איך זה עובד?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "מגדירים צורך", b: "ממלאים שאלון AI קצר שבו אתם מגדירים מה הארגון מחפש — סדנה, הרצאה, ריטריט צוותי ועוד." },
              { n: "02", t: "מקבלים התאמה", b: "המערכת מנתחת את הנתונים ומציגה את המומחים המתאימים ביותר מתוך קהילה אקסקלוסיבית של מומחים מאומתים." },
              { n: "03", t: "יוצאים לדרך", b: "בוחרים מומחה, משאירים פרטים — וצוות MapSoul מתאם ביניכם. פשוט, מהיר ומקצועי." },
            ].map((s) => (
              <div key={s.n} className="spa-card">
                <div className="font-display text-5xl font-bold text-primary/20 mb-4">{s.n}</div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{s.t}</h3>
                <p className="font-body text-sm text-muted-foreground">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <div className="section-divider" />
      <section className="py-24 bg-sand">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-10">מה תוכלו למצוא אצלנו?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "סדנאות והכשרות מקצועיות לעובדים ומנהלים",
              "הרצאות בנושאי חוסן, בריאות הנפש והתפתחות אישית",
              "ליווי מקצועי לארגונים בתהליכי שינוי",
              "ריטריטים ופעילויות גיבוש מבוססות תוכן טיפולי וחווייתי",
            ].map((item) => (
              <div key={item} className="card-nature p-6 flex gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span className="font-body text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <div className="section-divider" />
      <section className="py-24">
        <div className="glass-card max-w-2xl mx-auto text-center p-12">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">מוכנים למצוא את המומחה הנכון?</h2>
          <p className="font-body text-muted-foreground mb-8">
            מלאו את השאלון הקצר שלנו — ותוך דקות תקבלו המלצות מותאמות אישית לארגון שלכם.
          </p>
          <button onClick={scrollToForm} className="btn-primary text-lg">
            מצאו את המומחה הבא לארגון שלכם — בחינם לחלוטין
          </button>
        </div>
      </section>

      <div className="section-divider" />

      {/* Progress bar */}
      <div className="fixed top-[68px] left-0 right-0 z-40 h-1 bg-foreground/10">
        <motion.div
          className="h-full rounded-l-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div id="corporate-form" className="relative z-10 mx-auto max-w-3xl px-6 pt-20 pb-24 nature-overlay ambient-leaves ambient-mist scroll-mt-24">
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
                          className="card-nature rounded-2xl p-6 bg-card/80 flex flex-col"
                        >
                          <h4 className="font-display text-lg font-bold text-foreground">{p.name}</h4>
                          <p className="font-body text-sm text-primary mb-3">{p.title}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {p.tags.map((t) => (
                              <span key={t} className="pill !py-1 !px-2 !text-xs">{t}</span>
                            ))}
                          </div>
                          <p className="font-body text-xs text-muted-foreground italic flex-1">"{p.matchReason}"</p>
                          <button
                            onClick={() => { setSelectedPractitioner(p); setInquirySent(false); }}
                            className="btn-primary w-full mt-4 text-sm"
                          >
                            בחרו מומחה זה ←
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    {selectedPractitioner && (
                      <motion.div {...fadeIn} transition={{ duration: 0.3 }} className="spa-card !p-8 mt-6">
                        {inquirySent ? (
                          <div className="text-center py-6">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                              <Check className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-display text-xl font-bold text-foreground mb-2">הפנייה נשלחה בהצלחה</h4>
                            <p className="font-body text-sm text-muted-foreground">
                              צוות MapSoul יחזור אליכם תוך 24 שעות לתיאום עם {selectedPractitioner.name}.
                            </p>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-display text-xl font-bold text-foreground mb-2">
                              בחרתם: {selectedPractitioner.name}
                            </h4>
                            <p className="font-body text-sm text-muted-foreground mb-6">
                              השאירו פרטים וצוות MapSoul יחזור אליכם תוך 24 שעות לתיאום.
                            </p>
                            <div className="space-y-3">
                              <div className="rounded-2xl border border-border bg-background/70 px-5">
                                <input
                                  value={contactForm.contactName}
                                  onChange={(e) => setContactForm((p) => ({ ...p, contactName: e.target.value }))}
                                  placeholder="שם איש/ת הקשר"
                                  className="w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-body text-sm"
                                />
                              </div>
                              <div className="rounded-2xl border border-border bg-background/70 px-5">
                                <input
                                  type="email"
                                  value={contactForm.contactEmail}
                                  onChange={(e) => setContactForm((p) => ({ ...p, contactEmail: e.target.value }))}
                                  placeholder="אימייל"
                                  className="w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-body text-sm"
                                />
                              </div>
                              <div className="rounded-2xl border border-border bg-background/70 px-5">
                                <input
                                  value={contactForm.contactPhone}
                                  onChange={(e) => setContactForm((p) => ({ ...p, contactPhone: e.target.value }))}
                                  placeholder="טלפון (אופציונלי)"
                                  className="w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-body text-sm"
                                />
                              </div>
                            </div>
                            <button onClick={sendInquiry} className="btn-primary w-full mt-6">
                              שלחו פנייה ל-MapSoul
                            </button>
                          </>
                        )}
                      </motion.div>
                    )}
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
                type="button"
                onClick={next}
                className="btn-primary !py-2.5 !px-6 inline-flex items-center gap-2 cursor-pointer"
              >
                המשך
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const err = validateStep();
                  if (err) { toast.error(err); return; }
                  handleSubmit();
                }}
                className="btn-primary !py-2.5 !px-6 inline-flex items-center gap-2 cursor-pointer"
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
