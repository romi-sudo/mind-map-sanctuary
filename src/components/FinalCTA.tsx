import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section className="py-32 md:py-40 relative overflow-hidden hero-sunset">
      {/* Decorative corners */}
      <div className="absolute top-8 right-8 w-24 h-24 border-t border-r border-foreground/10 rounded-tr-2xl" />
      <div className="absolute top-8 left-8 w-24 h-24 border-t border-l border-foreground/10 rounded-tl-2xl" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-foreground/10 rounded-br-2xl" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b border-l border-foreground/10 rounded-bl-2xl" />

      {/* Soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />

      <div ref={ref} className={`container mx-auto px-6 text-center relative z-10 reveal ${isVisible ? "visible" : ""}`}>
        <h2 className="font-hebrew text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-wide">
          מוכנים למצוא את המסלול שלכם?
        </h2>
        <div className="w-20 h-px bg-foreground/20 mx-auto mb-10" />
        <button
          onClick={() => navigate("/questionnaire")}
          className="btn-glow inline-block bg-white/90 text-foreground font-body font-semibold text-lg px-14 py-5 rounded-full hover:bg-white transition-all duration-300 shadow-warm-lg backdrop-blur-sm"
        >
          בואו נתחיל
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
