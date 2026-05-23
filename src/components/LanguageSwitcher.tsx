import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

const LanguageSwitcher = ({ className = "", style }: Props) => {
  const { i18n, t } = useTranslation();
  const toggle = () => {
    const next = i18n.language === "he" ? "en" : "he";
    i18n.changeLanguage(next);
  };
  return (
    <button
      onClick={toggle}
      type="button"
      aria-label="Change language"
      className={`font-body text-xs px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80 ${className}`}
      style={style}
    >
      {t("nav.language")}
    </button>
  );
};

export default LanguageSwitcher;
