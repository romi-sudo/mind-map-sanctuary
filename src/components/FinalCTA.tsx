import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const { ref, isVisible } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-leaves nature-overlay ambient-leaves ambient-mist">
      <div ref={ref} className={`container mx-auto px-6 relative z-10 py-28 reveal ${isVisible ? "visible" : ""}`}>
        <div className="glass-card max-w-2xl mx-auto text-center">
          <p className="font-body text-sm tracking-[0.25em] uppercase mb-6 text-primary">הצעד הבא שלכם</p>
          <h2 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-foreground mb-6 leading-tight">
            מוכנים למצוא את המסלול שלכם?
          </h2>
          <div className="w-14 h-px mx-auto mb-10 bg-primary/30" />
          <button
            onClick={() => navigate("/questionnaire")}
            className="btn-primary text-lg"
          >
            בואו נתחיל
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
