import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

/* Floating SVG elements */
const FloatingPetal = ({ className, delay = 0, duration = 12 }: { className: string; delay?: number; duration?: number }) => (
  <motion.svg
    className={`absolute pointer-events-none ${className}`}
    width="40" height="50" viewBox="0 0 40 50" fill="none"
    animate={{ y: [-8, -28, -8], x: [0, 10, 0], rotate: [0, 20, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <ellipse cx="20" cy="25" rx="14" ry="22" fill="currentColor" fillOpacity="0.15" />
  </motion.svg>
);

const FloatingButterfly = ({ className, delay = 0, duration = 10 }: { className: string; delay?: number; duration?: number }) => (
  <motion.svg
    className={`absolute pointer-events-none ${className}`}
    width="36" height="28" viewBox="0 0 36 28" fill="none"
    animate={{ y: [-5, -20, -5], x: [-5, 15, -5], rotate: [-5, 10, -5] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <path d="M18 14 C10 2, 0 4, 2 14 C0 24, 10 26, 18 14Z" fill="currentColor" fillOpacity="0.12" />
    <path d="M18 14 C26 2, 36 4, 34 14 C36 24, 26 26, 18 14Z" fill="currentColor" fillOpacity="0.12" />
    <line x1="18" y1="6" x2="18" y2="22" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.5" />
  </motion.svg>
);

const FloatingLeaf = ({ className, delay = 0, duration = 14 }: { className: string; delay?: number; duration?: number }) => (
  <motion.svg
    className={`absolute pointer-events-none ${className}`}
    width="32" height="44" viewBox="0 0 32 44" fill="none"
    animate={{ y: [0, -18, 0], x: [0, 8, 0], rotate: [0, -12, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <path d="M16 2 C24 10, 28 22, 16 42 C4 22, 8 10, 16 2Z" fill="currentColor" fillOpacity="0.1" />
    <line x1="16" y1="8" x2="16" y2="38" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.5" />
  </motion.svg>
);

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Sunset gradient background */}
      <div className="absolute inset-0 hero-sunset" />

      {/* Floating botanical elements */}
      <FloatingPetal className="text-[#F2A8A8] top-[12%] right-[6%] w-12 h-16" delay={0} duration={11} />
      <FloatingPetal className="text-[#F4C98A] top-[20%] left-[10%] w-10 h-14" delay={2} duration={13} />
      <FloatingPetal className="text-[#D4A0A0] bottom-[35%] right-[18%] w-8 h-12" delay={4} duration={10} />
      <FloatingPetal className="text-[#F2A8A8] top-[55%] left-[5%] w-10 h-14" delay={6} duration={12} />

      <FloatingButterfly className="text-[#F4C98A] top-[18%] right-[25%]" delay={1} duration={9} />
      <FloatingButterfly className="text-[#C47A5A] top-[35%] left-[20%]" delay={3.5} duration={11} />
      <FloatingButterfly className="text-[#F4C98A] bottom-[25%] right-[12%]" delay={5} duration={10} />

      <FloatingLeaf className="text-[#8BA888] top-[30%] left-[8%]" delay={1.5} duration={15} />
      <FloatingLeaf className="text-[#8BA888] bottom-[30%] left-[22%]" delay={4} duration={13} />
      <FloatingLeaf className="text-[#9BB898] top-[15%] left-[40%]" delay={2.5} duration={14} />

      {/* Soft radial glows */}
      <div className="absolute top-[20%] right-[15%] w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-[25%] left-[10%] w-80 h-80 rounded-full bg-[#F4C98A]/15 blur-3xl" />

      {/* Bottom fade to bg */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Content with parallax */}
      <motion.div style={{ y, opacity }} className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
        {/* Frosted glass card */}
        <div className="bg-white/25 backdrop-blur-md rounded-[2.5rem] px-8 md:px-16 py-14 md:py-20 border border-white/30 shadow-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-hebrew text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-foreground leading-[1.15] mb-6 tracking-wide"
          >
            מפת הנפש שלך —{" "}
            <span className="text-primary">מסלול מדויק</span>{" "}
            לצמיחה אמיתית
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="gold-line mb-10"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-14"
          >
            לא עוד עומס של אפשרויות. MapSoul מנווטת אותך למה שמתאים לך בדיוק — טיפול, אימון, ריטריט או קורס.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => navigate("/questionnaire")}
            className="btn-glow inline-block bg-primary text-primary-foreground font-body font-semibold text-lg px-14 py-5 rounded-full hover:bg-primary-hover transition-colors duration-300 shadow-warm-lg"
          >
            התחל את המסע שלך ←
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
