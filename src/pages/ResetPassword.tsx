import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

        <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">סיסמה חדשה</h1>
        <p className="font-body text-muted-foreground text-center mb-8">הזינו סיסמה חדשה לחשבון שלכם</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative border-b border-border">
            <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="סיסמה חדשה" className={inputClass} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors font-body text-xs">
              {showPassword ? "הסתר" : "הצג"}
            </button>
          </div>
          <div className="border-b border-border">
            <input type={showPassword ? "text" : "password"} required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="אימות סיסמה חדשה" className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "מעדכן..." : "עדכון סיסמה"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-body text-sm hover:underline text-primary">חזרה לכניסה</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
