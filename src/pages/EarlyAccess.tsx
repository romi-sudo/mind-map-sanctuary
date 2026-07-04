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
    social_link: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone || !form.role) return;
    setLoading(true);
    const { error } = await supabase.from("early_access_signups").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: ROLE_MAP[form.role] ?? "other",
      social_link: form.social_link.trim() || null,
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
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-display text-xl">תודה! נצור איתך קשר בקרוב</p>
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
              <label className="block text-sm mb-1">
                קישור לאתר / אינסטגרם / פייסבוק <span className="text-muted-foreground">(אופציונלי)</span>
              </label>
              <input
                type="text"
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
