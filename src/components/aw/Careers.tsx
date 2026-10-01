import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import driver from "@/assets/driver.jpg";
import fleet from "@/assets/fleet.jpg";
import warehouse from "@/assets/warehouse.jpg";
import { SectionLabel } from "@/components/aw/ui";

const ITEMS = [
  {
    index: "01",
    title: "Driver Opportunities",
    text: "Nationwide driver opportunities, including owner-operator opportunities across the American West network.",
    image: driver,
    alt: "American West driver beside a truck at dusk",
  },
  {
    index: "02",
    title: "Other Career Opportunities",
    text: "Warehouse, operations, corporate, and other positions that keep furniture moving from dock to door.",
    image: warehouse,
    alt: "Furniture staged inside an American West warehouse",
  },
  {
    index: "03",
    title: "Newsroom & Updates",
    text: "Company news, network updates, and the work happening across terminals and the road.",
    image: fleet,
    alt: "American West trucks lined up at a terminal",
  },
];

export function Careers() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(reduced);
    if (reduced) return;
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;
    const images = Array.from(pin.querySelectorAll<HTMLElement>("[data-career-image]"));
    const items = Array.from(pin.querySelectorAll<HTMLElement>("[data-career-item]"));
    gsap.registerPlugin(ScrollTrigger);
    const apply = (progress: number) => {
      const focus = progress * (ITEMS.length - 1);
      images.forEach((image, i) => {
        const weight = Math.max(0, 1 - Math.abs(focus - i));
        image.style.opacity = String(weight);
        image.style.transform = `scale(${1.03 - weight * 0.03})`;
      });
      items.forEach((item, i) => {
        const weight = Math.max(0, 1 - Math.abs(focus - i));
        const active = weight > 0.55;
        item.style.opacity = String(0.35 + weight * 0.65);
        item.style.borderColor = active ? "#F3692B" : "rgba(20,38,96,0.15)";
        const title = item.querySelector<HTMLElement>("h3");
        if (title) title.style.fontSize = active ? "22px" : "18px";
        const copy = item.querySelector<HTMLElement>("p:last-of-type");
        if (copy) copy.style.opacity = active ? "1" : "0.65";
      });
    };
    apply(0);
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: () => "+=1400",
      pin,
      scrub: 0.25,
      anticipatePin: 1,
      onUpdate: (self) => apply(self.progress),
    });
    return () => trigger.kill();
  }, []);

  if (reduce) {
    return (
      <section id="careers" className="section-y bg-[#F5F7FB] text-[#172033]">
        <div className="container-aw">
          <SectionLabel index="06 /" label="Opportunities & life at American West" />
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {ITEMS.map((item) => (
              <article key={item.title}>
                <img src={item.image} alt={item.alt} className="aspect-[4/3] w-full rounded-sm object-cover" />
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-route">{item.index}</p>
                <h3 className="display mt-2 text-[22px] text-[#142660]">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#172033]/75">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="careers" ref={rootRef} className="bg-[#F5F7FB] text-[#172033]">
      <div ref={pinRef} className="flex h-[100svh] items-center overflow-hidden">
        <div className="container-aw grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[#142660]">
            {ITEMS.map((item, i) => (
              <img
                key={item.title}
                data-career-image=""
                src={item.image}
                alt={item.alt}
                className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ opacity: i === 0 ? 1 : 0, transform: "scale(1)" }}
              />
            ))}
          </div>

          <div>
            <SectionLabel index="06 /" label="Opportunities & life at American West" />
            <h2 className="display mt-4 text-[clamp(28px,3vw,42px)] leading-[0.98] text-[#142660]">
              Work that keeps <span className="text-route">America</span> moving
            </h2>
            <ol className="mt-8 space-y-6">
              {ITEMS.map((item, i) => (
                <li
                  key={item.title}
                  data-career-item=""
                  className="border-l-2 pl-5 transition-[opacity,border-color] duration-[400ms]"
                  style={{ opacity: i === 0 ? 1 : 0.34, borderColor: i === 0 ? "#F3692B" : "rgba(20,38,96,0.15)" }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-route">{item.index}</p>
                  <h3 className="display mt-1 text-[18px] text-[#142660] transition-all duration-[400ms]">{item.title}</h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#172033]/75">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
