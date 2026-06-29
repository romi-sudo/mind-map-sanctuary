import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const CATEGORY_ICONS: Record<string, string> = {
  festival: "🌻",
  lecture: "🎤",
  enrichment: "🌿",
  team_building: "🤝",
  personal: "💛",
};

interface EventRow {
  id: string;
  title: string;
  category: keyof typeof CATEGORY_ICONS;
  event_date: string;
}

interface Props {
  label: string;
  triggerStyle?: React.CSSProperties;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("he-IL", { day: "numeric", month: "short" });
};

const EventsDropdown = ({ label, triggerStyle }: Props) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || items.length > 0) return;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("id,title,category,event_date")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(5);
      setItems((data as EventRow[]) ?? []);
      setLoading(false);
    })();
  }, [open, items.length]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-body whitespace-nowrap hover:opacity-80 transition-opacity text-xs xl:text-sm pb-1"
        style={triggerStyle}
      >
        {label} <span className="text-xs opacity-70">▾</span>
      </button>
      {open && (
        <div
          className="absolute top-full mt-3 w-72 rounded-2xl shadow-xl border overflow-hidden z-50"
          style={{
            right: 0,
            background: "#F2EBE2",
            borderColor: "rgba(120, 80, 40, 0.15)",
          }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(120,80,40,0.1)" }}>
            <p className="font-display text-sm font-semibold" style={{ color: "#2C1A0E" }}>
              האירועים הקרובים
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading && <div className="p-4 text-sm text-center opacity-60">טוען...</div>}
            {!loading && items.length === 0 && (
              <div className="p-4 text-sm text-center opacity-60">אין אירועים קרובים</div>
            )}
            {items.map((ev) => (
              <Link
                key={ev.id}
                to="/events"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors"
              >
                <span className="text-2xl">{CATEGORY_ICONS[ev.category]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium truncate" style={{ color: "#2C1A0E" }}>
                    {ev.title}
                  </p>
                  <p className="font-body text-xs opacity-70" style={{ color: "#2C1A0E" }}>
                    {formatDate(ev.event_date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/events"
            onClick={() => setOpen(false)}
            className="block text-center py-3 text-sm font-body border-t hover:bg-black/5 transition-colors"
            style={{ color: "hsl(var(--terracotta))", borderColor: "rgba(120,80,40,0.1)" }}
          >
            לכל האירועים ←
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventsDropdown;
