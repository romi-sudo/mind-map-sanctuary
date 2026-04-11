import { useScrollReveal } from "@/hooks/useScrollReveal";
import shellImg from "@/assets/shell-single.jpg";
import shellsImg from "@/assets/shells-scatter.jpg";

const cards = [
  { title: "עומס של אפשרויות", body: "מאות מומחים, שיטות וגישות — בלי לדעת מה באמת מתאים.", img: shellImg },
  { title: "חוסר כיוון", body: "מרגישים שמשהו צריך להשתנות, אבל לא יודעים מאיפה להתחיל.", img: shellsImg },
  { title: "ניסוי וטעייה", body: "בזבוז זמן וכסף על טיפולים וקורסים שלא מתאימים.", img: shellImg },
  { title: "חוסר אמון", body: 'קשה לדעת למי לסמוך ומי באמת "מומחה".', img: shellsImg },
];

const ProblemSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 reveal ${isVisible ? "visible" : ""}`}>
          <p className="font-body text-sm tracking-[0.25em] uppercase text-muted-foreground mb-4">🐚 &nbsp; מכירים? &nbsp; 🐚</p>
          <h2 className="font-hebrew text-4xl md:text-5xl font-bold text-foreground mb-4">
            מכירים את ההרגשה?
          </h2>
          <div className="gold-line mb-6" />
          <p className="font-body text-muted-foreground text-lg max-w-lg mx-auto">
            אתם לא לבד. רוב האנשים מרגישים בדיוק ככה.
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto reveal-stagger ${isVisible ? "visible" : ""}`}>
          {cards.map((card, i) => (
            <div key={card.title} className="nature-card bg-card border border-border/40">
              <div className="h-32 overflow-hidden">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-5">
                <h3 className="font-hebrew text-lg font-bold text-foreground mb-2">{card.title}</h3>
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
