import { useId, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TruckModel, type TruckPose } from "./TruckModel";
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

const BASE = "#0F1730";
const SIDE_RATIO = 1 / 3.4;
const ROAD_LEAD = 140;
/** Services row ends while the camera is still locked on the bottom band. */
const SERVICES_END = 0.42;
/** First bend. Everything before this is a straight road. */
const HORIZ_END = 0.6;
const TURN_MID = 0.7;
const TURN_DOWN = 0.78;
const MILE_START = 0.84;
const SERVICE_ZONES = [0.1, 0.22, 0.34, 0.46, 0.58, 0.7];

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

type Marker = { j: number; u: number };

type Geo = {
  mode: Mode;
  truckW: number;
  roadW: number;
  yEdge: number;
  baseH: number;
  total: number;
  roadStartU: number;
  roadTotal: number;
  lead: number;
  markers: Marker[];
  samples: Sample[];
  services: StopPos[];
  steps: StopPos[];
  delivered: StopPos;
  scroll: number;
  preferY: number;
  shiftX: number;
  showBase: boolean;
  roadStartX: number;
  viewW: number;
  curveY: number;
  vertX: number;
  yEnd: number;
  /** How far Nationwide is pulled up so it meets the road with no white gap. */
  overlap: number;
  /** Scene offset that holds every milestone card inside the pin. */
  frameY: number;
  /** Road length through the end of the second bend. */
  curveLen: number;
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
  revealed: number;
  lane: number;
  /** Right-hand branch of the second turn. Stays once the junction has been reached. */
  spur: number;
  shaped: number;
  revealJ: number;
  heldY: number | null;
};

type Pt = { x: number; y: number };

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

function n(v: number) {
  return Math.round(v * 10) / 10;
}

function fallbackTruck(w: number) {
  if (w >= 1024) return clamp(w * 0.28, 360, 440);
  if (w >= 768) return clamp(w * 0.34, 240, 310);
  return clamp(w * 0.56, 168, 230);
}

function modeFor(w: number): Mode {
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function samplePath(path: SVGPathElement, count = 360): { samples: Sample[]; total: number } {
  const total = path.getTotalLength();
  const samples: Sample[] = [];
  let prev = 0;
  for (let i = 0; i < count; i++) {
    const d = i / (count - 1);
    const p = path.getPointAtLength(total * d);
    const ahead = path.getPointAtLength(total * Math.min(1, d + 0.0025));
    const behind = path.getPointAtLength(total * Math.max(0, d - 0.0025));
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
  return best / Math.max(1, samples.length - 1);
}

function mapJourney(markers: Marker[], j: number) {
  const first = markers[0];
  if (!first || j <= first.j) return first?.u ?? 0;
  for (let i = 1; i < markers.length; i++) {
    const a = markers[i - 1];
    const b = markers[i];
    if (!a || !b) continue;
    if (j <= b.j) {
      const t = b.j === a.j ? 1 : (j - a.j) / (b.j - a.j);
      return a.u + (b.u - a.u) * t;
    }
  }
  return markers[markers.length - 1]?.u ?? 1;
}

function mapProgress(markers: Marker[], u: number) {
  for (let i = 1; i < markers.length; i++) {
    const a = markers[i - 1];
    const b = markers[i];
    if (!a || !b) continue;
    if (b.u <= a.u + 0.00001) continue;
    if (u <= b.u) {
      const t = (u - a.u) / (b.u - a.u);
      return a.j + (b.j - a.j) * clamp(t, 0, 1);
    }
  }
  return markers[markers.length - 1]?.j ?? 1;
}

function atU(samples: Sample[], u: number) {
  const f = clamp(u, 0, 1) * (samples.length - 1);
  const i = clamp(Math.floor(f), 0, samples.length - 2);
  const t = f - i;
  const A = samples[i] ?? samples[0];
  const B = samples[i + 1] ?? A;
  if (!A || !B) return { x: 0, y: 0, a: 0 };
  return {
    x: A.x + (B.x - A.x) * t,
    y: A.y + (B.y - A.y) * t,
    a: lerpAngle(A.a, B.a, t),
  };
}

/** Cubic Bézier for an elliptical arc, φ in standard position, y-down. */
function ellipseCubic(cx: number, cy: number, rx: number, ry: number, phi0: number, phi1: number) {
  const arc = phi1 - phi0;
  const k = (4 / 3) * Math.tan(arc / 4);
  const p = (phi: number): Pt => ({
    x: cx + rx * Math.cos(phi),
    y: cy + ry * Math.sin(phi),
  });
  const d = (phi: number): Pt => ({
    x: -rx * Math.sin(phi),
    y: ry * Math.cos(phi),
  });
  const p0 = p(phi0);
  const p3 = p(phi1);
  const d0 = d(phi0);
  const d3 = d(phi1);
  return {
    p0,
    p1: { x: p0.x + k * d0.x, y: p0.y + k * d0.y },
    p2: { x: p3.x - k * d3.x, y: p3.y - k * d3.y },
    p3,
  };
}

function cubicCmd(c: { p1: Pt; p2: Pt; p3: Pt }) {
  return `C ${n(c.p1.x)} ${n(c.p1.y)}, ${n(c.p2.x)} ${n(c.p2.y)}, ${n(c.p3.x)} ${n(c.p3.y)}`;
}

function offsetPath(path: SVGPathElement, dist: number, count = 96) {
  const total = path.getTotalLength();
  if (total < 1) return "";
  let d = "";
  for (let i = 0; i < count; i++) {
    const len = (i / (count - 1)) * total;
    const p = path.getPointAtLength(len);
    const q = path.getPointAtLength(Math.min(total, len + 1.5));
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const hyp = Math.hypot(dx, dy) || 1;
    const x = p.x + (dy / hyp) * dist;
    const y = p.y - (dx / hyp) * dist;
    d += i === 0 ? `M ${n(x)} ${n(y)}` : ` L ${n(x)} ${n(y)}`;
  }
  return d;
}

function StopCopy({
  index,
  title,
  text,
  icon: Icon,
  tone = "ink",
  scale = "service",
}: {
  index: string;
  title: string;
  text: string;
  icon: typeof Truck;
  tone?: "ink" | "light";
  scale?: "service" | "mile";
}) {
  const light = tone === "light";
  const mile = scale === "mile";
  return (
    <>
      <div className="flex items-center gap-2">
        <Icon
          className={light ? "h-4 w-4 shrink-0 text-current" : "h-4 w-4 shrink-0 text-route"}
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-route">{index}</span>
      </div>
      <h3
        className={`display mt-2 leading-[1.15] tracking-wide text-balance ${
          mile ? "text-[21px]" : "text-[19px]"
        } ${light ? "text-current" : "text-[#142660]"}`}
      >
        {title}
      </h3>
      <p
        className={`mt-2 leading-[1.55] ${
          mile ? "text-[15px]" : "text-[15px]"
        } ${light ? "text-current opacity-75" : "text-[#172033]/75"}`}
      >
        {text}
      </p>
    </>
  );
}

export function Journey() {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<SVGPathElement>(null);
  const roadRef = useRef<SVGPathElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const laneLRef = useRef<SVGPathElement>(null);
  const laneRRef = useRef<SVGPathElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const poseRef = useRef<TruckPose>({ pitch: 0, heading: 0, distance: 0 });
  const servicesLayerRef = useRef<HTMLDivElement>(null);
  const serviceLeadRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const journeyHeadRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const exitMaskRef = useRef<HTMLDivElement>(null);
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
    revealed: 0,
    lane: 0,
    spur: 0,
    shaped: 0,
    revealJ: 0,
    heldY: null,
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const scene = sceneRef.current;
    const motion = motionRef.current;
    const road = roadRef.current;
    const mask = maskRef.current;
    if (!root || !pin || !scene || !motion || !road || !mask) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const layout = () => {
      const w = pin.clientWidth;
      const h = pin.clientHeight;
      if (w < 64 || h < 64) return;

      const measured = probeRef.current?.getBoundingClientRect().width ?? 0;
      let truckW = measured > 40 ? measured : fallbackTruck(w);
      const mode = modeFor(w);
      const truckH = truckW * SIDE_RATIO;
      const stops = Array.from(pin.querySelectorAll<HTMLElement>("[data-stop]"));
      const serviceEls = stops.filter((el) => el.dataset["kind"] === "service");
      const stepEls = stops.filter((el) => el.dataset["kind"] === "step");
      const deliveredEl = stops.find((el) => el.dataset["kind"] === "delivered");

      let motionD = "";
      let roadD = "";
      let roadW = 150;
      let yEdge = h * 0.62;
      let baseH = 300;
      let showBase = true;
      let shiftX = 0;
      let preferY = h * 0.46;
      let scroll = 4800;
      const services: StopPos[] = [];
      const steps: StopPos[] = [];
      let delivered: StopPos = { x: w / 2, y: h, t: 0.98, w: 180, side: "", enter: "y" };
      let markers: Marker[] = [
        { j: 0, u: 0 },
        { j: 1, u: 1 },
      ];
      let roadStartHint = { x: 0, y: 0 };
      let curveY = 0;
      let turn1 = { x: 0, y: 0 };
      let vertX = w * 0.72;
      let yJoin = h;
      let yFirstStep = h;
      let yLastStep = h;
      let yStop = h;
      let yTruckEnd = h;
      let yEnd = h;
      let frameY = 0;

      if (mode === "mobile") {
        showBase = false;
        truckW = Math.min(truckW, w * 0.72);
        roadW = clamp(truckW * 0.42, 86, 120);
        const x = Math.round(w / 2);
        const stepW = clamp((w - roadW) / 2 - 28, 112, 160);
        const gap = clamp(h * 0.16, 118, 150);
        const startY = Math.round(Math.max(168, truckH + 96));
        const count = SERVICES.length + STEPS.length;
        const stopY = startY + gap * count;
        const roadEnd = stopY + truckW * 0.42 + 28;
        yEnd = roadEnd;
        motionD = `M ${x} ${startY - 20} L ${x} ${roadEnd}`;
        roadD = motionD;
        roadStartHint = { x, y: startY - 20 };
        vertX = x;
        yEdge = startY;
        baseH = 0;
        preferY = clamp(h * 0.42, 180, h * 0.5);
        shiftX = 0;
        scroll = Math.round(clamp(h * 4.2, 2800, 4200));
        const leftX = Math.max(12, x - roadW / 2 - 14 - stepW);
        const rightX = Math.min(w - stepW - 12, x + roadW / 2 + 14);
        for (let i = 0; i < count; i++) {
          const side: Side = i % 2 === 0 ? "right" : "left";
          const pos: StopPos = {
            x: side === "right" ? rightX : leftX,
            y: startY + gap * i,
            t: 0,
            w: stepW,
            side,
            enter: "x",
          };
          if (i < SERVICES.length) services.push(pos);
          else steps.push(pos);
        }
        delivered = {
          x: x - 90,
          y: roadEnd + 8,
          t: 0.98,
          w: 180,
          side: "",
          enter: "y",
        };
        markers = [
          { j: 0, u: 0 },
          { j: 1, u: 1 },
        ];
        if (serviceLeadRef.current) serviceLeadRef.current.style.display = "none";
      } else {
        const navClear = 78;
        const band = clamp(h * 0.42, mode === "desktop" ? 340 : 300, mode === "desktop" ? 420 : 360);
        baseH = band;
        const maxBase = h - navClear - truckH - 36;
        baseH = clamp(Math.min(baseH, maxBase), 220, baseH);
        truckW = Math.min(truckW, (h - baseH - navClear - 16) / SIDE_RATIO, w * 0.52);
        if (mode === "desktop") truckW = clamp(truckW, 360, 440);
        yEdge = h - baseH;
        // Final road width. It starts as the full band and narrows into this.
        roadW = clamp(h * 0.28, 220, 300);
        const yCenter = yEdge + baseH / 2;

        // A shorter straight run, then one quarter-turn down.
        const r = clamp(h * 0.42, 300, 420);
        const xStart = clamp(truckW * 0.2, 64, 140);
        const P0x = xStart + w * 1.28;
        const phiA = -Math.PI / 2;
        const C1x = P0x;
        const C1y = yCenter + r;
        const arc1 = ellipseCubic(C1x, C1y, r, r, phiA, 0);
        const mid = ellipseCubic(C1x, C1y, r, r, phiA, -Math.PI / 4);
        const P0 = { x: P0x, y: yCenter };
        turn1 = mid.p3;
        vertX = arc1.p3.x;
        yJoin = arc1.p3.y;
        curveY = yJoin;
        const stepGap = clamp(h * 0.52, 440, 580);
        yFirstStep = yJoin + Math.max(220, roadW * 0.85);
        frameY = 0;
        yLastStep = yFirstStep + (STEPS.length - 1) * stepGap;
        const extra = 420;
        yStop = yLastStep + extra;
        yTruckEnd = yStop + Math.round(h * 0.45);
        yEnd = yTruckEnd + Math.round(h * 1.2);
        const bend = cubicCmd(arc1);

        motionD = `M ${n(xStart)} ${n(yCenter)} L ${n(P0.x)} ${n(P0.y)} ${bend} L ${n(vertX)} ${n(yEnd)}`;
        const roadStartX = -40;
        roadD = `M ${n(roadStartX)} ${n(yCenter)} L ${n(P0.x)} ${n(P0.y)} ${bend} L ${n(vertX)} ${n(yEnd)}`;
        roadStartHint = { x: roadStartX, y: yCenter };

        shiftX = w / 2 - vertX;
        preferY = h * 0.46;
        scroll = Math.round(clamp(h * (mode === "tablet" ? 9.4 : 10.8), 8600, 12400));

        const cardW = clamp(w * 0.26, 280, 380);
        const gap = clamp(w * 0.032, 36, 56);
        const leadW = clamp(w * 0.28, 260, 400);
        const cardY = yEdge + clamp((baseH - 280) / 2, 18, 72);
        let cursor = Math.round(w * 0.36);
        if (serviceLeadRef.current) {
          const lead = serviceLeadRef.current;
          lead.style.left = `${cursor}px`;
          lead.style.top = `${cardY + 28}px`;
          lead.style.width = `${leadW}px`;
          lead.dataset["home"] = String(cursor);
          lead.style.display = "";
        }
        cursor += leadW + Math.round(gap * 1.6);
        for (let i = 0; i < SERVICES.length; i++) {
          const zone = SERVICE_ZONES[i] ?? 0.7;
          services.push({
            x: cursor,
            y: cardY,
            t: zone * HORIZ_END,
            w: cardW,
            side: "",
            enter: "x",
          });
          cursor += cardW + gap;
        }
        const last = services[services.length - 1];
        if (servicesLayerRef.current && last) {
          servicesLayerRef.current.dataset["shiftEnd"] = String(Math.round(w * 0.46 - last.x));
        }

        const stepW = clamp(mode === "desktop" ? 320 : 280, 240, 360);
        const headW = clamp(w * 0.26, 240, 360);
        if (journeyHeadRef.current) {
          journeyHeadRef.current.style.left = "48px";
          journeyHeadRef.current.style.top = `${Math.round(h * 0.22)}px`;
          journeyHeadRef.current.style.width = `${headW}px`;
        }
        if (watermarkRef.current) {
          const wm = watermarkRef.current;
          wm.style.left = "50%";
          wm.style.right = "auto";
          wm.style.width = "max-content";
          wm.style.maxWidth = "none";
          wm.style.transform = "translate(-50%, 0)";
          wm.style.whiteSpace = "nowrap";
          wm.style.lineHeight = "0.86";
          const maxW = Math.max(280, w - 48);
          let size = clamp(w * 0.16, 96, 220);
          wm.style.fontSize = `${size}px`;
          for (let i = 0; i < 8 && wm.scrollWidth > maxW; i++) {
            size = Math.max(56, size * (maxW / Math.max(wm.scrollWidth, 1)) * 0.98);
            wm.style.fontSize = `${size}px`;
          }
          const avail = Math.max(72, yEdge - 96);
          const measured = wm.offsetHeight || size * 0.86;
          if (measured > avail) {
            size = Math.max(56, size * (avail / measured) * 0.96);
            wm.style.fontSize = `${size}px`;
          }
          const textH = wm.offsetHeight || size * 0.86;
          wm.style.top = `${Math.max(80, yEdge - textH - 14)}px`;
          wm.style.opacity = "1";
        }

        const gutter = 56;
        const rightX = vertX + roadW / 2 + gutter;
        for (let i = 0; i < STEPS.length; i++) {
          const y = yFirstStep + i * stepGap;
          steps.push({
            x: rightX,
            y,
            t: 0,
            w: stepW,
            side: "right",
            enter: "x",
          });
        }
        delivered = {
          x: vertX - 100,
          y: yStop,
          t: 0.988,
          w: 210,
          side: "",
          enter: "y",
        };
      }

      motion.setAttribute("d", motionD);
      road.setAttribute("d", roadD);
      mask.setAttribute("d", roadD);
      mask.setAttribute("stroke-width", String(roadW + 2));
      road.setAttribute("stroke-width", String(roadW));

      const { samples, total } = samplePath(motion);
      const roadLen = road.getTotalLength();
      const roadStartU = arcAt(samples, roadStartHint.x, roadStartHint.y);
      let curveLen = roadLen;
      if (mode !== "mobile" && roadLen > 1) {
        let best = Infinity;
        for (let i = 0; i <= 160; i++) {
          const point = road.getPointAtLength((roadLen * i) / 160);
          const dist = (point.x - vertX) ** 2 + (point.y - yJoin) ** 2;
          if (dist < best) {
            best = dist;
            curveLen = (roadLen * i) / 160;
          }
        }
      }

      if (mode !== "mobile") {
        let uFlat = 0.2;
        for (let i = 0; i < samples.length; i++) {
          const sample = samples[i];
          if (!sample) continue;
          if (sample.a < 0.08) uFlat = i / (samples.length - 1);
          else break;
        }
        const after = (u: number, min: number) => Math.max(u, min + 0.004);
        const u1 = after(arcAt(samples, turn1.x, turn1.y), uFlat);
        const u2 = after(arcAt(samples, vertX, yJoin), u1);
        const uSettle = after(arcAt(samples, vertX, yJoin + 56), u2);
        const uCard0 = after(arcAt(samples, vertX, yFirstStep), uSettle);
        const uCardN = after(arcAt(samples, vertX, yLastStep), uCard0);
        const uExtra = after(arcAt(samples, vertX, yStop), uCardN);
        const uEnd = after(arcAt(samples, vertX, yTruckEnd), uExtra);
        const uScreenRaw = arcAt(samples, w * 0.78, yEdge + roadW / 2);
        const uScreen = Math.min(uScreenRaw, Math.max(0.02, uFlat * 0.9));
        markers = [
          { j: 0, u: 0 },
          { j: SERVICES_END, u: uScreen },
          { j: HORIZ_END, u: uFlat },
          { j: TURN_MID, u: u1 },
          { j: TURN_DOWN, u: u2 },
          { j: TURN_DOWN + 0.02, u: uSettle },
          { j: MILE_START, u: uCard0 },
          { j: 0.94, u: uCardN },
          { j: 0.975, u: uExtra },
          { j: 1, u: uEnd },
        ];
      }

      const place = (pos: StopPos, kind: "service" | "step") => {
        if (mode === "mobile") {
          pos.t = mapProgress(markers, arcAt(samples, w / 2, pos.y));
          return;
        }
        if (kind === "service") {
          pos.t = mapProgress(markers, arcAt(samples, pos.x + pos.w / 2, yEdge));
        } else {
          const vertX = w / 2 - shiftX;
          pos.t = mapProgress(markers, arcAt(samples, vertX, pos.y));
        }
      };
      services.forEach((pos) => place(pos, "service"));
      steps.forEach((pos) => place(pos, "step"));
      services.forEach((pos, i) => {
        if (mode === "mobile") {
          const earlier = services[i - 1];
          const prev = earlier ? earlier.t + 0.04 : 0.1;
          pos.t = clamp(Math.max(pos.t, prev), 0.09, 0.55);
          return;
        }
        const zone = SERVICE_ZONES[i] ?? 0.7;
        pos.t = zone * SERVICES_END;
      });
      steps.forEach((pos, i) => {
        const earlier = steps[i - 1];
        const floor = mode === "mobile" ? 0.5 : MILE_START;
        const prev = earlier ? earlier.t + 0.012 : floor;
        const cap = mode === "mobile" ? 0.96 : 0.93;
        pos.t = clamp(Math.max(pos.t, prev), floor, cap);
      });
      const lastStep = steps[steps.length - 1];
      delivered.t = clamp((lastStep?.t ?? 0.9) + 0.04, 0.9, 0.96);
      if (mode !== "mobile") delivered.t = 0.962;

      if (laneLRef.current) laneLRef.current.setAttribute("d", offsetPath(road, roadW * 0.2));
      if (laneRRef.current) laneRRef.current.setAttribute("d", offsetPath(road, -roadW * 0.2));

      const worldH = Math.max(h + 40, yEnd + 80, delivered.y + 140);
      const worldW = Math.max(w, vertX + w, w * 3.2);
      scene.style.height = `${worldH}px`;
      const svg = motion.ownerSVGElement;
      if (svg) {
        svg.setAttribute("viewBox", `0 0 ${worldW} ${worldH}`);
        svg.style.width = `${worldW}px`;
        svg.style.height = `${worldH}px`;
      }
      const maskEl = mask.parentElement;
      if (maskEl) {
        maskEl.setAttribute("x", "-800");
        maskEl.setAttribute("y", "-800");
        maskEl.setAttribute("width", String(Math.max(w, vertX) + 1600));
        maskEl.setAttribute("height", String(worldH + 1200));
      }

      if (baseRef.current) {
        baseRef.current.style.top = `${yEdge}px`;
        baseRef.current.style.height = `${baseH}px`;
        baseRef.current.style.left = `${-w}px`;
        baseRef.current.style.width = `${w * 3}px`;
        baseRef.current.style.display = showBase ? "" : "none";
      }

      const geo: Geo = {
        mode,
        truckW,
        roadW,
        yEdge,
        baseH,
        total,
        roadStartU,
        roadTotal: roadLen,
        lead: ROAD_LEAD,
        markers,
        samples,
        services,
        steps,
        delivered,
        scroll,
        preferY,
        shiftX,
        showBase,
        roadStartX: roadStartHint.x,
        viewW: w,
        curveY,
        vertX,
        yEnd,
        overlap: 0,
        frameY,
        curveLen,
      };
      geoRef.current = geo;

      const applyPos = (el: HTMLElement | undefined, pos: StopPos) => {
        if (!el) return;
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
        el.style.width = `${pos.w}px`;
        el.dataset["side"] = pos.side;
        el.dataset["enter"] = pos.enter;
        el.dataset["t"] = pos.t.toFixed(4);
        if (mode !== "mobile" && el.dataset["kind"] === "service") {
          gsap.killTweensOf(el);
          gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
          el.dataset["state"] = "on";
          return;
        }
        if (el.dataset["state"] === "off" || !el.dataset["state"]) {
          const service = el.dataset["kind"] === "service";
          gsap.set(el, {
            opacity: 0,
            x: pos.side === "left" ? -50 : pos.side === "right" ? 50 : 0,
            y: el.dataset["kind"] === "delivered" ? 18 : service ? 24 : 0,
            scale: service ? 0.97 : 0.98,
          });
          el.dataset["state"] = "off";
        }
      };
      serviceEls.forEach((el, i) => {
        const pos = services[i];
        if (pos) applyPos(el, pos);
        el.classList.toggle("text-white", mode !== "mobile");
        el.classList.toggle("text-[#172033]", mode === "mobile");
      });
      stepEls.forEach((el, i) => {
        const pos = steps[i];
        if (pos) applyPos(el, pos);
      });
      if (deliveredEl) applyPos(deliveredEl, delivered);

      if (truckRef.current) truckRef.current.style.width = `${truckW}px`;

      const anim = animRef.current;
      if (anim.mode !== mode) {
        anim.mode = mode;
        anim.booted = false;
        anim.viewX = 0;
        anim.viewY = 0;
        anim.revealed = 0;
        anim.lane = 0;
        anim.spur = 0;
        anim.shaped = 0;
        anim.revealJ = 0;
        anim.heldY = null;
        for (const el of stops) el.dataset["state"] = "off";
      }
      const net = document.querySelector<HTMLElement>(".aw-network");
      if (net) {
        const cover = mode === "mobile" ? 64 : Math.round(clamp(h * 0.4, 320, 440));
        net.style.marginTop = `-${cover}px`;
        net.style.transform = "";
      }
    };

    const ctx = gsap.context(() => {
      layout();
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${geoRef.current?.scroll ?? 5200}`,
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
          const net = document.querySelector<HTMLElement>(".aw-network");
          if (net) net.style.transform = "";
        },
        onLeaveBack: () => {
          const anim = animRef.current;
          anim.target = 0;
          anim.current = 0;
          anim.active = false;
          anim.revealed = 0;
          anim.lane = 0;
          anim.spur = 0;
          anim.shaped = 0;
          anim.revealJ = 0;
          anim.heldY = null;
          pin.querySelectorAll<HTMLElement>("[data-stop]").forEach((el) => {
            el.dataset["state"] = "off";
            gsap.set(el, { opacity: 0 });
          });
          if (truckRef.current) truckRef.current.style.opacity = "1";
          const net = document.querySelector<HTMLElement>(".aw-network");
          if (net) net.style.transform = "";
        },
      });
    }, root);

    const play = (el: HTMLElement, vars: gsap.TweenVars) => {
      ctx.add(() => {
        gsap.to(el, vars);
      });
    };

    const syncStop = (el: HTMLElement, journey: number, active: boolean, kind: "service" | "step" | "delivered") => {
      const t = Number(el.dataset["t"] ?? 1);
      const on = journey >= t;
      const key = !on ? "off" : active ? "on" : "past";
      if (el.dataset["state"] === key) return;
      el.dataset["state"] = key;
      const side = el.dataset["side"];
      const x = side === "left" ? -50 : side === "right" ? 50 : 0;
      const y = kind === "delivered" ? 18 : kind === "service" ? 24 : 0;
      const fromScale = kind === "service" ? 0.97 : 0.98;
      const duration = kind === "delivered" ? 0.8 : kind === "service" ? 0.92 : 1;
      if (key === "off") {
        play(el, {
          opacity: 0,
          x,
          y,
          scale: fromScale,
          duration: kind === "delivered" ? 0.18 : 0.45,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      } else if (key === "past") {
        play(el, {
          opacity: kind === "service" ? 0.5 : 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        play(el, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    const update = () => {
      const geo = geoRef.current;
      const anim = animRef.current;
      if (!geo || geo.samples.length < 2 || !mask) return;

      anim.current = anim.target;
      const journey = anim.target;
      const u = mapJourney(geo.markers, journey);
      const pt = atU(geo.samples, u);

      const form = geo.mode === "mobile" ? 1 : smoothstep(0.4, 0.48, journey);
      const paintW =
        geo.mode === "mobile" || geo.baseH < 1 ? geo.roadW : geo.baseH + (geo.roadW - geo.baseH) * form;
      const pitch = geo.mode === "mobile" ? 1 : form;
      const drawY = pt.y;
      const dist = u * geo.total;
      const bob = Math.sin(dist * 0.028) * 0.65;

      if (!anim.booted) {
        anim.viewX = 0;
        anim.viewY = 0;
        anim.booted = true;
      }
      anim.angle = pt.a;

      const pinH = pin.clientHeight || window.innerHeight;
      const pinW = pin.clientWidth || window.innerWidth;
      let targetVX = 0;
      let targetVY = 0;
      if (geo.mode === "mobile") {
        const follow = smoothstep(0.02, 0.12, journey);
        const locked = geo.preferY - (drawY + bob);
        targetVY = locked < 0 ? locked * follow : 0;
      } else if (journey >= SERVICES_END) {
        const follow = smoothstep(SERVICES_END, SERVICES_END + 0.05, journey);
        const vertical = smoothstep(TURN_DOWN, TURN_DOWN + 0.05, journey);
        const aimX = pinW * (0.58 - vertical * 0.14) - pt.x;
        const yFollow = smoothstep(HORIZ_END - 0.04, HORIZ_END + 0.12, journey);
        const intoNet = smoothstep(0.95, 1, journey);
        const aimY = pinH * (0.5 + intoNet * 0.7) - (drawY + bob);
        const roadFloor = pinH - geo.yEnd;
        targetVX = aimX * follow;
        targetVY = Math.max(roadFloor, Math.min(0, aimY) * yFollow);
      }
      anim.viewX = targetVX;
      anim.viewY = targetVY;
      scene.style.transform = `translate3d(${anim.viewX}px, ${anim.viewY}px, 0)`;

      if (truckRef.current) {
        const ride = (1 - pitch) * (paintW / 2);
        truckRef.current.style.transform = `translate3d(${pt.x}px, ${drawY + bob - ride}px, 0)`;
        const graphic = truckRef.current.querySelector("canvas")?.parentElement ?? truckRef.current;
        const box = graphic.getBoundingClientRect();
        const netTop = document.querySelector(".aw-network")?.getBoundingClientRect().top ?? window.innerHeight + 240;
        const peek = netTop - box.top;
        const fade = peek <= 0 ? 0 : peek >= 80 ? 1 : peek / 80;
        truckRef.current.style.opacity = fade.toFixed(3);
      }
      if (shadowRef.current) {
        const wide = geo.truckW * (0.62 - pitch * 0.28);
        shadowRef.current.style.transform = `translate3d(${pt.x}px, ${drawY}px, 0) translate(-50%, -40%)`;
        shadowRef.current.style.width = `${wide}px`;
        shadowRef.current.style.opacity = `${(1 - pitch) * 0.35}`;
      }
      poseRef.current.pitch = pitch;
      poseRef.current.heading = anim.angle;
      poseRef.current.distance = dist;

      const span = Math.max(0.0001, 1 - geo.roadStartU);
      const along = ((u - geo.roadStartU) / span) * geo.roadTotal;
      const nose = geo.truckW * (geo.mode === "mobile" ? 0.34 : 0.52);
      const gate = geo.mode === "mobile" ? 1 : journey >= 0.36 ? 1 : 0;
      const drawn =
        geo.mode === "mobile" ? clamp(along + nose + geo.lead, 0, geo.roadTotal) * gate : geo.roadTotal * gate;
      anim.revealed = Math.max(anim.revealed, drawn);
      mask.style.strokeDasharray = `${geo.roadTotal}`;
      mask.style.strokeDashoffset = `${Math.max(0, geo.roadTotal - anim.revealed)}`;
      const laneFade = geo.mode === "mobile" ? 1 : smoothstep(0.46, 0.52, journey);
      anim.lane = Math.max(anim.lane, laneFade);
      const roadVis = geo.mode === "mobile" ? 1 : smoothstep(0.3, 0.4, journey);
      const masked = roadRef.current?.parentElement;
      if (masked) masked.style.opacity = String(roadVis);
      if (roadRef.current) roadRef.current.setAttribute("stroke-width", String(paintW));
      mask.setAttribute("stroke-width", String(paintW + 2));
      if (laneLRef.current) laneLRef.current.style.opacity = String(0.55 * anim.lane);
      if (laneRRef.current) laneRRef.current.style.opacity = String(0.55 * anim.lane);

      if (baseRef.current && geo.showBase) {
        anim.shaped = journey;
        const handoff = geo.mode === "mobile" ? 0 : smoothstep(0.34, 0.4, journey);
        const inset = Math.max(0, (geo.baseH - paintW) / 2);
        baseRef.current.style.top = `${geo.yEdge + inset}px`;
        baseRef.current.style.height = `${paintW}px`;
        baseRef.current.style.opacity = String(1 - handoff);
        baseRef.current.style.clipPath = "none";
      }

      anim.revealJ = journey;
      const revealJ = journey;
      const revealSteps = () => {
        const list = Array.from(pin.querySelectorAll<HTMLElement>("[data-kind='step']"));
        let active = -1;
        list.forEach((el, i) => {
          if (revealJ >= Number(el.dataset["t"] ?? 1)) active = i;
        });
        list.forEach((el, i) => {
          syncStop(el, revealJ, i === active, "step");
          el.dataset["glow"] = i === active ? "on" : "";
        });
      };
      const serviceList = Array.from(pin.querySelectorAll<HTMLElement>("[data-kind='service']"));
      let activeService = -1;
      serviceList.forEach((el, i) => {
        if (revealJ >= Number(el.dataset["t"] ?? 1)) activeService = i;
      });
      if (geo.mode === "mobile") {
        serviceList.forEach((el, i) => {
          syncStop(el, revealJ, i === activeService, "service");
          el.dataset["glow"] = i === activeService ? "on" : "";
        });
      } else {
        const shiftEnd = Number(servicesLayerRef.current?.dataset["shiftEnd"] ?? 0);
        const shift = shiftEnd * clamp(revealJ / 0.32, 0, 1);
        const slide = (el: HTMLElement) => {
          gsap.killTweensOf(el);
          el.dataset["state"] = "on";
          el.style.opacity = "1";
          el.style.transform = `translate3d(${shift}px, 0, 0)`;
        };
        serviceList.forEach(slide);
        if (serviceLeadRef.current) slide(serviceLeadRef.current);
        const truckX = truckRef.current?.getBoundingClientRect().left ?? -9999;
        let reached = -1;
        serviceList.forEach((el, i) => {
          const box = el.getBoundingClientRect();
          if (box.width < 8) return;
          if (truckX >= box.left + box.width * 0.28) reached = i;
        });
        serviceList.forEach((el, i) => {
          el.dataset["glow"] = i === reached ? "on" : "";
        });
      }
      revealSteps();
      if (exitMaskRef.current) exitMaskRef.current.style.opacity = "0";
      const deliveredEl = pin.querySelector<HTMLElement>("[data-kind='delivered']");
      if (deliveredEl) {
        const deliveredAt = Number(deliveredEl.dataset["t"] ?? 1);
        if (geo.mode !== "mobile") {
          const pinW = pin.clientWidth || window.innerWidth;
          const roadX = geo.vertX + anim.viewX;
          deliveredEl.style.left = `${clamp(roadX - 100, 16, pinW - 230)}px`;
          deliveredEl.style.top = `${Math.round(pinH * 0.52)}px`;
        }
        syncStop(deliveredEl, journey, journey >= deliveredAt, "delivered");
      }

      if (servicesLayerRef.current) {
        const leave = geo.mode === "mobile" ? smoothstep(0.48, 0.6, revealJ) : smoothstep(0.3, 0.4, revealJ);
        servicesLayerRef.current.style.opacity = geo.mode === "mobile" ? "1" : String(1 - leave);
      }

      const wmFade =
        geo.mode === "mobile"
          ? 1 - smoothstep(0.05, 0.2, revealJ)
          : 1 - smoothstep(0.3, 0.42, revealJ);
      if (watermarkRef.current) {
        watermarkRef.current.style.opacity = String(wmFade);
        watermarkRef.current.style.transform = "translate(-50%, 0)";
      }
      if (eyebrowRef.current) {
        eyebrowRef.current.style.opacity = String(0.7 * (1 - smoothstep(0.28, 0.4, revealJ)));
      }

      const pointing = smoothstep(1.2, 1.5, Math.abs(anim.angle));
      const headIn =
        geo.mode === "mobile" ? smoothstep(0.48, 0.64, revealJ) : pointing * smoothstep(TURN_DOWN - 0.04, TURN_DOWN + 0.08, revealJ);
      if (journeyHeadRef.current) {
        journeyHeadRef.current.style.opacity = String(headIn);
        journeyHeadRef.current.style.transform = `translateY(${(1 - headIn) * 16}px)`;
      }

      const turn = clamp(Math.abs(anim.angle) / 1.2, 0, 1);
      const moving = journey > 0.07 && journey < 0.985;
      const pace = journey >= 0.96 ? 0 : moving ? 34 - turn * 16 : 18;
      anim.kmh += (pace - anim.kmh) * 0.08;
      if (speedRef.current) {
        const next = `${Math.round(anim.kmh)} KM/H`;
        if (speedRef.current.textContent !== next) speedRef.current.textContent = next;
        const speedFade = geo.mode === "mobile" ? 1 - smoothstep(0.08, 0.18, journey) : 1;
        speedRef.current.style.opacity = String(speedFade);
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
      className="relative bg-white text-[#172033]"
      aria-labelledby="services-heading"
    >
      <div ref={pinRef} className="aw-journey aw-journey-pin relative z-[2] h-[100svh] overflow-hidden bg-white">
        <div ref={probeRef} className="aw-truck-probe" aria-hidden="true" />

        <p
          ref={eyebrowRef}
          className="eyebrow pointer-events-none absolute left-7 top-[7.15rem] z-30 text-[#142660]/55 md:left-10"
        >
          04 / The route
        </p>
        <h2
          id="services-heading"
          ref={watermarkRef}
          className="display pointer-events-none absolute left-[3%] z-0 whitespace-nowrap text-[#c5cbd4]"
        >
          Our Services
        </h2>

        <div ref={sceneRef} className="absolute left-0 top-0 z-[2] w-full will-change-transform">
          <div
            ref={baseRef}
            className="absolute z-0"
            style={{ background: BASE }}
            aria-hidden="true"
          />

          <svg className="absolute left-0 top-0 z-[1] w-full overflow-visible" aria-hidden="true">
            <defs>
              <mask
                id={`aw-road-mask-${uid}`}
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
                x="-800"
                y="-800"
                width="8000"
                height="12000"
              >
                <path ref={maskRef} fill="none" stroke="white" strokeLinecap="butt" strokeLinejoin="round" />
              </mask>
            </defs>
            <g mask={`url(#aw-road-mask-${uid})`}>
              <path
                ref={roadRef}
                fill="none"
                stroke={BASE}
                strokeLinecap="butt"
                strokeLinejoin="round"
              />
              <path
                ref={laneLRef}
                fill="none"
                stroke="white"
                strokeWidth="2.25"
                strokeDasharray="18 20"
                strokeLinecap="butt"
              />
              <path
                ref={laneRRef}
                fill="none"
                stroke="white"
                strokeWidth="2.25"
                strokeDasharray="18 20"
                strokeLinecap="butt"
              />
            </g>
            <path ref={motionRef} fill="none" stroke="none" />
          </svg>

          <div ref={servicesLayerRef} className="absolute inset-0 z-[4]">
            <div
              ref={serviceLeadRef}
              data-kind="service-lead"
              className="absolute max-w-[34ch] text-[18px] leading-relaxed text-white/80"
            >
              <p>Specialized furniture transportation, from the vendor floor through the last mile.</p>
              <p className="mt-4 text-white/70">One partner for storage, linehaul, and delivery.</p>
            </div>
            {SERVICES.map((service, i) => (
              <article
                key={service.title}
                data-stop=""
                data-kind="service"
                data-state="off"
                className="absolute text-white [&_h3]:!mt-3 [&_h3]:!text-[clamp(24px,1.9vw,32px)] [&_h3]:!uppercase [&_h3]:!leading-tight [&_h3]:!tracking-[0.03em] [&_p]:!mt-3 [&_p]:!text-[clamp(16px,1.2vw,19px)] [&_p]:!leading-snug [&_p]:!text-white/80 [&_span]:!hidden [&>div]:!flex-col [&>div]:!items-start [&>div]:!gap-3 [&_svg]:!h-10 [&_svg]:!w-10"
              >
                <StopCopy
                  index={`0${i + 1}`}
                  title={service.title}
                  text={service.text}
                  icon={service.icon}
                  tone="light"
                  scale="service"
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
              className="absolute z-[5] opacity-0 [&_h3]:!text-[clamp(28px,2.2vw,38px)] [&_h3]:!leading-[1.12] [&_p]:!mt-3 [&_p]:!text-[clamp(17px,1.25vw,20px)] [&_p]:!leading-relaxed [&_svg]:!h-10 [&_svg]:!w-10"
            >
              <StopCopy index={`0${i + 1}`} title={step.title} text={step.text} icon={step.icon} scale="mile" />
            </article>
          ))}

          <div
            ref={shadowRef}
            className="pointer-events-none absolute left-0 top-0 z-[7] h-2.5 rounded-full bg-[#0F1730]/40 blur-[4px]"
            aria-hidden="true"
          />
          <div
            ref={truckRef}
            className="absolute left-0 top-0 z-[8] h-0 overflow-visible"
            style={{ width: "var(--truck-w)" }}
          >
            <TruckModel poseRef={poseRef} />
          </div>
        </div>

        <div
          ref={journeyHeadRef}
          className="pointer-events-none absolute z-[6] opacity-0 max-md:left-5 max-md:top-24 max-md:w-[min(18rem,78vw)]"
        >
          <p className="eyebrow text-route">Final mile</p>
          <h3 className="display mt-3 text-[clamp(36px,3.2vw,56px)] leading-[0.9] tracking-[-0.03em] text-[#142660]">
            Reliability
            <br />
            at every
            <br />
            milestone
          </h3>
          <p data-blurb="" className="mt-[clamp(72px,16vh,160px)] max-w-[340px] text-[17px] leading-relaxed text-[#172033]/75">
            From facility to front door. The last miles are where a brand is kept.
          </p>
        </div>

        <div
          ref={exitMaskRef}
          className="pointer-events-none absolute bottom-0 z-20 bg-white opacity-0"
          aria-hidden="true"
        />

        <div
          data-stop=""
          data-kind="delivered"
          data-state="off"
          data-t="0.988"
          className="absolute z-30 w-[210px] text-center opacity-0"
        >
          <span className="relative mx-auto block h-3 w-3 rounded-full bg-route">
            <span className="absolute inset-0 animate-[hub-pulse_2.6s_ease-out_infinite] rounded-full bg-route" />
          </span>
          <p className="display mt-3 text-[clamp(22px,2vw,32px)] text-route">Delivered.</p>
        </div>

        <span
          ref={speedRef}
          className="pointer-events-none absolute left-7 top-24 z-40 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#142660]/60 tabular-nums md:left-10"
          aria-hidden="true"
        >
          18 KM/H
        </span>
      </div>

      <div className="aw-journey-static section-y">
        <div className="container-aw">
          <p className="eyebrow text-route">04 / The route</p>
          <h2 className="display mt-3 text-[clamp(38px,8vw,52px)] text-primary">Our Services</h2>
          <img
            src="/brand/aw-truck.png"
            alt="American West truck"
            className="mt-6 h-auto w-[min(420px,88vw)]"
          />
          <div className="mt-8 flex max-w-xl flex-col gap-10">
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
            <h3 className="display mt-3 text-[clamp(28px,4vw,44px)] text-[#142660]">
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
