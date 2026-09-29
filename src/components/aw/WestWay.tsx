import blanketWrap from "@/assets/blanket-wrap.jpg";
import { SectionLabel } from "@/components/aw/ui";
import { useSectionProgress } from "@/hooks/use-reveal";

export function WestWay() {
  const { ref, progress } = useSectionProgress<HTMLDivElement>();

  // Visual grows from ~38% to full-bleed as the section scrolls through.
  const eased = Math.min(1, progress * 1.25);
  const width = 38 + eased * 62;
  const overlay = Math.max(0, (eased - 0.45) / 0.45);

  return (
    <section id="about" ref={ref} className="relative h-[260vh] bg-background">
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1600px] gap-14 px-6 py-24 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <SectionLabel index="02 /" label="The American West Way" />
            <h2 className="display mt-8 text-[clamp(2.75rem,7vw,7rem)]">
              The
              <br />
              American
              <br />
              West Way.
            </h2>
            <p className="mt-10 max-w-md text-xl leading-snug font-medium md:text-2xl">
              Furniture isn&rsquo;t ordinary freight. So we don&rsquo;t move it like ordinary
              freight.
            </p>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Blanket-wrap handling, forklift-free loading, dedicated distribution and a final-mile
              network trained on high-value goods. Every piece is treated as though it were the last
              one on the truck.
            </p>
            <div className="mt-10 grid max-w-md grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-8">
              {["Blanket wrap", "Final mile", "Pool distribution", "Warehousing"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-1 w-6 bg-primary" />
                  <span className="text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-end">
            <div
              className="relative aspect-[4/5] overflow-hidden bg-navy"
              style={{
                width: `${width}%`,
                minWidth: "220px",
                transition: "width 120ms linear",
              }}
            >
              <img
                src={blanketWrap}
                alt="A leather armchair being blanket wrapped for transport"
                loading="lazy"
                width={1280}
                height={1600}
                className="h-full w-full object-cover"
                style={{ transform: `scale(${1.12 - eased * 0.1})` }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-navy/55 px-6"
                style={{ opacity: overlay }}
              >
                <p className="display text-center text-[clamp(1.5rem,3.4vw,3.5rem)] text-on-navy">
                  Specialized.
                  <br />
                  <span className="text-primary">Protected.</span>
                  <br />
                  Delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
