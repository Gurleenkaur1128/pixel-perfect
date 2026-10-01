import type React from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function AwButton({
  children,
  className,
  href = "#quote",
  arrow = "→",
  compact = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  arrow?: string;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <a href={href} onClick={onClick} className={cn("aw-glow", compact && "aw-glow-compact", className)}>
      <span>{children}</span>
      {arrow ? <span className="aw-glow-arrow" aria-hidden="true">{arrow}</span> : null}
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
