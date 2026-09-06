type AppLogoProps = {
  size?: number;
};

/**
 * Elegant mark: rounded frame + workflow hub
 * (resume → AI orchestrator → ranked candidate)
 */
export function AppLogo({ size = 36 }: AppLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGold" x1="8" y1="8" x2="40" y2="40">
          <stop offset="0%" stopColor="#FFD95A" />
          <stop offset="50%" stopColor="#F5C518" />
          <stop offset="100%" stopColor="#C9A000" />
        </linearGradient>
        <linearGradient id="logoGlow" x1="24" y1="10" x2="24" y2="38">
          <stop offset="0%" stopColor="#FFD95A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F5C518" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Outer frame */}
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="11"
        fill="#0A0A0A"
        stroke="url(#logoGold)"
        strokeWidth="1.25"
      />

      {/* Workflow spine */}
      <path
        d="M24 13.5V34.5"
        stroke="url(#logoGlow)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Top node — intake */}
      <circle cx="24" cy="13.5" r="2.75" fill="#0A0A0A" stroke="#FFD95A" strokeWidth="1.25" />

      {/* Center hub — AI orchestrator */}
      <circle cx="24" cy="24" r="4.25" fill="url(#logoGold)" />
      <circle cx="24" cy="24" r="1.5" fill="#0A0A0A" opacity="0.85" />

      {/* Bottom node — outcome */}
      <circle cx="24" cy="34.5" r="2.75" fill="#0A0A0A" stroke="#FFD95A" strokeWidth="1.25" />

      {/* Agent branches */}
      <path
        d="M24 24L33.5 18.5M24 24L14.5 18.5M24 24L33.5 29.5M24 24L14.5 29.5"
        stroke="#F5C518"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Branch endpoints */}
      <circle cx="33.5" cy="18.5" r="1.35" fill="#FFD95A" />
      <circle cx="14.5" cy="18.5" r="1.35" fill="#FFD95A" />
      <circle cx="33.5" cy="29.5" r="1.35" fill="#FFD95A" />
      <circle cx="14.5" cy="29.5" r="1.35" fill="#FFD95A" />
    </svg>
  );
}
