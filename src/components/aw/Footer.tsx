import { Logo } from "@/components/aw/ui";

const COLUMNS = [
  { title: "Services", links: ["B2B / LTL / Retail / Final Mile", "Blanket Wrap", "E-commerce and Home", "Pool Distribution", "Warehousing"] },
  { title: "Company", links: ["About Us", "Our Family of Carriers", "The American West Way", "News & Events"] },
  { title: "Resources", links: ["Track Your Shipment", "Schedule a Pickup", "Request a Quote", "FAQs"] },
  { title: "Contact", links: ["51 Zaca Lane, Suite 120", "San Luis Obispo, CA 93401", "(800) 788-4534"] },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep pb-10 pt-20 text-on-navy">
      <span className="display pointer-events-none absolute inset-x-0 bottom-2 select-none whitespace-nowrap text-center text-[11vw] leading-none text-on-navy/[0.04]">
        American West
      </span>
      <div className="container-aw relative">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-on-navy/10 pb-12">
          <Logo className="h-16" />
          <p className="max-w-xs text-sm leading-relaxed text-on-navy/60">
            Specialized furniture transportation, warehousing and final-mile delivery across the
            United States.
          </p>
        </div>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-route">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#top" className="text-sm text-on-navy/65 transition-colors duration-500 hover:text-on-navy">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-on-navy/10 pt-8 text-[0.6875rem] uppercase tracking-[0.2em] text-on-navy/50">
          <p>&copy; {new Date().getFullYear()} American West Worldwide Express, Inc.</p>
          <p>Delivering on your promises.</p>
        </div>
      </div>
    </footer>
  );
}
