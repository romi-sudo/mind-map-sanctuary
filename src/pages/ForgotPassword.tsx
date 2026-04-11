import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthBackHome from "@/components/auth/AuthBackHome";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) { toast.error(err.message || "שגיאה בשליחה"); }
    finally { setLoading(false); }
  };

  const inputClass =
    "w-full px-5 py-3.5 rounded-[20px] bg-shell-white border-b border-sand-dark text-foreground placeholder:text-sand-dark focus:outline-none focus:border-b-2 focus:border-terracotta text-sm font-body transition-all";

  return (
    <div dir="rtl" className="min-h-screen bg-sand-light grain-overlay flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-shell-white rounded-[24px] p-8 md:p-10 shadow-sandy border border-sand-medium/50"
      >
        <AuthBackHome />
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xl">🐚</span>
          <Link to="/" className="font-display text-2xl font-bold text-foreground tracking-wide">MapSoul</Link>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-4xl mb-4">📬</p>
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">שלחנו!</h1>
            <p className="font-body text-driftwood mb-6">בדקו את תיבת הדואר שלכם</p>
            <Link to="/login" className="font-body text-terracotta hover:underline text-sm">חזרה לכניסה</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">איפוס סיסמה</h1>
            <p className="font-body text-driftwood text-center mb-8">נשלח לכם קישור לאיפוס למייל</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="אימייל" className={inputClass} />
              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-full bg-terracotta text-shell-white font-body font-semibold text-base hover:bg-primary-hover transition-colors duration-300 shadow-warm disabled:opacity-50 btn-glow">
                {loading ? "שולח..." : "שלחו קישור לאיפוס"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="font-body text-sm text-terracotta hover:underline">חזרה לכניסה</Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
