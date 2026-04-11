import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";
import sunsetImg from "@/assets/sunset-sea.jpg";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section className="photo-section min-h-[60vh] flex items-center justify-center">
      <div className="photo-bg">
        <img src={sunsetImg} alt="Sunset over sea" loading="lazy" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(22,40%,16%)]/60 via-[hsl(22,40%,16%)]/30 to-transparent" />
      </div>

      <div ref={ref} className={`container mx-auto px-6 text-center relative z-10 py-28 reveal ${isVisible ? "visible" : ""}`}>
        <p className="font-body text-sm tracking-[0.25em] uppercase text-white/60 mb-6">🐚 &nbsp; הצעד הבא שלכם &nbsp; 🐚</p>
        <h2 className="font-hebrew text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          מוכנים למצוא את המסלול שלכם?
        </h2>
        <div className="w-14 h-px bg-white/40 mx-auto mb-10" />
        <button
          onClick={() => navigate("/questionnaire")}
          className="btn-glow bg-white/90 text-foreground font-body font-semibold text-lg px-12 py-4 rounded-full hover:bg-white transition-all shadow-warm-lg backdrop-blur-sm"
        >
          בואו נתחיל
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
