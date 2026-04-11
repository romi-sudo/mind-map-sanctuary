import { useState } from "react";
import { X } from "lucide-react";
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
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full transition-colors text-sand/60 hover:text-cream ${className}`}
        aria-label={`מידע על ${tag}`}
      >
        <span className="text-xs font-body">?</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(13,31,13,0.6)", backdropFilter: "blur(4px)" }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                dir="rtl"
                className="pointer-events-auto w-full max-w-[380px] max-h-[80vh] overflow-y-auto rounded-2xl glass-card"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-bold text-cream leading-tight">{approach.name}</h2>
                    <p className="font-body text-xs text-sand mt-1">{approach.subtitle}</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="mr-3 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: "rgba(200,184,154,0.1)" }}
                  >
                    <X size={15} className="text-sand/60" />
                  </button>
                </div>

                <div className="h-px mb-4" style={{ background: "rgba(200,184,154,0.2)" }} />

                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full font-body text-xs" style={{ background: "rgba(232,133,74,0.15)", color: "#E8854A" }}>
                    {approach.type}
                  </span>

                  <Section title="מה זה?" text={approach.what} />
                  <Section title="איך זה עובד בפועל?" text={approach.how} />

                  <div>
                    <h4 className="font-display text-sm font-bold text-cream mb-2">מתאים במיוחד ל:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {approach.goodFor.map((t) => (
                        <span key={t} className="text-xs font-body px-3 py-1 rounded-full" style={{ border: "1px solid rgba(201,169,110,0.3)", color: "#C9A96E" }}>{t}</span>
                      ))}
                    </div>
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

                  <Link
                    to="/practitioners"
                    onClick={() => setOpen(false)}
                    className="btn-primary block w-full text-center text-sm !py-2.5"
                  >
                    מצאו מומחה בגישה זו
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
    <h4 className="font-display text-sm font-bold text-cream mb-1">{title}</h4>
    <p className="font-body text-sm text-sand leading-relaxed">{text}</p>
  </div>
);

export default ApproachTooltipButton;
