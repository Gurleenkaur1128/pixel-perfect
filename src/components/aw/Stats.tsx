import { useEffect, useState } from "react";

import warehouse from "@/assets/warehouse.jpg";
import { SectionLabel } from "@/components/aw/ui";
import { useInView } from "@/hooks/use-reveal";

const STATS = [
  { value: 100, suffix: "+", label: "Years of combined experience" },
  { value: 48, suffix: "", label: "States served", placeholder: true },
  { value: 12, suffix: "", label: "Service locations", placeholder: true },
  { value: 250, suffix: "K+", label: "Deliveries completed", placeholder: true },
];

function Counter({ to, suffix, run }: { to: number; suffix: string; run: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run) return;
    const duration = 2200;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, to]);

  return (
    <span className="display text-[clamp(3.5rem,11vw,9rem)] leading-none">
      {n}
      <span className="text-primary">{suffix}</span>
    </span>
  );
}

export function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionLabel index="07 /" label="Experience" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
          <div className="divide-y divide-border">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 py-7"
              >
                <Counter to={s.value} suffix={s.suffix} run={inView} />
                <div className="pb-3 text-right">
                  <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {s.label}
                  </p>
                  {s.placeholder && (
                    <p className="mt-1 text-[0.5625rem] uppercase tracking-[0.2em] text-muted-foreground/60">
                      Indicative
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="relative aspect-[4/5] overflow-hidden bg-navy">
            <img
              src={warehouse}
              alt="Furniture distribution warehouse interior"
              loading="lazy"
              width={1600}
              height={1008}
              className="drift h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/25" />
          </div>
        </div>
      </div>
    </section>
  );
}
