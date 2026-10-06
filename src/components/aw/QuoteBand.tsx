import { AwButton } from "@/components/aw/ui";

export function QuoteBand() {
  return (
    <section className="bg-[#F5F7FB] py-16 text-[#172033] lg:py-20">
      <div className="container-aw flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl">
          <h2 className="display text-[#142660]" style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>
            Not sure which service fits?
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[#3d4a68]">
            Tell us what you&apos;re moving and where it needs to go.
          </p>
        </div>
        <AwButton href="#quote">Request a Quote</AwButton>
      </div>
    </section>
  );
}
