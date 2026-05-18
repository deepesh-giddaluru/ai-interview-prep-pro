export function Logo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="32" cy="32" r="31" fill="#f3f4f6" stroke="#3b82f6" strokeWidth="1" />

      {/* Brain/Head shape */}
      <path
        d="M 32 12 C 38 12 42 16 42 22 L 42 28 C 42 32 40 35 36 37 L 36 45 C 36 47.2 34.2 48 32 48 C 29.8 48 28 47.2 28 45 L 28 37 C 24 35 22 32 22 28 L 22 22 C 22 16 26 12 32 12 Z"
        fill="#3b82f6"
        opacity="0.8"
      />

      {/* Brain sections */}
      <circle cx="27" cy="20" r="2.5" fill="#ffffff" opacity="0.7" />
      <circle cx="37" cy="20" r="2.5" fill="#ffffff" opacity="0.7" />
      <circle cx="24" cy="26" r="2.5" fill="#ffffff" opacity="0.7" />
      <circle cx="40" cy="26" r="2.5" fill="#ffffff" opacity="0.7" />
      <circle cx="32" cy="25" r="2" fill="#ffffff" opacity="0.6" />

      {/* Chat bubble */}
      <rect x="20" y="34" width="24" height="14" rx="3" fill="#10b981" opacity="0.9" />
      <polygon
        points="20,48 16,52 20,50"
        fill="#10b981"
        opacity="0.9"
      />

      {/* Chat dots in bubble */}
      <circle cx="26" cy="41" r="1.5" fill="#ffffff" />
      <circle cx="32" cy="41" r="1.5" fill="#ffffff" />
      <circle cx="38" cy="41" r="1.5" fill="#ffffff" />

      {/* Spark/AI accent */}
      <g opacity="0.8">
        <circle cx="48" cy="18" r="1.5" fill="#f59e0b" />
        <line x1="48" y1="14" x2="48" y2="10" stroke="#f59e0b" strokeWidth="1" />
        <line x1="52" y1="18" x2="56" y2="18" stroke="#f59e0b" strokeWidth="1" />
        <line x1="51" y1="15" x2="54" y2="12" stroke="#f59e0b" strokeWidth="1" />
      </g>
    </svg>
  );
}
