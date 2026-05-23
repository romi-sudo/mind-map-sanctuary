import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { practitioners } from "@/data/practitioners";
import { ApproachTooltipButton } from "@/components/ApproachTooltip";
import { findApproach } from "@/data/approaches";
import { supabase } from "@/integrations/supabase/client";

const PractitionerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";
  const p = practitioners.find((pr) => pr.id === id);
  const [formSent, setFormSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!p) {
    return (
      <div className="min-h-screen font-body flex items-center justify-center bg-background" dir={dir}>
        <Navbar />
        <div className="text-center pt-28">
          <h1 className="font-display text-3xl text-foreground mb-4">{t("profile.notFound")}</h1>
          <Link to="/practitioners" className="text-primary underline font-body">{t("profile.backToCatalog")}</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      therapist_id: p.id,
      seeker_name: form.name,
      seeker_email: form.email,
      seeker_phone: form.phone || null,
      message: form.message || null,
    });
    setSubmitting(false);
    if (error) {
      console.error("Lead insert error:", error);
      toast.error(t("profile.errorSubmit"));
      return;
    }
    setFormSent(true);
    toast.success(t("profile.successSubmit"));
  };

  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
  const inputClass = "w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-body text-sm transition-all";

  return (
    <div className="min-h-screen font-body bg-background" dir={dir}>
      <Navbar />

      <section className="photo-section pt-20">
        <div className="photo-bg">
          <img src="https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=1920&q=80" alt="" />
          <div className="photo-overlay" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <Link to="/practitioners" className="inline-block mb-8 text-sm text-white/70 hover:text-white transition-colors font-body">
            {t("profile.backToAll")}
          </Link>

          <motion.div {...fade} className="text-center">
            <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center mx-auto mb-6 bg-white/20 backdrop-blur-sm overflow-hidden">
              {p.photo ? (
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-4xl font-bold text-white">{p.initials}</span>
              )}
            </div>
            <h1 className="font-display text-[2.2rem] md:text-[3.5rem] font-bold text-white mb-2">{p.name}</h1>
            <p className="text-lg text-white/80 mb-5 font-body">{p.title}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {p.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-sm px-4 py-1.5 rounded-full border font-body border-white/25 text-white/90">
                  {tag}
                  {findApproach(tag) && <ApproachTooltipButton tag={tag} />}
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-8 mb-8 text-sm text-white/70 font-body">
              <span>{t("profile.experience")}: {p.experience}</span>
              <span>{t("profile.sessions")}: {p.sessions}</span>
            </div>
            <button onClick={scrollToContact} className="btn-primary text-lg">
              {t("profile.contactCta")}
            </button>
          </motion.div>
        </div>
      </section>

      <main className="px-4 sm:px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="section-divider my-12" />

          <motion.section {...fade} transition={{ delay: 0.1 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">{t("profile.aboutMe")}</h2>
            <div className="spa-card space-y-4">
              {p.bio.map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed font-body">{paragraph}</p>
              ))}
            </div>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.15 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">{t("profile.specialties")}</h2>
            <div className="flex flex-wrap gap-3">
              {p.specialties.map((s) => (
                <span key={s} className="btn-primary !py-2 !px-4 text-sm">{s}</span>
              ))}
            </div>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.2 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">{t("profile.myApproach")}</h2>
            <div className="space-y-4">
              {p.approaches.map((a) => (
                <div key={a.name} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-primary" />
                  <p className="font-body text-muted-foreground">
                    <span className="text-foreground font-medium">{a.name}</span> — {a.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.25 }} className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t("profile.price"), value: p.price },
                { label: t("profile.format"), value: p.format },
                { label: t("profile.languages"), value: p.languages },
                { label: t("profile.availability"), value: p.availability },
              ].map((item) => (
                <div key={item.label} className="spa-card text-center !p-5">
                  <p className="text-xs text-muted-foreground mb-1 font-body">{item.label}</p>
                  <p className="font-body text-foreground text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.3 }} className="mb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">{t("profile.reviews")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {p.reviews.map((r, i) => (
                <div key={i} className="spa-card">
                  <div className="mb-3">
                    <span className="text-amber-500 text-sm tracking-wide" aria-label={`${r.stars} stars`}>
                      {'★'.repeat(r.stars)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 font-body">"{r.text}"</p>
                  <p className="text-foreground text-sm font-body">— {r.name}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fade} transition={{ delay: 0.35 }} id="contact">
            <div className="spa-card !p-8 md:!p-12">
              <h2 className="font-display text-3xl font-bold text-foreground text-center mb-8">{t("profile.startTitle")}</h2>
              {formSent ? (
                <p className="text-center text-foreground text-xl font-body">{t("profile.thanks")}</p>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                  {[
                    { v: form.name, k: "name", ph: t("profile.name"), type: "text", required: true },
                    { v: form.email, k: "email", ph: t("profile.email"), type: "email", required: true },
                    { v: form.phone, k: "phone", ph: t("profile.phone"), type: "tel", required: false },
                  ].map((f) => (
                    <div key={f.k} className="border-b border-border">
                      <input
                        required={f.required}
                        type={f.type}
                        value={f.v}
                        onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                        placeholder={f.ph}
                        className={inputClass}
                      />
                    </div>
                  ))}
                  <div className="border-b border-border">
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("profile.message")} rows={4} className={`${inputClass} resize-none`} />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full mt-4 disabled:opacity-60">
                    {submitting ? t("profile.submitting") : t("profile.submit")}
                  </button>
                </form>
              )}
            </div>
          </motion.section>
        </div>
      </main>

      {showStickyBar && !formSent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t border-border bg-background/90 px-4 py-3"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-center">
            <button onClick={scrollToContact} className="btn-primary w-full sm:w-auto">
              {t("profile.stickyContact")} {p.name}
            </button>
          </div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default PractitionerProfile;
