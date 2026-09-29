import { useState } from "react";

import { SectionLabel } from "@/components/aw/ui";
import { useInView } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const USA =
  "M 112 70 L 150 150 L 140 210 L 178 300 L 250 330 L 330 350 L 400 372 L 445 340 L 520 348 L 600 360 L 690 370 L 720 420 L 760 455 L 775 400 L 800 330 L 840 270 L 862 215 L 905 150 L 930 95 L 860 78 L 700 62 L 400 52 Z";

type Hub = {
  id: string;
  name: string;
  x: number;
  y: number;
  roles: string[];
};

const HUBS: Hub[] = [
  { id: "sea", name: "Seattle", x: 148, y: 100, roles: ["Regional Distribution", "LTL Linehaul"] },
  {
    id: "lax",
    name: "Los Angeles",
    x: 170,
    y: 282,
    roles: ["Regional Distribution", "Warehousing", "Final Mile"],
  },
  { id: "dal", name: "Dallas", x: 452, y: 330, roles: ["Pool Distribution", "Warehousing"] },
  { id: "chi", name: "Chicago", x: 618, y: 168, roles: ["Linehaul Hub", "Final Mile"] },
  { id: "atl", name: "Atlanta", x: 714, y: 300, roles: ["Pool Distribution", "Final Mile"] },
  { id: "nyc", name: "New York", x: 872, y: 158, roles: ["Final Mile", "White Glove"] },
  { id: "mia", name: "Miami", x: 758, y: 428, roles: ["Regional Distribution"] },
];

const ROUTES = [
  { id: "r1", d: "M 170 282 C 290 320 360 330 452 330", dur: "11s" },
  { id: "r2", d: "M 452 330 C 520 280 560 210 618 168", dur: "8s" },
  { id: "r3", d: "M 618 168 C 700 150 790 150 872 158", dur: "7s" },
  { id: "r4", d: "M 452 330 C 540 330 650 320 714 300", dur: "9s" },
  { id: "r5", d: "M 714 300 C 740 350 750 390 758 428", dur: "6s" },
  { id: "r6", d: "M 148 100 C 300 120 460 130 618 168", dur: "12s" },
];

export function NetworkMap() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const [active, setActive] = useState<Hub | null>(null);

  return (
    <section id="network" ref={ref} className="relative overflow-hidden bg-navy py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--steel) 60%, transparent) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionLabel index="03 /" label="Nationwide Network" className="text-on-navy" />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
          <h2 className="display text-[clamp(2.75rem,7.5vw,7.5rem)] text-on-navy">
            From coast
            <br />
            to <span className="text-primary">coast.</span>
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-steel">
            One connected network. Built to keep every shipment moving &mdash; from vendor pickup to
            the customer&rsquo;s door.
          </p>
        </div>

        <div className="relative mt-14">
          <svg
            viewBox="0 0 1000 500"
            className="w-full overflow-visible"
            role="img"
            aria-label="Stylized map of the United States showing American West distribution hubs and routes"
          >
            <path
              d={USA}
              fill="color-mix(in oklab, var(--navy-soft) 90%, transparent)"
              stroke="color-mix(in oklab, var(--steel) 45%, transparent)"
              strokeWidth="1.5"
              style={{
                strokeDasharray: 4200,
                strokeDashoffset: inView ? 0 : 4200,
                transition: "stroke-dashoffset 3200ms cubic-bezier(0.16,1,0.3,1)",
              }}
            />

            {ROUTES.map((r, i) => (
              <g key={r.id}>
                <path
                  id={r.id}
                  d={r.d}
                  fill="none"
                  stroke="var(--route)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity={0.75}
                  style={{
                    strokeDasharray: 1400,
                    strokeDashoffset: inView ? 0 : 1400,
                    transition: `stroke-dashoffset 2200ms cubic-bezier(0.16,1,0.3,1) ${1200 + i * 220}ms`,
                  }}
                />
                {inView && (
                  <circle r="3.2" fill="var(--route)">
                    <animateMotion
                      dur={r.dur}
                      begin={`${2 + i * 0.6}s`}
                      repeatCount="indefinite"
                      rotate="auto"
                    >
                      <mpath href={`#${r.id}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            ))}

            {HUBS.map((h, i) => (
              <g
                key={h.id}
                className="cursor-pointer"
                onMouseEnter={() => setActive(h)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(h)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                style={{
                  opacity: inView ? 1 : 0,
                  transition: `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${900 + i * 220}ms`,
                }}
              >
                <circle cx={h.x} cy={h.y} r="16" fill="transparent" />
                <circle
                  cx={h.x}
                  cy={h.y}
                  r="5"
                  fill="var(--route)"
                  className="origin-center"
                  style={{
                    animation: "hub-pulse 3.6s ease-out infinite",
                    animationDelay: `${i * 0.5}s`,
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                />
                <circle cx={h.x} cy={h.y} r="3.4" fill="var(--route)" />
                <text
                  x={h.x}
                  y={h.y - 14}
                  textAnchor="middle"
                  className="fill-current text-[11px] uppercase"
                  style={{
                    letterSpacing: "0.18em",
                    fill:
                      active?.id === h.id
                        ? "var(--on-navy)"
                        : "color-mix(in oklab, var(--steel) 80%, transparent)",
                  }}
                >
                  {h.name}
                </text>
              </g>
            ))}
          </svg>

          <div
            className={cn(
              "pointer-events-none absolute left-0 bottom-0 w-64 border-l-2 border-primary bg-navy-soft/90 p-5 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:left-auto md:right-0",
              active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <p className="display text-xl text-on-navy">{active?.name ?? "Los Angeles"}</p>
            <ul className="mt-3 space-y-1.5">
              {(active?.roles ?? ["Regional Distribution"]).map((r) => (
                <li key={r} className="text-[0.6875rem] uppercase tracking-[0.18em] text-steel">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-[0.625rem] uppercase tracking-[0.2em] text-steel/60">
          Hubs shown are illustrative of network coverage.
        </p>
      </div>
    </section>
  );
}
