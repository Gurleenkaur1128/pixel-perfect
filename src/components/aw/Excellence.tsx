import fleet from "@/assets/fleet.jpg";
import highway from "@/assets/hero-highway.jpg";
import warehouse from "@/assets/warehouse.jpg";
import { useRevealRoot } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const ROWS = [
  {
    t: "Remaining Specialized",
    d: "Staying committed to furniture brands and partners, we maintain our loyalty and expertise to provide quality deliveries, competitive transits and a low claims ratio.",
    img: warehouse,
    alt: "Wrapped furniture staged in an American West warehouse",
  },
  {
    t: "A Team of Professionals",
    d: "Our loyalty to those we serve is embraced by team members who exhibit a culture of giving, professionalism and respect.",
    img: fleet,
    alt: "American West fleet at the terminal at dawn",
  },
  {
    t: "Delivery Excellence",
    d: "Blending the 100+ years of combined experience from our family of specialized furniture carriers, American West extends a solid reputation for delivery success.",
    img: highway,
    alt: "Truck on an open interstate at sunrise",
  },
];

export function Excellence() {
  const root = useRevealRoot<HTMLElement>();
  return (
    <section ref={root} className="section-y bg-background">
      <div className="container-aw space-y-16 lg:space-y-[5.25rem]">
        {ROWS.map((r, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={r.t} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <div className={cn("lg:col-span-5", flip ? "lg:order-2 lg:col-start-8" : "lg:col-start-1")}>
                <p className="reveal display text-sm text-route" data-reveal>0{i + 1}</p>
                <h3 className="display reveal mt-3 text-[clamp(32px,3vw,44px)] leading-[0.98] text-primary" data-reveal>
                  {r.t}
                </h3>
                <span className="reveal mt-6 block h-0.5 w-14 bg-route" data-reveal />
                <p className="body-copy reveal mt-5 max-w-md text-muted-foreground" data-reveal>
                  {r.d}
                </p>
              </div>
              <div
                className={cn(
                  "reveal-mask h-[260px] overflow-hidden rounded-sm sm:h-[340px] lg:col-span-6 lg:h-[440px]",
                  flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7",
                )}
                data-reveal
              >
                <img src={r.img} alt={r.alt} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
