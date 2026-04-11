import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "rgba(61,36,16,0.4)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-sm tracking-[0.3em] uppercase mb-6"
          style={{ color: "#C9A96E" }}
        >
          מסע פנימי מתחיל כאן
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-cream leading-[1.1] mb-8"
        >
          מפת הנפש שלך
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-16 h-px mx-auto mb-8"
          style={{ background: "rgba(200,184,154,0.4)" }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12 text-sand"
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
      </motion.div>
    </section>
  );
};

export default HeroSection;
