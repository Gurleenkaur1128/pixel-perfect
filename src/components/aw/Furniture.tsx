import { useEffect, useRef, useState } from "react";

import chair from "@/assets/chair.png";
import { SectionLabel } from "@/components/aw/ui";
import { useRevealRoot } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const CALLOUTS = [
  { no: "01", label: "Blanket Wrapped", top: "16%", side: "left" },
  { no: "02", label: "Specialized Handling", top: "36%", side: "right" },
  { no: "03", label: "Forklift-Free Approach", top: "56%", side: "left" },
  { no: "04", label: "Final Mile", top: "72%", side: "right" },
  { no: "05", label: "White Glove Delivery", top: "88%", side: "left" },
] as const;

export function Furniture() {
  const root = useRevealRoot<HTMLElement>();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      setTilt({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 14,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * -10,
      });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-muted py-24 md:py-32">
      <span className="display pointer-events-none absolute -left-4 bottom-0 select-none text-[22vw] leading-none text-foreground/[0.04]">
        Furniture
      </span>

      <div className="relative mx-auto grid max-w-[1600px] gap-16 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <SectionLabel index="06 /" label="Built for Furniture" className="reveal" data-reveal />
          <h2 className="display reveal mt-8 text-[clamp(3rem,8vw,8rem)]" data-reveal>
            Built
            <br />
            for
            <br />
            <span className="text-primary">Furniture.</span>
          </h2>
          <p
            className="reveal mt-10 max-w-md text-base leading-relaxed text-muted-foreground"
            data-reveal
            data-reveal-delay="150"
          >
            Every process in our network is designed around large, high-value, easily damaged goods
            &mdash; not boxes on a pallet.
          </p>
        </div>

        <div ref={stageRef} className="relative min-h-[520px]">
          <div
            className="reveal-scale absolute inset-0 grid place-items-center"
            data-reveal
            style={{
              transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transition: "transform 900ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <img
              src={chair}
              alt="Premium leather lounge chair"
              loading="lazy"
              width={1200}
              height={1200}
              className="w-[78%] max-w-[520px] drop-shadow-[0_40px_60px_rgba(7,21,33,0.18)]"
            />
          </div>

          {CALLOUTS.map((c, i) => (
            <div
              key={c.no}
              className={cn(
                "reveal absolute flex items-center gap-3",
                c.side === "left" ? "left-0" : "right-0 flex-row-reverse",
              )}
              data-reveal
              data-reveal-delay={300 + i * 180}
              style={{ top: c.top }}
            >
              <span className="eyebrow text-primary">{c.no}</span>
              <span className="text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/80">
                {c.label}
              </span>
              <span
                className={cn(
                  "h-px bg-primary/60",
                  c.side === "left" ? "w-10 md:w-16" : "w-10 md:w-16",
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
