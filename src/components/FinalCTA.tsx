import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section className="photo-section min-h-[60vh] flex items-center justify-center">
      <div className="photo-bg">
        <img src="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=1920&q=80" alt="" loading="lazy" />
        <div className="photo-overlay" />
      </div>

      <div ref={ref} className={`container mx-auto px-6 text-center relative z-10 py-28 reveal ${isVisible ? "visible" : ""}`}>
        <p className="font-body text-sm tracking-[0.25em] uppercase mb-6" style={{ color: "#C9A96E" }}>הצעד הבא שלכם</p>
        <h2 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-cream mb-6 leading-tight">
          מוכנים למצוא את המסלול שלכם?
        </h2>
        <div className="w-14 h-px mx-auto mb-10" style={{ background: "rgba(200,184,154,0.4)" }} />
        <button
          onClick={() => navigate("/questionnaire")}
          className="btn-primary text-lg"
        >
          בואו נתחיל
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
