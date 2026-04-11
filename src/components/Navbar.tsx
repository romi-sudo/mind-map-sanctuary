import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const linkMap: Record<string, string> = {
  "בית": "/",
  "מצא את המסלול": "/questionnaire",
  "גישות טיפוליות": "/approaches",
  "מומחים": "/practitioners",
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const links = Object.keys(linkMap);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 backdrop-blur-xl border-b" style={{ background: "rgba(13,31,13,0.95)", borderColor: "rgba(200,184,154,0.15)" }}>
      <div className="container mx-auto px-6 py-4 flex flex-row-reverse items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-wide" style={{ color: "#C9A96E" }}>
          MapSoul
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link}>
                <Link to={linkMap[link]} className="font-body text-cream/80 hover:text-cream transition-colors text-sm">
                  {link}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 mr-2">
            {user ? (
              <button
                onClick={signOut}
                className="btn-secondary text-sm !py-2 !px-5"
              >
                יציאה
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm !py-2 !px-5">כניסה</Link>
                <Link to="/signup" className="btn-primary text-sm !py-2 !px-5">הרשמה</Link>
              </>
            )}
          </div>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-cream" aria-label="תפריט">
          <span className="font-body text-sm">{mobileOpen ? "סגור" : "תפריט"}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-5 border-t" style={{ background: "rgba(13,31,13,0.98)", borderColor: "rgba(200,184,154,0.1)" }}>
          <ul className="flex flex-col gap-3 mb-4 pt-4">
            {links.map((link) => (
              <li key={link}>
                <Link to={linkMap[link]} onClick={() => setMobileOpen(false)} className="font-body text-cream/80 hover:text-cream transition-colors text-base">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            {user ? (
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="btn-secondary flex-1 text-sm !py-2">יציאה</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-sm !py-2 text-center">כניסה</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-sm !py-2 text-center">הרשמה</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
