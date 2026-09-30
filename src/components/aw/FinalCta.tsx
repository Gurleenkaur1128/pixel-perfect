import { AwButton } from "@/components/aw/ui";
import { useInView } from "@/hooks/use-reveal";

export function FinalCta() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  return (
    <section id="quote" className="relative flex min-h-[68vh] items-center overflow-hidden bg-warm py-16">
      <div ref={ref} className="container-aw relative text-center">
        <p className="eyebrow text-route">07 / Get started</p>
        <h2 className="display h-section mt-4 text-primary">Ready to move?</h2>
        <p className="body-copy mx-auto mt-4 max-w-md text-muted-foreground">
          Let&rsquo;s build a smarter transportation and delivery program.
        </p>
        <div id="track" className="mt-7 flex flex-wrap justify-center gap-3">
          <AwButton>Request a Quote</AwButton>
          <AwButton tone="ghost-dark" arrow="↗" href="#track">
            Track Shipment
          </AwButton>
        </div>

        <div className="relative mx-auto mt-10 h-20 max-w-3xl">
          <svg viewBox="0 0 800 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M 0 20 C 200 20 260 80 400 80"
              fill="none"
              stroke="var(--route)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: inView ? 0 : 1, transition: "stroke-dashoffset 2000ms cubic-bezier(0.16,1,0.3,1)" }}
            />
          </svg>
          <span
            className="absolute left-1/2 top-[80%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-route transition-opacity duration-700"
            style={{ opacity: inView ? 1 : 0, transitionDelay: "1600ms", animation: inView ? "hub-pulse 2.8s ease-out infinite 2s" : undefined }}
          />
        </div>
        <p
          className="display mt-4 text-2xl text-route transition-all duration-1000"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(8px)", transitionDelay: "1900ms" }}
        >
          Delivered.
        </p>
      </div>
    </section>
  );
}
