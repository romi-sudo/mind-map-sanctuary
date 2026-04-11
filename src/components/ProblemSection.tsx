import { useScrollReveal } from "@/hooks/useScrollReveal";
import flowerBeach from "@/assets/flower-beach.jpg";

const cards = [
  { icon: "🌪️", title: "עומס של אפשרויות", body: "מאות מומחים, שיטות וגישות — בלי לדעת מה באמת מתאים." },
  { icon: "🧭", title: "חוסר כיוון", body: "מרגישים שמשהו צריך להשתנות, אבל לא יודעים מאיפה להתחיל." },
  { icon: "💸", title: "ניסוי וטעייה", body: "בזבוז זמן וכסף על טיפולים וקורסים שלא מתאימים." },
  { icon: "🤷", title: "חוסר אמון", body: 'קשה לדעת למי לסמוך ומי באמת "מומחה".' },
];

const ProblemSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-warm-lg">
              <img
                src={flowerBeach}
                alt="פרח על חוף הים"
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-primary/20 -z-10" />
          </div>

          {/* Content side */}
          <div className="order-1 lg:order-2">
            <div ref={ref} className={`reveal ${isVisible ? "visible" : ""}`}>
              <h2 className="font-hebrew text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-wide">
                מכירים את ההרגשה?
              </h2>
              <div className="gold-line !mx-0 mb-12" />
            </div>

            <div className={`space-y-5 reveal-stagger ${isVisible ? "visible" : ""}`}>
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="flex gap-4 items-start p-5 rounded-2xl bg-card/80 border border-border/50 hover:border-primary/30 hover:shadow-warm transition-all duration-500"
                >
                  <span className="text-2xl flex-shrink-0 mt-1">{card.icon}</span>
                  <div>
                    <h3 className="font-hebrew text-lg font-bold text-foreground mb-1">{card.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{card.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
