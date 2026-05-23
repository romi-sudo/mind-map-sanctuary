import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";
  const arrow = i18n.language === "he" ? "←" : "→";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) { toast.error(err.message || t("auth.forgot.error")); }
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

        {sent ? (
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">{t("auth.forgot.sentTitle")}</h1>
            <p className="font-body text-muted-foreground mb-6">{t("auth.forgot.sentBody")}</p>
            <Link to="/login" className="font-body text-sm hover:underline text-primary">{t("auth.forgot.backToLogin")}</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">{t("auth.forgot.title")}</h1>
            <p className="font-body text-muted-foreground text-center mb-8">{t("auth.forgot.subtitle")}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-border">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.forgot.email")} className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? t("auth.forgot.submitting") : t("auth.forgot.submit")}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="font-body text-sm hover:underline text-primary">{t("auth.forgot.backToLogin")}</Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
