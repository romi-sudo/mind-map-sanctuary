const Footer = () => {
  return (
    <footer className="bg-warm-espresso relative">
      {/* Golden top line */}
      <div className="h-px bg-gradient-to-l from-transparent via-secondary/50 to-transparent" />
      <div className="container mx-auto px-6 py-14 text-center">
        <a href="/" className="font-display text-2xl font-bold text-primary-foreground/90 mb-6 block">
          MapSoul
        </a>
        <p className="font-body text-primary-foreground/40 text-sm">
          MapSoul © 2025 — כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
};

export default Footer;
