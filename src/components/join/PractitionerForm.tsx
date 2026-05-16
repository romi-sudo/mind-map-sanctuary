import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FieldWrap from "./FieldWrap";

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

const phoneRegex = /^[\d\s\-+()]{9,15}$/;
const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

const schema = z.object({
  full_name: z.string().trim().min(2, "השם חייב להכיל לפחות 2 תווים").max(80, "השם ארוך מדי"),
  professional_title: z.string().trim().min(2, "אנא הזינו תואר מקצועי").max(80, "התואר ארוך מדי"),
  email: z.string().trim().email("כתובת אימייל לא תקינה").max(255),
  phone: z.string().trim().regex(phoneRegex, "מספר טלפון לא תקין"),
  specialties: z.array(z.string()).min(1, "בחרו לפחות נושא התמחות אחד"),
  service_types: z.array(z.string()).min(1, "בחרו לפחות סוג שירות אחד"),
  approaches: z.array(z.string()).min(1, "בחרו לפחות גישה טיפולית אחת"),
  languages: z.array(z.string()).min(1, "בחרו לפחות שפה אחת"),
  area: z.string().trim().max(80, "טקסט ארוך מדי").optional().or(z.literal("")),
  bio: z.string().trim().max(300, "הביוגרפיה ארוכה מדי").optional().or(z.literal("")),
  whatsapp: z.string().trim().regex(phoneRegex, "מספר וואטסאפ לא תקין").optional().or(z.literal("")),
  website: z.string().trim().regex(urlRegex, "כתובת אתר לא תקינה").optional().or(z.literal("")),
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

const PractitionerForm = ({ onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    full_name: "", professional_title: "", email: "", phone: "",
    specialties: [] as string[], service_types: [] as string[],
    approaches: [] as string[], format: "both",
    languages: ["עברית"] as string[], price_per_session: 300,
    area: "", accepting_new_clients: true, bio: "", whatsapp: "", website: "",
  });

  const toggle = (field: "specialties" | "service_types" | "approaches" | "languages", val: string) => {
    setForm((prev) => {
      const next = {
        ...prev,
        [field]: prev[field].includes(val) ? prev[field].filter((v) => v !== val) : [...prev[field], val],
      };
      // live-clear error once user makes a valid selection
      if (next[field].length > 0 && errors[field]) {
        setErrors((e) => { const c = { ...e }; delete c[field]; return c; });
      }
      return next;
    });
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

      if (user) {
        const { data: existing } = await supabase
          .from("practitioner_applications")
          .select("id, status")
          .eq("user_id", user.id)
          .maybeSingle();

        if (existing) {
          toast.info("כבר הגשת מועמדות — אנחנו בבדיקה. ניצור קשר תוך 48 שעות.");
          window.location.href = "/pending";
          return;
        }
      }

      const { error } = await supabase.from("practitioner_applications").insert({
        full_name: form.full_name, professional_title: form.professional_title,
        email: form.email, phone: form.phone, specialties: form.specialties,
        service_types: form.service_types, approaches: form.approaches,
        format: form.format, languages: form.languages,
        price_per_session: form.price_per_session, area: form.area || null,
        accepting_new_clients: form.accepting_new_clients,
        bio: form.bio || null, whatsapp: form.whatsapp || null, website: form.website || null,
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

  const update = (k: string, v: string) => {
    setForm({ ...form, [k]: v });
    if (touched[k]) validateField(k, v);
  };
  const blur = (k: string, v: unknown) => {
    setTouched((t) => ({ ...t, [k]: true }));
    validateField(k, v);
  };

  return (
    <form onSubmit={handleSubmit} className="spa-card !p-8 md:!p-12" noValidate>
      <h2 className="font-display text-3xl font-bold text-foreground mb-2 text-center">צרו פרופיל מקצועי</h2>
      <p className="text-center text-sm text-muted-foreground mb-10 font-body">
        שדות עם <span className="text-primary">*</span> הם חובה · פרטיכם נשמרים באופן מאובטח
      </p>

      <div className="space-y-5">
        <h3 className="font-display text-xl font-bold text-foreground">פרטים אישיים</h3>

        <FieldWrap label="שם מלא" required helper="כפי שיופיע בפרופיל הציבורי שלכם" error={touched.full_name ? errors.full_name : undefined}>
          <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} onBlur={(e) => blur("full_name", e.target.value)} placeholder="לדוגמה: דנה כהן" className={inputClass} />
        </FieldWrap>

        <FieldWrap label="תואר מקצועי" required helper="לדוגמה: פסיכולוגית קלינית, מאמן NLP מוסמך" error={touched.professional_title ? errors.professional_title : undefined}>
          <input value={form.professional_title} onChange={(e) => update("professional_title", e.target.value)} onBlur={(e) => blur("professional_title", e.target.value)} placeholder="פסיכולוגית קלינית" className={inputClass} />
        </FieldWrap>

        <FieldWrap label="אימייל" required helper="נשלח אליו אישור הגשה ופניות מלקוחות" error={touched.email ? errors.email : undefined}>
          <input type="email" dir="ltr" value={form.email} onChange={(e) => update("email", e.target.value)} onBlur={(e) => blur("email", e.target.value)} placeholder="name@example.com" className={`${inputClass} text-right`} />
        </FieldWrap>

        <FieldWrap label="טלפון" required helper="9–15 ספרות, אפשר עם רווחים או מקפים" error={touched.phone ? errors.phone : undefined}>
          <input type="tel" dir="ltr" value={form.phone} onChange={(e) => update("phone", e.target.value)} onBlur={(e) => blur("phone", e.target.value)} placeholder="050-1234567" className={`${inputClass} text-right`} />
        </FieldWrap>
      </div>

      <div className="section-divider my-10" />

      <div className="space-y-6">
        <h3 className="font-display text-xl font-bold text-foreground">מומחיות</h3>
        <div>
          <label className="block text-sm text-foreground mb-2 font-body">נושאי התמחות <span className="text-primary">*</span></label>
          <p className="text-xs text-muted-foreground/70 mb-3">בחרו את כל הנושאים בהם אתם מתמחים — מסייע ב-AI להתאמת לקוחות</p>
          <div className="flex flex-wrap gap-2">{specialtyOptions.map((s) => <PillToggle key={s} label={s} selected={form.specialties.includes(s)} onClick={() => toggle("specialties", s)} />)}</div>
          {errors.specialties && <p className="text-xs text-destructive font-body mt-2">{errors.specialties}</p>}
        </div>
        <div>
          <label className="block text-sm text-foreground mb-2 font-body">סוג שירות <span className="text-primary">*</span></label>
          <p className="text-xs text-muted-foreground/70 mb-3">איך אתם פוגשים מטופלים? אפשר לבחור כמה</p>
          <div className="flex flex-wrap gap-2">{serviceOptions.map((s) => <PillToggle key={s} label={s} selected={form.service_types.includes(s)} onClick={() => toggle("service_types", s)} />)}</div>
          {errors.service_types && <p className="text-xs text-destructive font-body mt-2">{errors.service_types}</p>}
        </div>
        <div>
          <label className="block text-sm text-foreground mb-2 font-body">גישה טיפולית <span className="text-primary">*</span></label>
          <p className="text-xs text-muted-foreground/70 mb-3">לא בטוחים מה לבחור? סמנו אינטגרטיבי</p>
          <div className="flex flex-wrap gap-2">{approachOptions.map((a) => <PillToggle key={a} label={a} selected={form.approaches.includes(a)} onClick={() => toggle("approaches", a)} />)}</div>
          {errors.approaches && <p className="text-xs text-destructive font-body mt-2">{errors.approaches}</p>}
        </div>
      </div>

      <div className="section-divider my-10" />

      <div className="space-y-6">
        <h3 className="font-display text-xl font-bold text-foreground">פרטים מעשיים</h3>
        <div>
          <label className="block text-sm text-foreground mb-3 font-body">פורמט</label>
          <div className="flex gap-3">
            {[{ v: "online", l: "אונליין" }, { v: "in-person", l: "פרונטלי" }, { v: "both", l: "שניהם" }].map((o) => (
              <PillToggle key={o.v} label={o.l} selected={form.format === o.v} onClick={() => setForm({ ...form, format: o.v })} />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-foreground mb-2 font-body">שפות <span className="text-primary">*</span></label>
          <div className="flex gap-3">{languageOptions.map((l) => <PillToggle key={l} label={l} selected={form.languages.includes(l)} onClick={() => toggle("languages", l)} />)}</div>
          {errors.languages && <p className="text-xs text-destructive font-body mt-2">{errors.languages}</p>}
        </div>
        <div>
          <label className="block text-sm text-foreground mb-3 font-body">מחיר לפגישה: <span className="font-bold text-primary">{form.price_per_session} ש״ח</span></label>
          <input type="range" min={100} max={1500} step={50} value={form.price_per_session}
            onChange={(e) => setForm({ ...form, price_per_session: Number(e.target.value) })}
            className="w-full h-1 rounded-full appearance-none cursor-pointer bg-border" style={{ accentColor: "hsl(24 44% 50%)" }} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1 font-body"><span>100 ש״ח</span><span>1,500 ש״ח</span></div>
        </div>

        <FieldWrap label="אזור גיאוגרפי" helper="רלוונטי לפגישות פרונטליות (אופציונלי)" error={touched.area ? errors.area : undefined}>
          <input value={form.area} onChange={(e) => update("area", e.target.value)} onBlur={(e) => blur("area", e.target.value)} placeholder="תל אביב, מרכז" className={inputClass} />
        </FieldWrap>

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

        <FieldWrap label="ביוגרפיה קצרה" helper={`עד 300 תווים · ${form.bio.length}/300`} error={touched.bio ? errors.bio : undefined}>
          <textarea value={form.bio} onChange={(e) => update("bio", e.target.value.slice(0, 300))} onBlur={(e) => blur("bio", e.target.value)}
            placeholder="ספרו למה בחרתם בתחום הזה ומה מייחד את העבודה שלכם..." rows={4} className={`${inputClass} resize-none`} />
        </FieldWrap>

        <FieldWrap label="וואטסאפ לפניות" helper="אופציונלי · יוצג ככפתור צ׳אט מהיר בפרופיל" error={touched.whatsapp ? errors.whatsapp : undefined}>
          <input type="tel" dir="ltr" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} onBlur={(e) => blur("whatsapp", e.target.value)} placeholder="050-1234567" className={`${inputClass} text-right`} />
        </FieldWrap>

        <FieldWrap label="אתר אישי" helper="אופציונלי · כולל https://" error={touched.website ? errors.website : undefined}>
          <input type="url" dir="ltr" value={form.website} onChange={(e) => update("website", e.target.value)} onBlur={(e) => blur("website", e.target.value)} placeholder="https://your-site.com" className={`${inputClass} text-right`} />
        </FieldWrap>
      </div>

      <div className="mt-12">
        <button type="submit" disabled={loading} className="btn-primary w-full text-lg">
          {loading ? "שולח..." : "הגש/י מועמדות"}
        </button>
        <p className="text-xs text-muted-foreground text-center mt-3 font-body">
          בהגשת הטופס את/ה מאשר/ת את <a href="/terms" className="underline hover:text-primary">תנאי השימוש</a> ואת <a href="/privacy" className="underline hover:text-primary">מדיניות הפרטיות</a>
        </p>
      </div>
    </form>
  );
};

export default PractitionerForm;
