import { useEffect, useState } from "react";

/** Cinematic beat: the truck enters, holds on the title, then drives into the hero. */
export function Preloader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const done = window.setTimeout(() => setGone(true), reduce ? 160 : 2350);
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
