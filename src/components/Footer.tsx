import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";

  const navLinks = [
    { to: "/", key: "home" },
    { to: "/questionnaire", key: "questionnaire" },
    { to: "/practitioners", key: "practitioners" },
    { to: "/corporate", key: "corporate" },
    { to: "/join-as-practitioner", key: "join" },
    { to: "/approaches", key: "approaches" },
  ];

  return (
    <footer className="bg-sand border-t border-border py-16 px-6">
      <div dir={dir} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="font-display text-2xl font-bold text-foreground">MapSoul</div>
          <div className="w-12 h-px bg-primary/30 my-4" />
          <p className="font-body text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold text-foreground mb-4">{t("footer.navTitle")}</h3>
          <ul className="space-y-2">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t(`footer.links.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold text-foreground mb-4">{t("footer.contactTitle")}</h3>
          <p className="font-body text-sm text-muted-foreground mb-4">hello@mapsoul.co</p>
          <ul className="space-y-2">
            <li>
              <Link to="/terms" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("footer.terms")}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                {t("footer.privacy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div dir={dir} className="max-w-6xl mx-auto mt-12 pt-6 border-t border-border flex justify-between items-center">
        <p className="font-body text-xs text-muted-foreground">{t("footer.rights")}</p>
        <p className="font-body text-xs text-muted-foreground">{t("footer.builtIn")}</p>
      </div>
    </footer>
  );
};

export default Footer;
