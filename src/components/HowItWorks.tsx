import { useScrollReveal } from "@/hooks/useScrollReveal";
import pathImg from "@/assets/path-ocean.jpg";

const steps = [
  { num: "🐚", title: "ספרו לנו מה עובר עליכם", desc: "שאלון קצר וחכם שמבין את הצרכים שלכם." },
  { num: "⭐", title: "נמפה את המסלול המדויק", desc: "המערכת בונה עבורכם תוכנית מותאמת אישית." },
  { num: "🌊", title: "תתחברו למומחה הנכון", desc: "חיבור ישיר למומחים שנבדקו ומתאימים בדיוק." },
];

const HowItWorks = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="photo-section">
      <div className="photo-bg">
        <img src={pathImg} alt="Path to ocean" loading="lazy" width={1920} height={1080} />
        <div className="absolute inset-0 bg-[#F5ECD7]/88 backdrop-blur-[1px]" />
      </div>

      <div className="container mx-auto px-6 py-28 md:py-36 relative z-10">
        <div ref={ref} className={`reveal ${isVisible ? "visible" : ""}`}>
          <p className="font-body text-sm tracking-[0.25em] uppercase text-driftwood text-center mb-4">⭐ &nbsp; שלושה צעדים &nbsp; ⭐</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground text-center mb-4">
            איך זה עובד?
          </h2>
          <div className="gold-line mb-16" />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto reveal-stagger ${isVisible ? "visible" : ""}`}>
          {steps.map((step) => (
            <div key={step.title} className="text-center card-coastal p-8 rounded-[20px] bg-shell-white/90 backdrop-blur-sm border border-sand-medium/40 shadow-sandy">
              <span className="text-4xl block mb-5">{step.num}</span>
              <h3 className="font-display text-lg font-bold text-foreground mb-3">{step.title}</h3>
              <p className="font-body text-driftwood text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
