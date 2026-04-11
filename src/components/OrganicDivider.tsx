/** Organic SVG divider between sections */
const OrganicDivider = ({ color = "hsl(var(--secondary) / 0.3)" }: { color?: string }) => (
  <div className="flex items-center justify-center py-4">
    <svg width="200" height="24" viewBox="0 0 200 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 12 C30 4, 50 20, 80 12 S130 4, 160 12 S190 20, 200 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="100" cy="12" r="3" fill={color} />
    </svg>
  </div>
);

export default OrganicDivider;
