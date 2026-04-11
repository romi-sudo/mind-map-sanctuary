import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { practitioners, type Practitioner } from "@/data/practitioners";
import { ApproachTooltipButton } from "@/components/ApproachTooltip";
import { findApproach } from "@/data/approaches";

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
    className="group card-coastal bg-sand-light rounded-[20px] border border-sand-medium/50 shadow-sandy flex flex-col overflow-hidden"
  >
    <div className="p-6 flex flex-col items-center text-center flex-1">
      <div className="w-20 h-20 rounded-full bg-terracotta flex items-center justify-center mb-4">
        <span className="font-display text-2xl font-bold text-shell-white">{p.initials}</span>
      </div>
      <h3 className="font-display text-xl font-bold text-foreground mb-1">{p.name}</h3>
      <p className="text-driftwood text-sm mb-4">{p.title}</p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {p.tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-dried-botanical/15 text-dried-botanical border border-dried-botanical/20">
            {tag}
            {findApproach(tag) && <ApproachTooltipButton tag={tag} />}
          </span>
        ))}
      </div>
      <div className="w-full h-px bg-sand-dark/30 my-2" />
      <div className="mt-3 text-sm text-driftwood space-y-1">
        <p>{p.price}</p>
        <p>{p.format}</p>
      </div>
    </div>
    <Link
      to={`/practitioners/${p.id}`}
      className="w-full py-3 border-t border-sand-dark/20 text-terracotta font-medium text-sm hover:bg-terracotta hover:text-shell-white transition-colors duration-300 text-center block"
    >
      לפרופיל המלא
    </Link>
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
    <div className="min-h-screen bg-shell-white font-body grain-overlay" dir="rtl">
      <Navbar />
      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground text-center mb-8"
          >
            מצאו את המומחה המתאים לכם
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative max-w-xl mx-auto mb-8"
          >
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-terracotta" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חפשו לפי נושא, שם או גישה..."
              className="w-full pr-12 pl-4 py-3 rounded-full bg-shell-white border border-sand-dark/40 text-foreground placeholder:text-driftwood/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta/40 text-sm"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mb-12 space-y-4"
          >
            {Object.entries(filterGroups).map(([group, items]) => (
              <div key={group} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-driftwood min-w-[50px]">{group}:</span>
                {items.map((item) => {
                  const active = activeFilters.has(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleFilter(item)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-colors duration-200 ${
                        active
                          ? "bg-terracotta text-shell-white"
                          : "bg-sand-medium text-driftwood hover:bg-terracotta/10"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <PractitionerCard key={p.name} p={p} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-driftwood mt-12 text-lg">
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
