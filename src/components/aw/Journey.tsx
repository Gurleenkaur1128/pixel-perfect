import { useEffect, useRef } from "react";
import { TruckModel } from "./TruckModel";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Boxes, Globe, Handshake, ShieldCheck, Truck, Warehouse } from "lucide-react";

const SERVICES = [
  {
    icon: Truck,
    title: "B2B / LTL",
    text: "Store, retail and less-than-truckload furniture freight between vendors, DCs and showrooms.",
  },
  {
    icon: ShieldCheck,
    title: "Blanket Wrap",
    text: "Hand-wrapped pieces in a forklift-free environment, protected for the brand on the label.",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    text: "Short- and long-term furniture storage, staged and released on your schedule.",
  },
  {
    icon: Boxes,
    title: "Pool Distribution",
    text: "Consolidate inbound freight, then release it into the final-mile network.",
  },
  {
    icon: Globe,
    title: "International",
    text: "Cross-border furniture transportation coordinated with specialized partners.",
  },
  {
    icon: Handshake,
    title: "Logistics Brokerage",
    text: "Capacity, routing and carrier coordination when the network needs extra reach.",
  },
];

const MILESTONES = [
  {
    title: "Distribution Hub",
    text: "Inbound freight is received, inspected and staged for the region.",
  },
  {
    title: "Local Hub",
    text: "Routes are sequenced for the day’s final-mile deliveries.",
  },
  {
    title: "Home Delivery",
    text: "Furniture-trained associates place every piece with care.",
  },
  {
    title: "Customer Support",
    text: "People on the route, from the appointment through the doorway.",
  },
];

export function Journey() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const sideTruckRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const roadPathRef = useRef<SVGPathElement>(null);
  const dashPathRef = useRef<SVGPathElement>(null);
  const stubPathRef = useRef<SVGPathElement>(null);
  const stubDashRef = useRef<SVGPathElement>(null);
  const motionRef = useRef<SVGPathElement>(null);
  const chevronRef = useRef<SVGGElement>(null);
  const topTruckRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    const layoutRoad = () => {
      const svg = svgRef.current;
      const road = roadPathRef.current;
      const dash = dashPathRef.current;
      const stub = stubPathRef.current;
      const stubDash = stubDashRef.current;
      const motion = motionRef.current;
      const chevron = chevronRef.current;
      if (!svg || !road || !dash || !stub || !stubDash || !motion || !chevron) return;

      const w = pin.clientWidth;
      const h = pin.clientHeight;
      if (w < 64 || h < 64) return;

      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const y = Math.round(Math.max(148, h * 0.27));
      const R = Math.round(Math.min(230, Math.max(170, h * 0.24)));
      const x = Math.round(w * 0.5);
      const straight = x - R;
      const k = 0.5523;
      let endY = Math.round(h - 200);
      if (endY < y + R + 130) endY = y + R + 130;
      if (endY > h - 90) endY = h - 90;
      const roadEnd = Math.min(h - 36, endY + 128);
      const head = `M ${straight - 180} ${y} H ${straight} C ${straight + k * R} ${y}, ${x} ${y + (1 - k) * R}, ${x} ${y + R}`;
      const d = `${head} V ${endY}`;
      const dRoad = `${head} V ${roadEnd}`;
      const stubD = `M ${-240} ${y} H ${w + 280}`;
      const stubDashD = `M ${straight - 10} ${y} H ${w + 280}`;

      road.setAttribute("d", dRoad);
      dash.setAttribute("d", dRoad);
      motion.setAttribute("d", d);
      stub.setAttribute("d", stubD);
      stubDash.setAttribute("d", stubDashD);

      const roadW = Math.round(Math.min(176, Math.max(146, w * 0.118)));
      road.setAttribute("stroke-width", String(roadW));
      stub.setAttribute("stroke-width", String(roadW));

      chevron.setAttribute("transform", `translate(${Math.round(x - roadW * 0.05)} ${Math.round(y + roadW * 0.72)}) rotate(38)`);
      pin.style.setProperty("--road-x", `${(x / w) * 100}%`);
      pin.style.setProperty("--mile-left", `${((x + roadW / 2 + 48) / w) * 100}%`);
      pin.style.setProperty("--mile-top", `${((y + roadW / 2 + 18) / h) * 100}%`);
      pin.style.setProperty("--road-end", `${(roadEnd / h) * 100}%`);
    };

    layoutRoad();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const speed = { v: 20 };
        const paintSpeed = () => {
          if (speedRef.current) speedRef.current.textContent = `${Math.round(speed.v)} KM/H`;
        };
        paintSpeed();

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 2.35)}`,
            pin,
            scrub: 1,
            anticipatePin: 1,
            onRefreshInit: layoutRoad,
          },
        });

        tl.fromTo(
          sideTruckRef.current,
          { x: -30 },
          {
            x: () => (lightRef.current?.clientWidth ?? 1100) - (sideTruckRef.current?.offsetWidth ?? 240) - 16,
            duration: 1,
          },
          0,
        );
        tl.to(trackRef.current, { xPercent: -33.333, duration: 1 }, 0);
        tl.to(speed, { v: 30, duration: 1, onUpdate: paintSpeed }, 0);

        tl.to(sideTruckRef.current, { autoAlpha: 0, duration: 0.1 }, 0.94);
        tl.to(".js-services", { autoAlpha: 0, duration: 0.14 }, 0.98);
        tl.fromTo(roadRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, 1.08);

        const motionPath = motionRef.current;
        tl.fromTo(topTruckRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 1.18);
        if (motionPath) {
          tl.to(
            topTruckRef.current,
            {
              motionPath: {
                path: motionPath,
                align: motionPath,
                alignOrigin: [0.5, 0.5],
                autoRotate: true,
              },
              duration: 1.55,
              immediateRender: false,
            },
            1.18,
          );
        }

        tl.to(speed, { v: 14, duration: 0.42, ease: "power1.inOut", onUpdate: paintSpeed }, 1.85);
        tl.fromTo(
          ".js-mile-title",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" },
          1.72,
        );

        MILESTONES.forEach((_, i) => {
          tl.fromTo(
            `.js-mile-${i}`,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.16, ease: "power2.out" },
            2.02 + i * 0.14,
          );
        });

        tl.to(speed, { v: 32, duration: 0.5, onUpdate: paintSpeed }, 2.28);
        tl.fromTo(
          ".js-delivered",
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.16, ease: "power2.out" },
          2.62,
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={rootRef} className="relative bg-[#F5F7FB] text-[#172033]">
      <div
        ref={pinRef}
        className="relative hidden h-[100svh] overflow-hidden lg:block"
        style={{ ["--road-x" as string]: "50%", ["--mile-left" as string]: "62%", ["--mile-top" as string]: "48%", ["--road-end" as string]: "80%" }}
      >
        <div className="js-services absolute inset-0 flex flex-col">
          <div ref={lightRef} className="relative min-h-0 flex-1 overflow-hidden">
            <p className="display pointer-events-none absolute left-[6%] top-[22%] text-[clamp(64px,8vw,104px)] leading-none text-[#2D419A]/10">
              Services
            </p>
            <div className="relative z-10 px-10 pt-36">
              <p className="eyebrow text-route">04 / The route</p>
              <h2 className="display mt-3 text-[clamp(38px,4.5vw,64px)] text-primary">Our Services</h2>
            </div>
            <div ref={sideTruckRef} className="absolute bottom-1 left-0 z-10 w-[clamp(200px,17vw,260px)] select-none">
              <TruckModel />
            </div>
            <div className="absolute inset-x-0 bottom-0 z-[5] h-4 bg-[#142660]">
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/70" />
            </div>
          </div>

          <div className="relative z-20 h-[38%] min-h-[220px] max-h-[320px] overflow-hidden border-t-2 border-route bg-[#142660] text-white">
            <div ref={trackRef} className="flex h-full w-[150%]">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                <article
                  key={service.title}
                  className="flex w-1/6 flex-col justify-center border-l border-white/15 px-5 first:border-l-0 xl:px-7"
                >
                  <Icon className="h-5 w-5 text-route" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="display mt-3 text-[13px] leading-tight tracking-wide">{service.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-white/72">{service.text}</p>
                </article>
              );})}
            </div>
          </div>
        </div>

        <div ref={roadRef} className="pointer-events-none absolute inset-0 z-30 bg-[#F5F7FB] opacity-0">
          <svg ref={svgRef} className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path ref={stubPathRef} fill="none" stroke="#142660" strokeLinecap="butt" />
            <path ref={roadPathRef} fill="none" stroke="#142660" strokeLinecap="butt" />
            <path
              ref={stubDashRef}
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeDasharray="18 16"
              strokeLinecap="butt"
              opacity="0.8"
            />
            <path
              ref={dashPathRef}
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeDasharray="18 16"
              strokeLinecap="butt"
              opacity="0.85"
            />
            <path ref={motionRef} fill="none" stroke="none" />
            <g ref={chevronRef} fill="none" stroke="white" strokeWidth="1.6" opacity="0.55">
              <path d="M0 0 L18 14 L0 28" />
              <path d="M12 2 L30 14 L12 26" />
              <path d="M24 4 L42 14 L24 24" />
            </g>
          </svg>

          <div
            ref={topTruckRef}
            className="absolute left-0 top-0 z-10 w-[clamp(200px,15vw,230px)] opacity-0"
          >
            <TruckModel view="top" />
          </div>

          <div className="js-mile-title absolute left-[3.5%] z-20 w-[min(24rem,calc(var(--road-x)-18%))] opacity-0" style={{ top: "var(--mile-top)" }}>
            <p className="eyebrow text-route">Final mile</p>
            <h3 className="display mt-3 text-[clamp(28px,3vw,42px)] leading-[0.98] text-primary">
              Reliability at every milestone
            </h3>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#172033]/70">
              From facility to front door. The last miles are where a brand is kept.
            </p>
          </div>

          <div
            className="absolute z-20 w-[min(17rem,calc(100%-var(--mile-left)-1.5rem))] space-y-4"
            style={{ left: "var(--mile-left)", top: "var(--mile-top)" }}
          >
            {MILESTONES.map((mile, i) => (
              <article key={mile.title} className={`js-mile-${i} opacity-0`}>
                <p className="eyebrow text-route">0{i + 1}</p>
                <h4 className="display mt-1.5 text-[15px] tracking-wide text-[#142660]">{mile.title}</h4>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#172033]/70">{mile.text}</p>
              </article>
            ))}
          </div>

          <div className="js-delivered absolute z-20 -translate-x-1/2 text-center opacity-0" style={{ left: "var(--road-x)", top: "calc(var(--road-end) + 10px)" }}>
            <span className="relative mx-auto block h-3 w-3 rounded-full bg-route">
              <span className="absolute inset-0 animate-[hub-pulse_2.6s_ease-out_infinite] rounded-full bg-route" />
            </span>
            <p className="display mt-3 text-[clamp(22px,2vw,32px)] text-route">Delivered.</p>
          </div>
        </div>

        <span
          ref={speedRef}
          className="pointer-events-none absolute left-10 top-[108px] z-40 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#142660]/55 tabular-nums"
        >
          20 KM/H
        </span>
      </div>

      <div className="section-y lg:hidden">
        <div className="container-aw">
          <p className="eyebrow text-route">04 / The route</p>
          <h2 className="display mt-3 text-[clamp(38px,8vw,52px)] text-primary">Our Services</h2>
          <div className="mt-6 w-[min(240px,70vw)]">
            <TruckModel />
          </div>
          <div className="mt-8 divide-y divide-[#142660]/12 border-y border-[#142660]/12">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
              <article key={service.title} className="flex gap-4 py-5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-route" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h3 className="display text-[15px] text-[#142660]">{service.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#172033]/70">{service.text}</p>
                </div>
              </article>
            );})}
          </div>

          <div className="mt-12">
            <p className="eyebrow text-route">Final mile</p>
            <h3 className="display mt-3 text-[clamp(28px,7vw,40px)] text-primary">Reliability at every milestone</h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#172033]/70">
              From facility to front door. The last miles are where a brand is kept.
            </p>
            <ol className="relative mt-8 space-y-6 border-l-2 border-[#142660] pl-6">
              {MILESTONES.map((mile, i) => (
                <li key={mile.title} className="relative">
                  <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-route bg-[#F5F7FB]" />
                  <p className="eyebrow text-route">0{i + 1}</p>
                  <h4 className="display mt-1 text-[15px] text-[#142660]">{mile.title}</h4>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#172033]/70">{mile.text}</p>
                </li>
              ))}
              <li className="relative pt-2">
                <span className="absolute -left-[31px] top-3 h-3 w-3 rounded-full bg-route" />
                <p className="display text-xl text-route">Delivered.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
