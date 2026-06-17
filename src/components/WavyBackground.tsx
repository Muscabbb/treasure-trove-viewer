export default function WavyBackground() {
  return (
    <div
      aria-hidden="true"
      className="wavy-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <svg
        className="wavy-svg absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wave-grad-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" className="wave-stop-1a" />
            <stop offset="100%" className="wave-stop-1b" />
          </linearGradient>
          <linearGradient id="wave-grad-2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" className="wave-stop-2a" />
            <stop offset="100%" className="wave-stop-2b" />
          </linearGradient>
          <linearGradient id="wave-grad-3" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" className="wave-stop-3a" />
            <stop offset="100%" className="wave-stop-3b" />
          </linearGradient>
          <filter id="wave-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>

        <g filter="url(#wave-blur)">
          <path className="wave wave-1" fill="url(#wave-grad-1)" d="" />
          <path className="wave wave-2" fill="url(#wave-grad-2)" d="" />
          <path className="wave wave-3" fill="url(#wave-grad-3)" d="" />
        </g>
      </svg>
    </div>
  );
}
