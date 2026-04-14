import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { practitioners, type Practitioner } from "@/data/practitioners";
import { ApproachTooltipButton } from "@/components/ApproachTooltip";
import { findApproach } from "@/data/approaches";

const practitionerFilterGroups = {
  נושא: ["קריירה", "מערכות יחסים", "חרדה", "זהות", "טראומה", "זוגיות", "AI וקריירה"],
  סוג: ["טיפול אישי", "אימון", "קורס", "ריטריט", "סדנה"],
  גישה: ["CBT", "EMDR", "EFT", "IFS", "סומטי", "מיינדפולנס", "ACT"],
  מחיר: ["עד 300", "300-800", "מעל 800"],
  פורמט: ["אונליין", "פרונטלי"],
};

const courseFilterGroups = {
  נושא: ["AI וטכנולוגיה", "נומרולוגיה", "אסטרולוגיה", "קבלה", "תניא", "יאמה", "טארוט", "רפואה אינטגרטיבית", "מיינדפולנס"],
  רמה: ["מתחילים", "מתקדמים", "מקצועי", "לכולם"],
  "סוג כלים": ["ChatGPT", "Midjourney", "Canva AI", "כלים לשיווק", "אוטומציה"],
  פורמט: ["לייב", "מוקלט", "היברידי", "קבוצתי"],
  משך: ["שיעור בודד", "קורס קצר", "קורס מלא"],
  מחיר: ["חינמי", "עד 200", "200-500", "מעל 500"],
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

const PractitionerCard = ({ p, index }: { p: Practitioner; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="spa-card flex flex-col overflow-hidden !p-0"
  >
    <div className="p-6 flex flex-col items-center text-center flex-1">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-muted">
        <span className="font-display text-2xl font-bold text-primary">{p.initials}</span>
      </div>
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
      לפרופיל המלא
    </Link>
  </motion.div>
);

const CourseCard = ({ course, index }: { course: Course; index: number }) => (
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
      לפרטים והרשמה
    </button>
  </motion.div>
);

const Practitioners = () => {
  const [searchParams] = useSearchParams();
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
      if (q && ![p.name, p.title, ...p.tags].some((t) => t.includes(q))) return false;
      if (activeFilters.size === 0) return true;
      return p.tags.some((t) => activeFilters.has(t)) ||
        activeFilters.has(p.format) ||
        (activeFilters.has("אונליין") && p.format.includes("אונליין")) ||
        (activeFilters.has("פרונטלי") && p.format.includes("פרונטלי"));
    });
  }, [search, activeFilters]);

  const filteredCourses = useMemo(() => {
    return dummyCourses.filter((c) => {
      const q = search.trim();
      if (q && ![c.title, c.instructor, ...c.tags].some((t) => t.includes(q))) return false;
      if (activeFilters.size === 0) return true;
      return c.tags.some((t) => activeFilters.has(t));
    });
  }, [search, activeFilters]);

  return (
    <div className="min-h-screen font-body bg-background" dir="rtl">
      <Navbar />
      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-foreground text-center mb-8"
          >
            {activeTab === "practitioners" ? "מצאו את המומחה המתאים לכם" : "קורסים והכשרות"}
          </motion.h1>

          {/* Tabs */}
          <div className="flex justify-center gap-8 mb-8 border-b border-border">
            <button
              onClick={() => switchTab("practitioners")}
              className={`font-body text-base pb-3 transition-colors duration-200 relative ${
                activeTab === "practitioners"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              מומחים וטיפול
              {activeTab === "practitioners" && (
                <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => switchTab("courses")}
              className={`font-body text-base pb-3 transition-colors duration-200 relative ${
                activeTab === "courses"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              קורסים והכשרות
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
            className="relative max-w-xl mx-auto mb-8"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === "practitioners" ? "חפשו לפי נושא, שם או גישה..." : "חפשו לפי נושא, שם מרצה או כלי..."}
              className="w-full px-6 py-3 rounded-full text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm font-body bg-white border border-border shadow-sm"
            />
          </motion.div>

          {/* Filters */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mb-12 space-y-4"
          >
            {Object.entries(currentFilters).map(([group, items]) => (
              <div key={group} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-body text-muted-foreground min-w-[50px]">{group}:</span>
                {items.map((item) => {
                  const active = activeFilters.has(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleFilter(item)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-200 font-body ${
                        active
                          ? "bg-primary text-white"
                          : "border border-secondary/40 text-secondary bg-transparent hover:bg-secondary/10"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            ))}
          </motion.div>

          {/* Content */}
          {activeTab === "practitioners" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPractitioners.map((p, i) => (
                  <PractitionerCard key={p.name} p={p} index={i} />
                ))}
              </div>
              {filteredPractitioners.length === 0 && (
                <p className="text-center text-muted-foreground mt-12 text-lg font-body">
                  לא נמצאו מומחים מתאימים. נסו לשנות את החיפוש או הסינון.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((c, i) => (
                  <CourseCard key={c.id} course={c} index={i} />
                ))}
              </div>
              {filteredCourses.length === 0 && (
                <p className="text-center text-muted-foreground mt-12 text-lg font-body">
                  לא נמצאו קורסים מתאימים. נסו לשנות את החיפוש או הסינון.
                </p>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Practitioners;
