import { useScrollReveal } from "@/hooks/useScrollReveal";

const TrustBar = () => {
  const { ref, isVisible } = useScrollReveal();
  const stats = [
    { value: "+200", label: "מומחים" },
    { value: "+5,000", label: "אנשים מצאו את דרכם" },
    { value: "🇮🇱", label: "ישראל" },
  ];

  return (
    <section className="py-20 md:py-28 bg-sand-light">
      <div className="container mx-auto px-6">
        <div ref={ref} className={`flex flex-col md:flex-row items-center justify-center reveal ${isVisible ? "visible" : ""}`}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="text-center px-12 py-5 md:py-0">
                <span className="font-display text-5xl md:text-6xl font-bold text-terracotta block mb-2">{stat.value}</span>
                <span className="font-body text-driftwood text-sm font-medium">{stat.label}</span>
              </div>
              {i < stats.length - 1 && <div className="hidden md:block w-px h-14 bg-sand-dark/40 mx-2" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
