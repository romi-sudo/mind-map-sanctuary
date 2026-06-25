import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MockEvent } from "@/data/events";

interface Props {
  event: MockEvent;
}

const EventCard = ({ event }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition cursor-pointer flex flex-col snap-start shrink-0 w-72 sm:w-auto"
      >
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="h-40 w-full object-cover"
          />
          <span
            className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 text-xs font-body"
            style={{ color: "#2C1A0E" }}
          >
            {event.category}
          </span>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3
            className="font-display text-lg font-bold leading-tight mb-2"
            style={{ color: "#2C1A0E" }}
          >
            {event.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {event.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {event.location}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {event.shortDescription}
          </p>
          <div className="flex justify-between items-center mt-3">
            <span
              className="font-body font-medium"
              style={{ color: "hsl(var(--terracotta))" }}
            >
              {event.price}
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-body"
              style={{ background: "rgba(120,80,40,0.08)", color: "#2C1A0E" }}
            >
              {event.format}
            </span>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-56 object-cover rounded-xl"
          />
          <DialogHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <DialogTitle
                className="font-display text-2xl font-bold text-right"
                style={{ color: "#2C1A0E" }}
              >
                {event.title}
              </DialogTitle>
              <span
                className="px-3 py-1 rounded-full bg-white/90 text-xs font-body border"
                style={{ color: "#2C1A0E", borderColor: "rgba(120,80,40,0.15)" }}
              >
                {event.category}
              </span>
            </div>
          </DialogHeader>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {event.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {event.location}
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs"
              style={{ background: "rgba(120,80,40,0.08)", color: "#2C1A0E" }}
            >
              {event.format}
            </span>
            <span
              className="font-body font-medium"
              style={{ color: "hsl(var(--terracotta))" }}
            >
              {event.price}
            </span>
          </div>

          <p
            className="font-body text-base leading-relaxed"
            style={{ color: "#2C1A0E" }}
          >
            {event.fullDescription}
          </p>

          <button className="btn-primary w-full">אני מעוניין/ת</button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;
