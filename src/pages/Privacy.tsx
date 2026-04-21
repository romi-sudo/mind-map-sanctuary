import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { t: "מידע שאנו אוספים", b: "אנו אוספים מידע שאתם מספקים בעת ההרשמה ושימוש בפלטפורמה, כולל שם, אימייל ותשובות לשאלון." },
  { t: "שימוש במידע", b: "המידע משמש לשיפור חוויית השימוש, התאמת המלצות, ויצירת קשר בנוגע לשירותי הפלטפורמה." },
  { t: "אבטחה", b: "אנו משתמשים ב-Supabase לאחסון מאובטח של כל הנתונים." },
];

const Privacy = () => (
  <div dir="rtl" className="min-h-screen bg-leaves">
    <Navbar />
    <main className="pt-28 pb-20 px-6">
      <article className="spa-card max-w-3xl mx-auto">
        <h1 className="font-display text-3xl mb-8 text-foreground">מדיניות פרטיות</h1>
        <p className="font-body text-sm text-muted-foreground mb-8">עודכן לאחרונה: ינואר 2025</p>
        {sections.map((s) => (
          <section key={s.t} className="mb-6">
            <h2 className="font-display text-xl mb-3 text-foreground">{s.t}</h2>
            <p className="font-body text-muted-foreground leading-relaxed">{s.b}</p>
          </section>
        ))}
      </article>
    </main>
    <Footer />
  </div>
);

export default Privacy;
