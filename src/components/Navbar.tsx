import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { usePractitionerStatus } from "@/hooks/usePractitionerStatus";

const baseLinks: Record<string, string> = {
  "בית": "/",
  "מצא את המסלול": "/questionnaire",
  "גישות טיפוליות": "/approaches",
  "מומחים": "/practitioners",
  "לחברות": "/corporate",
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { firstName, role } = useProfile();
  const { status } = usePractitionerStatus();
  const location = useLocation();

  const linkMap: Record<string, string> = { ...baseLinks };
  if (user && role === "practitioner" && status === "approved") {
    linkMap["דשבורד"] = "/dashboard";
  }
  const links = Object.keys(linkMap);
  const greetName = firstName || user?.email?.split("@")[0];
  const isActive = (link: string) => linkMap[link] === location.pathname;

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: 'rgba(20, 35, 20, 0.95)' }}>
      <div className="container mx-auto px-6 py-4 flex flex-row-reverse items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-wide" style={{ color: '#F5ECD7' }}>
          MapSoul
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link}>
                <Link
                  to={linkMap[link]}
                  className={`font-body hover:opacity-80 transition-opacity text-sm pb-1 ${isActive(link) ? "border-b-2" : ""}`}
                  style={{ color: '#F5ECD7', borderColor: isActive(link) ? 'rgba(245,236,215,0.6)' : 'transparent' }}
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 mr-2">
            {user ? (
              <>
                <span className="font-body text-sm px-3 py-1.5 rounded-full" style={{ color: '#F5ECD7', background: 'rgba(245, 236, 215, 0.12)' }}>
                  שלום, {greetName}
                </span>
                <button onClick={signOut} className="btn-secondary text-sm !py-2 !px-5">יציאה</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm !py-2 !px-5">כניסה</Link>
                <Link to="/signup" className="btn-primary text-sm !py-2 !px-5">הרשמה</Link>
              </>
            )}
          </div>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ color: '#F5ECD7' }} aria-label="תפריט">
          <span className="font-body text-sm">{mobileOpen ? "סגור" : "תפריט"}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-5 border-t border-white/10 backdrop-blur-xl" style={{ background: 'rgba(20, 35, 20, 0.95)' }}>
          <ul className="flex flex-col gap-3 mb-4 pt-4">
            {links.map((link) => (
              <li key={link}>
                <Link
                  to={linkMap[link]}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body hover:opacity-80 transition-opacity text-base inline-block pb-1 ${isActive(link) ? "border-b-2" : ""}`}
                  style={{ color: '#F5ECD7', borderColor: isActive(link) ? 'rgba(245,236,215,0.6)' : 'transparent' }}
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
          {user ? (
            <div className="flex flex-col gap-2">
              <span className="font-body text-sm text-center py-2 rounded-full" style={{ color: '#F5ECD7', background: 'rgba(245, 236, 215, 0.12)' }}>
                שלום, {greetName}
              </span>
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="btn-secondary w-full text-sm !py-2">יציאה</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-sm !py-2 text-center">כניסה</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-sm !py-2 text-center">הרשמה</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
