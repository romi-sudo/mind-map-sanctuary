/** Seashell SVG divider between sections */
const ShellDivider = () => (
  <div className="relative py-6 flex items-center justify-center overflow-hidden">
    <svg width="360" height="32" viewBox="0 0 360 32" fill="none" className="opacity-30">
      {/* Left wave line */}
      <path d="M0 16 Q30 8, 60 16 T120 16" stroke="hsl(var(--sand-dark))" strokeWidth="0.8" fill="none" />
      {/* Left shell */}
      <g transform="translate(130, 10)">
        <path d="M0 12 C2 4, 8 0, 12 0 C16 0, 22 4, 24 12 C22 14, 18 16, 12 16 C6 16, 2 14, 0 12Z" fill="hsl(var(--terracotta))" fillOpacity="0.25" />
        <line x1="12" y1="1" x2="12" y2="15" stroke="hsl(var(--terracotta))" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="6" y1="3" x2="4" y2="14" stroke="hsl(var(--terracotta))" strokeWidth="0.4" strokeOpacity="0.2" />
        <line x1="18" y1="3" x2="20" y2="14" stroke="hsl(var(--terracotta))" strokeWidth="0.4" strokeOpacity="0.2" />
      </g>
      {/* Center starfish */}
      <g transform="translate(168, 6)">
        <path d="M12 0 L14 8 L22 10 L15 14 L16 22 L12 16 L8 22 L9 14 L2 10 L10 8Z" fill="hsl(var(--sand-dark))" fillOpacity="0.3" />
      </g>
      {/* Right shell */}
      <g transform="translate(206, 10)">
        <path d="M0 12 C2 4, 8 0, 12 0 C16 0, 22 4, 24 12 C22 14, 18 16, 12 16 C6 16, 2 14, 0 12Z" fill="hsl(var(--terracotta))" fillOpacity="0.25" />
        <line x1="12" y1="1" x2="12" y2="15" stroke="hsl(var(--terracotta))" strokeWidth="0.5" strokeOpacity="0.3" />
      </g>
      {/* Right wave line */}
      <path d="M240 16 Q270 8, 300 16 T360 16" stroke="hsl(var(--sand-dark))" strokeWidth="0.8" fill="none" />
    </svg>
  </div>
);

export default ShellDivider;
