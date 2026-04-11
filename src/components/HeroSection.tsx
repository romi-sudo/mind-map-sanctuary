import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-shells.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full photo */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <img src={heroImg} alt="Seashells and sage on sand" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(33,30%,95%)]/80 via-[hsl(22,40%,16%)]/25 to-[hsl(22,40%,16%)]/10" />
      </motion.div>

      {/* Bottom blend into bg */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-body text-sm tracking-[0.3em] uppercase text-white/70 mb-6"
        >
          🐚 &nbsp; מסע פנימי מתחיל כאן &nbsp; 🐚
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-hebrew text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-8 drop-shadow-lg"
        >
          מפת הנפש שלך
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-16 h-px bg-white/50 mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-lg md:text-xl text-white/80 leading-relaxed max-w-xl mx-auto mb-12 drop-shadow"
        >
          MapSoul מנווטת אותך למסלול שמתאים לך בדיוק — טיפול, אימון, ריטריט או קורס
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={() => navigate("/questionnaire")}
          className="btn-glow bg-primary text-primary-foreground font-body font-semibold text-lg px-12 py-4 rounded-full hover:bg-primary-hover transition-colors shadow-warm-lg"
        >
          התחילו את המסע ←
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
