import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HowItWorks = () => {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useTranslation();
  const stepsData = t("how.steps", { returnObjects: true }) as { title: string; desc: string }[];
  const nums = ["01", "02", "03"];

  return (
    <section className="relative min-h-[80vh] flex items-center bg-tropical-mist nature-overlay ambient-mist">
      <div className="container mx-auto px-6 py-28 md:py-36 relative z-10">
        <div ref={ref} className={`reveal ${isVisible ? "visible" : ""}`}>
          <p className="font-body text-sm tracking-[0.25em] uppercase text-center mb-4 text-primary">{t("how.eyebrow")}</p>
          <h2 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-foreground text-center mb-4">
            {t("how.title")}
          </h2>
          <div className="w-16 h-px mx-auto mb-16 bg-primary/30" />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto reveal-stagger ${isVisible ? "visible" : ""}`}>
          {stepsData.map((step, i) => (
            <div key={step.title} className="card-nature bg-card/80 p-8 text-center">
              <span className="font-display text-4xl font-bold block mb-5 text-primary">{nums[i]}</span>
              <h3 className="font-display text-lg font-bold text-foreground mb-3">{step.title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
