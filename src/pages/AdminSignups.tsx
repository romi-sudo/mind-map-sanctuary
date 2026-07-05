import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Inbox, ExternalLink, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "romi@people360.co.il";
const isAdminEmail = (email?: string | null) =>
  !!email && email.trim().toLowerCase() === ADMIN_EMAIL;

const ROLE_LABEL: Record<string, string> = {
  practitioner: "מטפל/ת",
  consultant: "יועץ/ת",
  community_manager: "מנהל/ת קהילה",
  other: "אחר",
};

type Signup = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  specialty: string | null;
  years_experience: string | null;
  bio: string | null;
  social_link: string | null;
  created_at: string;
};

const AdminSignups = () => {
  const { user, loading: authLoading } = useAuth() as { user: any; loading?: boolean };
  const navigate = useNavigate();
  const [rows, setRows] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login?next=/admin/signups", { replace: true });
    } else if (!isAdminEmail(user.email)) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !isAdminEmail(user.email)) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("early_access_signups")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setRows(data as Signup[]);
      setLoading(false);
    })();
  }, [user]);

  const stats = useMemo(() => ({
    total: rows.length,
    practitioners: rows.filter((r) => r.role === "practitioner").length,
    consultants: rows.filter((r) => r.role === "consultant" || r.role === "community_manager").length,
  }), [rows]);

  const exportCsv = () => {
    const headers = ["שם מלא", "אימייל", "טלפון", "תפקיד", "תחום התמחות", "שנות ניסיון", "כמה מילים עליך", "קישור", "תאריך"];
    const escape = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const lines = [
      headers.map(escape).join(","),
      ...rows.map((r) => [
        r.full_name,
        r.email,
        r.phone,
        ROLE_LABEL[r.role] ?? r.role,
        r.specialty ?? "",
        r.years_experience ?? "",
        r.bio ?? "",
        r.social_link ?? "",
        new Date(r.created_at).toLocaleDateString("he-IL"),
      ].map(escape).join(",")),
    ];
    const csv = "\uFEFF" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `early-access-signups-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading || !user) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isAdminEmail(user.email)) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-28 pb-16">
        <h1 className="font-display text-3xl mb-8">נרשמים — Early Access</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { n: stats.total, label: "סה״כ נרשמו" },
            { n: stats.practitioners, label: "מטפלים" },
            { n: stats.consultants, label: "יועצים ומנהלי קהילה" },
          ].map((s, i) => (
            <div key={i} className="spa-card text-center !p-6">
              <div className="font-display text-4xl text-primary mb-1">{loading ? "—" : s.n}</div>
              <div className="font-body text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {rows.length > 0 && (
          <div className="flex justify-end mb-3">
            <button onClick={exportCsv} className="btn-primary !py-2 !px-4 text-sm inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              ייצוא ל-CSV
            </button>
          </div>
        )}

        {loading ? (
          <div className="spa-card text-center !p-10 text-muted-foreground">טוען...</div>
        ) : rows.length === 0 ? (
          <div className="spa-card text-center !p-10">
            <Inbox className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">עדיין אין נרשמים</p>
          </div>
        ) : (
          <div className="spa-card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="text-right px-4 py-3 font-medium">שם</th>
                    <th className="text-right px-4 py-3 font-medium">אימייל</th>
                    <th className="text-right px-4 py-3 font-medium">טלפון</th>
                    <th className="text-right px-4 py-3 font-medium">תפקיד</th>
                    <th className="text-right px-4 py-3 font-medium">תחום התמחות</th>
                    <th className="text-right px-4 py-3 font-medium">שנות ניסיון</th>
                    <th className="text-right px-4 py-3 font-medium">כמה מילים עליך</th>
                    <th className="text-right px-4 py-3 font-medium">קישור</th>
                    <th className="text-right px-4 py-3 font-medium">תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-border/60">
                      <td className="px-4 py-3">{r.full_name}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${r.email}`} className="hover:text-primary">{r.email}</a>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`tel:${r.phone}`} className="hover:text-primary">{r.phone}</a>
                      </td>
                      <td className="px-4 py-3">{ROLE_LABEL[r.role] ?? r.role}</td>
                      <td className="px-4 py-3">{r.specialty || "—"}</td>
                      <td className="px-4 py-3">{r.years_experience || "—"}</td>
                      <td className="px-4 py-3 max-w-xs whitespace-pre-wrap">{r.bio || "—"}</td>
                      <td className="px-4 py-3">
                        {r.social_link ? (
                          <a
                            href={r.social_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:opacity-70 inline-flex items-center gap-1"
                            title={r.social_link}
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>פתיחה</span>
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("he-IL")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminSignups;
