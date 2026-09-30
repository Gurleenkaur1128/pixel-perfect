import { useEffect, useState } from "react";

import heroHighway from "@/assets/hero-highway.jpg";
import { useScrollY } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const CITIES = [
  { name: "Los Angeles", x: 8, y: 62 },
  { name: "Dallas", x: 38, y: 74 },
  { name: "Chicago", x: 64, y: 38 },
  { name: "New York", x: 92, y: 50 },
];

const ROUTE = "M 40 300 C 260 300 300 150 560 170 C 800 188 900 320 1160 240";

export function Hero() {
  const [stage, setStage] = useState(0);
  const y = useScrollY();

  useEffect(() => {
    const timers = [200, 700, 1150, 1600, 2100].map((ms, i) =>
      window.setTimeout(() => setStage(i + 1), ms),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const on = (s: number) => stage >= s;

  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-navy">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroHighway}
          alt="American West semi truck on a western interstate at sunrise"
          width={1920}
          height={1088}
          className="drift h-full w-full object-cover"
          style={{ transform: `translate3d(0, ${y * 0.12}px, 0)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-navy/40" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,transparent,color-mix(in_oklab,var(--navy)_55%,transparent))]" />
      </div>

      <div className="mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-end px-6 pb-16 pt-32 md:px-10 md:pb-20">
        <div
          className={cn(
            "eyebrow flex items-center gap-4 text-on-navy/70 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            on(1) ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <span className="text-primary">01 /</span>
          <span>Nationwide furniture logistics</span>
        </div>

        <h1 className="display mt-8 text-on-navy">
          {["Delivering", "on your", "Promises."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span
                className={cn(
                  "block text-[clamp(3rem,13vw,10.5rem)] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === 2 && "text-primary",
                  on(i + 2) ? "translate-y-0" : "translate-y-full",
                )}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 border-t border-white/12 pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <p
            className={cn(
              "max-w-xl text-base leading-relaxed text-steel transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] md:text-lg",
              on(4) ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
            )}
          >
            Specialized furniture transportation and final-mile logistics built around your
            reputation.
          </p>

          <div
            className={cn(
              "flex flex-wrap items-center gap-4 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
              on(5) ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
            )}
          >
            <a
              href="#quote"
              className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors duration-500 hover:bg-primary/90"
            >
              Request a Quote
              <span className="arrow-slide group-hover:translate-x-1.5">&#8594;</span>
            </a>
            <a
              href="#track"
              className="group inline-flex items-center gap-3 border border-white/25 px-8 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-on-navy transition-colors duration-500 hover:border-primary hover:text-primary"
            >
              Track Shipment
              <span className="arrow-slide group-hover:-translate-y-1">&#8599;</span>
            </a>
          </div>
        </div>

        {/* Route line linking the coast-to-coast cities */}
        <div className="relative mt-14 hidden h-[120px] md:block">
          <svg
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <path
              id="hero-route"
              d={ROUTE}
              fill="none"
              stroke="var(--route)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                strokeDasharray: 2000,
                strokeDashoffset: on(5) ? 0 : 2000,
                transition: "stroke-dashoffset 2600ms cubic-bezier(0.16,1,0.3,1)",
              }}
            />
            {on(5) && (
              <g>
                <rect x="-11" y="-7" width="22" height="14" rx="1.5" fill="var(--route)" />
                <rect x="-11" y="-7" width="8" height="14" rx="1.5" fill="var(--on-navy)" />
                <animateMotion dur="9s" repeatCount="indefinite" begin="1.4s" rotate="auto">
                  <mpath href="#hero-route" />
                </animateMotion>
              </g>
            )}
          </svg>

          <div className="absolute inset-0">
            {CITIES.map((c, i) => (
              <div
                key={c.name}
                className={cn(
                  "absolute -translate-x-1/2 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  on(5) ? "opacity-100" : "translate-y-3 opacity-0",
                )}
                style={{ left: `${c.x}%`, top: `${c.y}%`, transitionDelay: `${600 + i * 300}ms` }}
              >
                <span className="mx-auto block h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="mt-3 block whitespace-nowrap text-[0.625rem] uppercase tracking-[0.2em] text-steel">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center gap-3 text-steel md:mt-8">
          <span className="text-[0.625rem] uppercase tracking-[0.24em]">Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/20">
            <span className="absolute inset-x-0 top-0 h-4 animate-[route-dash_2.4s_linear_infinite] bg-primary" />
          </span>
        </div>
      </div>
    </section>
  );
}
