import { useEffect, useState } from "react";

const WORD = "AMERICAN WEST";

/** Short branded beat before the hero. Skipped when motion is reduced. */
export function Preloader() {
  const [gone, setGone] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = window.setTimeout(() => setHide(true), reduce ? 80 : 1280);
    const done = window.setTimeout(() => setGone(true), reduce ? 160 : 1720);
    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(done);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className="aw-preloader"
      data-hide={hide ? "true" : "false"}
      role="status"
      aria-live="polite"
      aria-label="Loading American West"
    >
      <div className="aw-preloader-stage">
        <img src="/brand/aw-truck.png" alt="" className="aw-preloader-truck" />
        <p className="aw-preloader-word" aria-hidden="true">
          {WORD.split("").map((letter, i) => (
            <span key={`${letter}-${i}`} style={{ animationDelay: `${280 + i * 38}ms` }}>
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
