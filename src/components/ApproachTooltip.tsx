import { useState } from "react";
import { X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { findApproach, type ApproachInfo } from "@/data/approaches";

interface ApproachTooltipButtonProps {
  tag: string;
  className?: string;
}

export const ApproachTooltipButton = ({ tag, className = "" }: ApproachTooltipButtonProps) => {
  const [open, setOpen] = useState(false);
  const approach = findApproach(tag);

  if (!approach) return null;

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-primary/60 hover:text-primary hover:bg-primary/10 transition-colors ${className}`}
        aria-label={`מידע על ${tag}`}
      >
        <HelpCircle size={13} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                dir="rtl"
                className="pointer-events-auto w-full max-w-[380px] max-h-[80vh] overflow-y-auto rounded-[20px] shadow-warm-lg border border-primary/20"
                style={{ backgroundColor: "#FEF4EC" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-start justify-between p-5 pb-3" style={{ backgroundColor: "#FEF4EC" }}>
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-bold text-foreground leading-tight">{approach.name}</h2>
                    <p className="font-body text-xs text-muted-foreground mt-1">{approach.subtitle}</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="mr-3 mt-0.5 w-7 h-7 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"
                  >
                    <X size={15} className="text-foreground/60" />
                  </button>
                </div>

                {/* Accent line */}
                <div className="mx-5 h-0.5 rounded-full bg-primary/30" />

                {/* Content */}
                <div className="p-5 pt-4 space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-body text-xs font-medium">
                    {approach.type}
                  </div>

                  <Section title="מה זה?" text={approach.what} />
                  <Section title="איך זה עובד בפועל?" text={approach.how} />

                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground mb-2">מתאים במיוחד ל:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {approach.goodFor.map((t) => (
                        <span key={t} className="text-xs font-body px-3 py-1 rounded-full bg-secondary/15 text-secondary">{t}</span>
                      ))}
                    </div>
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
                      <p className="font-body text-sm text-muted-foreground">{approach.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-sm">🌱</span>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">מה לצפות בפגישה הראשונה:</h4>
                      <p className="font-body text-sm text-muted-foreground">{approach.firstSession}</p>
                    </div>
                  </div>

                  <Link
                    to="/practitioners"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center py-2.5 rounded-full bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary-hover transition-colors shadow-warm"
                  >
                    מצאו מומחה בגישה זו →
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Section = ({ title, text }: { title: string; text: string }) => (
  <div>
    <h4 className="font-display text-sm font-bold text-foreground mb-1">{title}</h4>
    <p className="font-body text-sm text-muted-foreground leading-relaxed">{text}</p>
  </div>
);

export default ApproachTooltipButton;
