import { useEffect, useState } from "react";

/** Full-screen beat: title first, truck below it, then the truck exits into the hero. */
export function Preloader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = window.setTimeout(() => setGone(true), reduce ? 160 : 2480);
    return () => window.clearTimeout(done);
  }, []);

  if (gone) return null;

  return (
    <div className="aw-preloader" role="status" aria-live="polite" aria-label="Loading American West">
      <div className="aw-preloader-veil" />
      <p className="aw-preloader-word">American West</p>
      <img src="/brand/aw-truck.png" alt="" className="aw-preloader-truck" width={2000} height={667} />
    </div>
  );
}
