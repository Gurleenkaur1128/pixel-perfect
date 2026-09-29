import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "red" | "dark" | "light";

export function AwButton({
  children,
  tone = "red",
  className,
  href = "#quote",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  href?: string;
}) {
  const tones: Record<Tone, string> = {
    red: "bg-primary text-primary-foreground hover:bg-primary/90",
    dark: "bg-navy text-on-navy hover:bg-navy-soft",
    light:
      "border border-current/30 text-current hover:border-primary hover:text-primary bg-transparent",
  };

  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-sm px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-500",
        tones[tone],
        className,
      )}
    >
      <span>{children}</span>
      <span className="arrow-slide group-hover:translate-x-1.5">&#8594;</span>
    </a>
  );
}

export function SectionLabel({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="eyebrow text-primary">{index}</span>
      <span className="h-px w-10 bg-current opacity-25" />
      <span className="eyebrow opacity-60">{label}</span>
    </div>
  );
}
