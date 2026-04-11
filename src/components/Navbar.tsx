import { Menu, X, Compass } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const linkMap: Record<string, string> = {
  "בית": "/",
  "מצא את המסלול": "/questionnaire",
  "מומחים": "/practitioners",
  "אודות": "#",
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = ["בית", "מצא את המסלול", "מומחים", "אודות"];

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto px-6 py-4 flex flex-row-reverse items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="text-primary" size={26} strokeWidth={1.5} />
          <span className="font-display text-2xl font-bold text-foreground tracking-tight">MapSoul</span>
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <li key={link}>
              <Link
                to={linkMap[link]}
                className="font-body text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
          aria-label="תפריט"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 pb-6">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link}>
                <Link to={linkMap[link]} onClick={() => setMobileOpen(false)} className="font-body text-muted-foreground hover:text-primary transition-colors text-base">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
