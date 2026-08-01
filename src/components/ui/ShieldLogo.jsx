/**
 * ShieldLogo - the OMSS brand mark.
 * A shield rendered entirely in SVG (no external image assets),
 * used in the navbar, sidebar, invoice header, and favicon.
 */
export default function ShieldLogo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Orange Multipurpose Security Service shield logo"
    >
      <defs>
        <linearGradient id="omssShieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      <path
        d="M32 3 L56 12 V29 C56 45 46 55 32 61 C18 55 8 45 8 29 V12 Z"
        fill="url(#omssShieldGrad)"
        stroke="#0A2E8A"
        strokeWidth="2.5"
      />
      <path
        d="M32 10 L49 17 V29.5 C49 41.5 41.5 49.5 32 54 C22.5 49.5 15 41.5 15 29.5 V17 Z"
        fill="#0A2E8A"
        opacity="0.12"
      />
      <text
        x="32"
        y="38"
        fontFamily="Sora, Arial, sans-serif"
        fontWeight="800"
        fontSize="18"
        fill="#ffffff"
        textAnchor="middle"
      >
        OMSS
      </text>
    </svg>
  )
}
