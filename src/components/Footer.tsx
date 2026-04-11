import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground relative">
      <div className="h-px bg-gradient-to-l from-transparent via-primary/40 to-transparent" />
      <div className="container mx-auto px-6 py-14 text-center">
        <Link to="/" className="font-display text-2xl font-bold text-primary-foreground/90 mb-6 block tracking-wider">
          MapSoul
        </Link>
        <Link
          to="/join-as-practitioner"
          className="inline-block text-primary/70 hover:text-primary transition-colors text-sm font-medium mb-6"
        >
          הצטרפו כמומחים
        </Link>
        <p className="font-body text-primary-foreground/40 text-sm">
          MapSoul © 2025 — כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
};

export default Footer;
