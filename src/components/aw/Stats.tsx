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
    <section className="bg-primary py-14 text-on-navy lg:py-16">
      <div ref={ref} className="container-aw flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <p className="display text-[clamp(64px,8vw,110px)] leading-none">
          {n}
          <span className="text-route">+</span>
        </p>
        <div className="max-w-sm">
          <p className="display text-[clamp(18px,2vw,28px)] leading-tight">Combined delivery experience</p>
          <p className="mt-3 text-[15px] leading-relaxed text-on-navy/80">
            From our family of specialized furniture carriers &mdash; one solid reputation for
            delivery success.
          </p>
        </div>
      </div>
    </section>
  );
}
