import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { approaches, type ApproachInfo } from "@/data/approaches";

const ApproachCard = ({ approach, index }: { approach: ApproachInfo; index: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-cream leading-tight">{approach.name}</h2>
          <p className="font-body text-xs text-sand mt-1">{approach.subtitle}</p>
        </div>
        <span className="shrink-0 px-3 py-1 rounded-full font-body text-xs" style={{ background: "rgba(232,133,74,0.15)", color: "#E8854A" }}>
          {approach.type}
        </span>
      </div>

      <p className="font-body text-sm text-sand leading-relaxed mb-4">{approach.what}</p>

      {/* Good for pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {approach.goodFor.map((t) => (
          <span key={t} className="text-xs font-body px-3 py-1 rounded-full" style={{ border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E" }}>{t}</span>
        ))}
      </div>

      {expanded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mt-4 pt-4" style={{ borderTop: "1px solid rgba(200,184,154,0.15)" }}>
          <div>
            <h4 className="font-display text-sm font-bold text-cream mb-1">איך זה עובד בפועל?</h4>
            <p className="font-body text-sm text-sand leading-relaxed">{approach.how}</p>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-cream mb-2">פחות מתאים ל:</h4>
            <div className="flex flex-wrap gap-1.5">
              {approach.notFor.map((t) => (
                <span key={t} className="text-xs font-body px-3 py-1 rounded-full" style={{ border: "1px solid rgba(212,120,154,0.3)", color: "#D4789A" }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-cream">משך טיפול טיפוסי:</h4>
            <p className="font-body text-sm text-sand">{approach.duration}</p>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-cream">מה לצפות בפגישה הראשונה:</h4>
            <p className="font-body text-sm text-sand">{approach.firstSession}</p>
          </div>
          <Link to="/practitioners" className="btn-primary inline-block text-sm !py-2 !px-5">
            מצאו מומחה בגישה זו
          </Link>
        </motion.div>
      )}

      <button onClick={() => setExpanded(!expanded)} className="mt-3 font-body text-sm transition-colors" style={{ color: "#E8854A" }}>
        {expanded ? "הסתר פרטים" : "קראו עוד"}
      </button>
    </motion.div>
  );
};

const Approaches = () => {
  const allApproaches = Object.values(approaches);

  return (
    <div className="min-h-screen font-body" dir="rtl" style={{ background: "#0D1F0D" }}>
      <Navbar />
      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-cream mb-4">גישות טיפוליות</h1>
            <p className="font-body text-lg text-sand max-w-2xl mx-auto leading-relaxed">
              הכירו את הגישות השונות כדי להבין מה הכי מתאים לכם. לחצו על "קראו עוד" לפרטים המלאים.
            </p>
          </motion.div>

          <div className="section-divider mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allApproaches.map((approach, i) => (
              <ApproachCard key={approach.id} approach={approach} index={i} />
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-16 text-center">
            <div className="glass-card inline-block max-w-lg text-center">
              <p className="font-display text-xl font-bold text-cream mb-3">לא בטוחים מה מתאים לכם?</p>
              <p className="font-body text-sm text-sand mb-5">השאלון שלנו יעזור לכם להבין איזו גישה מתאימה בדיוק למה שאתם עוברים.</p>
              <Link to="/questionnaire" className="btn-primary inline-block text-sm">התחילו את השאלון</Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Approaches;
