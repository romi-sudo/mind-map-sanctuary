import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";
import palmImg from "@/assets/palm-sunset.jpg";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center justify-center">
      {/* Full photo background */}
      <div className="absolute inset-0">
        <img
          src={palmImg}
          alt="Palm trees at sunset"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/30 to-black/20" />
      </div>

      <div ref={ref} className={`container mx-auto px-6 text-center relative z-10 py-32 reveal ${isVisible ? "visible" : ""}`}>
        <h2 className="font-hebrew text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          מוכנים למצוא את המסלול שלכם?
        </h2>
        <div className="w-20 h-px bg-white/40 mx-auto mb-10" />
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
