import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FieldWrap from "./FieldWrap";

const topicOptions = [
  "AI וטכנולוגיה", "נומרולוגיה", "אסטרולוגיה", "קבלה", "תניא", "יאמה", "טארוט", "רפואה אינטגרטיבית", "מיינדפולנס", "אחר",
];
const levelOptions = ["מתחילים", "מתקדמים", "מקצועי", "לכולם"];
const formatOptions = ["לייב", "מוקלט", "היברידי", "קבוצתי"];
const toolOptions = ["ChatGPT", "Midjourney", "Canva AI", "Notion AI", "כלים לשיווק", "אוטומציה", "אחר"];

const phoneRegex = /^[\d\s\-+()]{9,15}$/;
const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

const schema = z.object({
  full_name: z.string().trim().min(2, "השם חייב להכיל לפחות 2 תווים").max(80),
  professional_title: z.string().trim().min(2, "אנא הזינו תואר מקצועי").max(80),
  email: z.string().trim().email("כתובת אימייל לא תקינה").max(255),
  phone: z.string().trim().regex(phoneRegex, "מספר טלפון לא תקין"),
  course_name: z.string().trim().min(3, "שם הקורס חייב להכיל לפחות 3 תווים").max(120, "שם הקורס ארוך מדי"),
  course_description: z.string().trim().max(200, "התיאור ארוך מדי").optional().or(z.literal("")),
  topic: z.string().min(1, "בחרו נושא"),
  level: z.string().min(1, "בחרו רמה"),
  format: z.string().min(1, "בחרו פורמט"),
  duration: z.string().trim().max(60).optional().or(z.literal("")),
  price: z.number().min(0, "מחיר חייב להיות חיובי").max(50000, "מחיר חורג מהתחום הסביר"),
  teaching_experience: z.string().trim().max(500).optional().or(z.literal("")),
  sample_link: z.string().trim().regex(urlRegex, "קישור לא תקין").optional().or(z.literal("")),
  website: z.string().trim().regex(urlRegex, "כתובת אתר לא תקינה").optional().or(z.literal("")),
  whatsapp: z.string().trim().regex(phoneRegex, "מספר וואטסאפ לא תקין").optional().or(z.literal("")),
});

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
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

  const setChoice = (key: "topic" | "level" | "format", val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((e) => { const c = { ...e }; delete c[key]; return c; });
  };

  const validateField = (key: string, value: unknown) => {
    const single = (schema.shape as Record<string, z.ZodTypeAny>)[key];
    if (!single) return;
    const res = single.safeParse(value);
    setErrors((e) => {
      const next = { ...e };
      if (res.success) delete next[key];
      else next[key] = res.error.issues[0]?.message ?? "ערך לא תקין";
      return next;
    });
  };

  const update = (k: string, v: string | number) => {
    setForm({ ...form, [k]: v });
    if (touched[k]) validateField(k, v);
  };
  const blur = (k: string, v: unknown) => {
    setTouched((t) => ({ ...t, [k]: true }));
    validateField(k, v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      const touchedMap: Record<string, boolean> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        touchedMap[key] = true;
      }
      setErrors(fieldErrors);
      setTouched(touchedMap);
      toast.error("יש לתקן את השדות המסומנים לפני שליחה");
      return;
    }

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
    } catch (err) {
      console.error(err);
      toast.error("אירעה שגיאה בהגשה. אנא נסו שוב או פנו אלינו ל־hello@mapsoul.co");
    } finally { setLoading(false); }
  };

  const inputClass = "w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-body text-sm transition-all";

  return (
    <form onSubmit={handleSubmit} className="spa-card !p-8 md:!p-12" noValidate>
      <h2 className="font-display text-3xl font-bold text-foreground mb-2 text-center">הגישו קורס חדש</h2>
      <p className="text-center text-sm text-muted-foreground mb-10 font-body">
        שדות עם <span className="text-primary">*</span> הם חובה · ניצור איתכם קשר תוך 48 שעות
      </p>

      {/* Section A — Personal */}
      <div className="space-y-5">
        <h3 className="font-display text-xl font-bold text-foreground">פרטים אישיים</h3>

        <FieldWrap label="שם מלא" required error={touched.full_name ? errors.full_name : undefined}>
          <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} onBlur={(e) => blur("full_name", e.target.value)} placeholder="לדוגמה: יואב ברק" className={inputClass} />
        </FieldWrap>

        <FieldWrap label="תואר מקצועי" required helper="לדוגמה: מנחה סדנאות AI, מורה לקבלה" error={touched.professional_title ? errors.professional_title : undefined}>
          <input value={form.professional_title} onChange={(e) => update("professional_title", e.target.value)} onBlur={(e) => blur("professional_title", e.target.value)} placeholder="מנחה סדנאות AI" className={inputClass} />
        </FieldWrap>

        <FieldWrap label="אימייל" required helper="נשלח אליו אישור הגשה" error={touched.email ? errors.email : undefined}>
          <input type="email" dir="ltr" value={form.email} onChange={(e) => update("email", e.target.value)} onBlur={(e) => blur("email", e.target.value)} placeholder="name@example.com" className={`${inputClass} text-right`} />
        </FieldWrap>

        <FieldWrap label="טלפון" required helper="9–15 ספרות" error={touched.phone ? errors.phone : undefined}>
          <input type="tel" dir="ltr" value={form.phone} onChange={(e) => update("phone", e.target.value)} onBlur={(e) => blur("phone", e.target.value)} placeholder="050-1234567" className={`${inputClass} text-right`} />
        </FieldWrap>
      </div>

      <div className="section-divider my-10" />

      {/* Section B — Course Details */}
      <div className="space-y-6">
        <h3 className="font-display text-xl font-bold text-foreground">פרטי הקורס</h3>

        <FieldWrap label="שם הקורס" required helper="כותרת קצרה ובהירה — כמו שתופיע בכרטיס הקורס" error={touched.course_name ? errors.course_name : undefined}>
          <input value={form.course_name} onChange={(e) => update("course_name", e.target.value)} onBlur={(e) => blur("course_name", e.target.value)} placeholder="לדוגמה: יסודות הקבלה למתחילים" className={inputClass} />
        </FieldWrap>

        <FieldWrap label="תיאור הקורס" helper={`עד 200 תווים · ${form.course_description.length}/200`} error={touched.course_description ? errors.course_description : undefined}>
          <textarea value={form.course_description} onChange={(e) => update("course_description", e.target.value.slice(0, 200))} onBlur={(e) => blur("course_description", e.target.value)}
            placeholder="על מה הקורס ומה הלומדים יקבלו..." rows={3} className={`${inputClass} resize-none`} />
        </FieldWrap>

        <div>
          <label className="block text-sm text-foreground mb-2 font-body">נושא <span className="text-primary">*</span></label>
          <div className="flex flex-wrap gap-2">
            {topicOptions.map((t) => <PillToggle key={t} label={t} selected={form.topic === t} onClick={() => setChoice("topic", t)} />)}
          </div>
          {errors.topic && <p className="text-xs text-destructive font-body mt-2">{errors.topic}</p>}
        </div>

        <div>
          <label className="block text-sm text-foreground mb-2 font-body">רמה <span className="text-primary">*</span></label>
          <p className="text-xs text-muted-foreground/70 mb-3">למי הקורס מתאים?</p>
          <div className="flex flex-wrap gap-2">
            {levelOptions.map((l) => <PillToggle key={l} label={l} selected={form.level === l} onClick={() => setChoice("level", l)} />)}
          </div>
          {errors.level && <p className="text-xs text-destructive font-body mt-2">{errors.level}</p>}
        </div>

        <div>
          <label className="block text-sm text-foreground mb-2 font-body">פורמט <span className="text-primary">*</span></label>
          <div className="flex flex-wrap gap-2">
            {formatOptions.map((f) => <PillToggle key={f} label={f} selected={form.format === f} onClick={() => setChoice("format", f)} />)}
          </div>
          {errors.format && <p className="text-xs text-destructive font-body mt-2">{errors.format}</p>}
        </div>

        <FieldWrap label="משך הקורס" helper="אופציונלי" error={touched.duration ? errors.duration : undefined}>
          <input value={form.duration} onChange={(e) => update("duration", e.target.value)} onBlur={(e) => blur("duration", e.target.value)} placeholder="לדוגמה: 6 שבועות, 12 מפגשים" className={inputClass} />
        </FieldWrap>

        <FieldWrap label="מחיר" required helper="מחיר מלא לקורס בש״ח" error={touched.price ? errors.price : undefined}>
          <input type="number" min={0} value={form.price || ""} onChange={(e) => update("price", Number(e.target.value))} onBlur={(e) => blur("price", Number(e.target.value))} placeholder="לדוגמה: 1200" className={inputClass} />
        </FieldWrap>

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
              <label className="block text-sm text-foreground mb-2 font-body">כלים שמלמדים בקורס</label>
              <p className="text-xs text-muted-foreground/70 mb-3">סמנו את כל הכלים הרלוונטיים</p>
              <div className="flex flex-wrap gap-2">
                {toolOptions.map((t) => <PillToggle key={t} label={t} selected={form.tools.includes(t)} onClick={() => toggleTool(t)} />)}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="section-divider my-10" />

      {/* Section D — About You */}
      <div className="space-y-5">
        <h3 className="font-display text-xl font-bold text-foreground">קצת עליך</h3>

        <FieldWrap label="ניסיון בהוראה" helper="אופציונלי · עד 500 תווים" error={touched.teaching_experience ? errors.teaching_experience : undefined}>
          <textarea value={form.teaching_experience} onChange={(e) => update("teaching_experience", e.target.value.slice(0, 500))} onBlur={(e) => blur("teaching_experience", e.target.value)}
            placeholder="כמה שנות ניסיון, מה הרקע שלך בתחום..." rows={3} className={`${inputClass} resize-none`} />
        </FieldWrap>

        <FieldWrap label="לינק לדוגמה של שיעור" helper="אופציונלי · YouTube, Vimeo או כל קישור פתוח" error={touched.sample_link ? errors.sample_link : undefined}>
          <input type="url" dir="ltr" value={form.sample_link} onChange={(e) => update("sample_link", e.target.value)} onBlur={(e) => blur("sample_link", e.target.value)} placeholder="https://youtu.be/..." className={`${inputClass} text-right`} />
        </FieldWrap>

        <FieldWrap label="אתר או דף הרשמה קיים" helper="אופציונלי" error={touched.website ? errors.website : undefined}>
          <input type="url" dir="ltr" value={form.website} onChange={(e) => update("website", e.target.value)} onBlur={(e) => blur("website", e.target.value)} placeholder="https://your-site.com" className={`${inputClass} text-right`} />
        </FieldWrap>

        <FieldWrap label="וואטסאפ לפניות" helper="אופציונלי" error={touched.whatsapp ? errors.whatsapp : undefined}>
          <input type="tel" dir="ltr" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} onBlur={(e) => blur("whatsapp", e.target.value)} placeholder="050-1234567" className={`${inputClass} text-right`} />
        </FieldWrap>
      </div>

      <div className="mt-12">
        <button type="submit" disabled={loading} className="btn-primary w-full text-lg">
          {loading ? "שולח..." : "שלחו את פרטי הקורס ←"}
        </button>
        <p className="text-xs text-muted-foreground text-center mt-3 font-body">
          בהגשת הטופס את/ה מאשר/ת את <a href="/terms" className="underline hover:text-primary">תנאי השימוש</a> ואת <a href="/privacy" className="underline hover:text-primary">מדיניות הפרטיות</a>
        </p>
      </div>
    </form>
  );
};

export default CourseForm;
