import { useState } from "react";

import { Logo } from "@/components/aw/ui";
import { useScrollY } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Network", href: "#network" },
  { label: "Careers", href: "#careers" },
];

export function Nav() {
  const y = useScrollY();
  const [open, setOpen] = useState(false);
  const solid = y > 80 || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-700",
        solid ? "border-b border-on-navy/10 bg-navy/95 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="container-aw flex items-center justify-between gap-6 py-3.5">
        <a href="#top" aria-label="American West home">
          <Logo className="h-11" />
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative py-1 text-xs font-semibold uppercase tracking-[0.18em] text-on-navy/80 transition-colors duration-500 hover:text-on-navy"
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-route transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a
            href="#track"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-on-navy/80 transition-colors hover:text-on-navy"
          >
            Track Shipment
          </a>
          <a
            href="#quote"
            className="group inline-flex items-center gap-2 rounded-sm bg-route px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-navy transition-colors hover:bg-route/90"
          >
            Request a Quote <span className="arrow-slide group-hover:translate-x-1">&#8594;</span>
          </a>
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-end justify-center gap-[6px] lg:hidden"
        >
          <span className={cn("h-0.5 w-7 bg-on-navy transition-transform duration-500", open && "translate-y-[4px] rotate-45")} />
          <span className={cn("h-0.5 w-5 bg-on-navy transition-all duration-500", open && "w-7 -translate-y-[4px] -rotate-45")} />
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden bg-navy transition-[max-height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          open ? "max-h-[28rem]" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-6 pb-8 pt-2">
          {[...LINKS, { label: "Track Shipment", href: "#track" }].map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display border-b border-on-navy/10 py-4 text-xl text-on-navy"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#quote"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-between rounded-sm bg-route px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-on-navy"
          >
            Request a Quote <span>&#8594;</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
