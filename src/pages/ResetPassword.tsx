import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";
  const arrow = i18n.language === "he" ? "←" : "→";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setReady] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setReady(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error(t("auth.reset.errorMismatch")); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success(t("auth.reset.success"));
      navigate("/login");
    } catch (err: any) { toast.error(err.message || t("auth.reset.error")); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-body text-sm";

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="spa-card w-full max-w-md">
        <div className="mb-5">
          <Link to="/" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">{arrow} {t("common.backHome")}</Link>
        </div>
        <Link to="/" className="font-display text-2xl font-bold block text-center mb-6 text-foreground">MapSoul</Link>

        <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">{t("auth.reset.title")}</h1>
        <p className="font-body text-muted-foreground text-center mb-8">{t("auth.reset.subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative border-b border-border">
            <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.reset.newPw")} className={inputClass} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute ${dir === "rtl" ? "left-0" : "right-0"} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors font-body text-xs`}>
              {showPassword ? t("auth.hide") : t("auth.show")}
            </button>
          </div>
          <div className="border-b border-border">
            <input type={showPassword ? "text" : "password"} required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={t("auth.reset.confirmPw")} className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t("auth.reset.submitting") : t("auth.reset.submit")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-body text-sm hover:underline text-primary">{t("auth.reset.backToLogin")}</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
