import { useState } from "react";

import logo from "@/assets/logo.png";
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-[#142660]/10 bg-white/90 backdrop-blur-[14px] transition-shadow duration-500",
        (y > 8 || open) && "shadow-[0_8px_28px_rgba(20,38,96,0.06)]",
      )}
    >
      <div className="container-aw flex items-center justify-between gap-4 py-2">
        <a href="#top" aria-label="American West home" className="shrink-0">
          <img
            src={logo}
            alt="American West Worldwide Express, Inc."
            width={546}
            height={273}
            className="h-auto w-[128px] bg-transparent sm:w-[164px]"
          />
        </a>

        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative whitespace-nowrap py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#172033]/80 transition-colors duration-500 hover:text-[#2D419A]"
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-route transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href="#track"
            className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-[#172033]/80 transition-colors hover:text-[#2D419A]"
          >
            Track Shipment
          </a>
          <a
            href="#quote"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-sm bg-route px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-route/90"
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
          <span className={cn("h-0.5 w-7 bg-[#142660] transition-transform duration-500", open && "translate-y-[4px] rotate-45")} />
          <span className={cn("h-0.5 w-5 bg-[#142660] transition-all duration-500", open && "w-7 -translate-y-[4px] -rotate-45")} />
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-transparent bg-white/95 backdrop-blur-[14px] transition-[max-height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          open ? "max-h-[28rem] border-[#142660]/10" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-6 pb-6 pt-1">
          {[...LINKS, { label: "Track Shipment", href: "#track" }].map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display border-b border-[#142660]/10 py-3 text-lg text-[#172033]"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#quote"
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex items-center justify-between rounded-sm bg-route px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
          >
            Request a Quote <span>&#8594;</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
