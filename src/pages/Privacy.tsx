import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";
  const sections = t("legal.privacy.sections", { returnObjects: true }) as { t: string; b: string }[];

  return (
    <div dir={dir} className="min-h-screen bg-leaves">
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <article className="spa-card max-w-3xl mx-auto">
          <h1 className="font-display text-3xl mb-8 text-foreground">{t("legal.privacy.title")}</h1>
          <p className="font-body text-sm text-muted-foreground mb-8">{t("legal.updated")}</p>
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
};

export default Privacy;
