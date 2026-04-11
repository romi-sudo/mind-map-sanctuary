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

  const inputClass = "w-full py-3 bg-transparent text-cream placeholder:text-sand/50 focus:outline-none font-body text-sm";

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 py-12 photo-section">
      <div className="photo-bg">
        <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80" alt="" />
        <div className="photo-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card w-full max-w-md relative z-10"
      >
        <div className="mb-5">
          <Link to="/" className="font-body text-sm text-sand hover:text-cream transition-colors">← חזרה לדף הבית</Link>
        </div>
        <Link to="/" className="font-display text-2xl font-bold block text-center mb-6" style={{ color: "#C9A96E" }}>MapSoul</Link>

        <h1 className="font-display text-3xl font-bold text-cream text-center mb-2">סיסמה חדשה</h1>
        <p className="font-body text-sand text-center mb-8">הזינו סיסמה חדשה לחשבון שלכם</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative" style={{ borderBottom: "1px solid rgba(201,169,110,0.3)" }}>
            <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="סיסמה חדשה" className={inputClass} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-0 top-1/2 -translate-y-1/2 text-sand hover:text-cream transition-colors font-body text-xs">
              {showPassword ? "הסתר" : "הצג"}
            </button>
          </div>
          <div style={{ borderBottom: "1px solid rgba(201,169,110,0.3)" }}>
            <input type={showPassword ? "text" : "password"} required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="אימות סיסמה חדשה" className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "מעדכן..." : "עדכון סיסמה"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-body text-sm hover:underline" style={{ color: "#E8854A" }}>חזרה לכניסה</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
