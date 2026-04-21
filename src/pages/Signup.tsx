import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import RolePickerModal from "@/components/RolePickerModal";
import { getPostAuthRoute } from "@/lib/postAuthRoute";

type Tab = "consumer" | "practitioner" | "company";

const COMPANY_SIZES = ["עד 10 עובדים", "10-50 עובדים", "50-200 עובדים", "200+ עובדים"];

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get("role") as Tab) || "consumer";
  const nextPath = searchParams.get("next") || "";

  const [tab, setTab] = useState<Tab>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // practitioner-only
  const [profTitle, setProfTitle] = useState("");

  // company-only
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [website, setWebsite] = useState("");

  // OAuth role picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<"google" | "apple" | null>(null);

  useEffect(() => {
    if (initialRole && ["consumer", "practitioner", "company"].includes(initialRole)) {
      setTab(initialRole);
    }
  }, [initialRole]);

  const redirectAfterSignup = async (role: Tab, userId?: string) => {
    if (nextPath) { navigate(nextPath); return; }
    if (role === "practitioner" && userId) {
      const dest = await getPostAuthRoute(userId, role);
      navigate(dest);
      return;
    }
    if (role === "company") navigate("/corporate");
    else navigate("/");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error("הסיסמאות לא תואמות"); return; }
    if (!agreed) { toast.error("יש לאשר את תנאי השימוש"); return; }
    if (tab === "company") {
      if (!companyName.trim()) { toast.error("אנא הזינו שם חברה"); return; }
      if (!companySize) { toast.error("אנא בחרו גודל חברה"); return; }
    }
    if (tab === "practitioner" && !profTitle.trim()) {
      toast.error("אנא הזינו תואר מקצועי"); return;
    }

    setLoading(true);
    try {
      const meta: Record<string, string> = {
        full_name: name,
        role: tab,
      };
      if (phone) meta.phone = phone;
      if (tab === "practitioner") meta.professional_title = profTitle;
      if (tab === "company") {
        meta.company_name = companyName;
        meta.company_size = companySize;
        if (contactRole) meta.contact_role = contactRole;
        if (website) meta.website = website;
      }

      const { data: signUpData, error } = await supabase.auth.signUp({
        email, password,
        options: { data: meta, emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      toast.success("נרשמתם בהצלחה!");

      // If no session was returned (email confirmation required), sign in immediately
      if (!signUpData.session) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) {
          toast.info("שלחנו לכם מייל לאימות החשבון");
          navigate("/login");
          return;
        }
      }
      const { data: { user } } = await supabase.auth.getUser();
      await redirectAfterSignup(tab, user?.id);
    } catch (err: any) {
      toast.error(err.message || "שגיאה בהרשמה");
    } finally { setLoading(false); }
  };

  const startOAuth = (provider: "google" | "apple") => {
    setPendingProvider(provider);
    setPickerOpen(true);
  };

  const handleRoleSelected = async (role: Tab) => {
    setPickerOpen(false);
    if (!pendingProvider) return;
    sessionStorage.setItem("pending_role", role);
    const result = await lovable.auth.signInWithOAuth(pendingProvider, { redirect_uri: window.location.origin });
    if (result.error) {
      sessionStorage.removeItem("pending_role");
      toast.error(`שגיאה בהרשמה עם ${pendingProvider === "google" ? "Google" : "Apple"}`);
    }
    if (result.redirected) return;
    const { data: { user } } = await supabase.auth.getUser();
    await redirectAfterSignup(role, user?.id);
  };

  const inputClass = "w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-body text-sm";

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 py-12 bg-shadow-leaves nature-overlay ambient-leaves ambient-mist">
      <RolePickerModal open={pickerOpen} onOpenChange={setPickerOpen} onSelect={(r) => handleRoleSelected(r as Tab)} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="spa-card w-full max-w-md"
      >
        <div className="mb-5">
          <Link to="/" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">← חזרה לדף הבית</Link>
        </div>

        <Link to="/" className="font-display text-2xl font-bold block text-center mb-6 text-foreground">MapSoul</Link>

        <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">צרו חשבון</h1>
        <p className="font-body text-muted-foreground text-center mb-6">התחילו את המסע שלכם עם MapSoul</p>

        <div className="flex mb-8 border-b border-border">
          {(["consumer", "practitioner", "company"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} type="button"
              className={`flex-1 pb-3 px-1 font-body text-xs sm:text-sm transition-colors border-b-2 ${tab === t ? "text-foreground border-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t === "consumer" ? "משתמש/ת" : t === "practitioner" ? "מומחה/ית" : "חברה / ארגון"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="border-b border-border">
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="שם מלא" className={inputClass} />
          </div>
          <div className="border-b border-border">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="אימייל" className={inputClass} />
          </div>
          <div className="border-b border-border">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="טלפון (לא חובה)" className={inputClass} />
          </div>

          {tab === "practitioner" && (
            <div className="border-b border-border">
              <input type="text" required value={profTitle} onChange={(e) => setProfTitle(e.target.value)} placeholder="תואר מקצועי (לדוגמה: פסיכולוגית קלינית)" className={inputClass} />
            </div>
          )}

          {tab === "company" && (
            <>
              <div className="border-b border-border">
                <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="שם החברה" className={inputClass} />
              </div>
              <div className="border-b border-border">
                <select required value={companySize} onChange={(e) => setCompanySize(e.target.value)} className={`${inputClass} ${companySize ? "" : "text-muted-foreground/50"}`}>
                  <option value="">גודל החברה</option>
                  {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="border-b border-border">
                <input type="text" value={contactRole} onChange={(e) => setContactRole(e.target.value)} placeholder="תפקיד איש הקשר (HR, מנכ״ל...)" className={inputClass} />
              </div>
              <div className="border-b border-border">
                <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="אתר החברה (לא חובה)" className={inputClass} />
              </div>
            </>
          )}

          <div className="relative border-b border-border">
            <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="סיסמה" className={inputClass} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors font-body text-xs">
              {showPassword ? "הסתר" : "הצג"}
            </button>
          </div>
          <div className="border-b border-border">
            <input type={showPassword ? "text" : "password"} required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="אימות סיסמה" className={inputClass} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: "hsl(24 44% 50%)" }} />
            <span className="font-body text-sm text-muted-foreground">קראתי ואני מסכים/ה לתנאי השימוש</span>
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "יוצר חשבון..." : "יצירת חשבון"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="font-body text-sm text-muted-foreground">או</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-3">
          <button onClick={() => startOAuth("google")} type="button" className="btn-secondary w-full flex items-center justify-center gap-3 !py-3">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            הרשמה עם Google
          </button>

          <button onClick={() => startOAuth("apple")} type="button" className="btn-secondary w-full flex items-center justify-center gap-3 !py-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            הרשמה עם Apple
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            כבר יש לכם חשבון?{" "}
            <Link to="/login" className="hover:underline text-primary">התחברו כאן</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
