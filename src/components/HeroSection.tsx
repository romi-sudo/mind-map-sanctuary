import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(25_30%_90%)] to-background" />

      {/* Floating orbs - dreamy */}
      <motion.div
        className="absolute top-16 left-[8%] w-72 h-72 rounded-full bg-card/70 blur-sm"
        animate={{ y: [-8, 14, -8], x: [0, 6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-24 right-[6%] w-56 h-56 rounded-full bg-primary/8 blur-sm"
        animate={{ y: [10, -12, 10], x: [-4, 4, -4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-[30%] right-[22%] w-40 h-40 rounded-full bg-secondary/10 blur-sm"
        animate={{ y: [-14, 8, -14], x: [6, -6, 6] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[35%] left-[18%] w-24 h-24 rounded-full border border-secondary/20"
        animate={{ y: [6, -10, 6], scale: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Content with parallax */}
      <motion.div style={{ y, opacity }} className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-hebrew text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.15] mb-10"
        >
          מפת הנפש שלך —{" "}
          <span className="text-primary">מסלול מדויק</span>{" "}
          לצמיחה אמיתית
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-lg md:text-xl text-warm-walnut leading-relaxed max-w-2xl mx-auto mb-14"
        >
          לא עוד עומס של אפשרויות. MapSoul מנווטת אותך למה שמתאים לך בדיוק — טיפול, אימון, ריטריט או קורס.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          href="#"
          className="btn-glow inline-block bg-primary text-primary-foreground font-body font-medium text-lg px-12 py-5 rounded-pill hover:bg-primary-hover transition-colors duration-300"
        >
          התחל את המסע שלך ←
        </motion.a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
