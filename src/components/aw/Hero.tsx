import { useEffect, useState } from "react";

import heroPoster from "@/assets/hero-highway.jpg";
import { AwButton } from "@/components/aw/ui";
import { cn } from "@/lib/utils";

const CITIES = [
  { name: "Los Angeles", x: 6 },
  { name: "Dallas", x: 36 },
  { name: "Chicago", x: 64 },
  { name: "New York", x: 94 },
];

const ROUTE = "M 72 60 C 250 60 330 100 432 92 C 560 82 640 30 768 36 C 900 42 1000 70 1128 56";

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

      {/* Signature route line — static, no truck */}
      <div className="pointer-events-none absolute inset-x-0 bottom-2">
        <div className="container-aw relative">
          <div className="relative hidden h-[4.75rem] md:block">
            <svg viewBox="0 0 1200 110" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path
                d={ROUTE}
                fill="none"
                stroke="var(--route)"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: 1400,
                  strokeDashoffset: on(5) ? 0 : 1400,
                  transition: "stroke-dashoffset 2400ms cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </svg>
            {CITIES.map((c, i) => (
              <div
                key={c.name}
                className={cn("absolute top-0 -translate-x-1/2 transition-opacity duration-1000", on(5) ? "opacity-100" : "opacity-0")}
                style={{ left: `${c.x}%`, top: i % 2 ? "46%" : "8%", transitionDelay: `${500 + i * 250}ms` }}
              >
                <span className="mx-auto block h-2 w-2 rounded-full bg-route ring-4 ring-route/20" />
                <span className="mt-2.5 block whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-on-navy/60">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-3 text-on-navy/70 md:absolute md:-top-16 md:left-10">
            <span className="relative h-10 w-px overflow-hidden bg-on-navy/25">
              <span className="absolute inset-x-0 top-0 h-4 animate-[scroll-cue_2.4s_ease-in-out_infinite] bg-route" />
            </span>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em]">Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}
