const COLUMNS = [
  {
    title: "Services",
    links: ["B2B / LTL", "Final Mile", "Blanket Wrap", "Warehousing", "Pool Distribution"],
  },
  { title: "Company", links: ["About", "Network", "Careers", "Safety"] },
  { title: "Resources", links: ["Track Shipment", "Request a Quote", "Carrier Partners"] },
  { title: "Contact", links: ["Sales", "Customer Service", "Driver Recruiting"] },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy pt-24 pb-10">
      <span className="display pointer-events-none absolute inset-x-0 bottom-0 select-none whitespace-nowrap text-center text-[17vw] leading-[0.8] text-white/[0.04]">
        Moving America
      </span>

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/10 pb-12">
          <p className="display max-w-2xl text-[clamp(2rem,6vw,5rem)] text-on-navy">
            American
            <br />
            <span className="text-primary">West.</span>
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-steel">
            Specialized furniture transportation, warehousing and final-mile delivery across the
            United States.
          </p>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-primary">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-steel transition-colors duration-500 hover:text-on-navy"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="text-[0.625rem] uppercase tracking-[0.2em] text-steel/70">
            &copy; {new Date().getFullYear()} American West &mdash; Delivering on your promises.
          </p>
          <div className="flex gap-6">
            {["LinkedIn", "Instagram", "YouTube"].map((s) => (
              <a
                key={s}
                href="#top"
                className="text-[0.625rem] uppercase tracking-[0.2em] text-steel/70 transition-colors duration-500 hover:text-primary"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
