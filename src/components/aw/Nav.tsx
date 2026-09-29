import { useState } from "react";

import { useScrollY } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Network", href: "#network" },
  { label: "About", href: "#about" },
  { label: "Careers", href: "#careers" },
];

export function Nav() {
  const y = useScrollY();
  const [open, setOpen] = useState(false);
  const solid = y > 80;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-700",
        solid
          ? "border-b border-white/10 bg-navy/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-6 px-6 py-5 md:px-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <a href="#top" className="flex min-w-0 items-center gap-3 text-on-navy">
          <span className="grid h-8 w-8 shrink-0 place-items-center bg-primary">
            <span className="display text-[0.95rem] leading-none text-primary-foreground">A</span>
          </span>
          <span className="display truncate text-base tracking-[0.06em] sm:text-lg">
            American West
          </span>
        </a>

        <nav className="hidden items-center gap-10 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative py-1 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-on-navy/70 transition-colors duration-500 hover:text-on-navy"
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-7 lg:flex">
          <a
            href="#track"
            className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-on-navy/70 transition-colors duration-500 hover:text-on-navy"
          >
            Track Shipment
          </a>
          <a
            href="#quote"
            className="group inline-flex items-center gap-2 bg-primary px-5 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors duration-500 hover:bg-primary/90"
          >
            Get a Quote
            <span className="arrow-slide group-hover:translate-x-1">&#8594;</span>
          </a>
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 shrink-0 flex-col items-end justify-center gap-[5px] justify-self-end lg:hidden"
        >
          <span
            className={cn(
              "h-px w-7 bg-on-navy transition-transform duration-500",
              open && "translate-y-[3px] rotate-45",
            )}
          />
          <span
            className={cn(
              "h-px w-5 bg-on-navy transition-all duration-500",
              open && "w-7 -translate-y-[3px] -rotate-45",
            )}
          />
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/10 bg-navy transition-[max-height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          open ? "max-h-96" : "max-h-0 border-t-transparent",
        )}
      >
        <nav className="flex flex-col px-6 py-6">
          {[...LINKS, { label: "Track Shipment", href: "#track" }].map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display border-b border-white/10 py-4 text-2xl text-on-navy"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#quote"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-between bg-primary px-5 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-primary-foreground"
          >
            Get a Quote <span>&#8594;</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
