import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import wildflowersImg from "@/assets/wildflowers-meadow.jpg";

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
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
      selected
        ? "bg-primary text-primary-foreground border-primary shadow-warm"
        : "bg-card text-muted-foreground border-border hover:border-primary/40"
    }`}
  >
    {selected && <Check size={14} className="inline mr-1 -mt-0.5" />}
    {label}
  </button>
);

const SectionDivider = () => (
  <div className="my-10">
    <div className="gold-line" />
  </div>
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
  const inputClass =
    "w-full px-5 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 text-sm font-body transition-all";

  return (
    <div className="min-h-screen bg-background font-body grain-overlay" dir="rtl">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Hero with nature image */}
          <motion.section {...fade} className="mb-14">
            <div className="rounded-2xl overflow-hidden mb-10 shadow-warm-lg">
              <img src={wildflowersImg} alt="Wildflowers meadow" className="w-full h-48 md:h-64 object-cover" loading="lazy" width={1920} height={1080} />
            </div>
            <div className="text-center">
              <h1 className="font-hebrew text-4xl md:text-6xl font-bold text-foreground mb-4">
                הצטרפו למשפחת MapSoul
              </h1>
              <div className="gold-line mb-6" />
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                חברו עם אנשים שמחפשים בדיוק את מה שאתם מציעים
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["קהל יעד מדויק", "פרופיל מקצועי", "ללא עמלות בהתחלה"].map((b) => (
                  <span key={b} className="px-5 py-2.5 rounded-full bg-card text-primary text-sm font-medium border border-primary/20 shadow-warm">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          {submitted ? (
            <motion.div {...fade} className="bg-card rounded-3xl p-12 text-center shadow-warm-lg border border-border/60">
              <p className="text-5xl mb-6">🌿</p>
              <h2 className="font-hebrew text-3xl font-bold text-foreground mb-4">תודה שהצטרפתם!</h2>
              <p className="text-muted-foreground text-lg">קיבלנו את הפרטים שלכם.</p>
              <p className="text-muted-foreground text-lg">ניצור איתכם קשר תוך 48 שעות.</p>
            </motion.div>
          ) : (
            <motion.form {...fade} transition={{ delay: 0.15 }} onSubmit={handleSubmit} className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/60 shadow-warm">
              <h2 className="font-hebrew text-3xl font-bold text-foreground mb-10 text-center">צרו פרופיל מקצועי</h2>

              <div className="space-y-5">
                <h3 className="font-hebrew text-xl font-bold text-foreground">פרטים אישיים</h3>
                <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="שם מלא" className={inputClass} />
                <input required value={form.professional_title} onChange={(e) => setForm({ ...form, professional_title: e.target.value })} placeholder="לדוגמה: פסיכולוגית קלינית" className={inputClass} />
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="אימייל" className={inputClass} />
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="טלפון" className={inputClass} />
              </div>

              <SectionDivider />

              <div className="space-y-6">
                <h3 className="font-hebrew text-xl font-bold text-foreground">מומחיות</h3>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">נושאי התמחות</label>
                  <div className="flex flex-wrap gap-2">{specialtyOptions.map((s) => <PillToggle key={s} label={s} selected={form.specialties.includes(s)} onClick={() => toggle("specialties", s)} />)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">סוג שירות</label>
                  <div className="flex flex-wrap gap-2">{serviceOptions.map((s) => <PillToggle key={s} label={s} selected={form.service_types.includes(s)} onClick={() => toggle("service_types", s)} />)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">גישה טיפולית</label>
                  <div className="flex flex-wrap gap-2">{approachOptions.map((a) => <PillToggle key={a} label={a} selected={form.approaches.includes(a)} onClick={() => toggle("approaches", a)} />)}</div>
                </div>
              </div>

              <SectionDivider />

              <div className="space-y-6">
                <h3 className="font-hebrew text-xl font-bold text-foreground">פרטים מעשיים</h3>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">פורמט</label>
                  <div className="flex gap-3">
                    {[{ v: "online", l: "אונליין" }, { v: "in-person", l: "פרונטלי" }, { v: "both", l: "שניהם" }].map((o) => (
                      <button key={o.v} type="button" onClick={() => setForm({ ...form, format: o.v })}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${form.format === o.v ? "bg-primary text-primary-foreground border-primary shadow-warm" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}>{o.l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">שפות</label>
                  <div className="flex gap-3">{languageOptions.map((l) => <PillToggle key={l} label={l} selected={form.languages.includes(l)} onClick={() => toggle("languages", l)} />)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">מחיר לפגישה: <span className="text-primary font-bold">{form.price_per_session} ש״ח</span></label>
                  <input type="range" min={100} max={1500} step={50} value={form.price_per_session}
                    onChange={(e) => setForm({ ...form, price_per_session: Number(e.target.value) })}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-border accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>100 ש״ח</span><span>1,500 ש״ח</span></div>
                </div>
                <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="תל אביב, מרכז" className={inputClass} />
                <div className="flex items-center justify-between bg-background rounded-2xl px-5 py-3.5 border border-border">
                  <span className="text-sm text-foreground">פתוח למטופלים חדשים</span>
                  <button type="button" onClick={() => setForm({ ...form, accepting_new_clients: !form.accepting_new_clients })}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.accepting_new_clients ? "bg-primary" : "bg-border"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.accepting_new_clients ? "right-0.5" : "right-[calc(100%-22px)]"}`} />
                  </button>
                </div>
              </div>

              <SectionDivider />

              <div className="space-y-5">
                <h3 className="font-hebrew text-xl font-bold text-foreground">קצת עליך</h3>
                <div className="relative">
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 300) })}
                    placeholder="ספרו למה בחרתם בתחום הזה ומה מייחד את העבודה שלכם..." rows={4} className={`${inputClass} resize-none`} />
                  <span className="absolute bottom-3 left-3 text-xs text-muted-foreground">{form.bio.length}/300</span>
                </div>
                <input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="וואטסאפ לפניות (אופציונלי)" className={inputClass} />
                <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="אתר אישי (אופציונלי)" className={inputClass} />
              </div>

              <div className="mt-12">
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:bg-primary-hover transition-colors duration-300 shadow-warm-lg disabled:opacity-50 btn-glow">
                  {loading ? "שולח..." : "שלחו את הפרופיל שלכם ←"}
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
