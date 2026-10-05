import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import us from "us-atlas/states-albers-10m.json";

import { SectionLabel } from "@/components/aw/ui";
import { useInView } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const topo = us as unknown as Topology<{ states: GeometryCollection; nation: GeometryCollection }>;
const path = geoPath();
const NATION = path(feature(topo, topo.objects.nation)) ?? "";
const BORDERS = path(mesh(topo, topo.objects.states, (a, b) => a !== b)) ?? "";

const projection = geoAlbersUsa().scale(1300).translate([487.5, 305]);
const CITY_COORDS: Record<string, [number, number]> = {
  "Los Angeles": [-118.24, 34.05],
  Dallas: [-96.8, 32.78],
  Chicago: [-87.63, 41.88],
  Atlanta: [-84.39, 33.75],
  "New York": [-74.0, 40.71],
};
const CITIES = Object.entries(CITY_COORDS).map(([name, c]) => {
  const [x, y] = projection(c) ?? [0, 0];
  return { name, x, y };
});
const at = (n: string) => CITIES.find((c) => c.name === n)!;

function arc(a: string, b: string, lift = 0.22) {
  const p = at(a);
  const q = at(b);
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2 - Math.hypot(q.x - p.x, q.y - p.y) * lift;
  return `M ${p.x} ${p.y} Q ${mx} ${my} ${q.x} ${q.y}`;
}

const ROUTES = [
  { d: arc("Los Angeles", "Dallas"), c: "var(--route)", dur: 7 },
  { d: arc("Dallas", "Atlanta"), c: "var(--route)", dur: 6.4 },
  { d: arc("Atlanta", "New York"), c: "var(--route)", dur: 6.2 },
  { d: arc("Los Angeles", "Chicago", 0.18), c: "rgba(255,255,255,0.45)", dur: 10 },
  { d: arc("Chicago", "New York"), c: "rgba(255,255,255,0.45)", dur: 6.6 },
  { d: arc("Dallas", "Chicago", 0.2), c: "rgba(255,255,255,0.45)", dur: 7.4 },
];

const REQUESTS = [
  { label: "New Request", city: "Los Angeles", dx: 108, dy: -28, delay: "0s" },
  { label: "Pickup Request", city: "Dallas", dx: 10, dy: 30, delay: "2.3s" },
  { label: "Quote Request", city: "Chicago", dx: -40, dy: 24, delay: "4.6s" },
  { label: "Delivery Request", city: "New York", dx: -70, dy: -8, delay: "6.4s" },
];

const STATS = [
  { v: "48", l: "Contiguous states" },
  { v: "100+", l: "Years combined experience" },
  { v: "Furniture", l: "Specialized furniture delivery" },
];

function MapTruck({ href, dur, begin }: { href: string; dur: number; begin: number }) {
  return (
    <g>
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} rotate="auto" repeatCount="indefinite">
        <mpath href={href} />
      </animateMotion>
      <g transform="scale(1.15)">
        <rect x="-16" y="-5" width="20" height="10" rx="1" fill="#ffffff" stroke="#2D419A" strokeWidth="0.8" />
        <rect x="-16" y="-0.8" width="20" height="2" fill="#F3692B" />
        <path d="M4 -4 H10 L14.5 0 V5 H4 Z" fill="#2D419A" />
        <rect x="9" y="-2.6" width="3" height="2.4" fill="#E7ECFA" />
        <circle cx="-8" cy="5.2" r="1.5" fill="#142660" />
        <circle cx="1.5" cy="5.2" r="1.5" fill="#142660" />
        <circle cx="11" cy="5.2" r="1.5" fill="#142660" />
      </g>
    </g>
  );
}

export function NetworkMap() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section id="network" className="aw-network relative flex min-h-[100svh] flex-col justify-start overflow-hidden bg-navy pb-16 pt-8 text-on-navy lg:pb-20 lg:pt-10">
      <div
        ref={ref}
        className={cn(
          "container-aw transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          inView ? "translate-y-0 opacity-100" : "translate-y-[80px] opacity-0",
        )}
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
          <div>
            <SectionLabel index="03 /" label="Nationwide" />
            <h2 className="display h-section mt-5">
              Nationwide delivery <span className="text-route">success</span>
            </h2>
          </div>
          <p className="body-copy max-w-sm text-on-navy/70">
            Specialized furniture transportation and final-mile coverage across the continental
            United States.
          </p>
        </div>

        <div
          className={cn(
            "relative mx-auto mt-8 w-full max-w-[800px] origin-center transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            inView ? "scale-100" : "scale-[1.03]",
          )}
        >
          <div className="relative">
          <svg viewBox="0 0 975 610" className="mx-auto h-auto w-full max-h-[min(52vh,460px)]" role="img" aria-label="Map of the continental United States with American West delivery routes">
            <defs>
              <filter id="aw-route-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.2" />
              </filter>
            </defs>
            <path d={NATION} fill="color-mix(in srgb, var(--blue) 72%, var(--navy))" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
            <path d={BORDERS} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" />

            {ROUTES.map((r, i) => {
              const active = i < 3;
              const offsets = r.dur >= 7 ? [0, r.dur / 2] : [0];
              return (
              <g key={i}>
                {active && (
                  <path
                    d={r.d}
                    fill="none"
                    stroke="#F3692B"
                    strokeWidth="7"
                    strokeLinecap="round"
                    opacity={inView ? 0.4 : 0}
                    filter="url(#aw-route-glow)"
                    pathLength={1}
                    style={{
                      strokeDasharray: 1,
                      strokeDashoffset: inView ? 0 : 1,
                      transition: `stroke-dashoffset 1800ms cubic-bezier(0.16,1,0.3,1) ${500 + i * 200}ms, opacity 800ms ease`,
                    }}
                  />
                )}
                <path
                  id={`nr-${i}`}
                  d={r.d}
                  fill="none"
                  stroke={r.c}
                  strokeWidth={active ? 2.1 : 1.3}
                  strokeLinecap="round"
                  opacity={0.9}
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: inView ? 0 : 1,
                    transition: `stroke-dashoffset 1800ms cubic-bezier(0.16,1,0.3,1) ${500 + i * 200}ms`,
                  }}
                />
                {inView &&
                  offsets.map((offset) => (
                    <MapTruck key={offset} href={`#nr-${i}`} dur={r.dur} begin={-(i * 1.15 + offset)} />
                  ))}
              </g>
            );})}

            {CITIES.map((c, i) => (
              <g key={c.name} style={{ opacity: inView ? 1 : 0, transition: `opacity 900ms ease ${300 + i * 150}ms` }}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r="6"
                  fill="var(--route)"
                  style={{ animation: "hub-pulse 3.6s ease-out infinite", animationDelay: `${i * 0.6}s`, transformBox: "fill-box", transformOrigin: "center" }}
                />
                <circle cx={c.x} cy={c.y} r="5" fill="var(--route)" stroke="var(--navy-deep)" strokeWidth="2" />
                <text
                  x={c.x}
                  y={c.y + (c.name === "Chicago" || c.name === "New York" ? -16 : 24)}
                  textAnchor="middle"
                  fill="var(--on-navy)"
                  style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}
                >
                  {c.name}
                </text>
              </g>
            ))}
          </svg>
          {inView && (
            <div className="pointer-events-none absolute inset-0">
              {REQUESTS.map((request) => {
                const city = at(request.city);
                return (
                  <div
                    key={`${request.city}-${request.delay}`}
                    className="aw-request absolute"
                    style={{
                      left: `${((city.x + request.dx) / 975) * 100}%`,
                      top: `${((city.y + request.dy) / 610) * 100}%`,
                      animationDelay: request.delay,
                    }}
                  >
                    <span className="aw-pin-pop">
                      <span className="aw-request-card">{request.label}</span>
                      <svg className="aw-pin" viewBox="0 0 48 68" aria-hidden="true">
                        <ellipse cx="24" cy="62" rx="11" ry="3.2" fill="none" stroke="#e23b3b" strokeWidth="1.6" />
                        <path
                          d="M24 2.5c-9.4 0-17 7.5-17 16.8C7 32.2 24 56 24 56s17-23.8 17-36.7C41 10 33.4 2.5 24 2.5z"
                          fill="#e53935"
                        />
                        <circle cx="24" cy="19.2" r="6.4" fill="#ffffff" />
                      </svg>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          </div>
          <p className="mt-2 text-center text-[0.6875rem] uppercase tracking-[0.2em] text-on-navy/40">
            Representative coverage routes
          </p>
        </div>

        <div className="mt-10 grid border-t border-on-navy/15 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <div key={s.l} className={i ? "border-on-navy/15 pt-6 sm:border-l sm:pl-8" : "pt-6"}>
              <p className="display text-[clamp(1.6rem,2.4vw,2.15rem)] text-route">{s.v}</p>
              <p className="eyebrow mt-2 text-on-navy/70">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
