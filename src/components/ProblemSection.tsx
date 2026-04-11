import { HelpCircle, Compass, ShieldQuestion } from "lucide-react";

const cards = [
  {
    icon: HelpCircle,
    title: "עולם הטיפול מבלבל ועמוס",
    body: "מאות שיטות, גישות ומומחים — איך יודעים מאיפה להתחיל?",
  },
  {
    icon: Compass,
    title: "קשה לדעת מה בדיוק צריכים",
    body: "טיפול? אימון? סדנה? בלי מפה ברורה, קל ללכת לאיבוד.",
  },
  {
    icon: ShieldQuestion,
    title: "איך יודעים למי לסמוך?",
    body: "בלי המלצות אמיתיות ובדיקת רקע, הבחירה מרגישה כמו הימור.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-card rounded-lg p-8 border border-border shadow-warm text-center"
            >
              <card.icon className="mx-auto mb-6 text-primary" size={36} strokeWidth={1.5} />
              <h3 className="font-hebrew text-xl font-bold text-foreground mb-3">
                {card.title}
              </h3>
              <p className="font-body text-warm-walnut text-sm leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
