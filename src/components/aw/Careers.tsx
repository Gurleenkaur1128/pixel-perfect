import driver from "@/assets/driver.jpg";
import { AwButton, SectionLabel } from "@/components/aw/ui";
import { useRevealRoot } from "@/hooks/use-reveal";

export function Careers() {
  const root = useRevealRoot<HTMLElement>();
  return (
    <section id="careers" ref={root} className="section-y bg-navy text-on-navy">
      <div className="container-aw grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="reveal-mask overflow-hidden rounded-sm" data-reveal>
          <img
            src={driver}
            alt="American West driver beside his truck at dusk"
            loading="lazy"
            className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[400px]"
          />
        </div>
        <div className="max-w-lg">
          <SectionLabel index="06 /" label="Careers" className="reveal" data-reveal />
          <h2 className="display h-sub reveal mt-4 leading-[0.98]" data-reveal>
            Drive with <span className="text-route">American West</span>
          </h2>
          <p className="body-copy reveal mt-4 text-on-navy/75" data-reveal>
            Build your career with a transportation network that keeps America moving. Driver and
            owner-operator opportunities are available across the United States.
          </p>
          <div className="reveal mt-7" data-reveal>
            <AwButton href="#careers">View Opportunities</AwButton>
          </div>
        </div>
      </div>
    </section>
  );
}
