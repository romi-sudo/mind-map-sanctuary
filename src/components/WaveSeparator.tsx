/** Thin wave line SVG separator */
const WaveSeparator = () => (
  <div className="py-4 flex justify-center overflow-hidden">
    <svg width="100%" height="16" viewBox="0 0 800 16" preserveAspectRatio="none" className="max-w-2xl opacity-20">
      <path
        d="M0 8 Q50 2, 100 8 T200 8 T300 8 T400 8 T500 8 T600 8 T700 8 T800 8"
        stroke="hsl(var(--sand-dark))"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  </div>
);

export default WaveSeparator;
