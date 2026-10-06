import { Link } from "@tanstack/react-router";
import { Building2, ClipboardList, Home, Package, Warehouse } from "lucide-react";
import { useEffect, useState } from "react";

import { QuoteBand } from "@/components/aw/QuoteBand";
import { AwButton } from "@/components/aw/ui";
import { FINAL_MILE_STEPS, HERO_IMAGE, SERVICES, type ServiceRecord } from "@/data/services";
import { useRevealRoot } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const MILE_ICONS = [ClipboardList, Package, Building2, Warehouse, Home];

export function ServicesPage() {
  const rootRef = useRevealRoot<HTMLDivElement>();
  const [preview, setPreview] = useState(SERVICES[0]?.slug ?? "");
  const activePreview = SERVICES.find((service) => service.slug === preview) ?? SERVICES[0];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      root.querySelectorAll<HTMLImageElement>("[data-parallax]").forEach((img) => {
        const rect = img.getBoundingClientRect();
        const delta = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const y = Math.max(-14, Math.min(14, delta * -18));
        img.style.transform = `scale(1.06) translate3d(0, ${y}px, 0)`;
      });
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [rootRef]);

  return (
    <div ref={rootRef} className="bg-white text-[#172033]">
      <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-[#142660] pb-16 pt-32 lg:pb-20">
        <img
          src={HERO_IMAGE}
          alt="American West truck on a western highway"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#142660]/92 via-[#142660]/70 to-[#142660]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#142660] via-[#142660]/25 to-[#142660]/35" />
        <div className="container-aw relative z-10 max-w-4xl">
          <p className="aw-hero-in eyebrow text-route">Specialized transportation solutions</p>
          <h1
            className="aw-hero-in display mt-4 max-w-[12ch] text-white"
            style={{ fontSize: "clamp(48px, 6vw, 84px)", animationDelay: "80ms" }}
          >
            Built around
            <br />
            your business.
          </h1>
          <p
            className="aw-hero-in mt-6 max-w-xl text-[16px] leading-relaxed text-white/85 md:text-[17px]"
            style={{ animationDelay: "160ms" }}
          >
            Every business has unique transportation needs, and American West works directly with
            customers to match those needs with specialized performance solutions.
          </p>
          <div
            className="aw-hero-in mt-8 flex flex-wrap items-center gap-6"
            style={{ animationDelay: "240ms" }}
          >
            <AwButton href="#quote">Request a Quote</AwButton>
            <a
              href="#our-services"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors hover:text-white"
            >
              Explore services
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section id="our-services" className="bg-[#F5F7FB] py-16 lg:py-24">
        <div className="container-aw">
          <p className="aw-rise eyebrow text-route" data-reveal>
            Our services
          </p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end">
            <h2
              className="aw-rise display max-w-[16ch] text-[#142660]"
              style={{ fontSize: "clamp(36px, 4.4vw, 64px)" }}
              data-reveal
            >
              Specialized solutions for every stage of the journey
            </h2>
            <p className="aw-rise max-w-xl text-[16px] leading-relaxed text-[#3d4a68]" data-reveal>
              American West supports retail, showroom, distribution center, manufacturer,
              e-commerce, final-mile, international and specialized furniture transportation
              requirements.
            </p>
          </div>

          <div className="mt-12 grid items-start gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-14">
            <ol>
              {SERVICES.map((service) => {
                const active = service.slug === activePreview?.slug;
                return (
                  <li key={service.slug} className="border-b border-[#142660]/10">
                    <a
                      href={`#service-${service.slug}`}
                      onMouseEnter={() => setPreview(service.slug)}
                      onFocus={() => setPreview(service.slug)}
                      className="group flex items-center gap-4 py-4 sm:gap-6 sm:py-5"
                    >
                      <span className="w-8 shrink-0 text-[12px] font-semibold tracking-[0.16em] text-route">
                        {service.number}
                      </span>
                      <span
                        className={cn(
                          "display min-w-0 flex-1 text-[#142660] transition-colors duration-300 group-hover:text-[#2D419A]",
                          active && "text-[#2D419A]",
                        )}
                        style={{ fontSize: "clamp(20px, 2.1vw, 32px)" }}
                      >
                        {service.title}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 text-route transition-all duration-300",
                          active
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                        )}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>

            <div className="relative aspect-[16/10] overflow-hidden bg-[#142660] lg:sticky lg:top-24 lg:aspect-[4/5]">
              {SERVICES.map((service) => (
                <img
                  key={service.slug}
                  src={service.image}
                  alt=""
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                    service.slug === activePreview?.slug ? "opacity-100" : "opacity-0",
                  )}
                  style={{ objectPosition: service.imagePosition ?? "center" }}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#142660]/80 to-transparent p-5">
                <p className="eyebrow text-route">{activePreview?.number}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                  {activePreview?.navLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="service-stories">
        {SERVICES.map((service, index) => (
          <ServiceStory key={service.slug} service={service} flipped={index % 2 === 1} />
        ))}
      </div>

      <StickyServiceNav />
      <FinalMileStrip />
      <QuoteBand />
    </div>
  );
}

function ServiceStory({ service, flipped }: { service: ServiceRecord; flipped: boolean }) {
  return (
    <section
      id={`service-${service.slug}`}
      className={cn(
        "flex items-center py-14 lg:min-h-[78vh] lg:py-16",
        flipped ? "bg-[#F5F7FB]" : "bg-white",
      )}
    >
      <div className="container-aw grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className={cn("aw-rise max-w-xl", flipped && "lg:order-2")} data-reveal>
          <p className="eyebrow text-route">{service.number}</p>
          <h2
            className="display mt-3 text-[#142660]"
            style={{ fontSize: "clamp(28px, 3.2vw, 48px)" }}
          >
            {service.title}
          </h2>
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#2D419A]">
            {service.tagline}
          </p>
          <div className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-[#3d4a68] md:text-[16.5px]">
            {service.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {service.chips ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {service.chips.map((chip) => (
                <li
                  key={chip}
                  className="border border-[#142660]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#142660]"
                >
                  {chip}
                </li>
              ))}
            </ul>
          ) : null}
          <Link
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="group mt-7 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#142660]"
          >
            Explore service
            <span
              className="text-route transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>

        <StoryVisual service={service} flipped={flipped} />
      </div>
    </section>
  );
}

function StoryVisual({ service, flipped }: { service: ServiceRecord; flipped: boolean }) {
  return (
    <div className={cn("aw-rise relative", flipped && "lg:order-1")} data-reveal>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#142660] sm:aspect-[5/4] lg:aspect-[5/6]">
        <img
          src={service.image}
          alt=""
          className="aw-story-photo h-full w-full object-cover"
          style={{ objectPosition: service.imagePosition ?? "center" }}
          data-parallax
        />
        {service.callouts ? <Callouts labels={service.callouts} /> : null}
        {service.path ? <PathOverlay steps={service.path} /> : null}
        {service.hub ? <HubOverlay /> : null}
        {service.slug === "warehousing" && service.chips ? (
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-[#142660]/75 to-transparent p-4">
            {service.chips.map((chip) => (
              <span
                key={chip}
                className="border border-white/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Callouts({ labels }: { labels: string[] }) {
  const spots = ["left-4 top-4", "right-4 top-16", "left-6 bottom-16", "right-5 bottom-6"];
  return (
    <>
      {labels.map((label, index) => (
        <span
          key={label}
          className={cn(
            "aw-callout absolute max-w-[11rem] bg-white/92 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#142660] shadow-[0_8px_20px_rgba(20,38,96,0.12)]",
            spots[index] ?? "left-4 top-4",
          )}
          style={{ animationDelay: `${index * 0.45}s` }}
        >
          {label}
        </span>
      ))}
    </>
  );
}

function PathOverlay({ steps }: { steps: string[] }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#142660]/85 via-[#142660]/45 to-transparent px-4 pb-4 pt-12">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:gap-3 sm:text-[11px]">
        {steps.map((step, index) => (
          <span key={step} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <span className="shrink-0">{step}</span>
            {index < steps.length - 1 ? (
              <span className="aw-path-line h-px flex-1 bg-route" />
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function HubOverlay() {
  const spokes = [
    [180, 96, 28, 28],
    [180, 96, 332, 22],
    [180, 96, 300, 78],
    [180, 96, 48, 72],
  ];
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#142660]/75 via-[#142660]/20 to-transparent px-5 pb-4 pt-16">
      <svg viewBox="0 0 360 120" className="h-24 w-full" aria-hidden="true">
        {spokes.map(([x1, y1, x2, y2], index) => (
          <line
            key={`${x2}-${y2}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            pathLength="1"
            stroke="#F3692B"
            strokeWidth="2"
            strokeLinecap="round"
            className="aw-pool-line"
            style={{ animationDelay: `${index * 0.18}s` }}
          />
        ))}
        <circle cx="180" cy="96" r="5" fill="#F3692B" />
        <circle cx="180" cy="96" r="11" fill="none" stroke="#ffffff" strokeOpacity="0.85" />
      </svg>
    </div>
  );
}

function FinalMileStrip() {
  return (
    <section className="border-t border-[#142660]/10 bg-white py-14 lg:py-16">
      <div className="container-aw">
        <p className="eyebrow text-route">Complete final mile order fulfillment</p>
        <ol className="relative mt-8 grid gap-6 md:grid-cols-5 md:gap-4">
          <div className="absolute left-[15px] top-2 hidden h-[calc(100%-8px)] w-px bg-route md:left-0 md:right-0 md:top-5 md:block md:h-px md:w-auto" />
          <div className="absolute bottom-2 left-[15px] top-2 w-px bg-route md:hidden" />
          {FINAL_MILE_STEPS.map((step, index) => {
            const Icon = MILE_ICONS[index] ?? Package;
            return (
              <li
                key={step}
                className="relative flex items-center gap-3 pl-10 md:block md:pl-0 md:pt-10"
              >
                <span className="absolute left-0 flex size-8 items-center justify-center bg-white text-[#2D419A] md:left-0 md:top-1">
                  <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#142660]">
                  <span className="mr-2 text-route">{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function StickyServiceNav() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodes = SERVICES.map((service) => document.getElementById(`service-${service.slug}`));
    let frame = 0;

    const update = () => {
      frame = 0;
      const mark = window.innerHeight * 0.42;
      let current = 0;
      let any = false;
      nodes.forEach((node, index) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        if (rect.top < mark && rect.bottom > 80) {
          current = index;
          any = true;
        }
      });
      const first = nodes[0]?.getBoundingClientRect();
      const last = nodes[nodes.length - 1]?.getBoundingClientRect();
      const quoteTop = document.getElementById("quote")?.getBoundingClientRect().top ?? Infinity;
      const inRange = Boolean(
        first &&
        last &&
        first.top < mark &&
        last.bottom > window.innerHeight * 0.62 &&
        quoteTop > window.innerHeight * 0.85,
      );
      setActive(any ? current : 0);
      setVisible(inRange);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const service = SERVICES[active];
  if (!service) return null;

  return (
    <a
      href={`#service-${service.slug}`}
      className={cn(
        "fixed bottom-4 z-40 hidden w-52 border border-[#142660]/10 bg-white/95 px-3 py-2.5 shadow-[0_10px_30px_rgba(20,38,96,0.08)] backdrop-blur-sm transition-[opacity,left,right] duration-300 lg:block",
        active % 2 === 1 ? "right-6" : "left-6",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-route">
        {service.number}
        <span className="text-[#142660]/40"> / {String(SERVICES.length).padStart(2, "0")}</span>
      </p>
      <p className="mt-1 truncate text-[12px] font-semibold uppercase tracking-[0.08em] text-[#142660]">
        {service.navLabel}
      </p>
      <span className="mt-2 block h-px w-full bg-[#142660]/10">
        <span
          className="block h-px bg-route transition-[width] duration-300"
          style={{ width: `${((active + 1) / SERVICES.length) * 100}%` }}
        />
      </span>
    </a>
  );
}
