import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

/* Botanical SVG petal */
const Petal = ({ className, delay = 0, duration = 10 }: { className: string; delay?: number; duration?: number }) => (
  <motion.svg
    className={`absolute pointer-events-none ${className}`}
    width="60" height="80" viewBox="0 0 60 80" fill="none"
    animate={{ y: [-10, -30, -10], x: [0, 8, 0], rotate: [0, 15, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <path
      d="M30 0 C45 15, 55 40, 30 80 C5 40, 15 15, 30 0Z"
      fill="currentColor" fillOpacity="0.12"
    />
  </motion.svg>
);

const Leaf = ({ className, delay = 0, duration = 12 }: { className: string; delay?: number; duration?: number }) => (
  <motion.svg
    className={`absolute pointer-events-none ${className}`}
    width="50" height="30" viewBox="0 0 50 30" fill="none"
    animate={{ y: [0, -18, 0], x: [0, 12, 0], rotate: [0, -10, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <path
      d="M0 15 Q12 0, 25 5 Q38 0, 50 15 Q38 30, 25 25 Q12 30, 0 15Z"
      fill="currentColor" fillOpacity="0.1"
    />
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
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(280_30%_92%)] via-[hsl(350_40%_90%)] via-[hsl(25_60%_88%)] to-background" />

      {/* Warm golden glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />

      {/* Floating botanical elements */}
      <Petal className="text-secondary top-[15%] right-[8%] w-16 h-20" delay={0} duration={9} />
      <Petal className="text-primary top-[25%] left-[12%] w-12 h-16" delay={2} duration={11} />
      <Petal className="text-secondary bottom-[30%] right-[20%] w-10 h-14" delay={4} duration={10} />
      <Leaf className="text-primary top-[40%] left-[5%]" delay={1} duration={13} />
      <Leaf className="text-secondary bottom-[20%] left-[25%]" delay={3} duration={12} />
      <Petal className="text-primary top-[10%] left-[40%] w-8 h-12" delay={5} duration={14} />
      <Leaf className="text-primary bottom-[40%] right-[8%]" delay={2.5} duration={11} />

      {/* Soft radial glows */}
      <div className="absolute top-[20%] right-[15%] w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-[25%] left-[10%] w-80 h-80 rounded-full bg-primary/8 blur-3xl" />

      {/* Content with parallax */}
      <motion.div style={{ y, opacity }} className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
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

        {/* Gold line decoration */}
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
          className="btn-glow inline-block bg-primary text-primary-foreground font-body font-medium text-lg px-14 py-5 rounded-full hover:bg-primary-hover transition-colors duration-300 shadow-warm"
        >
          התחל את המסע שלך ←
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
