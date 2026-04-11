import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-nature.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Full-bleed nature photo */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <img src={heroImg} alt="Lush green nature" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/15" />
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

      {/* Content */}
      <motion.div style={{ opacity }} className="container mx-auto px-6 text-center relative z-10 max-w-4xl pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-hebrew text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-8 drop-shadow-lg"
        >
          מפת הנפש שלך —{" "}
          <span className="text-amber-200">מסלול מדויק</span>{" "}
          לצמיחה אמיתית
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-24 h-[1px] bg-white/40 mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-body text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-12 drop-shadow"
        >
          לא עוד עומס של אפשרויות. MapSoul מנווטת אותך למה שמתאים לך בדיוק — טיפול, אימון, ריטריט או קורס.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          onClick={() => navigate("/questionnaire")}
          className="btn-glow inline-block bg-primary text-primary-foreground font-body font-semibold text-lg px-14 py-5 rounded-full hover:bg-primary-hover transition-colors duration-300 shadow-warm-lg"
        >
          התחל את המסע שלך ←
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
