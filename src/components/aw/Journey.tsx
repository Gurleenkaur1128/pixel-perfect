import { useId, useLayoutEffect, useRef } from "react";
import { TruckModel } from "./TruckModel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Boxes,
  ClipboardList,
  Globe,
  Handshake,
  Home,
  ShieldCheck,
  Truck,
  UserRound,
  Warehouse,
} from "lucide-react";

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

const STEPS = [
  {
    icon: ClipboardList,
    title: "Order Entry",
    text: "The shipment is booked, scheduled and released into the network.",
    side: "right" as const,
  },
  {
    icon: Truck,
    title: "Vendor Pickup",
    text: "Furniture is collected from the vendor, showroom or distribution center.",
    side: "left" as const,
  },
  {
    icon: Warehouse,
    title: "AW Facility Distribution",
    text: "Freight is received, inspected and staged for the region.",
    side: "right" as const,
  },
  {
    icon: Home,
    title: "Home Delivery Hub",
    text: "Routes are sequenced for the day's final-mile deliveries.",
    side: "left" as const,
  },
  {
    icon: UserRound,
    title: "Consumer",
    text: "Furniture-trained associates place every piece at the front door.",
    side: "right" as const,
  },
];

const KAPPA = 0.5522847498;
const SIDE_RATIO = 667 / 2000;

type Side = "left" | "right" | "";
type Mode = "mobile" | "tablet" | "desktop";

type StopPos = {
  x: number;
  y: number;
  t: number;
  w: number;
  side: Side;
  enter: "x" | "y";
};

type Sample = { x: number; y: number; a: number };

type Geo = {
  mode: Mode;
  truckW: number;
  roadW: number;
  shiftX: number;
  total: number;
  motionStart: number;
  motionEnd: number;
  horizT: number;
  curveT: number;
  preferY: number;
  drift: number;
  scroll: number;
  samples: Sample[];
  services: StopPos[];
  steps: StopPos[];
  delivered: StopPos;
};

type Anim = {
  target: number;
  current: number;
  angle: number;
  viewX: number;
  viewY: number;
  kmh: number;
  booted: boolean;
  mode: Mode | "";
  active: boolean;
};

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function smoothstep(e0: number, e1: number, x: number) {
  if (e1 === e0) return x >= e1 ? 1 : 0;
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerpAngle(a: number, b: number, u: number) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * u;
}

function fallbackTruck(w: number) {
  if (w >= 1536) return clamp(w * 0.22, 360, 460);
  if (w >= 1280) return clamp(w * 0.24, 320, 420);
  if (w >= 1024) return clamp(w * 0.26, 280, 360);
  if (w >= 768) return clamp(w * 0.3, 190, 240);
  return clamp(w * 0.44, 130, 170);
}

function modeFor(w: number): Mode {
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function samplePath(path: SVGPathElement, count = 280): { samples: Sample[]; total: number } {
  const total = path.getTotalLength();
  const samples: Sample[] = [];
  let prev = 0;
  for (let i = 0; i < count; i++) {
    const d = i / (count - 1);
    const p = path.getPointAtLength(total * d);
    const ahead = path.getPointAtLength(total * Math.min(1, d + 0.0035));
    const behind = path.getPointAtLength(total * Math.max(0, d - 0.0035));
    const dx = ahead.x - behind.x;
    const dy = ahead.y - behind.y;
    const a = Math.hypot(dx, dy) < 0.01 ? prev : Math.atan2(dy, dx);
    prev = a;
    samples.push({ x: p.x, y: p.y, a });
  }
  return { samples, total };
}

function arcAt(samples: Sample[], x: number, y: number) {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    if (!sample) continue;
    const dx = sample.x - x;
    const dy = sample.y - y;
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best / (samples.length - 1);
}

function pointAt(geo: Geo, journey: number) {
  const span = Math.max(0.0001, geo.motionEnd - geo.motionStart);
  const arc = geo.motionStart + span * clamp(journey, 0, 1);
  const f = arc * (geo.samples.length - 1);
  const i = clamp(Math.floor(f), 0, geo.samples.length - 2);
  const u = f - i;
  const A = geo.samples[i] ?? geo.samples[0];
  const B = geo.samples[i + 1] ?? A;
  if (!A || !B) return { x: 0, y: 0, a: 0 };
  return {
    x: A.x + (B.x - A.x) * u,
    y: A.y + (B.y - A.y) * u,
    a: lerpAngle(A.a, B.a, u),
  };
}

function toJourney(geo: Pick<Geo, "motionStart" | "motionEnd">, arc: number) {
  const span = Math.max(0.0001, geo.motionEnd - geo.motionStart);
  return clamp((arc - geo.motionStart) / span, 0, 1);
}

function curvedPath(startX: number, y0: number, turnX: number, radius: number, roadEndY: number) {
  const x1 = turnX + radius;
  const y1 = y0 + radius;
  return `M ${startX} ${y0} L ${turnX} ${y0} C ${turnX + KAPPA * radius} ${y0}, ${x1} ${y0 + (1 - KAPPA) * radius}, ${x1} ${y1} L ${x1} ${roadEndY}`;
}

function StopCopy({
  index,
  title,
  text,
  icon: Icon,
}: {
  index: string;
  title: string;
  text: string;
  icon: typeof Truck;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-route" strokeWidth={1.6} aria-hidden="true" />
        <span className="eyebrow text-route">{index}</span>
      </div>
      <h3 className="display mt-2 text-[13px] leading-tight tracking-wide text-[#142660]">
        {title}
      </h3>
      <p className="mt-1.5 text-[12.5px] leading-snug text-[#172033]/70">{text}</p>
    </>
  );
}

export function Journey() {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const blueRef = useRef<SVGPathElement>(null);
  const orangeRef = useRef<SVGPathElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const servicesLayerRef = useRef<HTMLDivElement>(null);
  const servicesHeadRef = useRef<HTMLDivElement>(null);
  const journeyHeadRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLParagraphElement>(null);
  const chevronRef = useRef<SVGGElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const geoRef = useRef<Geo | null>(null);
  const animRef = useRef<Anim>({
    target: 0,
    current: 0,
    angle: 0,
    viewX: 0,
    viewY: 0,
    kmh: 18,
    booted: false,
    mode: "",
    active: false,
  });

   useLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const scene = sceneRef.current;
    const motion = pathRef.current;
    if (!root || !pin || !scene || !motion) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
   
      gsap.registerPlugin(ScrollTrigger);

    const layout = () => {
      const w = pin.clientWidth;
      const h = pin.clientHeight;
      if (w < 64 || h < 64) return;

      const measured = probeRef.current?.getBoundingClientRect().width ?? 0;
      let truckW = measured > 40 ? measured : fallbackTruck(w);
      truckW = Math.min(truckW, w - 28, h * 0.46);
      const mode = modeFor(w);
      const body = truckW * (220 / 640);
      const roadW = clamp(body * 1.16, mode === "mobile" ? 72 : 96, mode === "desktop" ? 168 : 132);

      const stops = Array.from(pin.querySelectorAll<HTMLElement>("[data-stop]"));
      const serviceEls = stops.filter((el) => el.dataset["kind"] === "service");
      const stepEls = stops.filter((el) => el.dataset["kind"] === "step");
      const deliveredEl = stops.find((el) => el.dataset["kind"] === "delivered");

      let d = "";
      let shiftX = 0;
      let horizArc = 0.45;
      let curveArc = 0.62;
      let motionStartPt = { x: w / 2, y: 180 };
      let motionEndPt = { x: w / 2, y: h };
      let preferY = h * 0.48;
      let drift = Math.min(72, h * 0.08);
      let scroll = 4200;
      const services: StopPos[] = [];
      const steps: StopPos[] = [];
      let delivered: StopPos = { x: w / 2, y: h * 0.8, t: 0.97, w: 160, side: "", enter: "y" };

      if (mode === "mobile") {
        const x = Math.round(w / 2);
        const stepW = clamp((w - roadW) / 2 - 28, 116, 168);
        const gap = clamp(h * 0.2, 136, 168);
        const startY = Math.round(Math.max(220, truckW * 0.55 + 176));
        const count = SERVICES.length + STEPS.length;
        const stopY = startY + gap * (count + 0.35);
        const roadEnd = stopY + truckW * 0.62 + 36;
        d = `M ${x} ${startY - 28} L ${x} ${roadEnd}`;
        motionStartPt = { x, y: startY };
        motionEndPt = { x, y: stopY };
        preferY = clamp(h * 0.5, 260, h - truckW * 0.62 - 56);
        drift = Math.min(56, h * 0.06);
        scroll = Math.round(clamp(h * 4.4, 3200, 4600));
        const leftX = Math.max(12, x - roadW / 2 - 16 - stepW);
        const rightX = Math.min(w - stepW - 12, x + roadW / 2 + 16);
        for (let i = 0; i < count; i++) {
          const side: Side = i % 2 === 0 ? "right" : "left";
          const pos: StopPos = {
            x: side === "right" ? rightX : leftX,
            y: startY + gap * (i + 0.15),
            t: 0,
            w: stepW,
            side,
            enter: "x",
          };
          if (i < SERVICES.length) services.push(pos);
          else steps.push(pos);
        }
        const deliveredW = Math.min(220, w - 32);
        delivered = {
          x: x - deliveredW / 2,
          y: roadEnd + 8,
          t: 0.98,
          w: deliveredW,
          side: "",
          enter: "y",
        };
        shiftX = 0;
      } else {
        const visualH = truckW * SIDE_RATIO * 0.72;
        const topReserve = h < 760 ? 148 : 176;
        let y0 = topReserve + visualH + 12;
        y0 = clamp(y0, 108 + visualH, Math.max(108 + visualH, h * 0.4));
        const tierR =
          mode === "tablet" ? clamp(w * 0.145, 112, 168) : clamp(Math.min(w, h) * 0.2, 168, 248);
        let R = Math.min(tierR, Math.max(108, h * 0.58 - y0));
        const turnClear = Math.max(roadW * 0.55 + 18, truckW * 0.4);
        const verticalX = w - turnClear;
        let turnX = verticalX - R;
        const pathStart = 8;
        const truckStart = truckW * 0.5 + 36;
        while (turnX - truckStart < Math.min(340, w * 0.32) && R > 104) {
          R -= 6;
          turnX = verticalX - R;
        }
         const vertLen = clamp(mode === "tablet" ? 620 : 740, 560, 860);
        const stopY = y0 + R + vertLen;
        const roadEndY = stopY + truckW * 0.52 + 16;
        d = curvedPath(pathStart, y0, turnX, R, roadEndY);
        motionStartPt = { x: truckStart, y: y0 };
        motionEndPt = { x: verticalX, y: stopY };
        shiftX = w / 2 - verticalX;
        preferY = clamp(y0 + R, h * 0.4, h * 0.6);
        const bottomCap = h - truckW * 0.52 - 64;
        if (preferY > bottomCap) preferY = bottomCap;
        drift = Math.min(64, h * 0.07);
        scroll = Math.round(
          clamp(h * (mode === "tablet" ? 4.8 : 5.3), mode === "tablet" ? 4000 : 4500, 5500),
        );

        const travelLeft = truckStart + 8;
        const travelRight = turnX - 12;
        const usable = Math.max(120, travelRight - travelLeft);
        const cardW = clamp(usable / 6.6, 118, mode === "desktop" ? 176 : 148);
        const rowGap = h < 760 ? 86 : 108;
        for (let i = 0; i < SERVICES.length; i++) {
          const u = (i + 0.5) / SERVICES.length;
          services.push({
            x: travelLeft + usable * u - cardW / 2,
            y: y0 + roadW * 0.5 + 20 + (i % 2) * rowGap,
            t: 0,
            w: cardW,
            side: "",
            enter: "y",
          });
        }

        const shiftPreview = w / 2 - verticalX;
        const screenGap = roadW * 0.5 + 40;
        const stepW = clamp(
          mode === "desktop" ? 200 : 168,
          148,
          Math.max(148, w / 2 - screenGap - 28),
        );
        const rightScreen = Math.min(w / 2 + screenGap, w - stepW - 20);
        const leftScreen = Math.max(20, w / 2 - screenGap - stepW);
        const rightX = rightScreen - shiftPreview;
        const leftX = leftScreen - shiftPreview;
        const vertStart = y0 + R + 36;
        for (let i = 0; i < STEPS.length; i++) {
          const step = STEPS[i];
          if (!step) continue;
          const side = step.side;
          const y = vertStart + ((i + 0.35) / STEPS.length) * (vertLen - 40);
          steps.push({
            x: side === "right" ? rightX : leftX,
            y,
            t: 0,
            w: stepW,
            side,
            enter: "x",
          });
        }
        delivered = {
          x: verticalX - 90,
          y: roadEndY + 22,
          t: 0.985,
          w: 180,
          side: "",
          enter: "y",
        };
        
         if (watermarkRef.current) {
          watermarkRef.current.style.left = `${(truckStart + turnX) / 2}px`;
          watermarkRef.current.style.top = `${y0}px`;
          watermarkRef.current.style.fontSize = `${clamp(w * 0.075, 64, 132)}px`;
          watermarkRef.current.hidden = false;
        }
        if (chevronRef.current) chevronRef.current.style.display = "";
      }

      motion.setAttribute("d", d);
      const edge = pin.querySelector<SVGPathElement>("[data-road='edge']");
      const base = pin.querySelector<SVGPathElement>("[data-road='base']");
      const shadow = pin.querySelector<SVGPathElement>("[data-road='shadow']");
      for (const el of [edge, base, shadow, blueRef.current, orangeRef.current]) {
        if (!el) continue;
        el.setAttribute("d", d);
        if (el === edge || el === shadow) el.setAttribute("stroke-width", String(roadW));
        if (el === base) el.setAttribute("stroke-width", String(Math.max(8, roadW - 3)));
      }
      const lane = pin.querySelector<SVGPathElement>("[data-road='lane']");
      lane?.setAttribute("d", d);

      const { samples, total } = samplePath(motion);
      const motionStart = arcAt(samples, motionStartPt.x, motionStartPt.y);
      const motionEnd = Math.max(motionStart + 0.05, arcAt(samples, motionEndPt.x, motionEndPt.y));
      const partial = { motionStart, motionEnd };

      if (mode !== "mobile") {
        const y0 = motionStartPt.y;
        let curveStart = motionEnd;
        let verticalStart = motionEnd;
        for (let i = 0; i < samples.length; i++) {
          const sample = samples[i];
          if (!sample) continue;
          const arc = i / (samples.length - 1);
          if (arc < motionStart) continue;
          if (curveStart === motionEnd && sample.y > y0 + 8) curveStart = arc;
          if (sample.a > 1.2) {
            verticalStart = arc;
            break;
          }
        }
        horizArc = toJourney(partial, curveStart);
        curveArc = toJourney(partial, verticalStart);
      } else {
        horizArc = 0.5;
        curveArc = 0.58;
      }

      const place = (pos: StopPos) => {
        // Services sit beside the road, not on the centerline — time them from x/y along the route.
        if (mode !== "mobile" && pos.enter === "y") {
          const centerX = pos.x + pos.w / 2;
          pos.t = toJourney(partial, arcAt(samples, centerX, motionStartPt.y));
        } else if (mode !== "mobile" && pos.enter === "x") {
          pos.t = toJourney(partial, arcAt(samples, motionEndPt.x, pos.y));
        } else {
          const roadX = mode === "mobile" ? motionStartPt.x : pos.x + pos.w / 2;
          pos.t = toJourney(partial, arcAt(samples, roadX, pos.y));
        }
      };
      services.forEach(place);
      steps.forEach(place);
      if (mode === "mobile") {
        if (watermarkRef.current) watermarkRef.current.hidden = true;
        if (chevronRef.current) chevronRef.current.style.display = "none";
      }

      // Keep reveals strictly increasing and on the road segment they belong to.
      services.forEach((pos, i) => {
        const earlier = services[i - 1];
        const prev = earlier ? earlier.t + 0.03 : 0.04;
        pos.t = clamp(Math.max(pos.t, prev), 0.03, 0.97);
      });
      steps.forEach((pos, i) => {
        const earlier = steps[i - 1];
        const lastService = services[services.length - 1];
        const prev = earlier ? earlier.t + 0.03 : (lastService?.t ?? 0.4) + 0.04;
        pos.t = clamp(Math.max(pos.t, prev), 0.05, 0.97);
      });
      const lastStep = steps[steps.length - 1];
      delivered.t = clamp(Math.max(delivered.t, (lastStep?.t ?? 0.9) + 0.025), 0.9, 0.992);
      const lastService = services[services.length - 1];
      const firstStep = steps[0];
      if (mode === "mobile" && lastService && firstStep) {
        horizArc = (lastService.t + firstStep.t) / 2;
        curveArc = firstStep.t;
      }

      const geo: Geo = {
        mode,
        truckW,
        roadW,
        shiftX,
        total,
        motionStart,
        motionEnd,
        horizT: horizArc,
        curveT: curveArc,
        preferY,
        drift,
        scroll,
        samples,
        services,
        steps,
        delivered,
      };
      geoRef.current = geo;

      const worldH = Math.max(h, delivered.y + 90, motionEndPt.y + truckW);
      scene.style.height = `${worldH}px`;
      const svg = motion.ownerSVGElement;
      if (svg) {
        svg.setAttribute("viewBox", `0 0 ${w} ${worldH}`);
        svg.style.height = `${worldH}px`;
      }

      const applyPos = (el: HTMLElement | undefined, pos: StopPos) => {
        if (!el) return;
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
        el.style.width = `${pos.w}px`;
        el.dataset["side"] = pos.side;
        el.dataset["enter"] = pos.enter;
        el.dataset["t"] = pos.t.toFixed(4);
        if (el.dataset["state"] === "off" || !el.dataset["state"]) {
          gsap.set(el, {
            opacity: 0,
            x: pos.side === "left" ? -40 : pos.side === "right" ? 40 : 0,
            y: pos.enter === "y" ? 26 : 0,
            scale: pos.enter === "y" ? 0.97 : 0.96,
          });
          el.dataset["state"] = "off";
        }
      };
      serviceEls.forEach((el, i) => {
        const pos = services[i];
        if (pos) applyPos(el, pos);
      });
      stepEls.forEach((el, i) => {
        const pos = steps[i];
        if (pos) applyPos(el, pos);
      });
      if (deliveredEl) applyPos(deliveredEl, delivered);

      for (const line of [blueRef.current, orangeRef.current]) {
        if (!line) continue;
        line.style.strokeDasharray = `${total}`;
        line.style.strokeDashoffset = `${total}`;
      }

      if (mode !== "mobile" && chevronRef.current) {
        const mid = pointAt(geo, (geo.horizT + geo.curveT) / 2);
        const deg = (mid.a * 180) / Math.PI;
        chevronRef.current.setAttribute("transform", `translate(${mid.x} ${mid.y}) rotate(${deg})`);
      }

      if (truckRef.current) truckRef.current.style.width = `${truckW}px`;

      const anim = animRef.current;
      if (anim.mode !== mode) {
        anim.mode = mode;
        anim.booted = false;
      }
    };
      const ctx = gsap.context(() => {
      layout();
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${geoRef.current?.scroll ?? 4800}`,
        pin,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: layout,
        onToggle: (self) => {
          animRef.current.active = self.isActive;
        },
        onUpdate: (self) => {
          animRef.current.target = self.progress;
          animRef.current.active = self.isActive;
        },
        onLeave: () => {
          animRef.current.target = 1;
          animRef.current.active = false;
        },
        onLeaveBack: () => {
          animRef.current.target = 0;
          animRef.current.active = false;
        },
      });
    }, root);

     
      const play = (el: HTMLElement, vars: gsap.TweenVars) => {
      ctx.add(() => {
        gsap.to(el, vars);
      });
    };

    const syncStop = (el: HTMLElement, journey: number, active: boolean) => {
      const t = Number(el.dataset["t"] ?? 1);
      const on = journey >= t;
      const key = !on ? "off" : active ? "on" : "past";
      if (el.dataset["state"] === key) return;
      el.dataset["state"] = key;
      const side = el.dataset["side"];
      const enter = el.dataset["enter"];
      const x = side === "left" ? -40 : side === "right" ? 40 : 0;
      const y = enter === "y" ? 26 : 0;
      if (key === "off") {
        play(el, {
          opacity: 0,
          x,
          y,
          scale: enter === "y" ? 0.97 : 0.96,
          duration: 0.42,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      } else {
        play(el, {
          opacity: key === "on" ? 1 : 0.68,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.72,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

     const update = () => {
      const geo = geoRef.current;
      const anim = animRef.current;
      if (!geo || geo.samples.length < 2) return;

      const endBoost = !anim.active && (anim.target <= 0.001 || anim.target >= 0.999);
      const k = endBoost ? 0.38 : 0.15;
      anim.current += (anim.target - anim.current) * k;
      if (Math.abs(anim.target - anim.current) < 0.0006) anim.current = anim.target;
      const journey = anim.current;
      const pt = pointAt(geo, journey);

      if (!anim.booted) {
        anim.angle = pt.a;
        anim.viewX = 0;
        anim.viewY = 0;
        anim.booted = true;
      } else {
        anim.angle = lerpAngle(anim.angle, pt.a, 0.28);
      }

      const shiftT = smoothstep(geo.horizT, Math.min(0.99, geo.curveT + 0.03), journey);
      const descent = smoothstep(geo.curveT, 0.99, journey);
      const prefer = geo.preferY + descent * geo.drift;
      const locked = prefer - pt.y;
      let targetVY = 0;
      if (locked < 0) {
        const blend =
          geo.mode === "mobile"
            ? smoothstep(0.03, 0.14, journey)
            : smoothstep(geo.horizT, geo.curveT + 0.02, journey);
        targetVY = locked * blend;
      }
      const targetVX = geo.shiftX * shiftT;
      anim.viewX += (targetVX - anim.viewX) * 0.11;
      anim.viewY += (targetVY - anim.viewY) * 0.11;

      if (scene) scene.style.transform = `translate3d(${anim.viewX}px, ${anim.viewY}px, 0)`;

      const arcLen = (geo.motionStart + (geo.motionEnd - geo.motionStart) * journey) * geo.total;
      const bob = Math.sin(arcLen * 0.021) * 1.15;
      if (truckRef.current) {
        truckRef.current.style.transform = `translate3d(${pt.x}px, ${pt.y + bob}px, 0)`;
      }
      if (shadowRef.current) {
        const wide = geo.truckW * (0.72 - shiftT * 0.22);
        shadowRef.current.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
        shadowRef.current.style.width = `${wide}px`;
        shadowRef.current.style.opacity = `${0.28 + Math.sin(arcLen * 0.021) * 0.04}`;
      }

      const fade = geo.mode === "mobile" ? 1 : smoothstep(0.16, 0.78, Math.abs(anim.angle));
      if (sideRef.current) sideRef.current.style.opacity = String(1 - fade);
      if (topRef.current) {
        topRef.current.style.opacity = String(fade);
        const deg = (anim.angle * 180) / Math.PI;
        topRef.current.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
      }

       const drawn = arcLen;
      const offset = Math.max(0, geo.total - drawn);
      for (const line of [blueRef.current, orangeRef.current]) {
        if (!line) continue;
        line.style.strokeDashoffset = `${offset}`;
      }

      const reveal = (kind: "service" | "step") => {
        const list = Array.from(pin.querySelectorAll<HTMLElement>(`[data-kind='${kind}']`));
        let active = -1;
        list.forEach((el, i) => {
          if (journey >= Number(el.dataset["t"] ?? 1)) active = i;
        });
        list.forEach((el, i) => syncStop(el, journey, i === active));
      };
      reveal("service");
      reveal("step");
      const deliveredEl = pin.querySelector<HTMLElement>("[data-kind='delivered']");
      if (deliveredEl)
        syncStop(deliveredEl, journey, journey >= Number(deliveredEl.dataset["t"] ?? 1));

      if (servicesLayerRef.current && geo.mode !== "mobile") {
        const leave = smoothstep(geo.horizT, geo.curveT + 0.05, journey);
        servicesLayerRef.current.style.opacity = String(1 - leave);
        servicesLayerRef.current.style.transform = `translateY(${-leave * 16}px)`;
      } else if (servicesLayerRef.current) {
        servicesLayerRef.current.style.opacity = "1";
        servicesLayerRef.current.style.transform = "none";
      }

      const swapStart = geo.mode === "mobile" ? geo.horizT : geo.curveT + 0.07;
      const swapEnd = swapStart + (geo.mode === "mobile" ? 0.06 : 0.1);
      const intro = 1 - smoothstep(swapStart, swapEnd, journey);
      const outro = smoothstep(swapStart, swapEnd, journey);
      if (servicesHeadRef.current) {
        servicesHeadRef.current.style.opacity = String(intro);
        servicesHeadRef.current.style.transform = `translateY(${(1 - intro) * -12}px)`;
      }
       if (journeyHeadRef.current) {
        journeyHeadRef.current.style.opacity = String(outro);
        journeyHeadRef.current.style.transform = `translateY(${(1 - outro) * 14}px)`;
      }
      if (watermarkRef.current && !watermarkRef.current.hidden) {
        watermarkRef.current.style.opacity = String(0.07 * intro);
      }

      const turnAmount = clamp(Math.abs(anim.angle) / 1.2, 0, 1);
      const moving = journey > 0.012 && journey < 0.985;
      const pace = journey >= 0.985 ? 0 : moving ? 26 + 16 * (1 - turnAmount) : 18;
      anim.kmh += (pace - anim.kmh) * 0.08;
      if (speedRef.current) {
        const next = `${Math.round(anim.kmh)} KM/H`;
        if (speedRef.current.textContent !== next) speedRef.current.textContent = next;
      }
    };

    const onTick = () => update();
    gsap.ticker.add(onTick);
    update();

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);

    return () => {
      gsap.ticker.remove(onTick);
      ctx.revert();
    };
  }, []);
  
   return (
    <section
      id="services"
      ref={rootRef}
      className="relative bg-[#F5F7FB] text-[#172033]"
      aria-labelledby="services-heading"
    >
      <div ref={pinRef} className="aw-journey aw-journey-pin relative h-[100svh] overflow-hidden">
        <div ref={probeRef} className="aw-truck-probe" aria-hidden="true" />

        <div
          ref={servicesHeadRef}
          className="pointer-events-none absolute inset-x-0 top-[64px] z-30 bg-[#F5F7FB] px-5 pb-3 pt-2 text-center md:top-[92px] md:bg-transparent md:pb-0 md:pt-0"
        >
          <p className="eyebrow text-route">04 / The route</p>
          <h2
            id="services-heading"
            className="display mt-3 text-[clamp(32px,4.6vw,64px)] text-primary"
          >
            Our Services
          </h2>
        </div>

        <div
          ref={journeyHeadRef}
          className="pointer-events-none absolute z-30 opacity-0 max-md:inset-x-0 max-md:top-[64px] max-md:bg-[#F5F7FB] max-md:px-5 max-md:pb-3 max-md:pt-2 max-md:text-center md:left-10 md:top-[13%] md:w-[min(16.5rem,22vw)]"
        >
          <p className="eyebrow text-route">Final mile</p>
          <h3 className="display mt-2 text-[clamp(22px,6vw,44px)] leading-[0.98] text-primary md:mt-3 md:bg-[#F5F7FB] md:px-1 md:text-[clamp(26px,3vw,44px)] md:[box-decoration-break:clone]">
            Reliability at every milestone
          </h3>
          <p className="mt-3 hidden max-w-sm text-[14px] leading-relaxed text-[#172033]/70 md:block md:text-[15px]">
            From facility to front door. The last miles are where a brand is kept.
          </p>
        </div>

        <div ref={sceneRef} className="absolute left-0 top-0 w-full will-change-transform">
          <svg className="absolute left-0 top-0 w-full overflow-visible" aria-hidden="true">
            <defs>
              <filter id={`aw-road-shadow-${uid}`} x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
                <feOffset dy="8" result="off" />
                <feFlood floodColor="#142660" floodOpacity="0.16" result="color" />
                <feComposite in="color" in2="off" operator="in" result="shadow" />
                <feMerge>
                  <feMergeNode in="shadow" />
                </feMerge>
              </filter>
            </defs>
            <path
              data-road="shadow"
              fill="none"
              stroke="#142660"
              strokeLinecap="butt"
              filter={`url(#aw-road-shadow-${uid})`}
            />
            <path
              data-road="edge"
              fill="none"
              stroke="white"
              strokeOpacity="0.28"
              strokeLinecap="butt"
              strokeLinejoin="round"
            />
             <path
              data-road="base"
              fill="none"
              stroke="#142660"
              strokeLinecap="butt"
              strokeLinejoin="round"
            />
            <path
              ref={blueRef}
              fill="none"
              stroke="#2D419A"
              strokeWidth="4.5"
              strokeOpacity="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              ref={orangeRef}
              fill="none"
              stroke="#F3692B"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              data-road="lane"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.5"
              strokeDasharray="16 18"
              strokeLinecap="butt"
            />
             <path ref={pathRef} fill="none" stroke="none" />
            <g
              ref={chevronRef}
              fill="none"
              stroke="white"
              strokeWidth="1.7"
              strokeOpacity="0.45"
              strokeLinecap="round"
            >
              <path d="M-34 -16 L-16 0 L-34 16" />
              <path d="M-16 -14 L2 0 L-16 14" />
              <path d="M2 -12 L20 0 L2 12" />
            </g>
          </svg>

          <p
            ref={watermarkRef}
            className="display pointer-events-none absolute z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[#2D419A]"
            style={{ opacity: 0.07 }}
          >
            Services
          </p>

          <div ref={servicesLayerRef} className="absolute inset-0 z-[4]">
            {SERVICES.map((service, i) => (
              <article
                key={service.title}
                data-stop=""
                data-kind="service"
                data-state="off"
                className="absolute opacity-0"
              >
                 <StopCopy
                  index={`0${i + 1}`}
                  title={service.title}
                  text={service.text}
                  icon={service.icon}
                />
              </article>
            ))}
          </div>

          {STEPS.map((step, i) => (
            <article
              key={step.title}
              data-stop=""
              data-kind="step"
              data-state="off"
              className="absolute z-[4] opacity-0"
            >
              <StopCopy index={`0${i + 1}`} title={step.title} text={step.text} icon={step.icon} />
            </article>
          ))}

          <div
            data-stop=""
            data-kind="delivered"
            data-state="off"
            className="absolute z-[5] text-center opacity-0"
          >
             <span className="relative mx-auto block h-3 w-3 rounded-full bg-route">
              <span className="absolute inset-0 animate-[hub-pulse_2.6s_ease-out_infinite] rounded-full bg-route" />
            </span>
            <p className="display mt-3 text-[clamp(22px,2vw,32px)] text-route">Delivered.</p>
          </div>

          <div
            ref={shadowRef}
            className="pointer-events-none absolute left-0 top-0 z-[6] h-3 rounded-full bg-[#142660]/30 blur-[5px]"
            aria-hidden="true"
          />
          <div
            ref={truckRef}
            className="absolute left-0 top-0 z-[7] h-0 overflow-visible"
            style={{ width: "var(--truck-w)" }}
          >
            <div
              ref={sideRef}
              className="pointer-events-none absolute bottom-0 left-0 w-full -translate-x-1/2 translate-y-[12%] select-none"
            >
              <TruckModel />
            </div>
            <div
              ref={topRef}
              className="pointer-events-none absolute left-0 top-0 w-full opacity-0"
            >
              <TruckModel view="top" />
            </div>
          </div>
        </div>

         <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[25] h-16 bg-gradient-to-b from-[#F5F7FB] to-transparent"
          aria-hidden="true"
        />

        <span
          ref={speedRef}
          className="pointer-events-none absolute bottom-6 left-6 z-40 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#142660]/55 tabular-nums md:left-10"
          aria-hidden="true"
        >
          18 KM/H
        </span>
      </div>

      <div className="aw-journey-static section-y">
        <div className="container-aw">
          <p className="eyebrow text-route">04 / The route</p>
          <h2 className="display mt-3 text-[clamp(38px,8vw,52px)] text-primary">Our Services</h2>
          <div className="mt-6 w-[min(420px,88vw)]">
            <TruckModel />
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <article key={service.title}>
                <StopCopy
                  index={`0${i + 1}`}
                  title={service.title}
                  text={service.text}
                  icon={service.icon}
                />
              </article>
                ))}
          </div>
          <div className="mt-14">
            <p className="eyebrow text-route">Final mile</p>
            <h3 className="display mt-3 text-[clamp(28px,4vw,44px)] text-primary">
              Reliability at every milestone
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#172033]/70">
              From facility to front door. The last miles are where a brand is kept.
            </p>
            <ol className="relative mt-8 space-y-6 border-l-2 border-[#142660] pl-6">
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <StopCopy
                    index={`0${i + 1}`}
                    title={step.title}
                    text={step.text}
                    icon={step.icon}
                  />
                </li>
              ))}
              <li className="pt-2">
                <p className="display text-xl text-route">Delivered.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
