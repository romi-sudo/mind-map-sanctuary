import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

// Local ambient loop — guaranteed to load (no CORS, no external CDN).
const AMBIENT_TRACK_URL = "/audio/ambient.mp3";
const STORAGE_KEY = "mapsoul_ambient_state_v1";

interface StoredState {
  volume: number;
}

const AmbientPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [expanded, setExpanded] = useState(false);

  // Restore volume
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s: StoredState = JSON.parse(raw);
        if (typeof s.volume === "number") setVolume(s.volume);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist volume
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume }));
    } catch {
      /* ignore */
    }
  }, [volume]);

  // Keep audio volume in sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

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

  return (
    <div
      dir="rtl"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <audio ref={audioRef} src={AMBIENT_TRACK_URL} loop preload="auto" />

      <button
        onClick={toggle}
        aria-label={playing ? "השתק מוזיקת רקע" : "הפעל מוזיקת רקע"}
        title={playing ? "השתק מוזיקת רקע" : "הפעל מוזיקת רקע אמביינט"}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border/40 bg-background/80 text-foreground shadow-md backdrop-blur-md transition-all duration-300 hover:bg-background hover:text-primary"
      >
        {playing ? <Volume2 className="h-4 w-4" /> : <Music className="h-4 w-4" />}
      </button>

      {/* Volume slider — appears on hover or when playing */}
      <div
        className={`flex items-center gap-2 overflow-hidden rounded-full border border-border/40 bg-background/80 shadow-md backdrop-blur-md transition-all duration-300 ${
          expanded || playing
            ? "w-44 opacity-100 px-3 py-2"
            : "w-0 opacity-0 px-0 py-2 border-transparent"
        }`}
      >
        {playing ? (
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
  );
};

export default AmbientPlayer;
