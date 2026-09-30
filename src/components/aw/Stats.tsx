import { useEffect, useState } from "react";

import { useInView } from "@/hooks/use-reveal";

export function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1800);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <section className="bg-primary py-20 text-on-navy lg:py-24">
      <div ref={ref} className="container-aw flex flex-wrap items-end justify-between gap-8">
        <p className="display text-[clamp(4.5rem,11vw,9rem)] leading-[0.85]">
          {n}
          <span className="text-route">+</span>
          <span className="ml-4 align-top text-[0.35em]">Years</span>
        </p>
        <div className="max-w-sm">
          <p className="eyebrow text-route">Combined delivery experience</p>
          <p className="mt-3 text-base leading-relaxed text-on-navy/80">
            From our family of specialized furniture carriers &mdash; one solid reputation for
            delivery success.
          </p>
        </div>
      </div>
    </section>
  );
}
