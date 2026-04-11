/** Small starfish SVG for use as bullet points */
export const StarfishBullet = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`inline-block shrink-0 ${className}`}>
    <path
      d="M12 1 L14 8.5 L22 10 L15.5 14 L17 22 L12 17 L7 22 L8.5 14 L2 10 L10 8.5Z"
      fill="hsl(var(--terracotta))"
      fillOpacity="0.6"
    />
  </svg>
);

export default StarfishBullet;
