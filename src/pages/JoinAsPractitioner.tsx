import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PractitionerForm from "@/components/join/PractitionerForm";
import CourseForm from "@/components/join/CourseForm";

const JoinAsPractitioner = () => {
  const [activeTab, setActiveTab] = useState<"practitioner" | "course">("practitioner");
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const switchTab = (tab: "practitioner" | "course") => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen font-body bg-sand nature-overlay ambient-leaves" dir="rtl">
      <Navbar />

      <main className="pt-24 pb-20">

        {/* ===== SECTION 1 — HERO ===== */}
        <section className="bg-shadow-leaves nature-overlay ambient-leaves py-28 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="font-body text-xs tracking-widest uppercase text-primary mb-6">
              הצטרפות מטפלים ומומחים
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              הצטרפו למשפחת MapSoul
            </h1>
            <div className="gold-line mx-auto my-6" />
            <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              חברו עם אנשים שמחפשים בדיוק את מה שאתם מציעים — בלי מאמץ שיווקי, בלי בזבוז זמן.
            </p>
            <button onClick={scrollToForm} className="btn-primary text-lg">
              הגישו מועמדות — חינם לחודשיים הראשונים ←
            </button>
            <p className="font-body text-xs text-muted-foreground mt-3">
              ביטול בכל עת · תהליך קבלה תוך 48 שעות
            </p>
          </div>
        </section>

        {/* ===== SECTION 2 — 4 BENEFITS ===== */}
        <div className="section-divider" />
        <section className="py-20 px-6 bg-sand">
          <h2 className="font-display text-3xl font-bold text-center mb-14 text-foreground">
            מה מקבלים בהצטרפות?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="spa-card text-center !p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 text-2xl">
                🎯
              </div>
              <h3 className="font-display text-xl font-bold mb-3">לידים מדויקים</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                רק מחפשים שמתאימים לגישה שלכם — AI שמסנן ומשלח בדיוק את הלקוחות הנכונים
              </p>
            </div>
            <div className="spa-card text-center !p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 text-2xl">
                🏢
              </div>
              <h3 className="font-display text-xl font-bold mb-3">חשיפה לחברות</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                ארגונים ומנהלי HR מחפשים מומחים לסדנאות, הכשרות וריטריטים — בלי שתצטרכו לחפש אותם
              </p>
            </div>
            <div className="spa-card text-center !p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 text-2xl">
                📊
              </div>
              <h3 className="font-display text-xl font-bold mb-3">דשבורד ניהול</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                לידים, צפיות, סטטיסטיקות — כל מה שצריך לנהל את הפעילות שלכם במקום אחד
              </p>
            </div>
            <div className="spa-card text-center !p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 text-2xl">
                ✨
              </div>
              <h3 className="font-display text-xl font-bold mb-3">קהילה אקסקלוסיבית</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                מטפלים נבחרים בלבד — תהליך קבלה עם ראיון והמלצות שמבטיח איכות ואמון
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3 — ROI STRIP ===== */}
        <section className="py-12 px-6 bg-primary">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12 text-center">
            <div>
              <div className="font-display text-4xl font-bold text-sand">77 ₪</div>
              <div className="font-body text-sm text-sand/60 mt-1">מנוי חודשי בלבד</div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-sand">48h</div>
              <div className="font-body text-sm text-sand/60 mt-1">תהליך קבלה מהיר</div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-sand">0</div>
              <div className="font-body text-sm text-sand/60 mt-1">עמלות בחודשיים הראשונים</div>
            </div>
          </div>
          <p className="font-body text-sm text-sand/50 mt-8 text-center italic">
            פגישה אחת שנסגרת = 5 חודשי מנוי מכוסים
          </p>
        </section>

        {/* ===== SECTION 3.5 — TESTIMONIALS ===== */}
        <section className="py-20 px-6 bg-sand">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-center mb-4 text-foreground">
              מה מטפלים אומרים?
            </h2>
            <p className="font-body text-muted-foreground text-center mb-14 max-w-xl mx-auto">
              חברי הקהילה של MapSoul מספרים מה השתנה מאז שהצטרפו
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "מיכל לוי",
                  title: "פסיכולוגית קלינית, CBT",
                  photo: "https://i.pravatar.cc/80?img=47",
                  quote: "תוך חודש קיבלתי 4 לידים איכותיים — אנשים שבדיוק התאימו לתחום המומחיות שלי. עד כה לא הייתי צריכה להשקיע כסף בפרסום.",
                },
                {
                  name: "אורן כהן",
                  title: "מאמן אישי וזוגי",
                  photo: "https://i.pravatar.cc/80?img=12",
                  quote: "הדשבורד נותן לי תמונת מצב ברורה — איפה אני מקבל הכי הרבה תשומת לב ואילו שירותים מבוקשים. עזר לי לכוון את המיקוד המקצועי שלי.",
                },
                {
                  name: "נועה שמיר",
                  title: "מטפלת ב-EMDR, סומטית",
                  photo: "https://i.pravatar.cc/80?img=48",
                  quote: "התהליך היה קל ואנושי. לא הרגשתי כמו עוד מספר — קיבלתי ליווי אמיתי. הלקוחות שמגיעים דרך MapSoul כבר מגיעים מוכנים וממוקדים.",
                },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="spa-card !p-8 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-display text-sm font-bold text-foreground">{t.name}</div>
                      <div className="font-body text-xs text-muted-foreground">{t.title}</div>
                    </div>
                  </div>
                  <blockquote className="font-body text-sm text-muted-foreground leading-relaxed flex-1 relative">
                    <span className="absolute -top-2 -right-1 text-4xl text-primary/10 font-display leading-none">"</span>
                    {t.quote}
                  </blockquote>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 4 — CTA BEFORE FORM ===== */}
        <section className="py-16 px-6 text-center bg-sand">
          <div className="glass-card max-w-2xl mx-auto !p-10">
            <h3 className="font-display text-2xl font-bold mb-3">מוכנים להתחיל?</h3>
            <p className="font-body text-muted-foreground mb-6">
              מלאו את הטופס הקצר — ונחזור אליכם תוך 48 שעות לשיחת היכרות.
            </p>
            <button onClick={scrollToForm} className="btn-primary">
              קפצו לטופס ←
            </button>
          </div>
        </section>

        <div className="section-divider" />

        {/* ===== EXISTING TABS + FORMS ===== */}
        <div ref={formRef} className="px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Tabs */}
            <div className="flex justify-center gap-8 mb-10">
              {[
                { key: "practitioner" as const, label: "אני מומחה/ית טיפולי/ת" },
                { key: "course" as const, label: "אני מרצה/ית או מנחה/ת קורסים" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => switchTab(tab.key)}
                  className={`relative pb-2 text-base md:text-lg font-body transition-colors duration-200 ${
                    activeTab === tab.key ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.span
                      layoutId="join-tab-underline"
                      className="absolute bottom-0 right-0 left-0 h-[2px] bg-primary rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {submitted ? (
              <motion.div {...fade} className="spa-card text-center !p-12">
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  {activeTab === "practitioner" ? "תודה שהצטרפתם!" : "תודה! קיבלנו את פרטי הקורס שלכם 🌿"}
                </h2>
                <p className="text-muted-foreground text-lg font-body">ניצור איתכם קשר תוך 48 שעות.</p>
              </motion.div>
            ) : (
              <motion.div {...fade} transition={{ delay: 0.15 }}>
                {activeTab === "practitioner" ? (
                  <PractitionerForm onSuccess={() => setSubmitted(true)} />
                ) : (
                  <CourseForm onSuccess={() => setSubmitted(true)} />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinAsPractitioner;
