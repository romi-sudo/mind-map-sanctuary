import { useScrollReveal } from "@/hooks/useScrollReveal";

const cards = [
  { title: "עומס של אפשרויות", body: "מאות מומחים, שיטות וגישות — בלי לדעת מה באמת מתאים." },
  { title: "חוסר כיוון", body: "מרגישים שמשהו צריך להשתנות, אבל לא יודעים מאיפה להתחיל." },
  { title: "ניסוי וטעייה", body: "בזבוז זמן וכסף על טיפולים וקורסים שלא מתאימים." },
  { title: "חוסר אמון", body: 'קשה לדעת למי לסמוך ומי באמת "מומחה".' },
];

const ProblemSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 md:py-32" style={{ background: "#0D1F0D" }}>
      <div className="container mx-auto px-6">
        <div ref={ref} className={`text-center mb-16 reveal ${isVisible ? "visible" : ""}`}>
          <p className="font-body text-sm tracking-[0.25em] uppercase text-sand mb-4">מכירים?</p>
          <h2 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-cream mb-4">
            מכירים את ההרגשה?
          </h2>
          <div className="gold-line mb-6" />
          <p className="font-body text-sand text-lg max-w-lg mx-auto">
            אתם לא לבד. רוב האנשים מרגישים בדיוק ככה.
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto reveal-stagger ${isVisible ? "visible" : ""}`}>
          {cards.map((card) => (
            <div key={card.title} className="glass-card">
              <h3 className="font-display text-lg font-bold text-cream mb-2">{card.title}</h3>
              <p className="font-body text-sm text-sand leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
