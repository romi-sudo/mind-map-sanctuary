import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { t: "השימוש בפלטפורמה", b: "MapSoul היא פלטפורמה לחיבור בין מחפשים לבין מטפלים ומומחים. השימוש בפלטפורמה כפוף לתנאים אלו." },
  { t: "אחריות", b: "MapSoul אינה אחראית לתוכן המוצג על ידי המטפלים, ואינה צד ישיר בקשר הטיפולי." },
  { t: "פרטיות", b: "אנו מכבדים את פרטיותכם. לפרטים נוספים ראו מדיניות הפרטיות שלנו." },
  { t: "יצירת קשר", b: "לכל שאלה: hello@mapsoul.co" },
];

const Terms = () => (
  <div dir="rtl" className="min-h-screen bg-leaves">
    <Navbar />
    <main className="pt-28 pb-20 px-6">
      <article className="spa-card max-w-3xl mx-auto">
        <h1 className="font-display text-3xl mb-8 text-foreground">תנאי שימוש</h1>
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

export default Terms;
