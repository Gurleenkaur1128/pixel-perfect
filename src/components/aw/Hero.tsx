import { useEffect, useState } from "react";

import heroPoster from "@/assets/hero-highway.jpg";
import { AwButton } from "@/components/aw/ui";
import { cn } from "@/lib/utils";

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
          src="/brand/hero-main.mp4"
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

      <div className="container-aw flex min-h-[100svh] flex-col justify-center pb-16 pt-28 max-[840px]:pt-24">
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
        </div>
        </div>
      </div>
    </section>
  );
}
