import { useScrollReveal } from "@/hooks/useScrollReveal";
import tropicalImg from "@/assets/tropical-flowers.jpg";

const TrustBar = () => {
  const { ref, isVisible } = useScrollReveal();
  const stats = [
    { value: "+200", label: "מומחים" },
    { value: "+5,000", label: "אנשים מצאו את דרכם" },
    { value: "🇮🇱", label: "ישראל" },
  ];

  return (
    <section className="py-24 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="rounded-2xl overflow-hidden mb-14 max-w-3xl mx-auto shadow-warm">
          <img src={tropicalImg} alt="Flowers on sand" className="w-full h-44 md:h-56 object-cover" loading="lazy" width={1920} height={800} />
        </div>

        <div ref={ref} className={`flex flex-col md:flex-row items-center justify-center reveal ${isVisible ? "visible" : ""}`}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="text-center px-14 py-6 md:py-0">
                <span className="font-display text-6xl md:text-7xl font-bold text-primary block mb-3">{stat.value}</span>
                <span className="font-body text-muted-foreground text-base font-medium">{stat.label}</span>
              </div>
              {i < stats.length - 1 && <div className="hidden md:block w-px h-16 bg-border mx-2" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
