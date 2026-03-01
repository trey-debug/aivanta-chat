export default function TransmissionSVG({ className, width = 120, height = 90 }) {
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
      {/* Gear 1 — large, left-center */}
      <circle cx="38" cy="45" r="22" />
      {/* Gear 1 teeth */}
      <line x1="38" y1="20" x2="38" y2="14" />
      <line x1="38" y1="70" x2="38" y2="76" />
      <line x1="13" y1="45" x2="7"  y2="45" />
      <line x1="63" y1="45" x2="69" y2="45" />
      <line x1="21" y1="28" x2="16" y2="23" />
      <line x1="55" y1="62" x2="60" y2="67" />
      <line x1="21" y1="62" x2="16" y2="67" />
      <line x1="55" y1="28" x2="60" y2="23" />
      {/* Gear 1 hub */}
      <circle cx="38" cy="45" r="6" />

      {/* Gear 2 — medium, top-right */}
      <circle cx="82" cy="24" r="14" />
      {/* Gear 2 teeth */}
      <line x1="82" y1="8"  x2="82" y2="4"  />
      <line x1="82" y1="40" x2="82" y2="44" />
      <line x1="66" y1="24" x2="62" y2="24" />
      <line x1="98" y1="24" x2="102" y2="24" />
      <line x1="71" y1="13" x2="68" y2="10" />
      <line x1="93" y1="35" x2="96" y2="38" />
      <line x1="71" y1="35" x2="68" y2="38" />
      <line x1="93" y1="13" x2="96" y2="10" />
      {/* Gear 2 hub */}
      <circle cx="82" cy="24" r="4" />

      {/* Gear 3 — small, bottom-right */}
      <circle cx="86" cy="68" r="12" />
      {/* Gear 3 teeth */}
      <line x1="86" y1="54" x2="86" y2="50" />
      <line x1="86" y1="82" x2="86" y2="86" />
      <line x1="72" y1="68" x2="68" y2="68" />
      <line x1="100" y1="68" x2="104" y2="68" />
      {/* Gear 3 hub */}
      <circle cx="86" cy="68" r="3.5" />

      {/* Shaft lines */}
      <line x1="38" y1="45" x2="38" y2="45" />
      <line x1="6"  y1="45" x2="7"  y2="45" />
    </svg>
  )
}
