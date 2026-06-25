import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Search, Plus, MapPin, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import EventCard from "@/components/events/EventCard";
import { MOCK_EVENTS, type MockEventCategory } from "@/data/events";

type Category = "festival" | "lecture" | "enrichment" | "team_building" | "personal";

interface EventRow {
  id: string;
  title: string;
  category: Category;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  price: number | null;
  is_free: boolean;
  visibility: "public" | "members_only";
  image_url: string | null;
  created_by: string | null;
}

const CATEGORIES: { key: Category; label: string; icon: string; gradient: string }[] = [
  { key: "festival", label: "פסטיבלים", icon: "🌻", gradient: "linear-gradient(135deg, #F5C97B 0%, #E89B5A 100%)" },
  { key: "lecture", label: "הרצאות", icon: "🎤", gradient: "linear-gradient(135deg, #C9A87A 0%, #8B6F47 100%)" },
  { key: "enrichment", label: "העשרה", icon: "🌿", gradient: "linear-gradient(135deg, #A8B98A 0%, #5C7A4E 100%)" },
  { key: "team_building", label: "ימי גיבוש", icon: "🤝", gradient: "linear-gradient(135deg, #D4A574 0%, #A67C52 100%)" },
  { key: "personal", label: "אישי", icon: "💛", gradient: "linear-gradient(135deg, #F5D78A 0%, #D4A574 100%)" },
];

const catMeta = (c: Category) => CATEGORIES.find((x) => x.key === c)!;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "short", year: "numeric" });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("he-IL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const Events = () => {
  const { user } = useAuth();
  const { role } = useProfile();
  const isCorporate = role === "company";

  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Category | "all">("all");
  const [showCreate, setShowCreate] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (error) toast.error("שגיאה בטעינת האירועים");
    setEvents((data as EventRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadEvents(); }, [user]);

  const filtered = events.filter((e) => {
    if (activeCat !== "all" && e.category !== activeCat) return false;
    if (query) {
      const q = query.toLowerCase();
      const hay = `${e.title} ${e.description ?? ""} ${e.location ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const upcoming = filtered.slice(0, 8);

  return (
    <div className="min-h-screen" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6" style={{ background: "linear-gradient(180deg, #F5ECD7 0%, #EBDDC2 100%)" }}>
        <div className="container mx-auto max-w-5xl text-center">
          <p className="font-body text-sm mb-3" style={{ color: "hsl(var(--terracotta))" }}>
            MapSoul Events
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: "#2C1A0E" }}>
            כל האירועים, במקום אחד
          </h1>
          <p className="font-body text-lg mb-8 opacity-80" style={{ color: "#2C1A0E" }}>
            פסטיבלים, הרצאות, ימי העשרה וטקסים — מסע משותף לחברי הקהילה
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
            <input
              type="text"
              placeholder="חיפוש לפי שם, נושא או מקום..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-4 rounded-full border-2 font-body text-base shadow-sm focus:outline-none focus:border-current"
              style={{ background: "#FBF5E9", borderColor: "rgba(120,80,40,0.15)", color: "#2C1A0E" }}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-6 sticky top-[72px] z-40 backdrop-blur-md" style={{ background: "rgba(245,236,215,0.85)" }}>
        <div className="container mx-auto flex flex-wrap gap-2 justify-center items-center">
          <button
            onClick={() => setActiveCat("all")}
            className={`pill ${activeCat === "all" ? "active" : ""}`}
          >
            הכל
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCat(c.key)}
              className={`pill ${activeCat === c.key ? "active" : ""}`}
            >
              <span className="ml-1">{c.icon}</span> {c.label}
            </button>
          ))}
          {isCorporate && (
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary text-sm !py-2 !px-4 mr-auto flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> הוסף אירוע חדש
            </button>
          )}
          {!isCorporate && user && (
            <span className="text-xs opacity-60 mr-auto">הוספת אירועים שמורה לחשבונות עסקיים</span>
          )}
        </div>
      </section>

      {/* Near you - horizontal */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: "#2C1A0E" }}>
            קרוב אליך
          </h2>
          {loading ? (
            <p className="opacity-60">טוען...</p>
          ) : upcoming.length === 0 ? (
            <p className="opacity-60">אין אירועים להצגה כרגע.</p>
          ) : (
            <div className="flex gap-5 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory">
              {upcoming.map((ev) => (
                <EventCard key={ev.id} event={ev} loggedIn={!!user} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming list */}
      <section className="py-12 px-6" style={{ background: "rgba(235, 221, 194, 0.3)" }}>
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: "#2C1A0E" }}>
            האירועים הבאים
          </h2>
          {filtered.length === 0 ? (
            <p className="opacity-60">אין תוצאות מתאימות לחיפוש שלך.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((ev) => (
                <EventRowItem key={ev.id} event={ev} loggedIn={!!user} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {showCreate && (
        <CreateEventModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            loadEvents();
          }}
        />
      )}
    </div>
  );
};

const DbEventCard = ({ event, loggedIn }: { event: EventRow; loggedIn: boolean }) => {
  const meta = catMeta(event.category);
  const locked = event.visibility === "members_only" && !loggedIn;

  return (
    <div
      className="snap-start shrink-0 w-80 rounded-3xl overflow-hidden shadow-md border flex flex-col"
      style={{ background: "#FBF5E9", borderColor: "rgba(120,80,40,0.12)" }}
    >
      <div className="h-40 relative" style={{ background: meta.gradient }}>
        {event.image_url && !locked && (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-body font-medium" style={{ background: "rgba(255,255,255,0.9)", color: "#2C1A0E" }}>
          {meta.icon} {meta.label}
        </div>
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(44,26,14,0.55)" }}>
            <Lock className="w-10 h-10 text-white opacity-90" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-display text-lg font-semibold leading-tight" style={{ color: "#2C1A0E" }}>
          {locked ? "אירוע לחברי הקהילה" : event.title}
        </h3>
        <div className="flex items-center gap-2 text-sm opacity-75" style={{ color: "#2C1A0E" }}>
          <Calendar className="w-4 h-4" />
          <span>{formatDateTime(event.event_date)}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2 text-sm opacity-75" style={{ color: "#2C1A0E" }}>
            <MapPin className="w-4 h-4" />
            <span>{locked ? "—" : event.location}</span>
          </div>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="font-body font-semibold" style={{ color: "hsl(var(--terracotta))" }}>
            {locked ? "" : event.is_free ? "חינם" : event.price ? `₪${event.price}` : "—"}
          </span>
          {locked ? (
            <Link to="/login" className="btn-secondary text-xs !py-2 !px-4 flex items-center gap-1">
              <Lock className="w-3 h-3" /> התחבר לפרטים
            </Link>
          ) : (
            <button className="btn-primary text-xs !py-2 !px-4">הצטרפות</button>
          )}
        </div>
      </div>
    </div>
  );
};

const EventRowItem = ({ event, loggedIn }: { event: EventRow; loggedIn: boolean }) => {
  const meta = catMeta(event.category);
  const locked = event.visibility === "members_only" && !loggedIn;

  return (
    <div
      className="rounded-2xl border p-4 flex items-center gap-4 shadow-sm"
      style={{ background: "#FBF5E9", borderColor: "rgba(120,80,40,0.12)" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
        style={{ background: meta.gradient }}
      >
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-display font-semibold truncate" style={{ color: "#2C1A0E" }}>
            {locked ? "אירוע לחברי הקהילה" : event.title}
          </h4>
          {locked && <Lock className="w-3.5 h-3.5 opacity-60" />}
        </div>
        <p className="text-sm opacity-70 truncate" style={{ color: "#2C1A0E" }}>
          {formatDate(event.event_date)} {event.location && !locked ? `· ${event.location}` : ""}
        </p>
      </div>
      <div className="text-sm font-body font-semibold shrink-0" style={{ color: "hsl(var(--terracotta))" }}>
        {locked ? "" : event.is_free ? "חינם" : event.price ? `₪${event.price}` : ""}
      </div>
      {locked ? (
        <Link to="/login" className="btn-secondary text-xs !py-1.5 !px-3 shrink-0">התחבר</Link>
      ) : (
        <button className="btn-primary text-xs !py-1.5 !px-3 shrink-0">הצטרפות</button>
      )}
    </div>
  );
};

const CreateEventModal = ({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "festival" as Category,
    description: "",
    event_date: "",
    end_date: "",
    location: "",
    price: "",
    is_free: false,
    visibility: "public" as "public" | "members_only",
    image_url: "",
  });

  const update = (k: keyof typeof form, v: string | boolean) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("events").insert({
      title: form.title,
      category: form.category,
      description: form.description || null,
      event_date: form.event_date,
      end_date: form.end_date || null,
      location: form.location || null,
      price: form.is_free ? null : form.price ? Number(form.price) : null,
      is_free: form.is_free,
      visibility: form.visibility,
      image_url: form.image_url || null,
      created_by: user.id,
      source: "manual",
    });
    setSubmitting(false);
    if (error) {
      toast.error("שגיאה ביצירת האירוע: " + error.message);
      return;
    }
    toast.success("האירוע נוצר בהצלחה!");
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(44,26,14,0.6)" }} onClick={onClose} dir="rtl">
      <div
        className="rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ background: "#FBF5E9" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(120,80,40,0.1)" }}>
          <h3 className="font-display text-xl font-bold" style={{ color: "#2C1A0E" }}>אירוע חדש</h3>
          <button onClick={onClose} aria-label="סגור"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <Field label="כותרת">
            <input required value={form.title} onChange={(e) => update("title", e.target.value)} className="input-field" />
          </Field>
          <Field label="קטגוריה">
            <select value={form.category} onChange={(e) => update("category", e.target.value as Category)} className="input-field">
              {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
            </select>
          </Field>
          <Field label="תיאור">
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="input-field min-h-24" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="תאריך התחלה">
              <input required type="datetime-local" value={form.event_date} onChange={(e) => update("event_date", e.target.value)} className="input-field" />
            </Field>
            <Field label="תאריך סיום">
              <input type="datetime-local" value={form.end_date} onChange={(e) => update("end_date", e.target.value)} className="input-field" />
            </Field>
          </div>
          <Field label="מיקום">
            <input value={form.location} onChange={(e) => update("location", e.target.value)} className="input-field" />
          </Field>
          <div className="grid grid-cols-2 gap-3 items-end">
            <Field label="מחיר (₪)">
              <input type="number" disabled={form.is_free} value={form.price} onChange={(e) => update("price", e.target.value)} className="input-field" />
            </Field>
            <label className="flex items-center gap-2 pb-3 font-body">
              <input type="checkbox" checked={form.is_free} onChange={(e) => update("is_free", e.target.checked)} />
              אירוע חינמי
            </label>
          </div>
          <Field label="נראות">
            <select value={form.visibility} onChange={(e) => update("visibility", e.target.value as "public" | "members_only")} className="input-field">
              <option value="public">ציבורי (כולם רואים)</option>
              <option value="members_only">חברי קהילה בלבד</option>
            </select>
          </Field>
          <Field label="קישור לתמונה (אופציונלי)">
            <input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} className="input-field" placeholder="https://..." />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">ביטול</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? "יוצר..." : "צור אירוע"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block font-body text-sm mb-1.5" style={{ color: "#2C1A0E" }}>{label}</label>
    {children}
  </div>
);

export default Events;
