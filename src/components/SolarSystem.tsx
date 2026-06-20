import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";

type Planet = {
  name: string;
  size: number; // px
  orbit: number; // px radius
  duration: number; // seconds
  color: string;
  ring?: boolean;
  glow?: string;
  startAngle?: number;
};

const PLANETS: Planet[] = [
  { name: "Mercury", size: 14, orbit: 90,  duration: 12, color: "radial-gradient(circle at 30% 30%, #d7c3a8, #6b5a45)", startAngle: 20 },
  { name: "Venus",   size: 22, orbit: 130, duration: 20, color: "radial-gradient(circle at 30% 30%, #ffe2a8, #c98a2b)", glow: "rgba(255,200,120,.5)", startAngle: 110 },
  { name: "Earth",   size: 26, orbit: 180, duration: 28, color: "radial-gradient(circle at 30% 30%, #7ec8ff 0%, #1d6fd1 55%, #0a2a55 100%)", glow: "rgba(120,190,255,.6)", startAngle: 200 },
  { name: "Mars",    size: 20, orbit: 230, duration: 38, color: "radial-gradient(circle at 30% 30%, #ff9a6b, #9b3a1a)", glow: "rgba(255,120,80,.4)", startAngle: 300 },
  { name: "Jupiter", size: 48, orbit: 310, duration: 60, color: "radial-gradient(circle at 30% 30%, #f3d9b1, #b06a2f 70%, #5a2f15)", glow: "rgba(240,200,140,.5)", startAngle: 40 },
  { name: "Saturn",  size: 42, orbit: 390, duration: 85, color: "radial-gradient(circle at 30% 30%, #f0e2b8, #b89855 70%, #6e5024)", ring: true, glow: "rgba(240,220,170,.5)", startAngle: 150 },
  { name: "Uranus",  size: 32, orbit: 460, duration: 115, color: "radial-gradient(circle at 30% 30%, #cdeff5, #5cb6c8 70%, #1f6b7a)", glow: "rgba(150,220,235,.5)", startAngle: 240 },
  { name: "Neptune", size: 30, orbit: 525, duration: 150, color: "radial-gradient(circle at 30% 30%, #a9c3ff, #2b54c7 70%, #0d1f5b)", glow: "rgba(120,160,255,.55)", startAngle: 330 },
];

function DraggablePlanet({ planet }: { planet: Planet }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [returning, setReturning] = useState(false);
  const [hover, setHover] = useState(false);
  const startRef = useRef<{ px: number; py: number; dx: number; dy: number } | null>(null);

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setReturning(false);
    startRef.current = {
      px: e.clientX,
      py: e.clientY,
      dx: drag?.x ?? 0,
      dy: drag?.y ?? 0,
    };
    setDrag({ x: startRef.current.dx, y: startRef.current.dy });
  };

  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!startRef.current) return;
    const s = startRef.current;
    setDrag({ x: s.dx + (e.clientX - s.px), y: s.dy + (e.clientY - s.py) });
  };

  const onPointerUp = () => {
    if (!startRef.current) return;
    startRef.current = null;
    setReturning(true);
    setDrag({ x: 0, y: 0 });
    window.setTimeout(() => setReturning(false), 900);
  };

  const ringColor = planet.glow ?? "rgba(255,255,255,.25)";

  return (
    <div
      className="orbit"
      style={{
        width: planet.orbit * 2,
        height: planet.orbit * 2,
        marginLeft: -planet.orbit,
        marginTop: -planet.orbit,
        animationDuration: `${planet.duration}s`,
        animationDelay: `${-(planet.startAngle ?? 0) / 360 * planet.duration}s`,
      }}
    >
      <div
        ref={wrapRef}
        className="planet-anchor"
        style={{ transform: `translate(${planet.orbit}px, 0)` }}
      >
        <div
          className="planet-drag"
          style={{
            transform: `translate(${drag?.x ?? 0}px, ${drag?.y ?? 0}px)`,
            transition: returning ? "transform .9s cubic-bezier(.22,1.4,.36,1)" : drag ? "none" : "transform .3s ease",
            width: planet.size,
            height: planet.size,
            marginLeft: -planet.size / 2,
            marginTop: -planet.size / 2,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          title={planet.name}
        >
          <div
            className="planet-body"
            style={{
              background: planet.color,
              boxShadow: `0 0 ${planet.size * 0.9}px ${ringColor}, inset -${planet.size * 0.18}px -${planet.size * 0.18}px ${planet.size * 0.35}px rgba(0,0,0,.55)`,
              transform: hover ? "scale(1.18)" : "scale(1)",
            }}
          />
          {planet.ring && (
            <div
              className="planet-ring"
              style={{
                width: planet.size * 2.2,
                height: planet.size * 0.55,
                marginLeft: -(planet.size * 2.2) / 2,
                marginTop: -(planet.size * 0.55) / 2,
              }}
            />
          )}
          <span className="planet-label" style={{ opacity: hover ? 1 : 0 }}>
            {planet.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SolarSystem() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (root.current) {
          const y = window.scrollY;
          root.current.style.transform = `translate3d(${y * 0.04}px, ${y * 0.18}px, 0) rotate(${y * 0.02}deg)`;
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

  // Drag the sun too
  const [sunDrag, setSunDrag] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [sunReturn, setSunReturn] = useState(false);
  const sunStart = useRef<{ px: number; py: number; dx: number; dy: number } | null>(null);

  const sunDown = (e: RPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setSunReturn(false);
    sunStart.current = { px: e.clientX, py: e.clientY, dx: sunDrag.x, dy: sunDrag.y };
  };
  const sunMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!sunStart.current) return;
    const s = sunStart.current;
    setSunDrag({ x: s.dx + (e.clientX - s.px), y: s.dy + (e.clientY - s.py) });
  };
  const sunUp = () => {
    if (!sunStart.current) return;
    sunStart.current = null;
    setSunReturn(true);
    setSunDrag({ x: 0, y: 0 });
    window.setTimeout(() => setSunReturn(false), 900);
  };

  return (
    <div
      aria-hidden="true"
      className="solar-root pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div ref={root} className="solar-stage">
        <div className="solar-center">
          {PLANETS.map((p) => (
            <div
              key={p.name}
              className="orbit-track"
              style={{
                width: p.orbit * 2,
                height: p.orbit * 2,
                marginLeft: -p.orbit,
                marginTop: -p.orbit,
              }}
            />
          ))}
          {PLANETS.map((p) => (
            <DraggablePlanet key={p.name} planet={p} />
          ))}
          <div
            className="sun"
            style={{
              transform: `translate(${sunDrag.x}px, ${sunDrag.y}px)`,
              transition: sunReturn ? "transform .9s cubic-bezier(.22,1.4,.36,1)" : sunStart.current ? "none" : "transform .3s ease",
            }}
            onPointerDown={sunDown}
            onPointerMove={sunMove}
            onPointerUp={sunUp}
            onPointerCancel={sunUp}
            title="Sun"
          >
            <div className="sun-core" />
            <div className="sun-corona" />
          </div>
        </div>
      </div>
    </div>
  );
}
