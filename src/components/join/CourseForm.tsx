import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const topicOptions = [
  "AI וטכנולוגיה", "נומרולוגיה", "אסטרולוגיה", "קבלה", "תניא", "יאמה", "טארוט", "רפואה אינטגרטיבית", "מיינדפולנס", "אחר",
];
const levelOptions = ["מתחילים", "מתקדמים", "מקצועי", "לכולם"];
const formatOptions = ["לייב", "מוקלט", "היברידי", "קבוצתי"];
const toolOptions = ["ChatGPT", "Midjourney", "Canva AI", "Notion AI", "כלים לשיווק", "אוטומציה", "אחר"];

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

interface Props {
  onSuccess: () => void;
}

const CourseForm = ({ onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", professional_title: "", email: "", phone: "",
    course_name: "", course_description: "", topic: "", level: "", format: "",
    duration: "", price: 0, free_intro: false, tools: [] as string[],
    teaching_experience: "", sample_link: "", website: "", whatsapp: "",
  });

  const toggleTool = (val: string) => {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.includes(val) ? prev.tools.filter((v) => v !== val) : [...prev.tools, val],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("course_applications").insert({
        full_name: form.full_name, professional_title: form.professional_title,
        email: form.email, phone: form.phone, course_name: form.course_name,
        course_description: form.course_description || null, topic: form.topic,
        level: form.level, format: form.format, duration: form.duration || null,
        price: form.price, free_intro: form.free_intro, tools: form.tools,
        teaching_experience: form.teaching_experience || null,
        sample_link: form.sample_link || null, website: form.website || null,
        whatsapp: form.whatsapp || null,
        user_id: user?.id ?? null,
      });
      if (error) throw error;
      onSuccess();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-body text-sm transition-all";

  return (
    <form onSubmit={handleSubmit} className="spa-card !p-8 md:!p-12">
      <h2 className="font-display text-3xl font-bold text-foreground mb-10 text-center">הגישו קורס חדש</h2>

      {/* Section A — Personal */}
      <div className="space-y-5">
        <h3 className="font-display text-xl font-bold text-foreground">פרטים אישיים</h3>
        {[
          { v: form.full_name, k: "full_name", ph: "שם מלא", req: true },
          { v: form.professional_title, k: "professional_title", ph: "לדוגמה: מנחה סדנאות AI", req: true },
          { v: form.email, k: "email", ph: "אימייל", req: true, type: "email" },
          { v: form.phone, k: "phone", ph: "טלפון", req: true, type: "tel" },
        ].map((f) => (
          <div key={f.k} className="border-b border-border">
            <input required={f.req} type={f.type || "text"} value={f.v} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} placeholder={f.ph} className={inputClass} />
          </div>
        ))}
      </div>

      <div className="section-divider my-10" />

      {/* Section B — Course Details */}
      <div className="space-y-6">
        <h3 className="font-display text-xl font-bold text-foreground">פרטי הקורס</h3>
        <div className="border-b border-border">
          <input required value={form.course_name} onChange={(e) => setForm({ ...form, course_name: e.target.value })} placeholder="שם הקורס" className={inputClass} />
        </div>
        <div className="relative border-b border-border">
          <textarea value={form.course_description} onChange={(e) => setForm({ ...form, course_description: e.target.value.slice(0, 200) })}
            placeholder="על מה הקורס ומה הלומדים יקבלו..." rows={3} className={`${inputClass} resize-none`} />
          <span className="absolute bottom-1 left-1 text-xs text-muted-foreground/50">{form.course_description.length}/200</span>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-3 font-body">נושא</label>
          <div className="flex flex-wrap gap-2">
            {topicOptions.map((t) => (
              <PillToggle key={t} label={t} selected={form.topic === t} onClick={() => setForm({ ...form, topic: t })} />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-3 font-body">רמה</label>
          <div className="flex flex-wrap gap-2">
            {levelOptions.map((l) => (
              <PillToggle key={l} label={l} selected={form.level === l} onClick={() => setForm({ ...form, level: l })} />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-3 font-body">פורמט</label>
          <div className="flex flex-wrap gap-2">
            {formatOptions.map((f) => (
              <PillToggle key={f} label={f} selected={form.format === f} onClick={() => setForm({ ...form, format: f })} />
            ))}
          </div>
        </div>
        <div className="border-b border-border">
          <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="לדוגמה: 6 שבועות, 12 מפגשים" className={inputClass} />
        </div>
        <div className="border-b border-border">
          <input type="number" min={0} required value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="מחיר בש״ח" className={inputClass} />
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-foreground font-body">מפגש היכרות חינמי</span>
          <button type="button" onClick={() => setForm({ ...form, free_intro: !form.free_intro })}
            className="relative w-12 h-6 rounded-full transition-colors duration-200"
            style={{ background: form.free_intro ? "hsl(24 44% 50%)" : "hsl(30 15% 80%)" }}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${form.free_intro ? "right-0.5" : "right-[calc(100%-22px)]"}`} />
          </button>
        </div>
      </div>

      {/* Section C — AI Tools (conditional) */}
      {form.topic === "AI וטכנולוגיה" && (
        <>
          <div className="section-divider my-10" />
          <div className="space-y-6">
            <h3 className="font-display text-xl font-bold text-foreground">כלים וטכנולוגיה</h3>
            <div>
              <label className="block text-sm text-muted-foreground mb-3 font-body">כלים שמלמדים בקורס</label>
              <div className="flex flex-wrap gap-2">
                {toolOptions.map((t) => (
                  <PillToggle key={t} label={t} selected={form.tools.includes(t)} onClick={() => toggleTool(t)} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="section-divider my-10" />

      {/* Section D — About You */}
      <div className="space-y-5">
        <h3 className="font-display text-xl font-bold text-foreground">קצת עליך</h3>
        <div className="relative border-b border-border">
          <textarea value={form.teaching_experience} onChange={(e) => setForm({ ...form, teaching_experience: e.target.value })}
            placeholder="כמה שנות ניסיון, מה הרקע שלך בתחום..." rows={3} className={`${inputClass} resize-none`} />
        </div>
        <div className="border-b border-border">
          <input type="url" value={form.sample_link} onChange={(e) => setForm({ ...form, sample_link: e.target.value })} placeholder="לינק לדוגמה של שיעור (אופציונלי)" className={inputClass} />
        </div>
        <div className="border-b border-border">
          <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="אתר או דף הרשמה קיים (אופציונלי)" className={inputClass} />
        </div>
        <div className="border-b border-border">
          <input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="וואטסאפ לפניות (אופציונלי)" className={inputClass} />
        </div>
      </div>

      <div className="mt-12">
        <button type="submit" disabled={loading} className="btn-primary w-full text-lg">
          {loading ? "שולח..." : "שלחו את פרטי הקורס ←"}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
