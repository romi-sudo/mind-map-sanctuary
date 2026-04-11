import { useScrollReveal } from "@/hooks/useScrollReveal";
import cardFlowers from "@/assets/card-flowers.jpg";
import cardSeashells from "@/assets/card-seashells.jpg";
import cardBridge from "@/assets/card-bridge.jpg";
import cardSunset from "@/assets/card-sunset.jpg";

const cards = [
  { icon: "🌪️", title: "עומס של אפשרויות", body: "מאות מומחים, שיטות וגישות — בלי לדעת מה באמת מתאים.", img: cardSeashells },
  { icon: "🧭", title: "חוסר כיוון", body: "מרגישים שמשהו צריך להשתנות, אבל לא יודעים מאיפה להתחיל.", img: cardBridge },
  { icon: "💸", title: "ניסוי וטעייה", body: "בזבוז זמן וכסף על טיפולים וקורסים שלא מתאימים.", img: cardFlowers },
  { icon: "🤷", title: "חוסר אמון", body: 'קשה לדעת למי לסמוך ומי באמת "מומחה".', img: cardSunset },
];

const ProblemSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 md:py-32 wash-peach">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 reveal ${isVisible ? "visible" : ""}`}>
          <h2 className="font-hebrew text-4xl md:text-6xl font-bold text-foreground mb-4">
            מכירים את ההרגשה?
          </h2>
          <div className="gold-line mb-6" />
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            אתם לא לבד. רוב האנשים מרגישים בדיוק ככה.
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto reveal-stagger ${isVisible ? "visible" : ""}`}>
          {cards.map((card) => (
            <div key={card.title} className="nature-card bg-card border border-border/50 overflow-hidden">
              <div className="h-36 overflow-hidden">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-6">
                <span className="text-2xl block mb-3">{card.icon}</span>
                <h3 className="font-hebrew text-xl font-bold text-foreground mb-2">{card.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
