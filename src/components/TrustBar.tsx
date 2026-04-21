import { useScrollReveal } from "@/hooks/useScrollReveal";

const TrustBar = () => {
  const { ref, isVisible } = useScrollReveal();
  const stats = [
    { value: "6", label: "מטפלים מייסדים" },
    { value: "AI", label: "התאמה חכמה" },
    { value: "2025", label: "ישראל · השקה" },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-secondary/20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none water-shimmer" style={{
        backgroundImage: 'radial-gradient(ellipse at 20% 50%, hsl(var(--water-teal) / 0.25), transparent 55%), radial-gradient(ellipse at 80% 50%, hsl(var(--warm-gold) / 0.18), transparent 55%)',
      }} />
      <div className="container mx-auto px-6 relative z-10">
        <div ref={ref} className={`flex flex-row flex-nowrap items-center justify-center overflow-x-auto reveal ${isVisible ? "visible" : ""}`}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center shrink-0">
              <div className="text-center px-8 md:px-12">
                <span className="font-display text-4xl md:text-6xl font-bold block mb-2 text-primary">{stat.value}</span>
                <span className="font-body text-muted-foreground text-xs md:text-sm">{stat.label}</span>
              </div>
              {i < stats.length - 1 && <div className="w-px h-12 md:h-14 mx-2 bg-border" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
