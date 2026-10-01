import { AwButton, Logo } from "@/components/aw/ui";

const COLUMNS = [
  { title: "Services", links: ["B2B / LTL / Retail / Final Mile", "Blanket Wrap", "E-commerce and Home", "Pool Distribution", "Warehousing"] },
  { title: "Company", links: ["About Us", "Our Family of Carriers", "The American West Way", "News & Events"] },
  { title: "Resources", links: ["Schedule a Pickup", "Request a Quote", "FAQs"] },
  { title: "Contact", links: ["51 Zaca Lane, Suite 120", "San Luis Obispo, CA 93401", "(800) 788-4534"] },
];

export function Footer() {
  return (
    <footer id="quote" className="relative overflow-hidden bg-navy-deep pb-6 pt-10 text-on-navy">
      <div className="container-aw relative">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-on-navy/10 pb-6">
          <Logo className="w-[140px] rounded-sm bg-white px-2 py-1 sm:w-[156px]" />
          <AwButton href="#quote" compact>
            Request a Quote
          </AwButton>
        </div>
        <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-route">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href={link === "Request a Quote" ? "#quote" : "#top"}
                      className="text-sm text-on-navy/65 transition-colors duration-500 hover:text-on-navy"
                    >
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
