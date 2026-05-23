import { useTranslation } from "react-i18next";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ProblemSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { t } = useTranslation();
  const cards = t("problem.cards", { returnObjects: true }) as { title: string; body: string }[];

  return (
    <section className="py-24 md:py-32 bg-sand nature-overlay ambient-leaves">
      <div className="container mx-auto px-6 relative z-10">
        <div ref={ref} className={`text-center mb-16 reveal ${isVisible ? "visible" : ""}`}>
          <p className="font-body text-sm tracking-[0.25em] uppercase text-primary mb-4">{t("problem.eyebrow")}</p>
          <h2 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-foreground mb-4">
            {t("problem.title")}
          </h2>
          <div className="gold-line mb-6" />
          <p className="font-body text-muted-foreground text-lg max-w-lg mx-auto">
            {t("problem.subtitle")}
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto reveal-stagger ${isVisible ? "visible" : ""}`}>
          {cards.map((card) => (
            <div key={card.title} className="card-nature p-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-2">{card.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
