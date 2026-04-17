import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music, Waves, Trees, Flower2 } from "lucide-react";

type TrackId = "waves" | "forest" | "meditation";

interface TrackDef {
  id: TrackId;
  label: string;
  url: string;
  Icon: typeof Waves;
}

const TRACKS: TrackDef[] = [
  { id: "waves", label: "גלי ים", url: "/audio/waves.mp3", Icon: Waves },
  { id: "forest", label: "יער וציפורים", url: "/audio/forest.mp3", Icon: Trees },
  { id: "meditation", label: "מדיטציה", url: "/audio/meditation.mp3", Icon: Flower2 },
];

const STORAGE_KEY = "mapsoul_ambient_state_v2";

interface StoredState {
  volume: number;
  trackId: TrackId;
}

const AmbientPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [trackId, setTrackId] = useState<TrackId>("waves");
  const [menuOpen, setMenuOpen] = useState(false);

  // Restore state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s: StoredState = JSON.parse(raw);
        if (typeof s.volume === "number") setVolume(s.volume);
        if (s.trackId && TRACKS.some((t) => t.id === s.trackId)) setTrackId(s.trackId);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume, trackId }));
    } catch {
      /* ignore */
    }
  }, [volume, trackId]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // When track changes while playing — switch source and continue
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const wasPlaying = playing;
    const newSrc = TRACKS.find((t) => t.id === trackId)!.url;
    if (audio.src.endsWith(newSrc)) return;
    audio.src = newSrc;
    audio.load();
    if (wasPlaying) {
      audio.play().catch((e) => console.warn("Track switch play blocked:", e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        audio.volume = volume;
        await audio.play();
        setPlaying(true);
      } catch (e) {
        console.warn("Ambient audio play blocked:", e);
      }
    }
  };

  const selectTrack = (id: TrackId) => {
    setTrackId(id);
    setMenuOpen(false);
  };

  const currentTrack = TRACKS.find((t) => t.id === trackId)!;
  const CurrentIcon = currentTrack.Icon;

  return (
    <div dir="rtl" className="fixed bottom-5 left-5 z-50">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        loop
        preload="auto"
      />

      {/* Track selection menu */}
      {menuOpen && (
        <div className="absolute bottom-14 left-0 mb-1 flex flex-col gap-1 rounded-2xl border border-border/40 bg-background/95 p-2 shadow-lg backdrop-blur-md min-w-[170px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-2 py-1 text-[11px] font-body text-muted-foreground border-b border-border/30 mb-1">
            צליל אמביינט
          </div>
          {TRACKS.map((t) => {
            const Icon = t.Icon;
            const active = t.id === trackId;
            return (
              <button
                key={t.id}
                onClick={() => selectTrack(t.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-right text-sm font-body transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{t.label}</span>
                {active && playing && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Player row */}
      <div className="flex items-center gap-2">
        {/* Play/pause main button */}
        <button
          onClick={toggle}
          aria-label={playing ? "השתק מוזיקת רקע" : "הפעל מוזיקת רקע"}
          title={playing ? "השתק" : `הפעל — ${currentTrack.label}`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border/40 bg-background/80 text-foreground shadow-md backdrop-blur-md transition-all duration-300 hover:bg-background hover:text-primary"
        >
          {playing ? <Volume2 className="h-4 w-4" /> : <Music className="h-4 w-4" />}
        </button>

        {/* Track selector button */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="בחירת צליל אמביינט"
          title={`צליל נוכחי: ${currentTrack.label}`}
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-border/40 bg-background/80 shadow-md backdrop-blur-md transition-all duration-300 hover:bg-background hover:text-primary ${
            menuOpen ? "text-primary bg-background" : "text-foreground"
          }`}
        >
          <CurrentIcon className="h-4 w-4" />
        </button>

        {/* Volume slider — visible when playing or menu open */}
        <div
          className={`flex items-center gap-2 overflow-hidden rounded-full border border-border/40 bg-background/80 shadow-md backdrop-blur-md transition-all duration-300 ${
            playing || menuOpen
              ? "w-40 opacity-100 px-3 py-2"
              : "w-0 opacity-0 px-0 py-2 border-transparent"
          }`}
        >
          {volume > 0 ? (
            <Volume2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <VolumeX className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1 w-full cursor-pointer accent-primary"
            aria-label="עוצמת מוזיקה"
          />
        </div>
      </div>
    </div>
  );
};

export default AmbientPlayer;
