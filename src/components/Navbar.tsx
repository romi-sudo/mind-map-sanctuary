import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const linkMap: Record<string, string> = {
  "בית": "/",
  "מצא את המסלול": "/questionnaire",
  "מומחים": "/practitioners",
  "אודות": "#",
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const links = ["בית", "מצא את המסלול", "מומחים", "אודות"];

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-shell-white/90 backdrop-blur-xl border-b border-sand-dark/20">
      <div className="container mx-auto px-6 py-4 flex flex-row-reverse items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg">🐚</span>
          <span className="font-display text-xl font-bold text-foreground tracking-wide">MapSoul</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link}>
                <Link to={linkMap[link]} className="font-body text-driftwood hover:text-terracotta transition-colors text-sm">
                  {link}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 mr-2">
            {user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-sand-dark/40 text-driftwood hover:text-foreground hover:border-terracotta/40 transition-colors font-body text-sm"
              >
                <LogOut size={14} />
                יציאה
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-1.5 rounded-full border border-sand-dark/40 text-foreground hover:border-terracotta/40 transition-colors font-body text-sm"
                >
                  כניסה
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-1.5 rounded-full bg-terracotta text-shell-white hover:bg-primary-hover transition-colors font-body text-sm"
                >
                  הרשמה
                </Link>
              </>
            )}
          </div>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground" aria-label="תפריט">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-shell-white/95 backdrop-blur-xl border-b border-sand-dark/20 px-6 pb-5">
          <ul className="flex flex-col gap-3 mb-4">
            {links.map((link) => (
              <li key={link}>
                <Link to={linkMap[link]} onClick={() => setMobileOpen(false)} className="font-body text-driftwood hover:text-terracotta transition-colors text-base">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            {user ? (
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex-1 py-2 rounded-full border border-sand-dark/40 text-foreground font-body text-sm text-center">
                יציאה
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 py-2 rounded-full border border-sand-dark/40 text-foreground font-body text-sm text-center">כניסה</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 py-2 rounded-full bg-terracotta text-shell-white font-body text-sm text-center">הרשמה</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
