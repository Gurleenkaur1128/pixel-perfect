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
      <div className="container-aw space-y-20 lg:space-y-28">
        {ROWS.map((r, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={r.t} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <div className={cn("lg:col-span-5", flip ? "lg:order-2 lg:col-start-8" : "lg:col-start-1")}>
                <p className="reveal display text-sm text-route" data-reveal>0{i + 1}</p>
                <h3 className="display reveal mt-4 text-[clamp(1.875rem,3vw,2.625rem)] text-primary" data-reveal>
                  {r.t}
                </h3>
                <span className="reveal mt-6 block h-0.5 w-14 bg-route" data-reveal />
                <p className="reveal mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg" data-reveal>
                  {r.d}
                </p>
              </div>
              <div
                className={cn(
                  "reveal-mask aspect-[16/10] overflow-hidden rounded-sm lg:col-span-6",
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
