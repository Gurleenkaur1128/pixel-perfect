import blanketWrap from "@/assets/blanket-wrap.jpg";
import delivery from "@/assets/delivery.jpg";
import fleet from "@/assets/fleet.jpg";
import heroHighway from "@/assets/hero-highway.jpg";
import warehouse from "@/assets/warehouse.jpg";
import finalMile from "@/assets/final-mile.jpg";
import { SectionLabel } from "@/components/aw/ui";
import { useSectionProgress } from "@/hooks/use-reveal";

const SERVICES = [
  {
    no: "01",
    title: "B2B / LTL",
    copy: "Consolidated less-than-truckload capacity between manufacturers, retailers and hubs.",
    image: heroHighway,
  },
  {
    no: "02",
    title: "Final Mile",
    copy: "Scheduled residential delivery with trained two-person teams.",
    image: delivery,
  },
  {
    no: "03",
    title: "Blanket Wrap",
    copy: "Pad-wrapped, strapped and decked without cartons or forklifts.",
    image: blanketWrap,
  },
  {
    no: "04",
    title: "Warehousing",
    copy: "Dedicated furniture storage, inspection and staging space.",
    image: warehouse,
  },
  {
    no: "05",
    title: "Pool Distribution",
    copy: "Regional pools that shorten transit and reduce handling.",
    image: fleet,
  },
  {
    no: "06",
    title: "Logistics",
    copy: "Visibility, routing and reporting across the whole program.",
    image: finalMile,
  },
];

export function Services() {
  const { ref, progress } = useSectionProgress<HTMLDivElement>();
  const shift = progress * (SERVICES.length - 1);

  return (
    <section id="services" ref={ref} className="relative bg-background" style={{ height: "520vh" }}>
      <div className="sticky top-0 flex min-h-[100svh] flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-[1600px] px-6 pt-24 md:px-10 md:pt-28">
          <SectionLabel index="05 /" label="Services" />
          <h2 className="display mt-6 max-w-2xl text-[clamp(2rem,5vw,4.5rem)]">
            Built to move
            <br />
            more than <span className="text-primary">freight.</span>
          </h2>
        </div>

        {/* Desktop: horizontal panels driven by scroll */}
        <div className="mt-12 hidden flex-1 items-center overflow-hidden md:flex">
          <div
            className="flex w-max gap-6 px-10 will-change-transform"
            style={{ transform: `translate3d(calc(${-shift} * (44vw + 1.5rem)), 0, 0)` }}
          >
            {SERVICES.map((s, i) => {
              const distance = Math.abs(i - shift);
              const scale = 1 - Math.min(0.08, distance * 0.05);
              return (
                <article
                  key={s.no}
                  className="group relative h-[58vh] w-[44vw] shrink-0 overflow-hidden bg-navy"
                  style={{
                    transform: `scale(${scale})`,
                    transition: "transform 300ms linear",
                  }}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/35 to-transparent" />
                  <div className="relative flex h-full flex-col justify-between p-8">
                    <span className="display text-5xl text-primary">{s.no}</span>
                    <div>
                      <h3 className="display text-[clamp(1.75rem,3.2vw,3rem)] text-on-navy">
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel">{s.copy}</p>
                      <span className="mt-6 inline-flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.2em] text-on-navy">
                        Explore Service
                        <span className="arrow-slide group-hover:translate-x-1.5 text-primary">
                          &#8594;
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mx-auto hidden w-full max-w-[1600px] items-center gap-4 px-10 pb-12 md:flex">
          <span className="eyebrow text-muted-foreground">
            {String(Math.round(shift) + 1).padStart(2, "0")} / 06
          </span>
          <span className="relative h-px flex-1 bg-border">
            <span
              className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-300"
              style={{ width: `${(shift / (SERVICES.length - 1)) * 100}%` }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}

export function ServicesMobile() {
  return (
    <section className="bg-background px-6 pb-20 md:hidden">
      <div className="flex flex-col gap-4">
        {SERVICES.map((s) => (
          <article key={s.no} className="relative h-[62vh] overflow-hidden bg-navy">
            <img
              src={s.image}
              alt={s.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-6">
              <span className="display text-4xl text-primary">{s.no}</span>
              <div>
                <h3 className="display text-3xl text-on-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{s.copy}</p>
                <span className="mt-5 inline-flex items-center gap-3 text-[0.625rem] uppercase tracking-[0.2em] text-on-navy">
                  Explore Service <span className="text-primary">&#8594;</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
