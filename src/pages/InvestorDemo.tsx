import { Link } from "react-router-dom";
import { practitioners } from "@/data/practitioners";
import { Badge } from "@/components/ui/badge";

export default function InvestorDemo() {
  const stats = [
    { label: "מומחים פעילים", value: practitioners.length },
    { label: "תחומי התמחות", value: new Set(practitioners.flatMap((p) => p.tags)).size },
    { label: "שפות", value: 3 },
    { label: "פורמטים", value: "אונליין · פרונטלי · ריטריטים" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <div className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-primary hover:opacity-80 transition-opacity"
          >
            <span className="text-lg leading-none">→</span>
            חזרה לדף הבית
          </Link>
          <Link to="/" className="font-display text-lg font-bold text-primary">
            MapSoul
          </Link>
        </div>
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-bl from-primary/10 via-background to-background" />
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-px w-10 bg-primary/60" />
            <span className="text-xs tracking-[0.3em] uppercase text-primary/80">Investor Demo · 2026</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6">
            הרשת של המומחים שלנו
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl leading-relaxed">
            12 מטפלים, מאמנים ומנחים מובילים — אוצרים בקפידה לרשת אחת שמחברת אנשים לעזרה הנכונה להם, בזמן הנכון.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5"
              >
                <div className="font-display text-3xl md:text-4xl text-primary">{s.value}</div>
                <div className="text-xs md:text-sm text-foreground/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl mb-2">כל המומחים</h2>
            <p className="text-foreground/60">לחיצה על כרטיס פותחת את פרופיל המומחה המלא</p>
          </div>
          <Link
            to="/practitioners"
            className="hidden md:inline-block text-sm text-primary hover:underline"
          >
            צפייה בעמוד המומחים הציבורי ←
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {practitioners.map((p, idx) => (
            <Link
              key={p.id}
              to={`/practitioners/${p.id}`}
              className="group relative rounded-3xl border border-border/60 bg-card p-6 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-4 left-4 text-xs font-mono text-foreground/30">
                {String(idx + 1).padStart(2, "0")}
              </div>

              <div className="flex items-center gap-4 mb-5">
                {p.photo ? (
                  <img
                    src={p.photo}
                    alt={p.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center font-display text-xl text-primary">
                    {p.initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg leading-tight truncate">{p.name}</h3>
                  <p className="text-sm text-foreground/60 truncate">{p.title}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.tags.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="text-[11px] font-normal bg-primary/8 text-foreground/80 border-0"
                  >
                    {t}
                  </Badge>
                ))}
              </div>

              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs border-t border-border/40 pt-4">
                <div>
                  <dt className="text-foreground/50">מחיר</dt>
                  <dd className="text-foreground/90 font-medium">{p.price}</dd>
                </div>
                <div>
                  <dt className="text-foreground/50">פורמט</dt>
                  <dd className="text-foreground/90 font-medium">{p.format}</dd>
                </div>
                <div>
                  <dt className="text-foreground/50">ניסיון</dt>
                  <dd className="text-foreground/90 font-medium">{p.experience}</dd>
                </div>
                <div>
                  <dt className="text-foreground/50">פגישות</dt>
                  <dd className="text-foreground/90 font-medium">{p.sessions}</dd>
                </div>
              </dl>

              <div className="mt-4 text-xs text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity">
                לפרופיל המלא ←
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-20 rounded-3xl border border-border/60 bg-gradient-to-l from-primary/5 to-transparent p-8 md:p-10 text-center">
          <p className="font-display text-2xl md:text-3xl mb-3">
            רשת אנושית. התאמה חכמה. חוויה רגועה.
          </p>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            כל מומחה ברשת עובר אוצרות אישית. ה-AI שלנו מחבר בין צורך לפתרון בתוך פחות מ-3 דקות —
            עם המלצות שמובילות תמיד למומחה אמיתי בעל פרופיל מלא.
          </p>
        </div>
      </main>
    </div>
  );
}
