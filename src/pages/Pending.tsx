import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Pending = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";
  const textAlign = i18n.language === "he" ? "text-right" : "text-left";

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading || !user) return null;

  const steps = t("pending.steps", { returnObjects: true }) as string[];
  const afterItems = t("pending.afterItems", { returnObjects: true }) as string[];

  return (
    <div dir={dir} className="min-h-screen bg-sand flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="spa-card max-w-lg w-full text-center p-10"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-warm-gold/20 flex items-center justify-center ring-4 ring-warm-gold/10">
              <Check className="w-8 h-8 text-warm-gold" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="font-display text-3xl text-foreground mb-4">
            {t("pending.title")}
          </h1>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            {t("pending.body")}
          </p>

          <div className="gold-line mx-auto mb-8" />

          <div className="grid grid-cols-3 gap-4 mb-8">
            {steps.map((label, idx) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-base mb-2">
                  {idx + 1}
                </div>
                <p className="font-body text-xs text-foreground/80 leading-snug">{label}</p>
              </div>
            ))}
          </div>

          <div className={`${textAlign} bg-warm-gold/5 rounded-2xl p-5 mb-8 border border-warm-gold/20`}>
            <h3 className="font-display text-base font-bold text-foreground mb-3">
              {t("pending.afterTitle")}
            </h3>
            <ul className="space-y-2">
              {afterItems.map((item) => (
                <li key={item} className="flex items-start gap-2 font-body text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-warm-gold shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="font-body text-sm text-muted-foreground">
            {t("pending.contact")}
            <a href="mailto:hello@mapsoul.co" className="text-primary hover:underline">
              hello@mapsoul.co
            </a>
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Pending;
