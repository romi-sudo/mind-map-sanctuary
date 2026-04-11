import { useScrollReveal } from "@/hooks/useScrollReveal";
import shellsImg from "@/assets/shells-scatter.jpg";

const TrustBar = () => {
  const { ref, isVisible } = useScrollReveal();
  const stats = [
    { value: "+200", label: "מומחים" },
    { value: "+5,000", label: "אנשים מצאו את דרכם" },
    { value: "🇮🇱", label: "ישראל" },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="rounded-2xl overflow-hidden mb-12 max-w-2xl mx-auto shadow-warm">
          <img src={shellsImg} alt="Seashells on linen" className="w-full h-40 md:h-52 object-cover" loading="lazy" />
        </div>

        <div ref={ref} className={`flex flex-col md:flex-row items-center justify-center reveal ${isVisible ? "visible" : ""}`}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="text-center px-12 py-5 md:py-0">
                <span className="font-display text-5xl md:text-6xl font-bold text-primary block mb-2">{stat.value}</span>
                <span className="font-body text-muted-foreground text-sm font-medium">{stat.label}</span>
              </div>
              {i < stats.length - 1 && <div className="hidden md:block w-px h-14 bg-border mx-2" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
