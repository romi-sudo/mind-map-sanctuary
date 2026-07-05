import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ROLE_MAP: Record<string, string> = {
  "מטפל/ת": "practitioner",
  "יועץ/ת": "consultant",
  "מנהל/ת קהילה": "community_manager",
  "אחר": "other",
};

const EarlyAccess = () => {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "",
    specialty: "",
    years_experience: "",
    bio: "",
    social_link: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone || !form.role || !form.social_link || !form.specialty || !form.years_experience) return;
    setLoading(true);
    const { error } = await supabase.from("early_access_signups").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: ROLE_MAP[form.role] ?? "other",
      social_link: form.social_link.trim(),
      specialty: form.specialty.trim(),
      years_experience: form.years_experience,
      bio: form.bio.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast.error("אירעה שגיאה, נסו שוב");
      return;
    }
    toast.success("נרשמתם בהצלחה!");
    setSubmitted(true);
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <button
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
        className="fixed top-6 right-6 z-50 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-4 py-2 font-body text-sm text-foreground hover:text-primary transition-colors backdrop-blur"
      >
        → חזרה
      </button>
      <div className="spa-card w-full max-w-md !p-8">
        <div className="text-center mb-6">
          <div className="font-display text-2xl text-foreground mb-4">MapSoul</div>
          {!submitted && (
            <>
              <h1 className="font-display text-2xl mb-2">הצטרפו ל-MapSoul</h1>
              <p className="text-sm text-muted-foreground">
                המקום שמחבר בין מומחים לאנשים שצריכים אותם — היו בין הראשונים
              </p>
            </>
          )}
        </div>

        {submitted ? (
          <div className="space-y-5 py-2">
            <div className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-display text-xl">תודה! נצור איתך קשר בקרוב</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-right">
              <div className="flex items-center gap-2 mb-3 justify-center">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs">✓</span>
                <p className="text-sm font-medium text-foreground">
                  הפרטים נשמרו בהצלחה במאגר
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start justify-between gap-3 border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">תחום התמחות</span>
                  <span className="text-left text-foreground font-medium break-all">{form.specialty}</span>
                </li>
                <li className="flex items-start justify-between gap-3 border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">שנות ניסיון</span>
                  <span className="text-left text-foreground font-medium">{form.years_experience}</span>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="text-muted-foreground">כמה מילים עליך</span>
                  <span className="text-left text-foreground font-medium break-words max-w-[60%]">
                    {form.bio.trim() ? form.bio : "—"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">שם מלא</label>
              <input
                required
                type="text"
                value={form.full_name}
                onChange={update("full_name")}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">אימייל</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={update("email")}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">טלפון</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">אני...</label>
              <select
                required
                value={form.role}
                onChange={update("role")}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="" disabled>בחרו</option>
                {Object.keys(ROLE_MAP).map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">תחום התמחות</label>
              <input
                required
                type="text"
                value={form.specialty}
                onChange={update("specialty")}
                placeholder="למשל: טיפול רגשי, אימון קריירה, מיינדפולנס..."
                className="w-full rounded-xl border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">שנות ניסיון</label>
              <select
                required
                value={form.years_experience}
                onChange={update("years_experience")}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="" disabled>בחרו</option>
                {["פחות משנה", "1-3 שנים", "3-5 שנים", "5-10 שנים", "10+ שנים"].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">כמה מילים עליך</label>
              <textarea
                value={form.bio}
                onChange={update("bio")}
                placeholder="ספר/י בקצרה על הגישה שלך..."
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                קישור לאתר / אינסטגרם / פייסבוק
              </label>
              <input
                required
                type="url"
                value={form.social_link}
                onChange={update("social_link")}
                placeholder="https://..."
                className="w-full rounded-xl border border-border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">
              {loading ? "שולח..." : "הצטרפו לרשימה"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EarlyAccess;
