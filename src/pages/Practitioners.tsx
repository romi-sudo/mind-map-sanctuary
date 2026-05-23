import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { practitioners, type Practitioner } from "@/data/practitioners";
import { ApproachTooltipButton } from "@/components/ApproachTooltip";
import { findApproach } from "@/data/approaches";

const practitionerFilterGroups: Record<string, string[]> = {
  topic: ["קריירה", "מערכות יחסים", "חרדה", "זהות", "טראומה", "זוגיות", "AI וקריירה"],
  kind: ["טיפול אישי", "אימון", "קורס", "ריטריט", "סדנה"],
  approach: ["CBT", "EMDR", "EFT", "IFS", "סומטי", "מיינדפולנס", "ACT"],
  price: ["עד 300", "300-800", "מעל 800"],
  format: ["אונליין", "פרונטלי"],
};

const courseFilterGroups: Record<string, string[]> = {
  topic: ["AI וטכנולוגיה", "נומרולוגיה", "אסטרולוגיה", "קבלה", "תניא", "יאמה", "טארוט", "רפואה אינטגרטיבית", "מיינדפולנס"],
  level: ["מתחילים", "מתקדמים", "מקצועי", "לכולם"],
  tools: ["ChatGPT", "Midjourney", "Canva AI", "כלים לשיווק", "אוטומציה"],
  format: ["לייב", "מוקלט", "היברידי", "קבוצתי"],
  duration: ["שיעור בודד", "קורס קצר", "קורס מלא"],
  price: ["חינמי", "עד 200", "200-500", "מעל 500"],
};


type Course = {
  id: string;
  title: string;
  instructor: string;
  level: string;
  format: string;
  duration: string;
  price: string;
  tags: string[];
};

const dummyCourses: Course[] = [
  { id: "c1", title: "AI לכולם — מתחילים", instructor: "רותם לוי", level: "מתחילים", format: "מוקלט", duration: "6 שבועות", price: "₪350", tags: ["AI וטכנולוגיה", "ChatGPT", "מתחילים", "מוקלט"] },
  { id: "c2", title: "ChatGPT למשווקים", instructor: "דן כהן", level: "מתקדמים", format: "לייב", duration: "4 שבועות", price: "₪490", tags: ["AI וטכנולוגיה", "ChatGPT", "כלים לשיווק", "מתקדמים", "לייב"] },
  { id: "c3", title: "נומרולוגיה — בסיס ומעבר", instructor: "מיכל אור", level: "לכולם", format: "מוקלט", duration: "8 שבועות", price: "₪280", tags: ["נומרולוגיה", "לכולם", "מוקלט"] },
  { id: "c4", title: "קבלה מעשית לחיים", instructor: "רב יוסי שמש", level: "מתחילים", format: "היברידי", duration: "10 שבועות", price: "₪420", tags: ["קבלה", "מתחילים", "היברידי"] },
  { id: "c5", title: "אסטרולוגיה — קריאת מפה", instructor: "נועה כץ", level: "מתחילים", format: "מוקלט", duration: "6 שבועות", price: "₪320", tags: ["אסטרולוגיה", "מתחילים", "מוקלט"] },
  { id: "c6", title: "יאמה ומיינדפולנס", instructor: "שירה בן דוד", level: "לכולם", format: "לייב", duration: "8 שבועות", price: "₪380", tags: ["יאמה", "מיינדפולנס", "לכולם", "לייב"] },
];

const PractitionerCard = ({ p, index }: { p: Practitioner; index: number }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="spa-card flex flex-col overflow-hidden !p-0"
    >
      <div className="p-6 flex flex-col items-center text-center flex-1">
        {p.photo && !imgFailed ? (
          <img
            src={p.photo}
            alt={p.name}
            onError={() => setImgFailed(true)}
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-muted">
            <span className="font-display text-2xl font-bold text-primary">{p.initials}</span>
          </div>
        )}
        <h3 className="font-display text-xl font-bold text-foreground mb-1">{p.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{p.title}</p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {p.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs font-body px-3 py-1 rounded-full border border-border text-primary">
              {tag}
              {findApproach(tag) && <ApproachTooltipButton tag={tag} />}
            </span>
          ))}
        </div>
        <div className="w-full h-px my-2 bg-border" />
        <div className="mt-3 text-sm text-muted-foreground space-y-1">
          <p>{p.price}</p>
          <p>{p.format}</p>
        </div>
      </div>
      <Link
        to={`/practitioners/${p.id}`}
        className="w-full py-3 text-sm font-body text-center transition-colors duration-300 border-t border-border text-primary hover:bg-primary/5"
      >
        {t("practitioners.fullProfile")}
      </Link>
    </motion.div>
  );
};


const CourseCard = ({ course, index }: { course: Course; index: number }) => {
  const { t } = useTranslation();
  return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="spa-card flex flex-col overflow-hidden !p-0"
  >
    <div className="h-40 relative overflow-hidden rounded-t-2xl" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--secondary) / 0.2))' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-6xl font-bold text-primary/10">{course.title.charAt(0)}</span>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h3 className="font-display text-lg font-bold text-foreground mb-1">{course.title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{course.instructor}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs font-body px-3 py-1 rounded-full bg-primary text-white">{course.level}</span>
        <span className="text-xs font-body px-3 py-1 rounded-full border border-border text-primary">{course.format}</span>
      </div>
      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
        <span>{course.duration}</span>
        <span className="font-display font-bold text-foreground">{course.price}</span>
      </div>
    </div>
    <button className="w-full py-3 text-sm font-body text-center transition-colors duration-300 border-t border-border text-primary hover:bg-primary/5">
      {t("practitioners.courseDetails")}
    </button>
  </motion.div>
  );
};


const Practitioners = () => {
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";
  const arrow = i18n.language === "he" ? "←" : "→";
  const [activeTab, setActiveTab] = useState<"practitioners" | "courses">(
    searchParams.get("tab") === "courses" ? "courses" : "practitioners"
  );
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  };

  const switchTab = (tab: "practitioners" | "courses") => {
    setActiveTab(tab);
    setSearch("");
    setActiveFilters(new Set());
  };

  const currentFilters = activeTab === "practitioners" ? practitionerFilterGroups : courseFilterGroups;

  const filteredPractitioners = useMemo(() => {
    return practitioners.filter((p) => {
      const q = search.trim();
      if (q && ![p.name, p.title, ...p.tags].some((tag) => tag.includes(q))) return false;
      if (activeFilters.size === 0) return true;
      return p.tags.some((tag) => activeFilters.has(tag)) ||
        activeFilters.has(p.format) ||
        (activeFilters.has("אונליין") && p.format.includes("אונליין")) ||
        (activeFilters.has("פרונטלי") && p.format.includes("פרונטלי"));
    });
  }, [search, activeFilters]);

  const filteredCourses = useMemo(() => {
    return dummyCourses.filter((c) => {
      const q = search.trim();
      if (q && ![c.title, c.instructor, ...c.tags].some((tag) => tag.includes(q))) return false;
      if (activeFilters.size === 0) return true;
      return c.tags.some((tag) => activeFilters.has(tag));
    });
  }, [search, activeFilters]);

  return (
    <div className="min-h-screen font-body bg-sand nature-overlay ambient-leaves" dir={dir}>
      <Navbar />
      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-foreground text-center mb-8 text-readable-light"
          >
            {activeTab === "practitioners" ? t("practitioners.titleExperts") : t("practitioners.titleCourses")}
          </motion.h1>

          <div className="glass-card !p-5 md:!p-6 mb-10">
            {/* Tabs */}
            <div className="flex justify-center gap-8 mb-6 border-b border-border">
              <button
                onClick={() => switchTab("practitioners")}
                className={`font-body text-base pb-3 transition-colors duration-200 relative ${
                  activeTab === "practitioners"
                    ? "text-primary font-semibold"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {t("practitioners.tabExperts")}
                {activeTab === "practitioners" && (
                  <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => switchTab("courses")}
                className={`font-body text-base pb-3 transition-colors duration-200 relative inline-flex items-center gap-2 ${
                  activeTab === "courses"
                    ? "text-primary font-semibold"
                    : "text-foreground/50 hover:text-foreground/70"
                }`}
              >
                {t("practitioners.tabCourses")}
                <span className="text-[10px] font-body px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {t("practitioners.comingSoon")}
                </span>
                {activeTab === "courses" && (
                  <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-primary rounded-full" />
                )}
              </button>
            </div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative max-w-xl mx-auto mb-6"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={activeTab === "practitioners" ? t("practitioners.searchExperts") : t("practitioners.searchCourses")}
                className="w-full px-6 py-3 rounded-full text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm font-body bg-white border border-border shadow-sm"
              />
            </motion.div>

            {/* Filters */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="space-y-3"
            >
              {Object.entries(currentFilters).map(([group, items]) => (
                <div key={group} className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-body font-semibold text-foreground min-w-[60px]">{t(`practitioners.filterGroups.${group}`)}:</span>
                  {items.map((item) => {
                    const active = activeFilters.has(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleFilter(item)}
                        className="pill"
                        style={active ? { background: '#C4A882', borderColor: '#B8956E' } : undefined}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Content */}
          {activeTab === "practitioners" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPractitioners.map((p, i) => (
                  <PractitionerCard key={p.name} p={p} index={i} />
                ))}
              </div>
              {filteredPractitioners.length === 0 && (
                <div className="text-center mt-12 space-y-4">
                  <p className="text-muted-foreground text-lg font-body">
                    {t("practitioners.noResults")}
                  </p>
                  <button
                    onClick={() => { setActiveFilters(new Set()); setSearch(""); }}
                    className="btn-secondary text-sm"
                  >
                    {t("practitioners.clearFilters")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="spa-card text-center !p-10">
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                {t("practitioners.coursesSoonTitle")}
              </h2>
              <p className="text-muted-foreground font-body mb-6">
                {t("practitioners.coursesSoonBody")}
              </p>
              <button onClick={() => switchTab("practitioners")} className="btn-primary">
                {t("practitioners.waitlist")} {arrow}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Practitioners;

