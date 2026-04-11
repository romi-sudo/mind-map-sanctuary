const TrustBar = () => {
  const stats = [
    { value: "+200", label: "מומחים" },
    { value: "+5,000", label: "אנשים מצאו את דרכם" },
    { value: "🇮🇱", label: "ישראל" },
  ];

  return (
    <section className="py-20 bg-card border-y border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center divide-y md:divide-y-0 md:divide-x md:divide-border">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center px-12 py-6 md:py-0">
              <span className="font-display text-5xl font-bold text-primary block mb-2">
                {stat.value}
              </span>
              <span className="font-body text-warm-walnut text-base font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
