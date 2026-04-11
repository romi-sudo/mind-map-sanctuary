import { useScrollReveal } from "@/hooks/useScrollReveal";

const TrustBar = () => {
  const { ref, isVisible } = useScrollReveal();
  const stats = [
    { value: "+200", label: "מומחים" },
    { value: "+5,000", label: "אנשים מצאו את דרכם" },
    { value: "🇮🇱", label: "ישראל" },
  ];

  return (
    <section className="py-24 md:py-28 bg-card/60 border-y border-border/40">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`flex flex-col md:flex-row items-center justify-center reveal ${isVisible ? "visible" : ""}`}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="text-center px-14 py-6 md:py-0">
                <span className="font-display text-6xl md:text-7xl font-bold text-primary block mb-3">
                  {stat.value}
                </span>
                <span className="font-body text-muted-foreground text-base font-medium tracking-wider">
                  {stat.label}
                </span>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden md:block w-px h-16 bg-secondary/30 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
