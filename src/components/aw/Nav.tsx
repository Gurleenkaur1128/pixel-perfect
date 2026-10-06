import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import logoBlue from "@/assets/logo.png";
import logoWhite from "@/assets/logo-white.png";
import { AwButton } from "@/components/aw/ui";
import { SERVICE_GROUPS, SERVICE_ICONS, SERVICES, servicesInGroup } from "@/data/services";
import { useScrollY } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const HASH_LINKS = [
  { label: "Careers", hash: "careers" },
  { label: "Locations", hash: "network" },
] as const;

export function Nav() {
  const y = useScrollY();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [preview, setPreview] = useState(SERVICES[0]?.slug ?? "");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  const solid = open || mega || y > 8;
  const logoSize = solid ? "w-[104px] sm:w-[118px]" : "w-[132px] sm:w-[168px]";
  const servicesActive = pathname.startsWith("/services");
  const previewService = SERVICES.find((service) => service.slug === preview) ?? SERVICES[0];

  useEffect(() => {
    setOpen(false);
    setMega(false);
    setServicesOpen(false);
    setMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMega(false);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const linkClass = cn(
    "whitespace-nowrap py-1 text-[10px] font-semibold uppercase tracking-[0.14em] xl:text-[11px] xl:tracking-[0.16em]",
    solid
      ? "text-[#172033]/80 hover:text-[#2D419A]"
      : "text-white drop-shadow-[0_1px_8px_rgba(16,28,72,0.45)] hover:text-white",
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b",
        solid
          ? "border-[#142660]/10 bg-white shadow-[0_8px_28px_rgba(20,38,96,0.06)]"
          : "border-transparent bg-transparent shadow-none",
      )}
      onMouseLeave={() => setMega(false)}
    >
      <div
        className={cn(
          "container-aw flex items-center justify-between gap-3",
          solid ? "py-1" : "py-2",
        )}
      >
        <Link to="/" aria-label="American West home" className="relative block shrink-0">
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
            className={cn(
              "absolute inset-0 h-auto bg-transparent",
              logoSize,
              solid ? "opacity-100" : "opacity-0",
            )}
          />
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          <Link to="/" className={cn("group relative", linkClass)}>
            Home
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-route transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </Link>
          <Link to="/" hash="top" className={cn("group relative", linkClass)}>
            About
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-route transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </Link>

          <div className="relative" onMouseEnter={() => setMega(true)}>
            <button
              type="button"
              aria-expanded={mega}
              aria-controls="services-mega"
              onClick={() => setMega((value) => !value)}
              className={cn("group relative inline-flex items-center gap-1", linkClass)}
            >
              Services
              <ChevronDown
                className={cn("size-3 transition-transform duration-300", mega && "rotate-180")}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-route transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  mega || servicesActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </button>
          </div>

          {HASH_LINKS.map((link) => (
            <Link
              key={link.label}
              to="/"
              hash={link.hash}
              className={cn("group relative", linkClass)}
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-route transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </Link>
          ))}
          <a href="#quote" className={cn("group relative", linkClass)}>
            Contact
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-route transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
          </a>
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
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 flex-col items-end justify-center gap-[6px] lg:hidden"
        >
          <span
            className={cn(
              "h-0.5 w-7 transition-transform duration-500",
              solid ? "bg-[#142660]" : "bg-white",
              open && "translate-y-[4px] rotate-45",
            )}
          />
          <span
            className={cn(
              "h-0.5 w-5 transition-all duration-500",
              solid ? "bg-[#142660]" : "bg-white",
              open && "w-7 -translate-y-[4px] -rotate-45",
            )}
          />
        </button>
      </div>

      <div
        id="services-mega"
        className={cn(
          "hidden overflow-hidden border-t bg-white transition-[max-height,opacity,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block",
          mega
            ? "max-h-[34rem] border-[#142660]/10 opacity-100"
            : "pointer-events-none max-h-0 border-transparent opacity-0",
        )}
      >
        <div className="container-aw grid max-h-[calc(100svh-4.5rem)] grid-cols-[220px_minmax(0,1fr)] gap-8 overflow-y-auto py-5 xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-12">
          <div>
            <p className="eyebrow text-[#2D419A]">Services</p>
            <p className="mt-3 text-[13px] leading-relaxed text-[#3d4a68]">
              Specialized transportation solutions built around your freight, your customers, and
              your reputation.
            </p>
            <Link
              to="/services"
              className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#142660] transition-colors hover:text-[#F3692B]"
            >
              View all services
              <span aria-hidden="true">→</span>
            </Link>
            {previewService ? (
              <div className="relative mt-4 hidden h-28 overflow-hidden xl:block">
                {SERVICES.map((service) => (
                  <img
                    key={service.slug}
                    src={service.image}
                    alt=""
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                      service.slug === previewService.slug ? "opacity-100" : "opacity-0",
                    )}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {SERVICE_GROUPS.map((group) => (
              <div key={group.id}>
                <p className="eyebrow text-[10px] text-[#2D419A]/80">{group.label}</p>
                <ul className="mt-2">
                  {servicesInGroup(group.id).map((service) => {
                    const Icon = SERVICE_ICONS[service.icon];
                    return (
                      <li key={service.slug}>
                        <Link
                          to="/services/$slug"
                          params={{ slug: service.slug }}
                          onMouseEnter={() => setPreview(service.slug)}
                          onFocus={() => setPreview(service.slug)}
                          className="group flex items-start gap-2.5 rounded-sm py-2 pr-1 transition-transform duration-300 hover:translate-x-[5px] focus-visible:translate-x-[5px]"
                        >
                          <Icon
                            className="mt-0.5 size-4 shrink-0 text-[#2D419A]"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 text-[13px] font-semibold leading-tight text-[#142660]">
                              {service.menuTitle}
                              <span className="h-px w-0 bg-route transition-all duration-300 group-hover:w-3.5" />
                              <span className="text-route opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                →
                              </span>
                            </span>
                            <span className="mt-0.5 block text-[11px] leading-snug text-[#3d4a68]">
                              {service.descriptor}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "overflow-y-auto border-t border-transparent bg-white/95 backdrop-blur-[14px] transition-[max-height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          open ? "max-h-[calc(100svh-4.25rem)] border-[#142660]/10" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-6 pb-6 pt-1">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="display border-b border-[#142660]/10 py-3 text-lg text-[#172033]"
          >
            Home
          </Link>
          <Link
            to="/"
            hash="top"
            onClick={() => setOpen(false)}
            className="display border-b border-[#142660]/10 py-3 text-lg text-[#172033]"
          >
            About
          </Link>

          <button
            type="button"
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen((value) => !value)}
            className="display flex items-center justify-between border-b border-[#142660]/10 py-3 text-left text-lg text-[#172033]"
          >
            Services
            <ChevronDown
              className={cn("size-4 transition-transform", servicesOpen && "rotate-180")}
            />
          </button>
          <div className={servicesOpen ? "block" : "hidden"}>
            <Link
              to="/services"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2D419A]"
            >
              View all services
              <span aria-hidden="true">→</span>
            </Link>
            {SERVICE_GROUPS.map((group) => {
              const expanded = mobileGroup === group.id;
              return (
                <div key={group.id} className="mt-3 border-t border-[#142660]/10 pt-3">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setMobileGroup(expanded ? null : group.id)}
                    className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2D419A]"
                  >
                    {group.label}
                    <ChevronDown
                      className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
                    />
                  </button>
                  {expanded ? (
                    <ul className="mt-2 pb-1">
                      {servicesInGroup(group.id).map((service) => {
                        const Icon = SERVICE_ICONS[service.icon];
                        return (
                          <li key={service.slug}>
                            <Link
                              to="/services/$slug"
                              params={{ slug: service.slug }}
                              onClick={() => setOpen(false)}
                              className="flex items-start gap-3 py-2.5"
                            >
                              <Icon
                                className="mt-0.5 size-4 shrink-0 text-[#2D419A]"
                                aria-hidden="true"
                              />
                              <span>
                                <span className="block text-sm font-semibold text-[#142660]">
                                  {service.menuTitle}
                                </span>
                                <span className="mt-0.5 block text-xs text-[#3d4a68]">
                                  {service.descriptor}
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>

          <Link
            to="/"
            hash="careers"
            onClick={() => setOpen(false)}
            className="display border-b border-[#142660]/10 py-3 text-lg text-[#172033]"
          >
            Careers
          </Link>
          <Link
            to="/"
            hash="network"
            onClick={() => setOpen(false)}
            className="display border-b border-[#142660]/10 py-3 text-lg text-[#172033]"
          >
            Locations
          </Link>
          <a
            href="#quote"
            onClick={() => setOpen(false)}
            className="display border-b border-[#142660]/10 py-3 text-lg text-[#172033]"
          >
            Contact
          </a>
          <AwButton href="#quote" className="mt-5" onClick={() => setOpen(false)}>
            Request a Quote
          </AwButton>
        </nav>
      </div>
    </header>
  );
}
