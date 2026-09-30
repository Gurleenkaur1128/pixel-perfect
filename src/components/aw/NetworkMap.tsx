import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import us from "us-atlas/states-albers-10m.json";

import { SectionLabel } from "@/components/aw/ui";
import { useInView } from "@/hooks/use-reveal";

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
  { d: arc("Dallas", "Atlanta"), c: "var(--route)", dur: 6 },
  { d: arc("Atlanta", "New York"), c: "var(--route)", dur: 6 },
  { d: arc("Los Angeles", "Chicago", 0.18), c: "var(--steel)", dur: 10 },
  { d: arc("Chicago", "New York"), c: "var(--steel)", dur: 6 },
  { d: arc("Dallas", "Chicago", 0.2), c: "var(--steel)", dur: 7 },
];

const STATS = [
  { v: "48", l: "Contiguous states" },
  { v: "100+", l: "Years combined experience" },
  { v: "Furniture", l: "Specialized delivery" },
];

export function NetworkMap() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section id="network" className="relative overflow-hidden bg-navy-deep py-20 text-on-navy lg:py-24">
      <div className="container-aw">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
          <div>
            <SectionLabel index="04 /" label="Nationwide" />
            <h2 className="display h-section mt-6">
              Nationwide delivery <span className="text-route">success</span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-on-navy/70">
            Specialized furniture transportation and final-mile coverage across the continental
            United States.
          </p>
        </div>

        <div ref={ref} className="relative mx-auto mt-10 w-full max-w-[920px]">
          <svg viewBox="0 0 975 610" className="h-auto w-full" role="img" aria-label="Map of the continental United States with American West delivery routes">
            <path d={NATION} fill="var(--navy)" stroke="color-mix(in oklab, var(--steel) 40%, transparent)" strokeWidth="1" />
            <path d={BORDERS} fill="none" stroke="color-mix(in oklab, var(--steel) 18%, transparent)" strokeWidth="0.6" />

            {ROUTES.map((r, i) => (
              <g key={i}>
                <path
                  id={`nr-${i}`}
                  d={r.d}
                  fill="none"
                  stroke={r.c}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity={0.85}
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: inView ? 0 : 1,
                    transition: `stroke-dashoffset 1800ms cubic-bezier(0.16,1,0.3,1) ${500 + i * 200}ms`,
                  }}
                />
                {inView && (
                  <circle r="3.2" fill="var(--on-navy)">
                    <animateMotion dur={`${r.dur}s`} begin={`${2 + i * 0.4}s`} repeatCount="indefinite">
                      <mpath href={`#nr-${i}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            ))}

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
                  style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}
                >
                  {c.name}
                </text>
              </g>
            ))}
          </svg>
          <p className="mt-2 text-center text-[0.6875rem] uppercase tracking-[0.2em] text-on-navy/40">
            Representative coverage routes
          </p>
        </div>

        <div className="mt-10 grid border-t border-on-navy/15 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <div key={s.l} className={i ? "border-on-navy/15 pt-6 sm:border-l sm:pl-8" : "pt-6"}>
              <p className="display text-[clamp(1.75rem,3vw,2.5rem)] text-route">{s.v}</p>
              <p className="eyebrow mt-2 text-on-navy/70">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
