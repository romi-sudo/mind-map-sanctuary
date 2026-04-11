const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden pt-20">
      {/* Decorative organic shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-card opacity-60 animate-float" />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-card opacity-40 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-primary/10 animate-float" style={{ animationDelay: '4s' }} />

      <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
        <h1 className="font-hebrew text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-8">
          מפת הנפש שלך — מסלול מדויק לצמיחה אמיתית
        </h1>

        <p className="font-body text-lg md:text-xl text-warm-walnut leading-relaxed max-w-2xl mx-auto mb-12">
          לא עוד עומס של אפשרויות. MapSoul מנווטת אותך למה שמתאים לך בדיוק — טיפול, אימון, ריטריט או קורס.
        </p>

        <a
          href="#"
          className="inline-block bg-primary text-primary-foreground font-body font-medium text-lg px-10 py-4 rounded-pill hover:bg-primary-hover transition-colors duration-300"
        >
          התחל את המסע שלך ←
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
