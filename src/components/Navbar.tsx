import { Menu, X, Leaf, LogOut } from "lucide-react";
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
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto px-6 py-4 flex flex-row-reverse items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="text-secondary" size={24} strokeWidth={1.5} />
          <span className="font-display text-2xl font-bold text-foreground">MapSoul</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-10">
            {links.map((link) => (
              <li key={link}>
                <Link to={linkMap[link]} className="font-body text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium">
                  {link}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors font-body text-sm"
              >
                <LogOut size={14} />
                יציאה
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full border border-border text-foreground hover:border-primary/40 transition-colors font-body text-sm font-medium"
                >
                  כניסה
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors font-body text-sm font-medium"
                >
                  הרשמה
                </Link>
              </>
            )}
          </div>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground" aria-label="תפריט">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6">
          <ul className="flex flex-col gap-4 mb-4">
            {links.map((link) => (
              <li key={link}>
                <Link to={linkMap[link]} onClick={() => setMobileOpen(false)} className="font-body text-muted-foreground hover:text-primary transition-colors text-base">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            {user ? (
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="flex-1 py-2.5 rounded-full border border-border text-foreground font-body text-sm text-center"
              >
                יציאה
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 rounded-full border border-border text-foreground font-body text-sm text-center">
                  כניסה
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground font-body text-sm text-center">
                  הרשמה
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
