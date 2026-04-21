import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  { n: 1, label: "קראנו את הבקשה" },
  { n: 2, label: "שיחה קצרה איתך" },
  { n: 3, label: "הפרופיל עולה לאוויר" },
];

const Pending = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="spa-card max-w-lg w-full text-center p-10"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-warm-gold/20 flex items-center justify-center ring-4 ring-warm-gold/10">
              <Check className="w-8 h-8 text-warm-gold" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="font-display text-3xl text-foreground mb-4">
            הבקשה שלך התקבלה
          </h1>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            אנחנו קוראים אותה בקפידה. ניצור איתך קשר תוך 48 שעות לשיחה קצרה — ואז הפרופיל שלך יוצא לאוויר.
          </p>

          <div className="gold-line mx-auto mb-8" />

          <div className="grid grid-cols-3 gap-4 mb-8">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-base mb-2">
                  {s.n}
                </div>
                <p className="font-body text-xs text-foreground/80 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="font-body text-sm text-muted-foreground">
            שאלות? כתבו לנו ל־
            <a href="mailto:hello@mapsoul.co" className="text-primary hover:underline">
              hello@mapsoul.co
            </a>
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Pending;
