import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Practitioner {
  name: string;
  initials: string;
  title: string;
  tags: string[];
  price: string;
  format: string;
}

const practitioners: Practitioner[] = [
  {
    name: 'ד"ר מיכל לוי',
    initials: "מל",
    title: "פסיכולוגית קלינית",
    tags: ["חרדה", "טראומה", "מעברי חיים"],
    price: "400-600 ש\"ח",
    format: "אונליין ופרונטלי",
  },
  {
    name: "אורן כהן",
    initials: "אכ",
    title: "מאמן קריירה וחיים",
    tags: ["קריירה", "AI וקריירה", "זהות"],
    price: "300-500 ש\"ח",
    format: "אונליין",
  },
  {
    name: "נועה שמיר",
    initials: "נש",
    title: "מטפלת זוגית ומשפחתית",
    tags: ["זוגיות", "מערכות יחסים", "גבולות"],
    price: "500-700 ש\"ח",
    format: "פרונטלי",
  },
  {
    name: "יואב ברק",
    initials: "יב",
    title: "מנחה ריטריטים",
    tags: ["זהות", "מיינדפולנס", "גוף ונפש"],
    price: "ריטריטים",
    format: "פרונטלי",
  },
  {
    name: "שירה אדלר",
    initials: "שא",
    title: "מאמנת צמיחה אישית",
    tags: ["ביטחון עצמי", "זהות", "קריירה"],
    price: "250-400 ש\"ח",
    format: "אונליין",
  },
  {
    name: 'ד"ר רן מזרחי',
    initials: "רמ",
    title: "פסיכותרפיסט",
    tags: ["טראומה", "EMDR", "חרדה"],
    price: "500-800 ש\"ח",
    format: "פרונטלי",
  },
];

const filterGroups = {
  נושא: ["קריירה", "מערכות יחסים", "חרדה", "זהות", "טראומה", "זוגיות", "AI וקריירה"],
  סוג: ["טיפול אישי", "אימון", "קורס", "ריטריט", "סדנה"],
  גישה: ["CBT", "EMDR", "EFT", "IFS", "סומטי", "מיינדפולנס", "ACT"],
  מחיר: ["עד 300", "300-800", "מעל 800"],
  פורמט: ["אונליין", "פרונטלי"],
};

const PractitionerCard = ({ p, index }: { p: Practitioner; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group bg-card rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
  >
    <div className="p-6 flex flex-col items-center text-center flex-1">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4">
        <span className="font-display text-2xl font-bold text-primary-foreground">{p.initials}</span>
      </div>

      {/* Name & title */}
      <h3 className="font-display text-xl font-bold text-foreground mb-1">{p.name}</h3>
      <p className="text-muted-foreground text-sm mb-4">{p.title}</p>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {p.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium px-3 py-1 rounded-full border border-primary text-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border my-2" />

      {/* Price & format */}
      <div className="mt-3 text-sm text-muted-foreground space-y-1">
        <p>{p.price}</p>
        <p>{p.format}</p>
      </div>
    </div>

    {/* CTA */}
    <button className="w-full py-3 border-t border-primary/30 text-primary font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
      לפרופיל המלא
    </button>
  </motion.div>
);

const Practitioners = () => {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  };

  const filtered = useMemo(() => {
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

  return (
    <div className="min-h-screen bg-background font-body" dir="rtl">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground text-center mb-8"
          >
            מצאו את המומחה המתאים לכם
          </motion.h1>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative max-w-xl mx-auto mb-8"
          >
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חפשו לפי נושא, שם או גישה..."
              className="w-full pr-12 pl-4 py-3 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
            />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mb-12 space-y-4"
          >
            {Object.entries(filterGroups).map(([group, items]) => (
              <div key={group} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground min-w-[50px]">{group}:</span>
                {items.map((item) => {
                  const active = activeFilters.has(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleFilter(item)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-200 ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:bg-primary/10"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            ))}
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <PractitionerCard key={p.name} p={p} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground mt-12 text-lg">
              לא נמצאו מומחים מתאימים. נסו לשנות את החיפוש או הסינון.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Practitioners;
