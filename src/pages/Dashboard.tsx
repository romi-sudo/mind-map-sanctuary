import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
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
            { n: leadsThisMonth, label: "לידים החודש" },
            { n: newLeads, label: "טרם טופלו" },
            { n: leads.length, label: "סה״כ פניות" },
          ].map((s, i) => (
            <div key={i} className="spa-card text-center !p-6">
              <div className="font-display text-4xl text-primary mb-1">{loading ? "—" : s.n}</div>
              <div className="font-body text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Leads */}
        <h2 className="font-display text-xl mb-4 text-foreground">פניות אחרונות</h2>
        {loading ? (
          <div className="spa-card text-center !p-10 mb-8">
            <p className="font-body text-muted-foreground">טוען פניות…</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="spa-card text-center !p-10 mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-warm-gold/15 flex items-center justify-center">
                <Inbox className="w-7 h-7 text-warm-gold" />
              </div>
            </div>
            <p className="font-body text-muted-foreground">
              עדיין לא הגיעו פניות. הפרופיל שלך פעיל ופועל.
            </p>
          </div>
        ) : (
          <div className="mb-8">
            {leads.map((l) => (
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
        )}

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
