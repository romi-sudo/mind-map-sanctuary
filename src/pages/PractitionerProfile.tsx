import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      <div className="min-h-screen font-body flex items-center justify-center" dir="rtl" style={{ background: "#3D2410" }}>
        <Navbar />
        <div className="text-center pt-28">
          <h1 className="font-display text-3xl text-cream mb-4">המומחה לא נמצא</h1>
          <Link to="/practitioners" className="text-tropical-orange underline font-body">חזרה לקטלוג</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
  const inputClass = "w-full py-3 bg-transparent text-cream placeholder:text-sand/50 focus:outline-none font-body text-sm transition-all";

  return (
    <div className="min-h-screen font-body" dir="rtl" style={{ background: "#3D2410" }}>
      <Navbar />

      <section className="photo-section pt-20">
        <div className="photo-bg">
          <img src="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=1920&q=80" alt="" />
          <div className="photo-overlay" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <Link to="/practitioners" className="inline-block mb-8 text-sm text-sand hover:text-cream transition-colors font-body">
            חזרה לכל המומחים
          </Link>

          <motion.div {...fade} className="text-center">
            <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#4D3520" }}>
              <span className="font-display text-4xl font-bold" style={{ color: "#C9A96E" }}>{p.initials}</span>
            </div>
            <h1 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-cream mb-2">{p.name}</h1>
            <p className="text-lg text-sand mb-5 font-body">{p.title}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {p.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-sm px-4 py-1.5 rounded-full border font-body" style={{ borderColor: "rgba(200,184,154,0.2)", color: "#C9A96E" }}>
                  {tag}
                  {findApproach(tag) && <ApproachTooltipButton tag={tag} />}
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-8 mb-8 text-sm text-sand font-body">
              <span>ניסיון: {p.experience}</span>
              <span>פגישות: {p.sessions}</span>
            </div>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary text-lg"
            >
              צרו קשר
            </button>
          </motion.div>
        </div>
      </section>

      <main className="px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="section-divider my-12" />

          <motion.section {...fade} transition={{ delay: 0.1 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-cream mb-6">קצת עליי</h2>
            <div className="glass-card space-y-4">
              {p.bio.map((paragraph, i) => (
                <p key={i} className="text-sand leading-relaxed font-body">{paragraph}</p>
              ))}
            </div>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.15 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-cream mb-6">במה אני מתמחה</h2>
            <div className="flex flex-wrap gap-3">
              {p.specialties.map((s) => (
                <span key={s} className="btn-primary !py-2 !px-4 text-sm">{s}</span>
              ))}
            </div>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.2 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-cream mb-6">הגישה שלי</h2>
            <div className="space-y-4">
              {p.approaches.map((a) => (
                <div key={a.name} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: "#E8854A" }} />
                  <p className="font-body text-sand">
                    <span className="text-cream font-medium">{a.name}</span> — {a.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.25 }} className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "מחיר לפגישה", value: p.price },
                { label: "פורמט", value: p.format },
                { label: "שפות", value: p.languages },
                { label: "זמינות", value: p.availability },
              ].map((item) => (
                <div key={item.label} className="glass-card text-center !p-5">
                  <p className="text-xs text-sand mb-1 font-body">{item.label}</p>
                  <p className="font-body text-cream text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.3 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-cream mb-6">מה אומרים</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {p.reviews.map((r, i) => (
                <div key={i} className="glass-card">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <span key={j} className="text-sm" style={{ color: "#C9A96E" }}>&#9679;</span>
                    ))}
                  </div>
                  <p className="text-sand text-sm leading-relaxed mb-4 font-body">"{r.text}"</p>
                  <p className="text-cream text-sm font-body">— {r.name}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.35 }} id="contact">
            <div className="glass-card !p-8 md:!p-12">
              <h2 className="font-display text-3xl font-bold text-cream text-center mb-8">רוצים להתחיל?</h2>
              {formSent ? (
                <p className="text-center text-cream text-xl font-body">תודה! ניצור איתך קשר בקרוב</p>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                  <div style={{ borderBottom: "1px solid rgba(201,169,110,0.3)" }}>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="שם מלא" className={inputClass} />
                  </div>
                  <div style={{ borderBottom: "1px solid rgba(201,169,110,0.3)" }}>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="אימייל" className={inputClass} />
                  </div>
                  <div style={{ borderBottom: "1px solid rgba(201,169,110,0.3)" }}>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="טלפון" className={inputClass} />
                  </div>
                  <div style={{ borderBottom: "1px solid rgba(201,169,110,0.3)" }}>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="ספרו לי במה אוכל לעזור" rows={4} className={`${inputClass} resize-none`} />
                  </div>
                  <button type="submit" className="btn-primary w-full mt-4">שליחה</button>
                </form>
              )}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PractitionerProfile;
