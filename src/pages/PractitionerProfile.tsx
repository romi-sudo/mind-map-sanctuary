import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Users, DollarSign, Monitor, Globe, CalendarCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { practitioners } from "@/data/practitioners";

const PractitionerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const p = practitioners.find((pr) => pr.id === id);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  if (!p) {
    return (
      <div className="min-h-screen bg-background font-body flex items-center justify-center" dir="rtl">
        <Navbar />
        <div className="text-center pt-28">
          <h1 className="font-display text-3xl text-foreground mb-4">המומחה לא נמצא</h1>
          <Link to="/practitioners" className="text-primary underline">חזרה לקטלוג</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background font-body" dir="rtl">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Back link */}
          <Link to="/practitioners" className="inline-block mb-8 text-sm text-muted-foreground hover:text-primary transition-colors">
            ← חזרה לכל המומחים
          </Link>

          {/* 1. Hero */}
          <motion.section {...fade} className="text-center mb-16">
            <div className="w-[120px] h-[120px] rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
              <span className="font-display text-4xl font-bold text-primary-foreground">{p.initials}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">{p.name}</h1>
            <p className="text-lg text-muted-foreground mb-5">{p.title}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {p.tags.map((tag) => (
                <span key={tag} className="text-sm px-4 py-1.5 rounded-full border border-primary text-primary">{tag}</span>
              ))}
            </div>
            <div className="flex justify-center gap-8 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span>ניסיון: {p.experience}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <span>פגישות: {p.sessions}</span>
              </div>
            </div>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-3 rounded-full bg-primary text-primary-foreground font-medium text-lg hover:opacity-90 transition-opacity"
            >
              צרו קשר
            </button>
          </motion.section>

          {/* 2. About */}
          <motion.section {...fade} transition={{ delay: 0.1 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">קצת עליי</h2>
            <div className="bg-card rounded-2xl p-6 md:p-8 space-y-4">
              {p.bio.map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </motion.section>

          {/* 3. Specialties */}
          <motion.section {...fade} transition={{ delay: 0.15 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">במה אני מתמחה</h2>
            <div className="flex flex-wrap gap-3">
              {p.specialties.map((s) => (
                <span key={s} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">{s}</span>
              ))}
            </div>
          </motion.section>

          {/* 4. Approach */}
          <motion.section {...fade} transition={{ delay: 0.2 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">הגישה שלי</h2>
            <div className="space-y-4">
              {p.approaches.map((a) => (
                <div key={a.name} className="flex gap-3 items-start">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <span className="font-bold text-foreground">{a.name}</span>
                    <span className="text-muted-foreground"> — {a.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 5. Practical details */}
          <motion.section {...fade} transition={{ delay: 0.25 }} className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: DollarSign, label: "מחיר לפגישה", value: p.price },
                { icon: Monitor, label: "פורמט", value: p.format },
                { icon: Globe, label: "שפות", value: p.languages },
                { icon: CalendarCheck, label: "זמינות", value: p.availability },
              ].map((item) => (
                <div key={item.label} className="bg-card rounded-2xl p-5 text-center">
                  <item.icon size={24} className="text-primary mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-medium text-foreground text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 6. Reviews */}
          <motion.section {...fade} transition={{ delay: 0.3 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">מה אומרים</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {p.reviews.map((r, i) => (
                <div key={i} className="bg-card rounded-2xl p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <Star key={j} size={16} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{r.text}"</p>
                  <p className="font-medium text-foreground text-sm">— {r.name}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 7. Contact */}
          <motion.section {...fade} transition={{ delay: 0.35 }} id="contact" className="bg-primary rounded-3xl p-8 md:p-12">
            <h2 className="font-display text-3xl font-bold text-primary-foreground text-center mb-8">רוצים להתחיל?</h2>
            {formSent ? (
              <p className="text-center text-primary-foreground text-xl">תודה! ניצור איתך קשר בקרוב 🌿</p>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="שם מלא"
                  className="w-full px-4 py-3 rounded-xl bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 border border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40"
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="אימייל"
                  className="w-full px-4 py-3 rounded-xl bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 border border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="טלפון"
                  className="w-full px-4 py-3 rounded-xl bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 border border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40"
                />
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="ספרו לי במה אוכל לעזור"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 border border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-primary-foreground text-primary font-medium text-lg hover:opacity-90 transition-opacity"
                >
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
