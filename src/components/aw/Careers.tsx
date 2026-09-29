import driver from "@/assets/driver.jpg";
import { SectionLabel } from "@/components/aw/ui";
import { useRevealRoot } from "@/hooks/use-reveal";

export function Careers() {
  const root = useRevealRoot<HTMLElement>();

  return (
    <section id="careers" ref={root} className="bg-navy-soft">
      <div className="grid lg:grid-cols-2">
        <div className="group relative min-h-[60vh] overflow-hidden lg:min-h-[92vh]">
          <img
            src={driver}
            alt="Professional driver beside an American West truck at dusk"
            loading="lazy"
            width={1200}
            height={1504}
            className="h-full w-full object-cover transition-transform duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-navy/25 transition-colors duration-700 group-hover:bg-navy/10" />
        </div>

        <div className="flex flex-col justify-center px-6 py-20 md:px-14 lg:py-0">
          <div className="reveal" data-reveal>
            <SectionLabel index="08 /" label="Careers" className="text-on-navy" />
          </div>
          <h2 className="display reveal mt-8 text-[clamp(3rem,7vw,7rem)] text-on-navy" data-reveal>
            Drive
            <br />
            the <span className="text-primary">West.</span>
          </h2>
          <p
            className="reveal mt-8 max-w-md text-base leading-relaxed text-steel"
            data-reveal
            data-reveal-delay="150"
          >
            Build your career with a transportation network that keeps America moving &mdash;
            dedicated lanes, modern equipment and teams who take care of the freight.
          </p>
          <div className="reveal mt-10" data-reveal data-reveal-delay="250">
            <a
              href="#careers"
              className="group inline-flex items-center gap-3 border border-white/25 px-8 py-4 text-[0.6875rem] uppercase tracking-[0.2em] text-on-navy transition-colors duration-500 hover:border-primary hover:text-primary"
            >
              View Opportunities
              <span className="arrow-slide group-hover:translate-x-1.5">&#8594;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
