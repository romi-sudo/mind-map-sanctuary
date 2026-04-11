import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { approaches, type ApproachInfo } from "@/data/approaches";
import ShellDivider from "@/components/ShellDivider";

const ApproachCard = ({ approach, index }: { approach: ApproachInfo; index: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="card-coastal bg-sand-light rounded-[20px] border border-sand-medium/50 shadow-sandy overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground leading-tight">{approach.name}</h2>
            <p className="font-body text-xs text-driftwood mt-1">{approach.subtitle}</p>
          </div>
          <span className="shrink-0 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta font-body text-xs font-medium">
            {approach.type}
          </span>
        </div>

        {/* What */}
        <p className="font-body text-sm text-driftwood leading-relaxed mb-4">{approach.what}</p>

        {/* Good for pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {approach.goodFor.map((t) => (
            <span key={t} className="text-xs font-body px-3 py-1 rounded-full bg-ocean-hint/15 text-ocean-hint border border-ocean-hint/20">{t}</span>
          ))}
        </div>

        {/* Expandable */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 mt-4 pt-4 border-t border-sand-dark/20"
          >
            <div>
              <h4 className="font-display text-sm font-bold text-foreground mb-1">איך זה עובד בפועל?</h4>
              <p className="font-body text-sm text-driftwood leading-relaxed">{approach.how}</p>
            </div>

            <div>
              <h4 className="font-display text-sm font-bold text-foreground mb-2">פחות מתאים ל:</h4>
              <div className="flex flex-wrap gap-1.5">
                {approach.notFor.map((t) => (
                  <span key={t} className="text-xs font-body px-3 py-1 rounded-full bg-destructive/10 text-destructive">{t}</span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-sm">⏱</span>
              <div>
                <h4 className="font-display text-sm font-bold text-foreground">משך טיפול טיפוסי:</h4>
                <p className="font-body text-sm text-driftwood">{approach.duration}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-sm">🌱</span>
              <div>
                <h4 className="font-display text-sm font-bold text-foreground">מה לצפות בפגישה הראשונה:</h4>
                <p className="font-body text-sm text-driftwood">{approach.firstSession}</p>
              </div>
            </div>

            <Link
              to="/practitioners"
              className="inline-block px-5 py-2 rounded-full bg-terracotta text-shell-white font-body text-sm font-medium hover:bg-primary-hover transition-colors shadow-warm"
            >
              מצאו מומחה בגישה זו →
            </Link>
          </motion.div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 font-body text-sm text-terracotta hover:text-primary-hover transition-colors"
        >
          {expanded ? "הסתר פרטים ↑" : "קראו עוד ↓"}
        </button>
      </div>
    </motion.div>
  );
};

const Approaches = () => {
  const allApproaches = Object.values(approaches);

  return (
    <div className="min-h-screen bg-shell-white font-body grain-overlay" dir="rtl">
      <Navbar />
      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              גישות טיפוליות
            </h1>
            <p className="font-body text-lg text-driftwood max-w-2xl mx-auto leading-relaxed">
              הכירו את הגישות השונות כדי להבין מה הכי מתאים לכם. לחצו על "קראו עוד" לפרטים המלאים.
            </p>
          </motion.div>

          <ShellDivider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {allApproaches.map((approach, i) => (
              <ApproachCard key={approach.id} approach={approach} index={i} />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-block bg-sand-light rounded-[20px] border border-sand-medium/50 shadow-sandy p-8 max-w-lg">
              <p className="font-display text-xl font-bold text-foreground mb-3">לא בטוחים מה מתאים לכם?</p>
              <p className="font-body text-sm text-driftwood mb-5">השאלון שלנו יעזור לכם להבין איזו גישה מתאימה בדיוק למה שאתם עוברים.</p>
              <Link
                to="/questionnaire"
                className="inline-block px-8 py-3 rounded-full bg-terracotta text-shell-white font-body text-sm font-medium hover:bg-primary-hover transition-colors shadow-warm"
              >
                התחילו את השאלון →
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Approaches;
