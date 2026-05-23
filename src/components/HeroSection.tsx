import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroNature from "@/assets/hero-nature.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section
      className="relative min-h-screen overflow-hidden ambient-mist"
      style={{
        backgroundImage: `url(${heroNature})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(44,26,14,0.45) 0%, rgba(44,26,14,0.6) 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-24"
      >
        <div className="max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-sm tracking-[0.3em] uppercase mb-6 text-white/80"
          >
            {t("hero.eyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[2.4rem] md:text-[3.8rem] font-bold text-white leading-[1.1] mb-6"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-body text-lg text-white/75 max-w-xl mx-auto mb-8"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-16 h-px mx-auto mb-8 bg-white/40"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="font-body text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12 text-white/80"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button onClick={() => navigate("/questionnaire")} className="btn-primary text-lg">
              {t("hero.cta")}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
