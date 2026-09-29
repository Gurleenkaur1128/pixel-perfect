import { useEffect, useRef, useState } from "react";

import { useInView } from "@/hooks/use-reveal";

export function FinalCta() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      setOffset({
        x: Math.max(-16, Math.min(16, (e.clientX - (rect.left + rect.width / 2)) / 14)),
        y: Math.max(-12, Math.min(12, (e.clientY - (rect.top + rect.height / 2)) / 14)),
      });
    };
    const reset = () => setOffset({ x: 0, y: 0 });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <section id="quote" ref={ref} className="relative overflow-hidden bg-background py-32 md:py-48">
      <svg
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M 600 -20 C 600 120 200 180 220 300 C 240 410 640 380 640 470"
          fill="none"
          stroke="var(--route)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1800,
            strokeDashoffset: inView ? 0 : 1800,
            transition: "stroke-dashoffset 3000ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <circle
          cx="640"
          cy="470"
          r="5"
          fill="var(--route)"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 600ms ease 2600ms" }}
        />
      </svg>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="eyebrow flex items-center gap-4">
          <span className="text-primary">09 /</span>
          <span className="opacity-60">Final Mile</span>
        </div>

        <h2 className="display mt-10 text-[clamp(3.5rem,13vw,11rem)]">
          Ready
          <br />
          to <span className="text-primary">move?</span>
        </h2>

        <p className="mt-10 max-w-md text-base leading-relaxed text-muted-foreground">
          Let&rsquo;s build a smarter transportation and delivery program.
        </p>

        <div className="mt-20 flex flex-col items-start gap-12 lg:flex-row lg:items-end lg:justify-between">
          <a
            ref={ctaRef}
            href="#quote"
            className="display group flex items-end gap-6 text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.9] transition-colors duration-500 hover:text-primary"
          >
            <span>
              Request
              <br />
              a Quote
            </span>
            <span
              className="mb-2 text-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
            >
              &#8600;
            </span>
          </a>

          <div className="flex flex-col gap-6">
            <a
              href="#track"
              className="group inline-flex items-center gap-3 border-b border-foreground/25 pb-3 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors duration-500 hover:border-primary hover:text-primary"
            >
              Track a Shipment
              <span className="arrow-slide group-hover:-translate-y-1">&#8599;</span>
            </a>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="eyebrow text-primary">Delivered.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
