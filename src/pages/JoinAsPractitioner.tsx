import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PractitionerForm from "@/components/join/PractitionerForm";
import CourseForm from "@/components/join/CourseForm";

const JoinAsPractitioner = () => {
  const [activeTab, setActiveTab] = useState<"practitioner" | "course">("practitioner");
  const [submitted, setSubmitted] = useState(false);

  const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const switchTab = (tab: "practitioner" | "course") => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen font-body bg-sand nature-overlay ambient-leaves" dir="rtl">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          <motion.section {...fade} className="mb-14 text-center">
            <h1 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-foreground mb-4">
              הצטרפו למשפחת MapSoul
            </h1>
            <div className="gold-line mb-6" />
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto font-body">
              חברו עם אנשים שמחפשים בדיוק את מה שאתם מציעים
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["קהל יעד מדויק", "פרופיל מקצועי", "ללא עמלות בהתחלה"].map((b) => (
                <span key={b} className="btn-secondary !py-2 !px-5 text-sm">{b}</span>
              ))}
            </div>
          </motion.section>

          {/* Tabs */}
          <div className="flex justify-center gap-8 mb-10">
            {[
              { key: "practitioner" as const, label: "אני מומחה/ית טיפולי/ת" },
              { key: "course" as const, label: "אני מרצה/ית או מנחה/ת קורסים" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => switchTab(tab.key)}
                className={`relative pb-2 text-base md:text-lg font-body transition-colors duration-200 ${
                  activeTab === tab.key ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.span
                    layoutId="join-tab-underline"
                    className="absolute bottom-0 right-0 left-0 h-[2px] bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {submitted ? (
            <motion.div {...fade} className="spa-card text-center !p-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                {activeTab === "practitioner" ? "תודה שהצטרפתם!" : "תודה! קיבלנו את פרטי הקורס שלכם 🌿"}
              </h2>
              <p className="text-muted-foreground text-lg font-body">ניצור איתכם קשר תוך 48 שעות.</p>
            </motion.div>
          ) : (
            <motion.div {...fade} transition={{ delay: 0.15 }}>
              {activeTab === "practitioner" ? (
                <PractitionerForm onSuccess={() => setSubmitted(true)} />
              ) : (
                <CourseForm onSuccess={() => setSubmitted(true)} />
              )}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JoinAsPractitioner;
