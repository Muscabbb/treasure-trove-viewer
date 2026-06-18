import { useEffect, useRef } from "react";

export default function WavyBackground() {
  const layer1 = useRef<SVGGElement>(null);
  const layer2 = useRef<SVGGElement>(null);
  const layer3 = useRef<SVGGElement>(null);
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);
  const earth = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (layer1.current) layer1.current.style.transform = `translate3d(0, ${y * -0.15}px, 0)`;
        if (layer2.current) layer2.current.style.transform = `translate3d(0, ${y * -0.3}px, 0)`;
        if (layer3.current) layer3.current.style.transform = `translate3d(0, ${y * -0.5}px, 0)`;
        if (blob1.current) blob1.current.style.transform = `translate3d(0, ${y * -0.2}px, 0)`;
        if (blob2.current) blob2.current.style.transform = `translate3d(0, ${y * -0.35}px, 0)`;
        if (earth.current) {
          // Earth drifts down slightly and rotates as you scroll
          earth.current.style.transform = `translate3d(${y * 0.05}px, ${y * 0.4}px, 0) rotate(${y * 0.05}deg)`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="wavy-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div ref={blob1} className="parallax-blob parallax-blob-1" />
      <div ref={blob2} className="parallax-blob parallax-blob-2" />

      {/* Animated Planet Earth with parallax */}
      <div ref={earth} className="earth-wrap">
        <div className="earth-glow" />
        <svg
          className="earth-svg"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="ocean" cx="35%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#7ec8ff" />
              <stop offset="55%" stopColor="#1d6fd1" />
              <stop offset="100%" stopColor="#0a2a55" />
            </radialGradient>
            <radialGradient id="atmosphere" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor="rgba(120,190,255,0)" />
              <stop offset="92%" stopColor="rgba(120,190,255,0.55)" />
              <stop offset="100%" stopColor="rgba(120,190,255,0)" />
            </radialGradient>
            <radialGradient id="shading" cx="30%" cy="30%" r="80%">
              <stop offset="50%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.65)" />
            </radialGradient>
            <clipPath id="globe-clip">
              <circle cx="100" cy="100" r="78" />
            </clipPath>
          </defs>

          {/* Atmospheric halo */}
          <circle cx="100" cy="100" r="92" fill="url(#atmosphere)" />

          {/* Ocean sphere */}
          <circle cx="100" cy="100" r="78" fill="url(#ocean)" />

          {/* Continents — rotates inside the globe */}
          <g clipPath="url(#globe-clip)">
            <g className="earth-continents">
              {/* Two copies side-by-side to create seamless rotation */}
              <g fill="#3aa856">
                {/* tile 1 */}
                <path d="M30 95 q10 -22 32 -18 q14 3 18 16 q5 14 -8 22 q-18 11 -32 2 q-14 -8 -10 -22 Z" />
                <path d="M85 70 q14 -10 28 -4 q14 6 12 22 q-2 12 -16 14 q-18 2 -24 -10 q-6 -12 0 -22 Z" />
                <path d="M130 110 q12 -4 20 6 q8 12 0 22 q-10 12 -22 6 q-12 -6 -8 -20 q2 -10 10 -14 Z" />
                <path d="M55 140 q14 -8 26 -2 q10 6 6 16 q-6 14 -22 12 q-16 -2 -18 -12 q-2 -8 8 -14 Z" />
                {/* tile 2 (offset by 160 for seamless loop) */}
                <path d="M190 95 q10 -22 32 -18 q14 3 18 16 q5 14 -8 22 q-18 11 -32 2 q-14 -8 -10 -22 Z" />
                <path d="M245 70 q14 -10 28 -4 q14 6 12 22 q-2 12 -16 14 q-18 2 -24 -10 q-6 -12 0 -22 Z" />
                <path d="M290 110 q12 -4 20 6 q8 12 0 22 q-10 12 -22 6 q-12 -6 -8 -20 q2 -10 10 -14 Z" />
                <path d="M215 140 q14 -8 26 -2 q10 6 6 16 q-6 14 -22 12 q-16 -2 -18 -12 q-2 -8 8 -14 Z" />
              </g>
            </g>

            {/* Clouds — slower rotation */}
            <g className="earth-clouds" opacity="0.55">
              <g fill="#ffffff">
                <ellipse cx="60" cy="70" rx="22" ry="5" />
                <ellipse cx="120" cy="90" rx="28" ry="6" />
                <ellipse cx="80" cy="125" rx="20" ry="5" />
                <ellipse cx="150" cy="135" rx="18" ry="4" />
                <ellipse cx="220" cy="70" rx="22" ry="5" />
                <ellipse cx="280" cy="90" rx="28" ry="6" />
                <ellipse cx="240" cy="125" rx="20" ry="5" />
                <ellipse cx="310" cy="135" rx="18" ry="4" />
              </g>
            </g>

            {/* Spherical shading overlay */}
            <circle cx="100" cy="100" r="78" fill="url(#shading)" />
          </g>

          {/* Rim highlight */}
          <circle
            cx="100"
            cy="100"
            r="78"
            fill="none"
            stroke="rgba(180,220,255,0.35)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <svg
        className="wavy-svg absolute inset-x-0 bottom-0 h-[140%] w-full"
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
          <g ref={layer1} className="parallax-layer">
            <path className="wave wave-1" fill="url(#wave-grad-1)" d="" />
          </g>
          <g ref={layer2} className="parallax-layer">
            <path className="wave wave-2" fill="url(#wave-grad-2)" d="" />
          </g>
          <g ref={layer3} className="parallax-layer">
            <path className="wave wave-3" fill="url(#wave-grad-3)" d="" />
          </g>
        </g>
      </svg>
    </div>
  );
}
