import { useInView } from "@/hooks/use-reveal";

export function BrandPromise() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <section ref={ref} className="relative overflow-hidden bg-navy py-32 md:py-44">
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        aria-hidden="true"
      >
        {[120, 300, 480].map((offset, i) => (
          <path
            key={offset}
            d={`M -50 ${offset} C 300 ${offset - 90} 700 ${offset + 120} 1250 ${offset - 40}`}
            fill="none"
            stroke="var(--route)"
            strokeWidth="1"
            opacity={0.5 - i * 0.12}
            style={{
              strokeDasharray: 2600,
              strokeDashoffset: inView ? 0 : 2600,
              transition: `stroke-dashoffset 3400ms cubic-bezier(0.16,1,0.3,1) ${i * 400}ms`,
            }}
          />
        ))}
      </svg>

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <h2 className="display text-[clamp(2.25rem,6.2vw,6rem)] text-on-navy">
          We don&rsquo;t just
          <br />
          move furniture.
        </h2>
        <h2 className="display mt-6 text-[clamp(2.25rem,6.2vw,6rem)] text-primary">
          We move your
          <br />
          reputation.
        </h2>
        <p className="mx-auto mt-10 max-w-lg text-base leading-relaxed text-steel">
          Every shipment represents your brand. Every delivery should strengthen it.
        </p>
        <a
          href="#quote"
          className="group mt-12 inline-flex items-center gap-5 border-b border-white/25 pb-4 text-[0.75rem] uppercase tracking-[0.22em] text-on-navy transition-colors duration-500 hover:border-primary"
        >
          Partner with American West
          <span className="arrow-slide text-primary text-3xl leading-none group-hover:translate-x-3">
            &#8594;
          </span>
        </a>
      </div>
    </section>
  );
}
