import { Link } from "@tanstack/react-router";

import { QuoteBand } from "@/components/aw/QuoteBand";
import { relatedServices, SERVICES, type ServiceRecord } from "@/data/services";
import { useRevealRoot } from "@/hooks/use-reveal";

export function ServiceDetail({ service }: { service: ServiceRecord }) {
  const rootRef = useRevealRoot<HTMLDivElement>();
  const related = relatedServices(service);

  return (
    <div ref={rootRef} className="bg-white text-[#172033]">
      <section className="relative flex min-h-[68svh] items-end overflow-hidden bg-[#142660] pb-14 pt-32 lg:min-h-[72svh] lg:pb-16">
        <img src={service.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#142660]/92 via-[#142660]/68 to-[#142660]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#142660] via-transparent to-[#142660]/30" />
        <div className="container-aw relative z-10 max-w-3xl">
          <p className="eyebrow text-route">
            {service.number} / {String(SERVICES.length).padStart(2, "0")}
          </p>
          <h1 className="display mt-4 text-white" style={{ fontSize: "clamp(40px, 5vw, 72px)" }}>
            {service.title}
          </h1>
          <p className="mt-4 max-w-xl text-[13px] font-semibold uppercase tracking-[0.16em] text-white/85">
            {service.tagline}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-aw grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <p className="aw-rise eyebrow text-route" data-reveal>
            Overview
          </p>
          <div
            className="aw-rise max-w-2xl space-y-5 text-[16px] leading-relaxed text-[#3d4a68] md:text-[17px]"
            data-reveal
          >
            {service.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F7FB] py-16 lg:py-20">
        <div className="container-aw">
          <p className="eyebrow text-route">Capabilities</p>
          <h2
            className="display mt-3 max-w-[16ch] text-[#142660]"
            style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            What this service covers
          </h2>
          <ul className="mt-10 border-t border-[#142660]/10">
            {service.capabilities.map((item, index) => (
              <li
                key={item.title}
                className="grid gap-2 border-b border-[#142660]/10 py-5 md:grid-cols-[88px_220px_minmax(0,1fr)] md:items-baseline md:gap-6"
              >
                <span className="text-[12px] font-semibold tracking-[0.16em] text-route">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-[#142660]">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[#3d4a68]">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-aw py-12 lg:py-16">
          <div className="aw-rise relative aspect-[16/8] overflow-hidden bg-[#142660]" data-reveal>
            <img src={service.supportImage} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {service.process ? (
        <section className="border-t border-[#142660]/10 py-14 lg:py-16">
          <div className="container-aw">
            <p className="eyebrow text-route">How it works</p>
            <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step, index) => (
                <li key={step.label} className="border-t-2 border-route pt-4">
                  <p className="text-[12px] font-semibold tracking-[0.16em] text-route">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-[15px] font-semibold uppercase tracking-[0.08em] text-[#142660]">
                    {step.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3d4a68]">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section className="bg-[#142660] py-16 text-white lg:py-20">
        <div className="container-aw">
          <p className="eyebrow text-route">Related services</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/services/$slug"
                params={{ slug: item.slug }}
                className="group relative flex min-h-[240px] items-end overflow-hidden bg-[#101c48] p-5"
              >
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#142660] via-[#142660]/35 to-[#142660]/10 transition-colors duration-500 group-hover:via-[#142660]/20" />
                <span className="relative display text-[clamp(22px,2vw,32px)] leading-none">
                  {item.title}
                  <span className="ml-2 inline-block text-route transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <QuoteBand />
    </div>
  );
}
