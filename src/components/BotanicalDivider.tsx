/* Botanical SVG divider between sections */
const BotanicalDivider = () => (
  <div className="relative py-8 flex items-center justify-center overflow-hidden">
    <svg width="320" height="40" viewBox="0 0 320 40" fill="none" className="text-primary/25">
      {/* Center flower */}
      <circle cx="160" cy="20" r="4" fill="currentColor" fillOpacity="0.4" />
      <ellipse cx="160" cy="12" rx="3" ry="6" fill="currentColor" fillOpacity="0.25" />
      <ellipse cx="160" cy="28" rx="3" ry="6" fill="currentColor" fillOpacity="0.25" />
      <ellipse cx="152" cy="20" rx="6" ry="3" fill="currentColor" fillOpacity="0.25" />
      <ellipse cx="168" cy="20" rx="6" ry="3" fill="currentColor" fillOpacity="0.25" />
      
      {/* Left stem with leaves */}
      <line x1="145" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <ellipse cx="110" cy="16" rx="8" ry="4" transform="rotate(-20 110 16)" fill="currentColor" fillOpacity="0.15" />
      <ellipse cx="80" cy="24" rx="8" ry="4" transform="rotate(15 80 24)" fill="currentColor" fillOpacity="0.15" />
      
      {/* Right stem with leaves */}
      <line x1="175" y1="20" x2="280" y2="20" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
      <ellipse cx="210" cy="16" rx="8" ry="4" transform="rotate(20 210 16)" fill="currentColor" fillOpacity="0.15" />
      <ellipse cx="240" cy="24" rx="8" ry="4" transform="rotate(-15 240 24)" fill="currentColor" fillOpacity="0.15" />
      
      {/* Small buds */}
      <circle cx="50" cy="20" r="2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="270" cy="20" r="2" fill="currentColor" fillOpacity="0.2" />
    </svg>
  </div>
);

export default BotanicalDivider;
