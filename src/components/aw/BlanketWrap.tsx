import blanket from "@/assets/blanket-wrap.jpg";
import { SectionLabel } from "@/components/aw/ui";
import { useInView } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const CALLOUTS = [
  { label: "Blanket wrap", note: "Every piece padded and wrapped by hand", side: "l", top: 22, px: 42, py: 30 },
  { label: "Specialized handling", note: "Skilled associates, furniture-trained", side: "l", top: 68, px: 38, py: 66 },
  { label: "Forklift-free", note: "A fork-lift free environment, always", side: "r", top: 26, px: 60, py: 38 },
  { label: "Damage prevention", note: "Delivered as it left the vendor", side: "r", top: 70, px: 62, py: 70 },
] as const;

export function BlanketWrap() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <section className="section-y relative overflow-hidden bg-navy text-on-navy">
      <div className="container-aw">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <SectionLabel index="02 /" label="Blanket Wrap" />
            <h2 className="display h-section mt-7">
              Protecting your brand with <span className="text-route">blanket wrap</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-on-navy/75 md:text-lg lg:justify-self-end">
            Our skilled associates handle every piece of furniture as if it is going into their own
            home &mdash; so it arrives without damage, keeping you and your customers happy.
          </p>
        </div>

        <div ref={ref} className="relative mt-14 lg:mt-20">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[640px] overflow-hidden rounded-sm lg:aspect-square lg:max-w-[520px]">
            <img
              src={blanket}
              alt="Armchair wrapped in blue moving blankets"
              loading="lazy"
              className={cn(
                "h-full w-full object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                inView ? "scale-100" : "scale-110",
              )}
            />
          </div>

          {/* Desktop callouts */}
          <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {CALLOUTS.map((c, i) => {
              const x2 = c.side === "l" ? 24 : 76;
              return (
                <g key={c.label}>
                  <line
                    x1={c.px}
                    y1={c.py}
                    x2={x2}
                    y2={c.top + 4}
                    stroke="var(--route)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    style={{
                      strokeDasharray: 1,
                      strokeDashoffset: inView ? 0 : 1,
                      transition: `stroke-dashoffset 1200ms cubic-bezier(0.16,1,0.3,1) ${600 + i * 250}ms`,
                    }}
                  />
                </g>
              );
            })}
          </svg>
          {CALLOUTS.map((c, i) => (
            <div key={c.label}>
              <span
                className="absolute hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-route ring-4 ring-route/25 transition-opacity duration-700 lg:block"
                style={{ left: `${c.px}%`, top: `${c.py}%`, opacity: inView ? 1 : 0, transitionDelay: `${400 + i * 250}ms` }}
              />
              <div
                className={cn(
                  "absolute hidden w-[20%] transition-all duration-1000 lg:block",
                  c.side === "l" ? "left-0 text-right" : "right-0",
                )}
                style={{ top: `${c.top}%`, opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(8px)", transitionDelay: `${900 + i * 250}ms` }}
              >
                <p className="eyebrow text-route">{c.label}</p>
                <p className="mt-2 text-sm text-on-navy/70">{c.note}</p>
              </div>
            </div>
          ))}

          {/* Mobile list */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:hidden">
            {CALLOUTS.map((c) => (
              <div key={c.label} className="border-l-2 border-route pl-4">
                <p className="eyebrow text-route">{c.label}</p>
                <p className="mt-1.5 text-sm text-on-navy/70">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
