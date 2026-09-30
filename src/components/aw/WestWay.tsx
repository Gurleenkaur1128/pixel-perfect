import delivery from "@/assets/delivery.jpg";
import { SectionLabel } from "@/components/aw/ui";
import { useInView, useRevealRoot } from "@/hooks/use-reveal";

const STOPS = ["Store", "Showroom", "Final Mile"];

export function WestWay() {
  const root = useRevealRoot<HTMLElement>();
  const { ref, inView } = useInView<HTMLDivElement>(0.4);

  return (
    <section id="about" ref={root} className="section-y overflow-hidden bg-background">
      <div className="container-aw grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-14">
        <div>
          <SectionLabel index="01 /" label="The American West Way" className="reveal text-ink" data-reveal />
          <h2 className="display h-section reveal mt-5 text-primary" data-reveal data-reveal-delay="120">
            Your business is anything <span className="text-route">but</span> average
          </h2>
          <p className="body-copy reveal mt-5 max-w-lg text-muted-foreground" data-reveal data-reveal-delay="240">
            Your business is unique. Whether you ship to a store, a showroom, a distribution center,
            a manufacturer or a final-mile home delivery, American West handles the specialized
            transportation behind every channel.
          </p>

          <div ref={ref} className="relative mt-14 max-w-lg">
            <svg viewBox="0 0 500 40" className="absolute inset-x-0 top-0 h-10 w-full" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M 8 20 C 120 4 180 36 250 20 C 320 4 380 36 492 20"
                fill="none"
                stroke="var(--route)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: 600,
                  strokeDashoffset: inView ? 0 : 600,
                  transition: "stroke-dashoffset 2200ms cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </svg>
            <div className="relative flex justify-between pt-[13px]">
              {STOPS.map((s, i) => (
                <div
                  key={s}
                  className="flex flex-col items-center transition-all duration-1000"
                  style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(10px)", transitionDelay: `${400 + i * 450}ms` }}
                >
                  <span className="block h-3.5 w-3.5 rounded-full border-[3px] border-route bg-background" />
                  <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
                    <span className="mr-1.5 text-route">0{i + 1}</span>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reveal-mask relative mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-sm lg:max-h-[560px] lg:max-w-none" data-reveal>
          <img
            src={delivery}
            alt="American West specialists carrying a sofa into a home"
            loading="lazy"
            width={1600}
            height={1008}
            className="h-full max-h-[620px] w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 bg-primary px-5 py-4 text-on-navy">
            <p className="eyebrow text-on-navy/70">Multi-channel fulfillment</p>
            <p className="display mt-1.5 text-xl">Store to doorstep.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
