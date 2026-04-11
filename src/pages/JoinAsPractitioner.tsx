import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const specialtyOptions = [
  "קריירה", "מערכות יחסים", "חרדה", "זהות", "טראומה", "זוגיות",
  "גבולות", "AI וקריירה", "ביטחון עצמי", "מעברי חיים", "הורות", "אבל",
];
const serviceOptions = [
  "טיפול אישי", "אימון אישי", "קורס דיגיטלי", "ריטריט", "סדנה קבוצתית", "טיפול זוגי",
];
const approachOptions = [
  "CBT", "EMDR", "EFT", "IFS", "ACT", "DBT", "סומטי", "מיינדפולנס", "פסיכודינמי", "גשטלט", "NVC", "אינטגרטיבי",
];
const languageOptions = ["עברית", "אנגלית", "ערבית"];

const PillToggle = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
      selected
        ? "bg-primary text-white"
        : "border border-secondary/40 text-secondary bg-transparent hover:bg-secondary/10"
    }`}
  >
    {label}
  </button>
);

const JoinAsPractitioner = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", professional_title: "", email: "", phone: "",
    specialties: [] as string[], service_types: [] as string[],
    approaches: [] as string[], format: "both",
    languages: ["עברית"] as string[], price_per_session: 300,
    area: "", accepting_new_clients: true, bio: "", whatsapp: "", website: "",
  });

  const toggle = (field: "specialties" | "service_types" | "approaches" | "languages", val: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(val) ? prev[field].filter((v) => v !== val) : [...prev[field], val],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("practitioner_applications").insert({
        full_name: form.full_name, professional_title: form.professional_title,
        email: form.email, phone: form.phone, specialties: form.specialties,
        service_types: form.service_types, approaches: form.approaches,
        format: form.format, languages: form.languages,
        price_per_session: form.price_per_session, area: form.area || null,
        accepting_new_clients: form.accepting_new_clients,
        bio: form.bio || null, whatsapp: form.whatsapp || null, website: form.website || null,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
  const inputClass = "w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-body text-sm transition-all";

  return (
    <div className="min-h-screen font-body bg-background" dir="rtl">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          <motion.section {...fade} className="mb-14 text-center">
            <h1 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-foreground mb-4">
              הצטרפו למשפחת MapSoul
            </h1>
            <div className="gold-line mb-6" />
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto font-body">
              חברו עם אנשים שמחפשים בדיוק את מה שאתם מציעים
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["קהל יעד מדויק", "פרופיל מקצועי", "ללא עמלות בהתחלה"].map((b) => (
                <span key={b} className="btn-secondary !py-2 !px-5 text-sm">{b}</span>
              ))}
            </div>
          </motion.section>

          {submitted ? (
            <motion.div {...fade} className="spa-card text-center !p-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">תודה שהצטרפתם!</h2>
              <p className="text-muted-foreground text-lg font-body">קיבלנו את הפרטים שלכם.</p>
              <p className="text-muted-foreground text-lg font-body">ניצור איתכם קשר תוך 48 שעות.</p>
            </motion.div>
          ) : (
            <motion.form {...fade} transition={{ delay: 0.15 }} onSubmit={handleSubmit} className="spa-card !p-8 md:!p-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-10 text-center">צרו פרופיל מקצועי</h2>

              <div className="space-y-5">
                <h3 className="font-display text-xl font-bold text-foreground">פרטים אישיים</h3>
                {[
                  { v: form.full_name, k: "full_name", ph: "שם מלא", req: true },
                  { v: form.professional_title, k: "professional_title", ph: "לדוגמה: פסיכולוגית קלינית", req: true },
                  { v: form.email, k: "email", ph: "אימייל", req: true, type: "email" },
                  { v: form.phone, k: "phone", ph: "טלפון", req: true, type: "tel" },
                ].map((f) => (
                  <div key={f.k} className="border-b border-border">
                    <input required={f.req} type={f.type || "text"} value={f.v} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} placeholder={f.ph} className={inputClass} />
                  </div>
                ))}
              </div>

              <div className="section-divider my-10" />

              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-foreground">מומחיות</h3>
                <div>
                  <label className="block text-sm text-muted-foreground mb-3 font-body">נושאי התמחות</label>
                  <div className="flex flex-wrap gap-2">{specialtyOptions.map((s) => <PillToggle key={s} label={s} selected={form.specialties.includes(s)} onClick={() => toggle("specialties", s)} />)}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-3 font-body">סוג שירות</label>
                  <div className="flex flex-wrap gap-2">{serviceOptions.map((s) => <PillToggle key={s} label={s} selected={form.service_types.includes(s)} onClick={() => toggle("service_types", s)} />)}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-3 font-body">גישה טיפולית</label>
                  <div className="flex flex-wrap gap-2">{approachOptions.map((a) => <PillToggle key={a} label={a} selected={form.approaches.includes(a)} onClick={() => toggle("approaches", a)} />)}</div>
                </div>
              </div>

              <div className="section-divider my-10" />

              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-foreground">פרטים מעשיים</h3>
                <div>
                  <label className="block text-sm text-muted-foreground mb-3 font-body">פורמט</label>
                  <div className="flex gap-3">
                    {[{ v: "online", l: "אונליין" }, { v: "in-person", l: "פרונטלי" }, { v: "both", l: "שניהם" }].map((o) => (
                      <PillToggle key={o.v} label={o.l} selected={form.format === o.v} onClick={() => setForm({ ...form, format: o.v })} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-3 font-body">שפות</label>
                  <div className="flex gap-3">{languageOptions.map((l) => <PillToggle key={l} label={l} selected={form.languages.includes(l)} onClick={() => toggle("languages", l)} />)}</div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-3 font-body">מחיר לפגישה: <span className="font-bold text-primary">{form.price_per_session} ש״ח</span></label>
                  <input type="range" min={100} max={1500} step={50} value={form.price_per_session}
                    onChange={(e) => setForm({ ...form, price_per_session: Number(e.target.value) })}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer bg-border" style={{ accentColor: "hsl(24 44% 50%)" }} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1 font-body"><span>100 ש״ח</span><span>1,500 ש״ח</span></div>
                </div>
                <div className="border-b border-border">
                  <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="תל אביב, מרכז" className={inputClass} />
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-foreground font-body">פתוח למטופלים חדשים</span>
                  <button type="button" onClick={() => setForm({ ...form, accepting_new_clients: !form.accepting_new_clients })}
                    className="relative w-12 h-6 rounded-full transition-colors duration-200"
                    style={{ background: form.accepting_new_clients ? "hsl(24 44% 50%)" : "hsl(30 15% 80%)" }}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${form.accepting_new_clients ? "right-0.5" : "right-[calc(100%-22px)]"}`} />
                  </button>
                </div>
              </div>

              <div className="section-divider my-10" />

              <div className="space-y-5">
                <h3 className="font-display text-xl font-bold text-foreground">קצת עליך</h3>
                <div className="relative border-b border-border">
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 300) })}
                    placeholder="ספרו למה בחרתם בתחום הזה ומה מייחד את העבודה שלכם..." rows={4} className={`${inputClass} resize-none`} />
                  <span className="absolute bottom-1 left-1 text-xs text-muted-foreground/50">{form.bio.length}/300</span>
                </div>
                <div className="border-b border-border">
                  <input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="וואטסאפ לפניות (אופציונלי)" className={inputClass} />
                </div>
                <div className="border-b border-border">
                  <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="אתר אישי (אופציונלי)" className={inputClass} />
                </div>
              </div>

              <div className="mt-12">
                <button type="submit" disabled={loading} className="btn-primary w-full text-lg">
                  {loading ? "שולח..." : "שלחו את הפרופיל שלכם"}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinAsPractitioner;
