/** Botanical gold divider between sections */
const OrganicDivider = () => (
  <div className="flex items-center justify-center py-6">
    <svg width="240" height="24" viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left petal */}
      <path d="M95 12 C90 6, 80 8, 75 12 C80 16, 90 18, 95 12Z" fill="hsl(var(--primary))" fillOpacity="0.2" />
      {/* Right petal */}
      <path d="M145 12 C150 6, 160 8, 165 12 C160 16, 150 18, 145 12Z" fill="hsl(var(--secondary))" fillOpacity="0.2" />
      {/* Center line */}
      <line x1="40" y1="12" x2="100" y2="12" stroke="hsl(var(--primary))" strokeOpacity="0.3" strokeWidth="1" />
      <line x1="140" y1="12" x2="200" y2="12" stroke="hsl(var(--primary))" strokeOpacity="0.3" strokeWidth="1" />
      {/* Center dot */}
      <circle cx="120" cy="12" r="2.5" fill="hsl(var(--primary))" fillOpacity="0.5" />
    </svg>
  </div>
);

export default OrganicDivider;
