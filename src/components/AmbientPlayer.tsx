import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

// Free ambient nature loop (CC0). Soft forest + gentle waves.
const AMBIENT_TRACK_URL =
  "https://cdn.pixabay.com/audio/2022/03/15/audio_27e5b6a9c8.mp3";

const STORAGE_KEY = "mapsoul_ambient_state_v1";

interface StoredState {
  playing: boolean;
  volume: number;
}

const AmbientPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);

  // Restore state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s: StoredState = JSON.parse(raw);
        setVolume(typeof s.volume === "number" ? s.volume : 0.25);
        // Don't auto-resume — browsers block it without user gesture
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ playing, volume } satisfies StoredState),
      );
    } catch {
      /* ignore */
    }
  }, [playing, volume]);

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
      <audio
        ref={audioRef}
        src={AMBIENT_TRACK_URL}
        loop
        preload="auto"
        onCanPlay={() => setReady(true)}
      />

      {/* Volume slider — appears on hover or when playing */}
      <div
        className={`flex items-center gap-2 overflow-hidden rounded-full border border-border/40 bg-background/80 px-3 py-2 shadow-md backdrop-blur-md transition-all duration-300 ${
          expanded || playing ? "w-44 opacity-100" : "w-0 opacity-0 px-0 border-transparent"
        }`}
      >
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

      <button
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? "השתק מוזיקת רקע" : "הפעל מוזיקת רקע"}
        title={playing ? "השתק מוזיקת רקע" : "הפעל מוזיקת רקע אמביינט"}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border/40 bg-background/80 text-foreground shadow-md backdrop-blur-md transition-all duration-300 hover:bg-background hover:text-primary disabled:opacity-40"
      >
        {playing ? (
          <Volume2 className="h-4 w-4" />
        ) : ready ? (
          <Music className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default AmbientPlayer;
