import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground">
      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-lg mb-2 opacity-30">🐚</p>
        <Link to="/" className="font-display text-xl font-bold text-primary-foreground/80 block mb-4">
          MapSoul
        </Link>
        <Link
          to="/join-as-practitioner"
          className="inline-block text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors text-sm font-body mb-4"
        >
          הצטרפו כמומחים
        </Link>
        <p className="font-body text-primary-foreground/25 text-xs">
          MapSoul © 2025 — כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
};

export default Footer;
