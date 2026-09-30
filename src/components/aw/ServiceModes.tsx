import finalMile from "@/assets/final-mile.jpg";
import { SectionLabel } from "@/components/aw/ui";
import { useRevealRoot } from "@/hooks/use-reveal";

const MODES = [
  { name: "White-Glove Premium", note: "Room-of-choice placement, unpacking, assembly and debris removal." },
  { name: "White-Glove No-Inspect", note: "Careful in-home placement without on-site inspection." },
  { name: "Threshold Delivery", note: "Delivered safely to the first dry area of the home." },
];

export function ServiceModes() {
  const root = useRevealRoot<HTMLElement>();
  return (
    <section ref={root} className="section-y bg-warm">
      <div className="container-aw grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="reveal-mask h-[240px] overflow-hidden rounded-sm sm:h-[320px] lg:h-[400px]" data-reveal>
          <img src={finalMile} alt="Furniture delivered into a sunlit living room" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div>
          <SectionLabel index="05 /" label="E-commerce / Final Mile" className="reveal text-ink" data-reveal />
          <h2 className="display h-sub reveal mt-4 leading-[0.98] text-primary" data-reveal>
            Your reputation is on the line with every delivery
          </h2>
          <p className="body-copy reveal mt-4 max-w-lg text-muted-foreground" data-reveal>
            Your customers depend on you for a quality product and a seamless delivery. American
            West helps complete the order fulfillment process.
          </p>
          <ul className="mt-6 border-t border-border">
            {MODES.map((m, i) => (
              <li key={m.name} className="reveal flex gap-5 border-b border-border py-4" data-reveal data-reveal-delay={i * 120}>
                <span className="display pt-0.5 text-sm text-route">0{i + 1}</span>
                <div>
                  <p className="display text-lg text-ink">{m.name}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{m.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
