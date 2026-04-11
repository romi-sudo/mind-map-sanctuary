import { useScrollReveal } from "@/hooks/useScrollReveal";
import OrganicDivider from "./OrganicDivider";

const steps = [
  { num: "01", title: "ספרו לנו מה עובר עליכם", desc: "שאלון קצר וחכם שמבין את הצרכים שלכם." },
  { num: "02", title: "נמפה את המסלול המדויק", desc: "המערכת בונה עבורכם תוכנית מותאמת אישית." },
  { num: "03", title: "תתחברו למומחה הנכון", desc: "חיבור ישיר למומחים שנבדקו ומתאימים בדיוק." },
];

const HowItWorks = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <>
      <OrganicDivider />
      <section className="py-32 md:py-40 bg-card/40">
        <div className="container mx-auto px-6">
          <div ref={ref} className={`reveal ${isVisible ? "visible" : ""}`}>
            <h2 className="font-hebrew text-4xl md:text-6xl font-bold text-foreground text-center mb-6 tracking-wide">
              איך זה עובד?
            </h2>
            <div className="gold-line mb-20" />
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto reveal-stagger ${isVisible ? "visible" : ""}`}>
            {steps.map((step) => (
              <div key={step.num} className="text-center group">
                <span className="font-display text-7xl font-bold text-secondary/30 block mb-6 group-hover:text-secondary/50 transition-colors duration-500">
                  {step.num}
                </span>
                <h3 className="font-hebrew text-xl font-bold text-foreground mb-4 tracking-wide">
                  {step.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
