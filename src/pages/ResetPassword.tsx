import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthBackHome from "@/components/auth/AuthBackHome";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setReady(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("הסיסמאות לא תואמות"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("הסיסמה עודכנה בהצלחה!");
      navigate("/login");
    } catch (err: any) { toast.error(err.message || "שגיאה בעדכון הסיסמה"); }
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

        <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">סיסמה חדשה</h1>
        <p className="font-body text-driftwood text-center mb-8">הזינו סיסמה חדשה לחשבון שלכם</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="סיסמה חדשה" className={inputClass} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-driftwood hover:text-foreground transition-colors">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <input type={showPassword ? "text" : "password"} required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="אימות סיסמה חדשה" className={inputClass} />
          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-full bg-terracotta text-shell-white font-body font-semibold text-base hover:bg-primary-hover transition-colors duration-300 shadow-warm disabled:opacity-50 btn-glow">
            {loading ? "מעדכן..." : "עדכון סיסמה"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-body text-sm text-terracotta hover:underline">חזרה לכניסה</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
