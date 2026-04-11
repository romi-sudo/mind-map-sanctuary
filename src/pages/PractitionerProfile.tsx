import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Users, DollarSign, Monitor, Globe, CalendarCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { practitioners } from "@/data/practitioners";
import { ApproachTooltipButton } from "@/components/ApproachTooltip";
import { findApproach } from "@/data/approaches";

const PractitionerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const p = practitioners.find((pr) => pr.id === id);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  if (!p) {
    return (
      <div className="min-h-screen bg-shell-white font-body flex items-center justify-center" dir="rtl">
        <Navbar />
        <div className="text-center pt-28">
          <h1 className="font-display text-3xl text-foreground mb-4">המומחה לא נמצא</h1>
          <Link to="/practitioners" className="text-terracotta underline">חזרה לקטלוג</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
  const inputClass = "w-full px-4 py-3 rounded-xl bg-shell-white/20 text-shell-white placeholder:text-shell-white/60 border-b border-shell-white/20 focus:outline-none focus:border-shell-white/50 transition-colors";

  return (
    <div className="min-h-screen bg-shell-white font-body grain-overlay" dir="rtl">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          <Link to="/practitioners" className="inline-block mb-8 text-sm text-driftwood hover:text-terracotta transition-colors">
            ← חזרה לכל המומחים
          </Link>

          {/* Hero */}
          <motion.section {...fade} className="text-center mb-16">
            <div className="w-[120px] h-[120px] rounded-full bg-terracotta flex items-center justify-center mx-auto mb-6">
              <span className="font-display text-4xl font-bold text-shell-white">{p.initials}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">{p.name}</h1>
            <p className="text-lg text-driftwood mb-5">{p.title}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {p.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-sm px-4 py-1.5 rounded-full bg-dried-botanical/15 text-dried-botanical border border-dried-botanical/20">
                  {tag}
                  {findApproach(tag) && <ApproachTooltipButton tag={tag} />}
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-8 mb-8 text-sm text-driftwood">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-terracotta" />
                <span>ניסיון: {p.experience}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-terracotta" />
                <span>פגישות: {p.sessions}</span>
              </div>
            </div>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-3 rounded-full bg-terracotta text-shell-white font-medium text-lg hover:bg-primary-hover transition-colors btn-glow"
            >
              צרו קשר
            </button>
          </motion.section>

          {/* About */}
          <motion.section {...fade} transition={{ delay: 0.1 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">קצת עליי</h2>
            <div className="bg-sand-light rounded-[20px] p-6 md:p-8 space-y-4 border border-sand-medium/50">
              {p.bio.map((paragraph, i) => (
                <p key={i} className="text-driftwood leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </motion.section>

          {/* Specialties */}
          <motion.section {...fade} transition={{ delay: 0.15 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">במה אני מתמחה</h2>
            <div className="flex flex-wrap gap-3">
              {p.specialties.map((s) => (
                <span key={s} className="px-4 py-2 rounded-full bg-terracotta text-shell-white text-sm font-medium">{s}</span>
              ))}
            </div>
          </motion.section>

          {/* Approach */}
          <motion.section {...fade} transition={{ delay: 0.2 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">הגישה שלי</h2>
            <div className="space-y-4">
              {p.approaches.map((a) => (
                <div key={a.name} className="flex gap-3 items-start">
                  <div className="w-2.5 h-2.5 rounded-full bg-terracotta mt-2 shrink-0" />
                  <div>
                    <span className="font-bold text-foreground">{a.name}</span>
                    <span className="text-driftwood"> — {a.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Details */}
          <motion.section {...fade} transition={{ delay: 0.25 }} className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: DollarSign, label: "מחיר לפגישה", value: p.price },
                { icon: Monitor, label: "פורמט", value: p.format },
                { icon: Globe, label: "שפות", value: p.languages },
                { icon: CalendarCheck, label: "זמינות", value: p.availability },
              ].map((item) => (
                <div key={item.label} className="bg-sand-light rounded-[20px] p-5 text-center border border-sand-medium/50">
                  <item.icon size={24} className="text-terracotta mx-auto mb-3" />
                  <p className="text-xs text-driftwood mb-1">{item.label}</p>
                  <p className="font-medium text-foreground text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Reviews */}
          <motion.section {...fade} transition={{ delay: 0.3 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">מה אומרים</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {p.reviews.map((r, i) => (
                <div key={i} className="bg-sand-light rounded-[20px] p-6 border border-sand-medium/50">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <Star key={j} size={16} className="fill-terracotta text-terracotta" />
                    ))}
                  </div>
                  <p className="text-driftwood text-sm leading-relaxed mb-4">"{r.text}"</p>
                  <p className="font-medium text-foreground text-sm">— {r.name}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Contact */}
          <motion.section {...fade} transition={{ delay: 0.35 }} id="contact" className="bg-terracotta rounded-[24px] p-8 md:p-12">
            <h2 className="font-display text-3xl font-bold text-shell-white text-center mb-8">רוצים להתחיל?</h2>
            {formSent ? (
              <p className="text-center text-shell-white text-xl">תודה! ניצור איתך קשר בקרוב 🐚</p>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="שם מלא" className={inputClass} />
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="אימייל" className={inputClass} />
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="טלפון" className={inputClass} />
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="ספרו לי במה אוכל לעזור" rows={4} className={`${inputClass} resize-none`} />
                <button type="submit" className="w-full py-3 rounded-full bg-shell-white text-terracotta font-medium text-lg hover:bg-sand-light transition-colors">
                  שליחה
                </button>
              </form>
            )}
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PractitionerProfile;
