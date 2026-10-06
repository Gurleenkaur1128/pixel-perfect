import { AwButton, Logo } from "@/components/aw/ui";

const COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "B2B / LTL / Retail / Final Mile", href: "/services/b2b-ltl-retail-final-mile" },
      { label: "Blanket Wrap", href: "/services/blanket-wrap" },
      { label: "E-commerce and Home", href: "/services/ecommerce-home-delivery" },
      { label: "Pool Distribution", href: "/services/pool-distribution" },
      { label: "Warehousing", href: "/services/warehousing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/#top" },
      { label: "Our Family of Carriers", href: "/#top" },
      { label: "The American West Way", href: "/#top" },
      { label: "News & Events", href: "/#top" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Schedule a Pickup", href: "/#top" },
      { label: "Request a Quote", href: "#quote" },
      { label: "FAQs", href: "/#top" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "51 Zaca Lane, Suite 120", href: "#quote" },
      { label: "San Luis Obispo, CA 93401", href: "#quote" },
      { label: "(800) 788-4534", href: "tel:8007884534" },
    ],
  },
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
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-on-navy/65 transition-colors duration-500 hover:text-on-navy"
                    >
                      {link.label}
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
