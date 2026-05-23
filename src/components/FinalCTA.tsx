import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate, Link } from "react-router-dom";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const arrow = i18n.language === "he" ? "←" : "→";

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-leaves nature-overlay ambient-leaves ambient-mist">
      <div ref={ref} className={`container mx-auto px-6 relative z-10 py-28 reveal ${isVisible ? "visible" : ""}`}>
        <div className="glass-card max-w-2xl mx-auto text-center">
          <p className="font-body text-sm tracking-[0.25em] uppercase mb-6 text-primary">{t("finalCta.eyebrow")}</p>
          <h2 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-foreground mb-6 leading-tight">
            {t("finalCta.title")}
          </h2>
          <div className="w-14 h-px mx-auto mb-10 bg-primary/30" />
          <button
            onClick={() => navigate("/questionnaire")}
            className="btn-primary text-lg"
          >
            {t("finalCta.cta")}
          </button>
          <p className="mt-6 font-body text-sm text-muted-foreground">
            {t("finalCta.or")}{" "}
            <Link to="/practitioners" className="text-primary hover:underline transition-colors">
              {t("finalCta.browse")}
            </Link>
            {" "}{arrow}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
