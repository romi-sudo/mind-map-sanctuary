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
    <footer className="bg-sand py-16 px-6">
      <div dir={dir} className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
        {/* Contact — appears on the right in Hebrew RTL */}
        <div className="text-center md:text-start">
          <h3 className="font-display text-base font-bold text-[#2C1A0E] mb-5">
            {t("footer.contactTitle")}
          </h3>
          <a
            href="mailto:hello@mapsoul.co"
            className="font-body text-base text-[#6B4226] hover:text-[#2C1A0E] transition-colors block mb-4"
          >
            hello@mapsoul.co
          </a>
          <ul className="space-y-3">
            <li>
              <Link
                to="/terms"
                className="font-body text-base text-[#6B4226] hover:text-[#2C1A0E] transition-colors"
              >
                {t("footer.terms")}
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="font-body text-base text-[#6B4226] hover:text-[#2C1A0E] transition-colors"
              >
                {t("footer.privacy")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Navigation — center */}
        <div className="text-center md:text-start">
          <h3 className="font-display text-base font-bold text-[#2C1A0E] mb-5">
            {t("footer.navTitle")}
          </h3>
          <ul className="space-y-3">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="font-body text-base text-[#6B4226] hover:text-[#2C1A0E] transition-colors"
                >
                  {t(`footer.links.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logo + tagline — appears on the left in Hebrew RTL */}
        <div className="text-center md:text-start">
          <div className="font-display text-2xl font-bold text-[#2C1A0E] mb-4">
            MapSoul
          </div>
          <div className="w-12 h-px bg-[#C4A882]/50 mb-4 mx-auto md:mx-0" />
          <p className="font-body text-sm text-[#6B4226] leading-relaxed">
            {t("footer.tagline")}
          </p>
        </div>
      </div>

      <div
        dir={dir}
        className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[#C4A882]/30 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-start"
      >
        <p className="font-body text-xs text-[#6B4226]/80">{t("footer.rights")}</p>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/signups"
            className="font-body text-xs text-[#6B4226]/60 hover:text-[#2C1A0E] transition-colors"
          >
            {t("footer.admin")}
          </Link>
          <Link
            to="/early-access"
            className="font-body text-xs text-[#6B4226]/60 hover:text-[#2C1A0E] transition-colors"
          >
            הרשמה מוקדמת
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

