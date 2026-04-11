import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("הסיסמאות לא תואמות");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("הסיסמה עודכנה בהצלחה!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "שגיאה בעדכון הסיסמה");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-5 py-3.5 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 text-sm font-body transition-all";

  return (
    <div dir="rtl" className="min-h-screen bg-background grain-overlay flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-card rounded-3xl p-8 md:p-10 shadow-warm-lg border border-border/60"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Leaf className="text-secondary" size={28} strokeWidth={1.5} />
          <Link to="/" className="font-display text-3xl font-bold text-foreground">MapSoul</Link>
        </div>

        <h1 className="font-hebrew text-3xl font-bold text-foreground text-center mb-2">סיסמה חדשה</h1>
        <p className="font-body text-muted-foreground text-center mb-8">הזינו סיסמה חדשה לחשבון שלכם</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה חדשה"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="אימות סיסמה חדשה"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-body font-semibold text-base hover:bg-primary-hover transition-colors duration-300 shadow-warm disabled:opacity-50 btn-glow"
          >
            {loading ? "מעדכן..." : "עדכון סיסמה"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-body text-sm text-primary hover:underline">חזרה לכניסה</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
