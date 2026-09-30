import type React from "react";
import type { ReactNode } from "react";

import logoAsset from "@/assets/aw-logo.png.asset.json";
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
        "group inline-flex items-center gap-3 rounded-sm px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-500",
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
    <span className={cn("inline-flex items-center rounded-sm bg-on-navy px-2.5 py-1.5", className)}>
      <img
        src={logoAsset.url}
        alt="American West Worldwide Express, Inc."
        width={606}
        height={309}
        className="h-full w-auto"
      />
    </span>
  );
}
