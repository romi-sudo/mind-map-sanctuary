import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ background: "#3D2410" }}>
      <div className="section-divider" />
      <div className="container mx-auto px-6 py-12 text-center">
        <Link to="/" className="font-display text-xl font-bold block mb-4" style={{ color: "#C9A96E" }}>
          MapSoul
        </Link>
        <Link
          to="/join-as-practitioner"
          className="inline-block text-sand/40 hover:text-sand/70 transition-colors text-sm font-body mb-4"
        >
          הצטרפו כמומחים
        </Link>
        <p className="font-body text-sand/25 text-xs">
          MapSoul © 2025 — כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
};

export default Footer;
