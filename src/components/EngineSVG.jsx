export default function EngineSVG({ className, width = 120, height = 90 }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 120 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Engine block body */}
      <rect x="20" y="30" width="80" height="40" />

      {/* Cylinders (3) */}
      <rect x="28" y="14" width="16" height="18" />
      <rect x="52" y="14" width="16" height="18" />
      <rect x="76" y="14" width="16" height="18" />

      {/* Cylinder tops */}
      <line x1="28" y1="14" x2="44" y2="14" />
      <line x1="52" y1="14" x2="68" y2="14" />
      <line x1="76" y1="14" x2="92" y2="14" />

      {/* Intake manifold across top */}
      <path d="M30 14 Q60 4 90 14" />

      {/* Exhaust ports on side */}
      <line x1="20" y1="40" x2="8" y2="40" />
      <line x1="20" y1="50" x2="8" y2="50" />
      <line x1="20" y1="60" x2="8" y2="60" />

      {/* Crankshaft outline (bottom) */}
      <path d="M25 70 L35 76 L45 70 L55 76 L65 70 L75 76 L85 70 L95 76" />

      {/* Oil pan */}
      <path d="M25 70 L25 82 Q60 86 95 82 L95 70" />

      {/* Accessory pulley right side */}
      <circle cx="108" cy="48" r="8" />
      <line x1="100" y1="48" x2="96" y2="48" />

      {/* Timing cover detail */}
      <line x1="20" y1="35" x2="14" y2="35" />
      <line x1="14" y1="35" x2="14" y2="55" />
      <line x1="14" y1="55" x2="20" y2="55" />
    </svg>
  )
}
