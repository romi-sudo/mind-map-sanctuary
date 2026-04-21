import { useState, useEffect } from "react";
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
      className="spa-card overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-foreground leading-tight">{approach.name}</h2>
          <p className="font-body text-xs text-muted-foreground mt-1">{approach.subtitle}</p>
        </div>
        <span className="shrink-0 px-3 py-1 rounded-full font-body text-xs bg-primary/10 text-primary">
          {approach.type}
        </span>
      </div>

      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{approach.what}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {approach.goodFor.map((t) => (
          <span key={t} className="text-xs font-body px-3 py-1 rounded-full border border-secondary/30 text-secondary">{t}</span>
        ))}
      </div>

      {expanded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mt-4 pt-4 border-t border-border">
          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-1">איך זה עובד בפועל?</h4>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{approach.how}</p>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-2">פחות מתאים ל:</h4>
            <div className="flex flex-wrap gap-1.5">
              {approach.notFor.map((t) => (
                <span key={t} className="text-xs font-body px-3 py-1 rounded-full border border-destructive/30 text-destructive">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">משך טיפול טיפוסי:</h4>
            <p className="font-body text-sm text-muted-foreground">{approach.duration}</p>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">מה לצפות בפגישה הראשונה:</h4>
            <p className="font-body text-sm text-muted-foreground">{approach.firstSession}</p>
          </div>
          <Link to="/practitioners" className="btn-primary inline-block text-sm !py-2 !px-5">
            מצאו מומחה בגישה זו
          </Link>
        </motion.div>
      )}

      <button onClick={() => setExpanded(!expanded)} className="mt-3 font-body text-sm transition-colors text-primary hover:text-primary/80">
        {expanded ? "הסתר פרטים" : "קראו עוד"}
      </button>
    </motion.div>
  );
};

const Approaches = () => {
  const allApproaches = Object.values(approaches);

  return (
    <div className="min-h-screen font-body bg-sand nature-overlay ambient-leaves" dir="rtl">
      <Navbar />
      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-foreground mb-4">גישות טיפוליות</h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
            <div className="spa-card inline-block max-w-lg text-center">
              <p className="font-display text-xl font-bold text-foreground mb-3">לא בטוחים מה מתאים לכם?</p>
              <p className="font-body text-sm text-muted-foreground mb-5">השאלון שלנו יעזור לכם להבין איזו גישה מתאימה בדיוק למה שאתם עוברים.</p>
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
