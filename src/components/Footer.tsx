import { Link } from "react-router-dom";

const navLinks = [
  { to: "/", label: "דף הבית" },
  { to: "/questionnaire", label: "מצא את המסלול שלך" },
  { to: "/practitioners", label: "מומחים" },
  { to: "/corporate", label: "לחברות" },
  { to: "/join-as-practitioner", label: "הצטרף כמטפל/ת" },
  { to: "/approaches", label: "גישות טיפוליות" },
];

const Footer = () => {
  return (
    <footer className="bg-sand border-t border-border py-16 px-6">
      <div dir="rtl" className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="font-display text-2xl font-bold text-foreground">MapSoul</div>
          <div className="w-12 h-px bg-primary/30 my-4" />
          <p className="font-body text-sm text-muted-foreground">
            מסלול מדויק לצמיחה אמיתית
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-display text-sm font-bold text-foreground mb-4">ניווט</h3>
          <ul className="space-y-2">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-sm font-bold text-foreground mb-4">צרו קשר</h3>
          <p className="font-body text-sm text-muted-foreground mb-4">hello@mapsoul.co</p>
          <ul className="space-y-2">
            <li>
              <Link to="/terms" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                תנאי שימוש
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                מדיניות פרטיות
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div dir="rtl" className="max-w-6xl mx-auto mt-12 pt-6 border-t border-border flex justify-between items-center">
        <p className="font-body text-xs text-muted-foreground">
          © 2025 MapSoul. כל הזכויות שמורות.
        </p>
        <p className="font-body text-xs text-muted-foreground">
          נבנה עם ❤️ בישראל
        </p>
      </div>
    </footer>
  );
};

export default Footer;
