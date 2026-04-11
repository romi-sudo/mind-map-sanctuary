import { useScrollReveal } from "@/hooks/useScrollReveal";
import flowersImg from "@/assets/wildflowers-meadow.jpg";

const cards = [
  { icon: "🌪️", title: "עומס של אפשרויות", body: "מאות מומחים, שיטות וגישות — בלי לדעת מה באמת מתאים." },
  { icon: "🧭", title: "חוסר כיוון", body: "מרגישים שמשהו צריך להשתנות, אבל לא יודעים מאיפה להתחיל." },
  { icon: "💸", title: "ניסוי וטעייה", body: "בזבוז זמן וכסף על טיפולים וקורסים שלא מתאימים." },
  { icon: "🤷", title: "חוסר אמון", body: 'קשה לדעת למי לסמוך ומי באמת "מומחה".' },
];

const ProblemSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Nature image banner */}
        <div className="rounded-3xl overflow-hidden mb-16 max-w-5xl mx-auto shadow-warm-lg">
          <img
            src={flowersImg}
            alt="Wildflowers in golden sunlight"
            className="w-full h-56 md:h-72 object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
        </div>

        <div ref={ref} className={`text-center mb-16 reveal ${isVisible ? "visible" : ""}`}>
          <h2 className="font-hebrew text-4xl md:text-6xl font-bold text-foreground mb-4 tracking-wide">
            מכירים את ההרגשה?
          </h2>
          <div className="nature-line mb-6" />
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            אתם לא לבד. רוב האנשים מרגישים בדיוק ככה.
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto reveal-stagger ${isVisible ? "visible" : ""}`}>
          {cards.map((card) => (
            <div
              key={card.title}
              className="card-nature p-7 rounded-2xl bg-card border border-border/60 hover:border-secondary/50"
            >
              <span className="text-3xl block mb-4">{card.icon}</span>
              <h3 className="font-hebrew text-xl font-bold text-foreground mb-2">{card.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
