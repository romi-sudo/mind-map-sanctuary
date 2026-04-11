const steps = [
  { num: "01", title: "ספרו לנו מה עובר עליכם", desc: "שאלון קצר וחכם שמבין את הצרכים שלכם." },
  { num: "02", title: "נמפה את המסלול המדויק", desc: "המערכת בונה עבורכם תוכנית מותאמת אישית." },
  { num: "03", title: "תתחברו למומחה הנכון", desc: "חיבור ישיר למומחים שנבדקו ומתאימים בדיוק." },
];

const HowItWorks = () => {
  return (
    <section className="py-24 md:py-32 bg-card/50">
      <div className="container mx-auto px-6">
        <h2 className="font-hebrew text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
          איך זה עובד?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <span className="font-display text-5xl font-bold text-primary/30 block mb-4">
                {step.num}
              </span>
              <h3 className="font-hebrew text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="font-body text-warm-walnut text-sm leading-relaxed">
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
