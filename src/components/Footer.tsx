import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground">
      <div className="container mx-auto px-6 py-14 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Leaf className="text-secondary" size={20} strokeWidth={1.5} />
          <Link to="/" className="font-display text-2xl font-bold text-primary-foreground/90">
            MapSoul
          </Link>
        </div>
        <Link
          to="/join-as-practitioner"
          className="inline-block text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors text-sm font-medium mb-6"
        >
          הצטרפו כמומחים
        </Link>
        <p className="font-body text-primary-foreground/35 text-sm">
          MapSoul © 2025 — כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
};

export default Footer;
