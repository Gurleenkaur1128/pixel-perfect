import { useEffect, useLayoutEffect, useRef, useState } from "react";

import heroPoster from "@/assets/hero-highway.jpg";
import { AwButton } from "@/components/aw/ui";
import { cn } from "@/lib/utils";

const CITIES = [
  { name: "Los Angeles", t: 0.08 },
  { name: "Dallas", t: 0.37 },
  { name: "Chicago", t: 0.64 },
  { name: "New York", t: 0.92 },
];

const ROUTE = "M 36 34 C 220 34 340 52 600 40 C 860 28 1000 24 1164 38";

function HeroRoute({ show }: { show: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = useState<{ name: string; x: number; y: number }[]>([]);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    const measure = () => {
      const length = path.getTotalLength();
      const box = svg.getBoundingClientRect();
      const view = svg.viewBox.baseVal;
      if (!box.width || !view.width) return;
      setPoints(
        CITIES.map((city) => {
          const point = path.getPointAtLength(length * city.t);
          return {
            name: city.name,
            x: (point.x / view.width) * box.width,
            y: (point.y / view.height) * box.height,
          };
        }),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 hidden md:block">
      <div className="container-aw">
        <div className="relative h-[4.5rem]">
          <svg
            ref={svgRef}
            viewBox="0 0 1200 72"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <path
              ref={pathRef}
              d={ROUTE}
              fill="none"
              stroke="var(--route)"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: 1400,
                strokeDashoffset: show ? 0 : 1400,
                transition: "stroke-dashoffset 2200ms cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </svg>
          {points.map((point) => (
            <div
              key={point.name}
              className="absolute -translate-x-1/2"
              style={{
                left: point.x,
                top: point.y,
                opacity: show ? 1 : 0,
                transition: "opacity 800ms ease",
              }}
            >
              <span className="mx-auto block h-2 w-2 -translate-y-1/2 rounded-full bg-route ring-4 ring-route/25" />
              <span className="mt-2 block whitespace-nowrap text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-on-navy/80">
                {point.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [150, 550, 900, 1250, 1650].map((ms, i) =>
      window.setTimeout(() => setStage(i + 1), ms),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const on = (s: number) => stage >= s;
  const fade = (s: number) =>
    cn(
      "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
      on(s) ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
    );

  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-navy-deep">
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover object-[68%_center]"
          src="/brand/hero-truck.mp4"
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,38,96,0.94)_0%,rgba(20,38,96,0.76)_30%,rgba(20,38,96,0.32)_58%,rgba(20,38,96,0.06)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,38,96,0.55)_0%,transparent_45%)]" />
      </div>

      <div className="container-aw flex min-h-[100svh] flex-col justify-center pb-24 pt-28 max-[840px]:pb-16 max-[840px]:pt-24">
        <div className="max-w-[560px]">
        <div className={cn("eyebrow flex items-center gap-4 text-on-navy/80", fade(1))}>
          <span className="h-px w-10 bg-route" />
          Specialized furniture transportation
        </div>

        <h1 className="display h-hero mt-5 max-w-[560px] text-on-navy">
          {["Delivering", "on your", "Promises"].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <span
                className={cn(
                  "block transition-transform duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === 2 && "text-route",
                  on(i + 2) ? "translate-y-0" : "translate-y-full",
                )}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className={cn("body-copy mt-5 max-w-[460px] text-on-navy/85", fade(4))}>
          Specialized furniture transportation and final-mile logistics built around your
          reputation.
        </p>

        <div className={cn("mt-7 flex flex-wrap gap-3", fade(5))}>
          <AwButton href="#quote">Request a Quote</AwButton>
          <AwButton href="#track" tone="ghost-light" arrow="↗">
            Track Shipment
          </AwButton>
        </div>
        </div>
      </div>

      <HeroRoute show={on(5)} />
    </section>
  );
}
