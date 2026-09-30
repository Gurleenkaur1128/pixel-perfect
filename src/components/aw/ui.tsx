import type React from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "orange" | "blue" | "ghost-light" | "ghost-dark";

export function AwButton({
  children,
  tone = "orange",
  className,
  href = "#quote",
  arrow = "→",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  href?: string;
  arrow?: string;
}) {
  const tones: Record<Tone, string> = {
    orange: "bg-route text-on-navy hover:bg-route/90",
    blue: "bg-primary text-primary-foreground hover:bg-navy",
    "ghost-light": "border border-on-navy/40 text-on-navy hover:border-route hover:text-route",
    "ghost-dark": "border border-ink/25 text-ink hover:border-primary hover:text-primary",
  };
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-sm px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-500",
        tones[tone],
        className,
      )}
    >
      <span>{children}</span>
      <span className="arrow-slide group-hover:translate-x-1.5">{arrow}</span>
    </a>
  );
}

export function SectionLabel({
  index,
  label,
  className,
  ...rest
}: {
  index: string;
  label: string;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "className"> & { "data-reveal"?: boolean }) {
  return (
    <div className={cn("flex items-center gap-4", className)} {...rest}>
      <span className="eyebrow text-route">{index}</span>
      <span className="h-px w-10 bg-current opacity-25" />
      <span className="eyebrow opacity-70">{label}</span>
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/brand/aw-logo.png"
      alt="American West Worldwide Express, Inc."
      width={546}
      height={273}
      className={cn("h-auto w-[128px] bg-transparent sm:w-[164px]", className)}
    />
  );
}
