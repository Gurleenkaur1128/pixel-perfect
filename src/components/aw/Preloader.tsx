import { useEffect, useState } from "react";

const WORD = "AMERICAN WEST";

/** Short branded beat before the hero. The truck crosses fully, then the hero is revealed. */
export function Preloader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = window.setTimeout(() => setGone(true), reduce ? 160 : 2100);
    return () => window.clearTimeout(done);
  }, []);

  if (gone) return null;

  return (
    <div className="aw-preloader" role="status" aria-live="polite" aria-label="Loading American West">
      <div className="aw-preloader-stage">
        <img src="/brand/aw-truck.png" alt="" className="aw-preloader-truck" width={2000} height={667} />
        <p className="aw-preloader-word" aria-hidden="true">
          {WORD.split("").map((letter, i) => (
            <span key={`${letter}-${i}`} style={{ animationDelay: `${120 + i * 28}ms` }}>
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
