import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroSunset from "@/assets/hero-sunset.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Full-bleed photo background with parallax zoom */}
      <motion.div style={{ scale: imgScale }} className="absolute inset-0">
        <img
          src={heroSunset}
          alt="שקיעה על חוף הים"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Warm overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(28_30%_15%/0.35)] via-[hsl(28_30%_15%/0.25)] to-[hsl(28_30%_15%/0.55)]" />
      
      {/* Bottom fade to background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Content with parallax */}
      <motion.div style={{ y, opacity }} className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-hebrew text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.15] mb-6 tracking-wide drop-shadow-lg"
        >
          מפת הנפש שלך —{" "}
          <span className="text-[hsl(35_70%_75%)]">מסלול מדויק</span>{" "}
          לצמיחה אמיתית
        </motion.h1>

        {/* Gold line decoration */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[hsl(35_70%_75%)] to-transparent mx-auto mb-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-14 drop-shadow-sm"
        >
          לא עוד עומס של אפשרויות. MapSoul מנווטת אותך למה שמתאים לך בדיוק — טיפול, אימון, ריטריט או קורס.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => navigate("/questionnaire")}
          className="btn-glow inline-block bg-white/95 text-foreground font-body font-semibold text-lg px-14 py-5 rounded-full hover:bg-white transition-colors duration-300 shadow-2xl backdrop-blur-sm"
        >
          התחל את המסע שלך ←
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
