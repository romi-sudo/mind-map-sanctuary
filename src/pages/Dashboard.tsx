import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { usePractitionerStatus } from "@/hooks/usePractitionerStatus";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Lead {
  id: string;
  seeker_name: string;
  seeker_email: string;
  seeker_phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
  therapist_id: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("he-IL", { day: "2-digit", month: "short" });

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { firstName } = useProfile();
  const { status, loading: statusLoading } = usePractitionerStatus();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [practitionerSlug, setPractitionerSlug] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'month'>('all');
  const leadsListRef = useRef<HTMLDivElement | null>(null);

  const scrollToLeads = (f: 'all' | 'pending' | 'month') => {
    setActiveFilter(f);
    setTimeout(() => leadsListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  useEffect(() => {
    if (authLoading || statusLoading) return;
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }
    if (status && status !== "approved") { navigate("/pending", { replace: true }); return; }
  }, [user, status, authLoading, statusLoading, navigate, location.pathname]);

  useEffect(() => {
    if (!user || status !== "approved") return;
    (async () => {
      setLoading(true);
      // First get the practitioner's application id (slug-based id)
      const { data: app } = await supabase
        .from("practitioner_applications")
        .select("id, full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (app) setPractitionerSlug(app.id);
      // Then fetch leads using both possible ids
      const { data } = await supabase
        .from("leads")
        .select("*")
        .or(`therapist_id.eq.${user.id},therapist_id.eq.${app?.id ?? 'none'}`)
        .order("created_at", { ascending: false });
      setLeads((data as Lead[]) ?? []);
      setLoading(false);
    })();
  }, [user, status]);

  const markContacted = async (leadId: string) => {
    await supabase
      .from("leads")
      .update({ status: "contacted" })
      .eq("id", leadId);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: "contacted" } : l))
    );
  };

  const chartData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }),
        new: 0,
        contacted: 0,
      };
    });
    leads.forEach((lead) => {
      const leadDate = lead.created_at?.split('T')[0];
      const day = days.find((d) => d.date === leadDate);
      if (day) {
        if (lead.status === 'new') day.new += 1;
        else day.contacted += 1;
      }
    });
    return days;
  }, [leads]);

  if (authLoading || statusLoading || !user || status !== "approved") return null;

  const now = Date.now();
  const monthMs = 30 * 24 * 60 * 60 * 1000;
  const leadsThisMonth = leads.filter((l) => now - new Date(l.created_at).getTime() < monthMs).length;
  const newLeads = leads.filter((l) => l.status === "new").length;

  return (
    <div className="min-h-screen bg-sand flex flex-col" dir="rtl">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 pt-28">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-3xl text-foreground mb-2">
            שלום, {firstName || "מטפל/ת"}
          </h1>
          <div className="flex items-center gap-3 mb-10">
            <p className="font-body text-muted-foreground">הפרופיל שלך פעיל · הלידים מגיעים אליך</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-warm-gold/10 text-warm-gold text-xs font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-warm-gold" />
              פעיל
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { n: leadsThisMonth, label: "לידים החודש", f: 'month' as const },
            { n: newLeads, label: "טרם טופלו", f: 'pending' as const },
            { n: leads.length, label: "סה״כ פניות", f: 'all' as const },
          ].map((s, i) => (
            <button
              key={i}
              onClick={() => scrollToLeads(s.f)}
              className={`spa-card text-center !p-6 cursor-pointer hover:shadow-md transition-shadow ${activeFilter === s.f ? 'ring-2 ring-primary/40' : ''}`}
            >
              <div className="font-display text-4xl text-primary mb-1">{loading ? "—" : s.n}</div>
              <div className="font-body text-sm text-muted-foreground">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Chart */}
        <h2 className="font-display text-xl mb-4 text-foreground">פניות ב-30 הימים האחרונים</h2>
        <div className="spa-card !p-6 mb-10">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                  contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontFamily: "inherit" }}
                />
                <Bar dataKey="new" stackId="a" fill="hsl(var(--warm-gold))" name="חדש" radius={[0, 0, 0, 0]} />
                <Bar dataKey="contacted" stackId="a" fill="hsl(var(--terracotta))" name="בטיפול" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 mt-3 text-xs font-body text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(var(--warm-gold))" }} />
              חדש
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(var(--terracotta))" }} />
              בטיפול
            </span>
          </div>
        </div>


        {/* Leads */}
        <div ref={leadsListRef} className="scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-foreground">
              {activeFilter === 'pending' ? 'פניות שטרם טופלו' : activeFilter === 'month' ? 'לידים מהחודש האחרון' : 'פניות אחרונות'}
            </h2>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="text-sm font-body text-primary hover:underline"
              >
                הצג הכל
              </button>
            )}
          </div>
          {(() => {
            const now = Date.now();
            const monthMs = 30 * 24 * 60 * 60 * 1000;
            const visibleLeads = leads.filter((l) => {
              if (activeFilter === 'pending') return l.status === 'new';
              if (activeFilter === 'month') return now - new Date(l.created_at).getTime() < monthMs;
              return true;
            });
            if (loading) {
              return (
                <div className="spa-card text-center !p-10 mb-8">
                  <p className="font-body text-muted-foreground">טוען פניות…</p>
                </div>
              );
            }
            if (visibleLeads.length === 0) {
              return (
                <div className="spa-card text-center !p-10 mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-warm-gold/15 flex items-center justify-center">
                      <Inbox className="w-7 h-7 text-warm-gold" />
                    </div>
                  </div>
                  <p className="font-body text-muted-foreground">
                    {leads.length === 0 ? 'עדיין לא הגיעו פניות. הפרופיל שלך פעיל ופועל.' : 'אין פניות תואמות לסינון הנוכחי.'}
                  </p>
                </div>
              );
            }
            return (
              <div className="mb-8">
                {visibleLeads.map((l) => (
                  <a
                    key={l.id}
                    href={`mailto:${l.seeker_email}`}
                    className="spa-card !p-4 mb-3 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        l.status === "new" ? "bg-warm-gold" : "bg-muted-foreground/40"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-body font-medium text-foreground truncate">{l.seeker_name}</div>
                      <div className="font-body text-sm text-muted-foreground truncate">
                        {l.seeker_email}
                        {l.message ? ` · ${l.message.slice(0, 60)}${l.message.length > 60 ? "…" : ""}` : ""}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0">{formatDate(l.created_at)}</div>
                    {l.status === "new" && (
                      <>
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-body flex-shrink-0">
                          חדש
                        </span>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); markContacted(l.id); }}
                          className="text-xs font-body text-muted-foreground hover:text-primary transition-colors flex-shrink-0 border border-border rounded-full px-2 py-0.5"
                        >
                          סמן כטופל
                        </button>
                      </>
                    )}
                    {l.status === "contacted" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-body flex-shrink-0">
                        בטיפול
                      </span>
                    )}
                  </a>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Payments — coming soon */}
        <h2 className="font-display text-xl mb-4 text-foreground">תשלומים וסליקה</h2>
        <div className="spa-card text-center !p-10 mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-warm-gold/15 flex items-center justify-center text-3xl">
              💳
            </div>
          </div>
          <h3 className="font-display text-lg text-foreground mb-2">מערכת סליקה בדרך</h3>
          <p className="font-body text-muted-foreground max-w-md mx-auto mb-4">
            בקרוב תוכלו לקבל תשלומים ישירות בפלטפורמה, לראות היסטוריית עסקאות ולנהל את החיוב החודשי שלכם — הכל במקום אחד.
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warm-gold/10 text-warm-gold text-xs font-body">
            בקרוב
          </span>
        </div>

        {/* Quick links */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate("/join-as-practitioner")} className="btn-secondary flex-1">
            ערוך פרופיל
          </button>
          {practitionerSlug && (
            <button
              onClick={() => navigate(`/practitioners/${practitionerSlug}`)}
              className="btn-secondary flex-1"
            >
              צפה בפרופיל הציבורי
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
