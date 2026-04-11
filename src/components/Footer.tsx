import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground">
      <div className="section-divider" />
      <div className="container mx-auto px-6 py-12 text-center">
        <Link to="/" className="font-display text-xl font-bold block mb-4 text-secondary">
          MapSoul
        </Link>
        <Link
          to="/join-as-practitioner"
          className="inline-block text-white/40 hover:text-white/70 transition-colors text-sm font-body mb-4"
        >
          הצטרפו כמומחים
        </Link>
        <p className="font-body text-white/25 text-xs">
          MapSoul © 2025 — כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
};

export default Footer;
