import driver from "@/assets/driver.jpg";
import { AwButton, SectionLabel } from "@/components/aw/ui";
import { useRevealRoot } from "@/hooks/use-reveal";

export function Careers() {
  const root = useRevealRoot<HTMLElement>();
  return (
    <section id="careers" ref={root} className="grid bg-navy text-on-navy lg:min-h-[640px] lg:grid-cols-2">
      <div className="reveal-scale relative min-h-[360px] overflow-hidden" data-reveal>
        <img src={driver} alt="American West driver beside his truck at dusk" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex items-center px-6 py-20 md:px-14 lg:px-20">
        <div className="max-w-lg">
          <SectionLabel index="07 /" label="Careers" className="reveal" data-reveal />
          <h2 className="display h-section reveal mt-6" data-reveal>
            Drive with <span className="text-route">American West</span>
          </h2>
          <p className="reveal mt-6 text-base leading-relaxed text-on-navy/75 md:text-lg" data-reveal>
            Build your career with a transportation network that keeps America moving. Driver and
            owner-operator opportunities are available across the United States.
          </p>
          <div className="reveal mt-9" data-reveal>
            <AwButton href="#careers">View Opportunities</AwButton>
          </div>
        </div>
      </div>
    </section>
  );
}
