import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";
import flowersField from "@/assets/flowers-field.jpg";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section className="py-32 md:py-40 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={flowersField}
          alt=""
          loading="lazy"
          width={1024}
          height={1024}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(28_30%_15%/0.55)] via-[hsl(28_30%_15%/0.45)] to-[hsl(28_30%_15%/0.6)]" />
      </div>

      {/* Decorative botanical corners */}
      <div className="absolute top-8 right-8 w-24 h-24 border-t border-r border-white/15 rounded-tr-2xl z-10" />
      <div className="absolute top-8 left-8 w-24 h-24 border-t border-l border-white/15 rounded-tl-2xl z-10" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-white/15 rounded-br-2xl z-10" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b border-l border-white/15 rounded-bl-2xl z-10" />

      <div ref={ref} className={`container mx-auto px-6 text-center relative z-10 reveal ${isVisible ? "visible" : ""}`}>
        <h2 className="font-hebrew text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-wide drop-shadow-lg">
          מוכנים למצוא את המסלול שלכם?
        </h2>
        <div className="w-20 h-px bg-white/40 mx-auto mb-10" />
        <button
          onClick={() => navigate("/questionnaire")}
          className="btn-glow inline-block bg-white/95 text-foreground font-body font-semibold text-lg px-14 py-5 rounded-full hover:bg-white transition-all duration-300 shadow-2xl"
        >
          בואו נתחיל
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
