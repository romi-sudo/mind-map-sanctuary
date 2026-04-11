import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("התחברתם בהצלחה!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "שגיאה בהתחברות");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("שגיאה בהתחברות עם Google");
    if (result.redirected) return;
    navigate("/");
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
          <Link to="/" className="font-body text-sm text-sand hover:text-cream transition-colors">
            ← חזרה לדף הבית
          </Link>
        </div>

        <Link to="/" className="font-display text-2xl font-bold block text-center mb-6" style={{ color: "#C9A96E" }}>MapSoul</Link>

        <h1 className="font-display text-3xl font-bold text-cream text-center mb-2">ברוכים השבים</h1>
        <p className="font-body text-sand text-center mb-8">המשיכו את המסע שלכם</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div style={{ borderBottom: "1px solid rgba(201,169,110,0.3)" }}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="אימייל" className={inputClass} />
          </div>
          <div className="relative" style={{ borderBottom: "1px solid rgba(201,169,110,0.3)" }}>
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="סיסמה" className={inputClass} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-0 top-1/2 -translate-y-1/2 text-sand hover:text-cream transition-colors font-body text-xs">
              {showPassword ? "הסתר" : "הצג"}
            </button>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "מתחבר..." : "כניסה"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px" style={{ background: "rgba(200,184,154,0.2)" }} />
          <span className="font-body text-sm text-sand">או</span>
          <div className="flex-1 h-px" style={{ background: "rgba(200,184,154,0.2)" }} />
        </div>

        <button onClick={handleGoogle} className="btn-secondary w-full flex items-center justify-center gap-3 !py-3">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          המשיכו עם Google
        </button>

        <div className="mt-8 text-center space-y-2">
          <p className="font-body text-sm text-sand">
            עוד אין לכם חשבון?{" "}
            <Link to="/signup" className="hover:underline" style={{ color: "#E8854A" }}>הרשמו כאן</Link>
          </p>
          <Link to="/forgot-password" className="font-body text-sm hover:underline" style={{ color: "#E8854A" }}>שכחתם סיסמה?</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
