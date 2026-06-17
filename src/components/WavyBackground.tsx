import { useEffect, useRef } from "react";

export default function WavyBackground() {
  const layer1 = useRef<SVGGElement>(null);
  const layer2 = useRef<SVGGElement>(null);
  const layer3 = useRef<SVGGElement>(null);
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);

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
