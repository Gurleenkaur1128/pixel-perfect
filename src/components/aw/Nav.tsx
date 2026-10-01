import { useState } from "react";

import logoBlue from "@/assets/logo.png";
import logoWhite from "@/assets/logo-white.png";
import { AwButton } from "@/components/aw/ui";
import { useScrollY } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Network", href: "#network" },
  { label: "Opportunities", href: "#careers" },
];

export function Nav() {
  const y = useScrollY();
  const [open, setOpen] = useState(false);

  const solid = open || y > 8;
  const logoSize = solid ? "w-[104px] sm:w-[118px]" : "w-[132px] sm:w-[168px]";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b",
        solid
          ? "border-[#142660]/10 bg-white shadow-[0_8px_28px_rgba(20,38,96,0.06)]"
          : "border-transparent bg-transparent shadow-none",
      )}
    >
      <div className={cn("container-aw flex items-center justify-between gap-4", solid ? "py-1" : "py-2")}>
        <a href="#top" aria-label="American West home" className="relative block shrink-0">
          <img
            src={logoWhite}
            alt=""
            width={1774}
            height={887}
            className={cn("h-auto bg-transparent", logoSize, solid ? "opacity-0" : "opacity-100")}
          />
          <img
            src={logoBlue}
            alt="American West Worldwide Express, Inc."
            width={546}
            height={273}
            className={cn("absolute inset-0 h-auto bg-transparent", logoSize, solid ? "opacity-100" : "opacity-0")}
          />
        </a>

        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={cn(
                "group relative whitespace-nowrap py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                solid
                  ? "text-[#172033]/80 hover:text-[#2D419A]"
                  : "text-white drop-shadow-[0_1px_8px_rgba(16,28,72,0.45)] hover:text-white",
              )}
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-route transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <AwButton href="#quote" compact>
            Request a Quote
          </AwButton>
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-end justify-center gap-[6px] lg:hidden"
        >
          <span className={cn("h-0.5 w-7 transition-transform duration-500", solid ? "bg-[#142660]" : "bg-white", open && "translate-y-[4px] rotate-45")} />
          <span className={cn("h-0.5 w-5 transition-all duration-500", solid ? "bg-[#142660]" : "bg-white", open && "w-7 -translate-y-[4px] -rotate-45")} />
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-transparent bg-white/95 backdrop-blur-[14px] transition-[max-height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          open ? "max-h-[28rem] border-[#142660]/10" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-6 pb-6 pt-1">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="display border-b border-[#142660]/10 py-3 text-lg text-[#172033]"
            >
              {l.label}
            </a>
          ))}
          <AwButton href="#quote" className="mt-5" onClick={() => setOpen(false)}>
            Request a Quote
          </AwButton>
        </nav>
      </div>
    </header>
  );
}
