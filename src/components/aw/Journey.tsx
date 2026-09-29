import delivery from "@/assets/delivery.jpg";
import finalMile from "@/assets/final-mile.jpg";
import fleet from "@/assets/fleet.jpg";
import warehouse from "@/assets/warehouse.jpg";
import blanketWrap from "@/assets/blanket-wrap.jpg";
import { SectionLabel } from "@/components/aw/ui";
import { useSectionProgress } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    no: "01",
    title: "Order Received",
    copy: "A retailer order enters the network and is scheduled against vendor capacity.",
    image: blanketWrap,
  },
  {
    no: "02",
    title: "Vendor Pickup",
    copy: "Our drivers collect from the manufacturer, blanket wrapped and manifested on site.",
    image: fleet,
  },
  {
    no: "03",
    title: "AW Distribution",
    copy: "Freight consolidates in a dedicated furniture distribution facility.",
    image: warehouse,
  },
  {
    no: "04",
    title: "Final-Mile Hub",
    copy: "Regional hubs break the load down into scheduled local delivery routes.",
    image: delivery,
  },
  {
    no: "05",
    title: "Home Delivery",
    copy: "White glove teams place, inspect and finish in the customer's home.",
    image: finalMile,
  },
];

export function Journey() {
  const { ref, progress } = useSectionProgress<HTMLDivElement>();
  const activeIndex = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length * 0.999));

  return (
    <section ref={ref} className="relative bg-navy" style={{ height: `${STAGES.length * 100}vh` }}>
      <div className="sticky top-0 min-h-[100svh] overflow-hidden">
        <div className="mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-6 py-24 md:px-10">
          <SectionLabel index="04 /" label="One Seamless Journey" className="text-on-navy" />
          <h2 className="display mt-6 max-w-2xl text-[clamp(2rem,4.6vw,4.25rem)] text-on-navy">
            One shipment.
            <br />
            One seamless <span className="text-primary">journey.</span>
          </h2>

          <div className="mt-10 grid flex-1 gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-center">
            <ol className="relative flex flex-col gap-6 pl-8">
              <span className="absolute left-[3px] top-2 bottom-2 w-px bg-white/15" />
              <span
                className="absolute left-0 top-2 w-[7px] rounded-full bg-primary transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ height: `calc(${(progress * 100).toFixed(2)}% - 1rem)` }}
              />
              {STAGES.map((s, i) => (
                <li
                  key={s.no}
                  className={cn(
                    "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    i === activeIndex ? "opacity-100" : "opacity-35",
                  )}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className={cn(
                        "display text-sm transition-colors duration-500",
                        i === activeIndex ? "text-primary" : "text-steel",
                      )}
                    >
                      {s.no}
                    </span>
                    <span className="display text-xl text-on-navy md:text-2xl">{s.title}</span>
                  </div>
                  <p
                    className={cn(
                      "mt-2 max-w-sm text-sm leading-relaxed text-steel transition-all duration-700",
                      i === activeIndex ? "max-h-24 opacity-100" : "max-h-0 overflow-hidden opacity-0",
                    )}
                  >
                    {s.copy}
                  </p>
                </li>
              ))}
            </ol>

            <div className="relative aspect-[16/11] overflow-hidden bg-navy-soft">
              {STAGES.map((s, i) => (
                <img
                  key={s.no}
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    clipPath: i <= activeIndex ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                    transform: i === activeIndex ? "scale(1)" : "scale(1.06)",
                  }}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-navy/85 to-transparent p-6">
                <span className="display text-2xl text-on-navy md:text-3xl">
                  {STAGES[activeIndex]?.title}
                </span>
                <span className="eyebrow text-primary">
                  {STAGES[activeIndex]?.no} / {STAGES.length.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          <p className="display mt-10 text-[clamp(1.25rem,3vw,2.75rem)] text-on-navy/90">
            From origin <span className="text-primary">to final mile.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
