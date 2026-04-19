import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden bg-shadow-leaves nature-overlay ambient-leaves ambient-mist">
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/45 to-foreground/25" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-24"
      >
        <div className="glass-card max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-sm tracking-[0.3em] uppercase mb-6 text-primary"
          >
            מסע פנימי מתחיל כאן
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[2.4rem] md:text-[3.8rem] font-bold text-primary leading-[1.1] mb-8"
          >
            מפת הנפש שלך
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-16 h-px mx-auto mb-8 bg-primary/40"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-body text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12 text-muted-foreground"
          >
            MapSoul מנווטת אותך למסלול שמתאים לך בדיוק — טיפול, אימון, ריטריט או קורס
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={() => navigate("/questionnaire")}
            className="btn-primary text-lg"
          >
            התחילו את המסע
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
