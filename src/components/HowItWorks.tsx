import { useScrollReveal } from "@/hooks/useScrollReveal";
import boardwalkImg from "@/assets/boardwalk-path.jpg";

const steps = [
  { num: "01", title: "ספרו לנו מה עובר עליכם", desc: "שאלון קצר וחכם שמבין את הצרכים שלכם." },
  { num: "02", title: "נמפה את המסלול המדויק", desc: "המערכת בונה עבורכם תוכנית מותאמת אישית." },
  { num: "03", title: "תתחברו למומחה הנכון", desc: "חיבור ישיר למומחים שנבדקו ומתאימים בדיוק." },
];

const HowItWorks = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative overflow-hidden">
      {/* Full photo background */}
      <div className="absolute inset-0">
        <img
          src={boardwalkImg}
          alt="Boardwalk path to the beach"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
      </div>

      <div className="container mx-auto px-6 py-32 md:py-40 relative z-10">
        <div ref={ref} className={`reveal ${isVisible ? "visible" : ""}`}>
          <h2 className="font-hebrew text-4xl md:text-6xl font-bold text-foreground text-center mb-6 tracking-wide">
            איך זה עובד?
          </h2>
          <div className="nature-line mb-20" />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto reveal-stagger ${isVisible ? "visible" : ""}`}>
          {steps.map((step) => (
            <div key={step.num} className="text-center group card-nature p-10 rounded-2xl bg-card/90 backdrop-blur-sm border border-border/60 hover:border-secondary/50">
              <span className="font-display text-6xl font-bold text-secondary/50 block mb-6 group-hover:text-primary/50 transition-colors duration-500">
                {step.num}
              </span>
              <h3 className="font-hebrew text-xl font-bold text-foreground mb-4">
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
  );
};

export default HowItWorks;
