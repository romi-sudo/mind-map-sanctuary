import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const inputClass = "w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-body text-sm";

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="spa-card w-full max-w-md"
      >
        <div className="mb-5">
          <Link to="/" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">← חזרה לדף הבית</Link>
        </div>
        <Link to="/" className="font-display text-2xl font-bold block text-center mb-6 text-foreground">MapSoul</Link>

        {sent ? (
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">שלחנו!</h1>
            <p className="font-body text-muted-foreground mb-6">בדקו את תיבת הדואר שלכם</p>
            <Link to="/login" className="font-body text-sm hover:underline text-primary">חזרה לכניסה</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">איפוס סיסמה</h1>
            <p className="font-body text-muted-foreground text-center mb-8">נשלח לכם קישור לאיפוס למייל</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-border">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="אימייל" className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "שולח..." : "שלחו קישור לאיפוס"}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="font-body text-sm hover:underline text-primary">חזרה לכניסה</Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
