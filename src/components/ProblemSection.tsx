import { HelpCircle, Compass, ShieldQuestion } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import OrganicDivider from "./OrganicDivider";

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
  const { ref, isVisible } = useScrollReveal();

  return (
    <>
      <OrganicDivider />
      <section className="py-32 md:py-40 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.03] via-transparent to-primary/[0.03]" />

        <div className="container mx-auto px-6 relative z-10">
          <div
            ref={ref}
            className={`grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto reveal-stagger ${isVisible ? "visible" : ""}`}
          >
            {cards.map((card) => (
              <div
                key={card.title}
                className="card-luxury bg-card rounded-2xl p-10 border border-secondary/20 shadow-warm text-center"
              >
                <div className="w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center mx-auto mb-7">
                  <card.icon className="text-primary" size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-hebrew text-xl font-bold text-foreground mb-4 tracking-wide">
                  {card.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProblemSection;
