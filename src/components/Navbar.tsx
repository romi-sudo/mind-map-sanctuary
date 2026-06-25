import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { usePractitionerStatus } from "@/hooks/usePractitionerStatus";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import EventsDropdown from "@/components/events/EventsDropdown";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { firstName, role } = useProfile();
  const { status } = usePractitionerStatus();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const baseLinks: { key: string; to: string }[] = [
    { key: "home", to: "/" },
    { key: "questionnaire", to: "/questionnaire" },
    { key: "practitioners", to: "/practitioners" },
    { key: "corporate", to: "/corporate" },
  ];
  baseLinks.push({ key: "dashboard", to: "/dashboard" });
  const greetName = firstName || user?.email?.split("@")[0];
  const isActive = (to: string) => to === location.pathname;
  const rowDir = i18n.language === "he" ? "flex-row-reverse" : "flex-row";

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: 'rgba(20, 35, 20, 0.95)' }}>
      <div className={`container mx-auto px-6 py-4 flex ${rowDir} items-center justify-between`}>
        <Link to="/" className="font-display text-xl font-bold tracking-wide" style={{ color: '#F5ECD7' }}>
          MapSoul
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {baseLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`font-body hover:opacity-80 transition-opacity text-sm pb-1 ${isActive(link.to) ? "border-b-2" : ""}`}
                  style={{ color: '#F5ECD7', borderColor: isActive(link.to) ? 'rgba(245,236,215,0.6)' : 'transparent' }}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              </li>
            ))}
            <li>
              <EventsDropdown label={t("nav.events")} triggerStyle={{ color: '#F5ECD7' }} />
            </li>
          </ul>

          <div className="flex items-center gap-3 mr-2">
            <LanguageSwitcher style={{ color: '#F5ECD7', borderColor: 'rgba(245,236,215,0.3)' }} />
            {user ? (
              <>
                <span className="font-body text-sm px-3 py-1.5 rounded-full" style={{ color: '#F5ECD7', background: 'rgba(245, 236, 215, 0.12)' }}>
                  {t("nav.hello")}, {greetName}
                </span>
                <button onClick={signOut} className="btn-secondary text-sm !py-2 !px-5">{t("nav.logout")}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm !py-2 !px-5">{t("nav.login")}</Link>
                <Link to="/signup" className="btn-primary text-sm !py-2 !px-5">{t("nav.signup")}</Link>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher style={{ color: '#F5ECD7', borderColor: 'rgba(245,236,215,0.3)' }} />
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: '#F5ECD7' }} aria-label={t("nav.menu")}>
            <span className="font-body text-sm">{mobileOpen ? t("nav.close") : t("nav.menu")}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-6 pb-5 border-t border-white/10 backdrop-blur-xl" style={{ background: 'rgba(20, 35, 20, 0.95)' }}>
          <ul className="flex flex-col gap-3 mb-4 pt-4">
            {baseLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body hover:opacity-80 transition-opacity text-base inline-block pb-1 ${isActive(link.to) ? "border-b-2" : ""}`}
                  style={{ color: '#F5ECD7', borderColor: isActive(link.to) ? 'rgba(245,236,215,0.6)' : 'transparent' }}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/events"
                onClick={() => setMobileOpen(false)}
                className={`font-body hover:opacity-80 transition-opacity text-base inline-block pb-1 ${isActive("/events") ? "border-b-2" : ""}`}
                style={{ color: '#F5ECD7', borderColor: isActive("/events") ? 'rgba(245,236,215,0.6)' : 'transparent' }}
              >
                {t("nav.events")}
              </Link>
            </li>
          </ul>
          {user ? (
            <div className="flex flex-col gap-2">
              <span className="font-body text-sm text-center py-2 rounded-full" style={{ color: '#F5ECD7', background: 'rgba(245, 236, 215, 0.12)' }}>
                {t("nav.hello")}, {greetName}
              </span>
              <button onClick={() => { signOut(); setMobileOpen(false); }} className="btn-secondary w-full text-sm !py-2">{t("nav.logout")}</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-sm !py-2 text-center">{t("nav.login")}</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-sm !py-2 text-center">{t("nav.signup")}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
