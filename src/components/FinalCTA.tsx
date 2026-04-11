import { useScrollReveal } from "@/hooks/useScrollReveal";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-32 md:py-40 bg-primary relative overflow-hidden">
      {/* Decorative frame corners */}
      <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-primary-foreground/20 rounded-tr-lg" />
      <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-primary-foreground/20 rounded-tl-lg" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-primary-foreground/20 rounded-br-lg" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-primary-foreground/20 rounded-bl-lg" />

      <div ref={ref} className={`container mx-auto px-6 text-center reveal ${isVisible ? "visible" : ""}`}>
        <h2 className="font-hebrew text-4xl md:text-6xl font-bold text-primary-foreground mb-10 leading-tight">
          מוכנים למצוא את המסלול שלכם?
        </h2>
        <a
          href="#"
          className="btn-glow inline-block bg-primary-foreground text-foreground font-body font-medium text-lg px-12 py-5 rounded-pill hover:opacity-90 transition-all duration-300"
        >
          בואו נתחיל
        </a>
      </div>
    </section>
  );
};

export default FinalCTA;
