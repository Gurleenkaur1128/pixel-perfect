import { useId, useLayoutEffect, useRef } from "react";
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

const BASE = "#0F1730";
const SIDE_RATIO = 667 / 2000;
/** Transparent pixels under the tires, as a fraction of the image height. */
const SIDE_BOTTOM_PAD = 0.02;
const ROAD_LEAD = 140;

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
  if (w >= 1440) return clamp(w * 0.3, 400, 470);
  if (w >= 1024) return clamp(w * 0.28, 330, 400);
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

function TopTruck({ className }: { className?: string }) {
  const ribs = Array.from({ length: 16 }, (_, i) => 36 + i * 22);
  const axles = [78, 156, 234, 312, 468, 540];
  return (
    <svg viewBox="0 0 640 210" className={className} aria-hidden="true">
      <rect x="18" y="58" width="430" height="94" rx="4" fill="#F4F7FB" stroke="#142660" strokeWidth="3" />
      {ribs.map((x) => (
        <path key={x} d={`M${x} 62 V148`} stroke="#142660" strokeOpacity="0.14" strokeWidth="2" />
      ))}
      <rect x="18" y="100" width="430" height="6" fill="#F3692B" />
      <rect x="18" y="108" width="430" height="44" fill="#2D419A" />
      <path d="M448 64 H552 C586 64 612 86 620 112 V150 H448 Z" fill="#142660" />
      <path d="M500 76 H562 C582 76 598 90 604 104 V116 H500 Z" fill="#E7EDF8" />
      <circle cx="448" cy="108" r="5" fill="#F3692B" />
      {axles.map((cx) =>
        [46, 164].map((cy) => (
          <g key={`${cx}-${cy}`} data-wheel="">
            <circle cx={cx} cy={cy} r="13" fill="#172033" />
            <circle cx={cx} cy={cy} r="5" fill="#D5DCF0" />
            <path d={`M${cx} ${cy - 7} V${cy + 7}`} stroke="#F7F8FC" strokeWidth="1.6" />
          </g>
        )),
      )}
    </svg>
  );
}

function StopCopy({
  index,
  title,
  text,
  icon: Icon,
  tone = "ink",
}: {
  index: string;
  title: string;
  text: string;
  icon: typeof Truck;
  tone?: "ink" | "light";
}) {
  const light = tone === "light";
  return (
    <>
      <div className="flex items-center gap-2">
        <Icon
          className={light ? "h-4 w-4 shrink-0 text-current" : "h-4 w-4 shrink-0 text-route"}
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <span className="eyebrow text-route">{index}</span>
      </div>
      <h3
        className={`display mt-2 text-[15px] leading-tight tracking-wide ${light ? "text-current" : "text-[#142660]"}`}
      >
        {title}
      </h3>
      <p
        className={`mt-1.5 text-[12.5px] leading-snug ${light ? "text-current opacity-70" : "text-[#172033]/70"}`}
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
  const chevronRef = useRef<SVGGElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLImageElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const servicesLayerRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const journeyHeadRef = useRef<HTMLDivElement>(null);
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
  const wheelsRef = useRef<SVGGElement[]>([]);

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
      let chevron = { x: 0, y: 0, a: 0 };
      const services: StopPos[] = [];
      const steps: StopPos[] = [];
      let delivered: StopPos = { x: w / 2, y: h, t: 0.98, w: 180, side: "", enter: "y" };
      let markers: Marker[] = [
        { j: 0, u: 0 },
        { j: 1, u: 1 },
      ];
      let roadStartHint = { x: 0, y: 0 };

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
        motionD = `M ${x} ${startY - 20} L ${x} ${roadEnd}`;
        roadD = motionD;
        roadStartHint = { x, y: startY - 20 };
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
      } else {
        const navClear = 78;
        baseH =
          mode === "desktop" ? clamp(h * 0.34, 280, 340) : clamp(h * 0.32, 220, 286);
        const maxBase = h - navClear - truckH - 28;
        baseH = clamp(Math.min(baseH, maxBase), 180, baseH);
        truckW = Math.min(truckW, (h - baseH - navClear - 16) / SIDE_RATIO, w * 0.52);
        yEdge = h - baseH;
        roadW = clamp(truckW * 0.62, mode === "desktop" ? 210 : 168, mode === "desktop" ? 280 : 220);
        const yCenter = yEdge;

        let ry = clamp(Math.min(w, h) * 0.2, 150, 230);
        let rx = ry * 1.38;
        const vertX = w - roadW / 2 - 36;
        let xA = vertX - rx;
        const minHoriz = Math.max(w * 0.48, truckW * 1.15);
        if (xA < minHoriz) {
          rx = Math.max(130, vertX - minHoriz);
          ry = rx / 1.38;
          xA = vertX - rx;
        }
        const cy = yCenter + ry;
        const phi0 = -Math.PI / 2;
        const phiMid = Math.atan(-ry / rx);
        const phi1 = 0;
        const c1 = ellipseCubic(xA, cy, rx, ry, phi0, phiMid);
        const c2 = ellipseCubic(xA, cy, rx, ry, phiMid, phi1);
        const yCurveEnd = c2.p3.y;
        const stepGap = h < 760 ? 168 : 204;
        const yFirstStep = yCurveEnd + 270;
        const yLastStep = yFirstStep + (STEPS.length - 1) * stepGap;
        const yStop = yLastStep + truckW * 0.15;
        const yEnd = yStop + truckW * 0.78 + 48;
        const xStart = -0.25 * truckW;

        motionD = `M ${n(xStart)} ${n(yCenter)} L ${n(c1.p0.x)} ${n(c1.p0.y)} ${cubicCmd(c1)} ${cubicCmd(c2)} L ${n(vertX)} ${n(yEnd)}`;
        const roadStartX = Math.max(xStart + truckW, xA - Math.max(truckW * 1.05, 320));
        roadD = `M ${n(roadStartX)} ${n(yCenter)} L ${n(c1.p0.x)} ${n(c1.p0.y)} ${cubicCmd(c1)} ${cubicCmd(c2)} L ${n(vertX)} ${n(yEnd)}`;
        roadStartHint = { x: roadStartX, y: yCenter };

        const ang = Math.atan2(c1.p3.y - c1.p2.y, c1.p3.x - c1.p2.x);
        const tx = Math.cos(ang);
        const ty = Math.sin(ang);
        chevron = {
          x: c1.p3.x + ty * roadW * 0.2,
          y: c1.p3.y - tx * roadW * 0.2,
          a: ang,
        };

        shiftX = w / 2 - vertX;
        preferY = h * 0.5;
        scroll = Math.round(clamp(h * (mode === "tablet" ? 5.1 : 5.6), 4600, 6400));

        const travelLeft = Math.max(28, truckW * 0.2);
        const travelRight = Math.max(travelLeft + 240, xA - 24);
        const usable = travelRight - travelLeft;
        const cardW = clamp(usable / SERVICES.length - 10, 132, 210);
        for (let i = 0; i < SERVICES.length; i++) {
          const cx = travelLeft + (usable * (i + 0.5)) / SERVICES.length;
          services.push({
            x: cx - cardW / 2,
            y: yEdge + (h < 760 ? 22 : 36),
            t: 0,
            w: cardW,
            side: "",
            enter: "y",
          });
        }

        const headW = clamp(w * 0.26, 220, 360);
        if (journeyHeadRef.current) {
          journeyHeadRef.current.style.left = `${vertX - roadW / 2 - 40 - headW}px`;
          journeyHeadRef.current.style.top = `${yCurveEnd + 28}px`;
          journeyHeadRef.current.style.width = `${headW}px`;
        }
        if (watermarkRef.current) {
          watermarkRef.current.style.top = `${Math.max(96, yEdge - truckH * 0.62)}px`;
          watermarkRef.current.style.fontSize = `${clamp(w * 0.15, 96, 220)}px`;
        }

        const stepW = clamp(mode === "desktop" ? 220 : 176, 150, Math.max(150, w * 0.22));
        const rightX = vertX + roadW / 2 + 44;
        const leftX = vertX - roadW / 2 - 44 - stepW;
        for (let i = 0; i < STEPS.length; i++) {
          const step = STEPS[i];
          if (!step) continue;
          const y = yFirstStep + i * stepGap;
          steps.push({
            x: step.side === "right" ? rightX : leftX,
            y,
            t: 0,
            w: stepW,
            side: step.side,
            enter: "x",
          });
        }
        delivered = {
          x: vertX - 90,
          y: yStop + truckW * 0.5,
          t: 0.97,
          w: 180,
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

      if (mode !== "mobile") {
        let uTurn = -1;
        let uVert = -1;
        for (let i = 0; i < samples.length; i++) {
          const sample = samples[i];
          if (!sample) continue;
          const u = i / (samples.length - 1);
          if (uTurn < 0 && sample.a >= 0.75) uTurn = u;
          if (sample.a >= 1.45) {
            uVert = u;
            break;
          }
        }
        let uFlat = 0.2;
        for (let i = 0; i < samples.length; i++) {
          const sample = samples[i];
          if (!sample) continue;
          if (sample.a < 0.08) uFlat = i / (samples.length - 1);
          else break;
        }
        if (uTurn < 0) uTurn = Math.min(0.9, uFlat + 0.04);
        if (uVert < 0) uVert = Math.min(0.96, uTurn + 0.04);
        const uStop = arcAt(samples, w / 2 - shiftX, delivered.y - truckW * 0.5);
        markers = [
          { j: 0, u: 0 },
          { j: 0.08, u: 0 },
          { j: 0.55, u: uFlat },
          { j: 0.64, u: Math.max(uFlat + 0.008, uTurn) },
          { j: 0.72, u: Math.max(uTurn + 0.008, uVert) },
          { j: 1, u: clamp(Math.max(uVert + 0.02, uStop), 0.8, 0.985) },
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
        const earlier = services[i - 1];
        const prev = earlier ? earlier.t + 0.025 : 0.1;
        pos.t = clamp(Math.max(pos.t, prev), 0.09, mode === "mobile" ? 0.55 : 0.53);
      });
      steps.forEach((pos, i) => {
        const earlier = steps[i - 1];
        const floor = mode === "mobile" ? 0.5 : 0.74;
        const prev = earlier ? earlier.t + 0.03 : floor;
        pos.t = clamp(Math.max(pos.t, prev), floor, 0.96);
      });
      const lastStep = steps[steps.length - 1];
      delivered.t = clamp(Math.max(delivered.t, (lastStep?.t ?? 0.9) + 0.02), 0.9, 0.99);

      if (laneLRef.current) laneLRef.current.setAttribute("d", offsetPath(road, roadW * 0.3));
      if (laneRRef.current) laneRRef.current.setAttribute("d", offsetPath(road, -roadW * 0.3));
      if (chevronRef.current) {
        chevronRef.current.setAttribute(
          "transform",
          `translate(${n(chevron.x)} ${n(chevron.y)}) rotate(${n((chevron.a * 180) / Math.PI)})`,
        );
        chevronRef.current.style.display = mode === "mobile" ? "none" : "";
      }

      const worldH = Math.max(h + 40, delivered.y + 140);
      scene.style.height = `${worldH}px`;
      const svg = motion.ownerSVGElement;
      if (svg) {
        svg.setAttribute("viewBox", `0 0 ${w} ${worldH}`);
        svg.style.height = `${worldH}px`;
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
        if (el.dataset["state"] === "off" || !el.dataset["state"]) {
          gsap.set(el, {
            opacity: 0,
            x: pos.side === "left" ? -40 : pos.side === "right" ? 40 : 0,
            y: pos.enter === "y" ? 26 : 0,
            scale: pos.enter === "y" ? 0.97 : 1,
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
      wheelsRef.current = Array.from(pin.querySelectorAll<SVGGElement>("[data-wheel]"));

      const anim = animRef.current;
      if (anim.mode !== mode) {
        anim.mode = mode;
        anim.booted = false;
        anim.viewX = 0;
        anim.viewY = 0;
        for (const el of stops) el.dataset["state"] = "off";
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

    const syncStop = (el: HTMLElement, journey: number, active: boolean, kind: "service" | "step" | "delivered") => {
      const t = Number(el.dataset["t"] ?? 1);
      const on = journey >= t;
      const key = !on ? "off" : active ? "on" : "past";
      if (el.dataset["state"] === key) return;
      el.dataset["state"] = key;
      const side = el.dataset["side"];
      const enter = el.dataset["enter"];
      const x = side === "left" ? -40 : side === "right" ? 40 : 0;
      const y = enter === "y" ? 26 : 0;
      const past = kind === "service" ? 0.6 : 1;
      if (key === "off") {
        play(el, {
          opacity: 0,
          x,
          y,
          scale: enter === "y" ? 0.97 : 1,
          duration: 0.4,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      } else {
        play(el, {
          opacity: key === "on" ? 1 : past,
          x: 0,
          y: 0,
          scale: 1,
          duration: kind === "step" ? 0.75 : 0.65,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    const update = () => {
      const geo = geoRef.current;
      const anim = animRef.current;
      if (!geo || geo.samples.length < 2 || !mask) return;

      const endBoost = !anim.active && (anim.target <= 0.001 || anim.target >= 0.999);
      const k = endBoost ? 0.38 : 0.14;
      anim.current += (anim.target - anim.current) * k;
      if (Math.abs(anim.target - anim.current) < 0.0005) anim.current = anim.target;
      const journey = anim.current;
      const u = mapJourney(geo.markers, journey);
      const pt = atU(geo.samples, u);

      const pitch = geo.mode === "mobile" ? 1 : smoothstep(0.5, 0.6, journey);
      const drawY = pt.y;
      const dist = u * geo.total;
      const bob = Math.sin(dist * 0.028) * 0.65;

      if (!anim.booted) {
        anim.angle = pt.a;
        anim.viewX = 0;
        anim.viewY = 0;
        anim.booted = true;
      } else {
        anim.angle = lerpAngle(anim.angle, pt.a, 0.34);
      }

      const pan = geo.mode === "mobile" ? 0 : smoothstep(0.6, 0.78, journey);
      const follow =
        geo.mode === "mobile" ? smoothstep(0.02, 0.12, journey) : smoothstep(0.56, 0.7, journey);
      const targetVX = geo.shiftX * pan;
      const locked = geo.preferY - (drawY + bob);
      const targetVY = locked < 0 ? locked * follow : 0;
      anim.viewX += (targetVX - anim.viewX) * 0.14;
      anim.viewY += (targetVY - anim.viewY) * 0.16;
      scene.style.transform = `translate3d(${anim.viewX}px, ${anim.viewY}px, 0)`;

      if (truckRef.current) {
        truckRef.current.style.transform = `translate3d(${pt.x}px, ${drawY + bob}px, 0)`;
      }
      if (shadowRef.current) {
        const wide = geo.truckW * (0.62 - pitch * 0.28);
        shadowRef.current.style.transform = `translate3d(${pt.x}px, ${drawY}px, 0) translate(-50%, -40%)`;
        shadowRef.current.style.width = `${wide}px`;
        shadowRef.current.style.opacity = `${(1 - pitch) * 0.35}`;
      }
      if (sideRef.current) {
        const sideFade = 1 - smoothstep(0.2, 0.62, pitch);
        sideRef.current.style.opacity = String(sideFade);
        sideRef.current.style.transform = `translateX(-50%) translateY(${SIDE_BOTTOM_PAD * 100}%)`;
      }
      if (topRef.current) {
        const deg = (anim.angle * 180) / Math.PI;
        topRef.current.style.opacity = String(smoothstep(0.28, 0.85, pitch));
        topRef.current.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
      }

      const radius = Math.max(8, geo.truckW * 0.045);
      const spin = (dist / (Math.PI * 2 * radius)) * 360;
      for (const wheel of wheelsRef.current) wheel.style.transform = `rotate(${spin}deg)`;

      const span = Math.max(0.0001, 1 - geo.roadStartU);
      const along = ((u - geo.roadStartU) / span) * geo.roadTotal;
      const nose = geo.truckW * (geo.mode === "mobile" ? 0.34 : 0.52);
      const gate = geo.mode === "mobile" ? 1 : smoothstep(0.53, 0.56, journey);
      const drawn = clamp(along + nose + geo.lead, 0, geo.roadTotal) * gate;
      mask.style.strokeDasharray = `${geo.roadTotal}`;
      mask.style.strokeDashoffset = `${Math.max(0, geo.roadTotal - drawn)}`;
      const laneFade = geo.mode === "mobile" ? 1 : smoothstep(0.48, 0.57, journey);
      if (laneLRef.current) laneLRef.current.style.opacity = String(0.55 * laneFade);
      if (laneRRef.current) laneRRef.current.style.opacity = String(0.55 * laneFade);

      if (baseRef.current && geo.showBase) {
        const morph = smoothstep(0.46, 0.56, journey);
        const handoff = smoothstep(0.54, 0.62, journey);
        const retract = smoothstep(0.62, 0.74, journey);
        const height = geo.baseH + (geo.roadW - geo.baseH) * morph;
        const top = geo.yEdge - (geo.roadW / 2) * morph;
        baseRef.current.style.top = `${top}px`;
        const fullRight = geo.viewW * 2;
        const rightEdge = fullRight + (geo.roadStartX + 72 - fullRight) * handoff;
        const clipRight = Math.max(0, fullRight - rightEdge);
        const clipLeft = retract * (geo.roadStartX + geo.viewW);
        baseRef.current.style.height = `${height}px`;
        baseRef.current.style.opacity = "1";
        baseRef.current.style.clipPath =
          retract > 0.98 ? "inset(0 0 0 100%)" : `inset(0 ${clipRight}px 0 ${clipLeft}px)`;
      }

      const reveal = (kind: "service" | "step") => {
        const list = Array.from(pin.querySelectorAll<HTMLElement>(`[data-kind='${kind}']`));
        let active = -1;
        list.forEach((el, i) => {
          if (journey >= Number(el.dataset["t"] ?? 1)) active = i;
        });
        list.forEach((el, i) => syncStop(el, journey, i === active, kind));
      };
      reveal("service");
      reveal("step");
      const deliveredEl = pin.querySelector<HTMLElement>("[data-kind='delivered']");
      if (deliveredEl) syncStop(deliveredEl, journey, journey >= Number(deliveredEl.dataset["t"] ?? 1), "delivered");

      if (servicesLayerRef.current) {
        const leave = geo.mode === "mobile" ? smoothstep(0.42, 0.55, journey) : smoothstep(0.42, 0.54, journey);
        servicesLayerRef.current.style.opacity = geo.mode === "mobile" ? "1" : String(1 - leave);
      }

      const wmFade = geo.mode === "mobile" ? 1 - smoothstep(0.05, 0.2, journey) : 1 - smoothstep(0.4, 0.54, journey);
      const drift = geo.mode === "mobile" ? 0 : -smoothstep(0.08, 0.52, journey) * geo.truckW * 1.15;
      if (watermarkRef.current) {
        watermarkRef.current.style.opacity = String(wmFade);
        watermarkRef.current.style.transform = `translate3d(${drift}px, -50%, 0)`;
      }
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = String(0.85 * wmFade);

      const headIn =
        geo.mode === "mobile" ? smoothstep(0.48, 0.58, journey) : smoothstep(0.68, 0.74, journey);
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
      }
    };

    const onTick = () => update();
    gsap.ticker.add(onTick);
    update();

    const img = sideRef.current;
    const refresh = () => ScrollTrigger.refresh();
    if (img && !img.complete) img.addEventListener("load", refresh, { once: true });
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
      <div ref={pinRef} className="aw-journey aw-journey-pin relative h-[100svh] overflow-hidden bg-white">
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
          className="display pointer-events-none absolute left-[3%] z-0 whitespace-nowrap text-[#d5dcf0]"
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
              <g
                ref={chevronRef}
                fill="none"
                stroke="white"
                strokeWidth="1.6"
                strokeOpacity="0.55"
                strokeLinecap="round"
              >
                <path d="M-28 -11 L-12 0 L-28 11" />
                <path d="M-12 -10 L4 0 L-12 10" />
                <path d="M4 -8 L18 0 L4 8" />
              </g>
            </g>
            <path ref={motionRef} fill="none" stroke="none" />
          </svg>

          <div ref={servicesLayerRef} className="absolute inset-0 z-[4]">
            {SERVICES.map((service, i) => (
              <article
                key={service.title}
                data-stop=""
                data-kind="service"
                data-state="off"
                className="absolute text-white opacity-0"
              >
                <StopCopy
                  index={`0${i + 1}`}
                  title={service.title}
                  text={service.text}
                  icon={service.icon}
                  tone="light"
                />
              </article>
            ))}
          </div>

          <div
            ref={journeyHeadRef}
            className="pointer-events-none absolute z-[5] opacity-0 max-md:left-5 max-md:top-24 max-md:w-[min(18rem,70vw)]"
          >
            <p className="eyebrow text-route">Final mile</p>
            <h3 className="display mt-2 text-[clamp(28px,3.4vw,52px)] leading-[0.96] text-[#142660]">
              Reliability at every milestone
            </h3>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[#172033]/70 md:text-[15px]">
              From facility to front door. The last miles are where a brand is kept.
            </p>
          </div>

          {STEPS.map((step, i) => (
            <article
              key={step.title}
              data-stop=""
              data-kind="step"
              data-state="off"
              className="absolute z-[5] opacity-0"
            >
              <StopCopy index={`0${i + 1}`} title={step.title} text={step.text} icon={step.icon} />
            </article>
          ))}

          <div
            data-stop=""
            data-kind="delivered"
            data-state="off"
            className="absolute z-[6] text-center opacity-0"
          >
            <span className="relative mx-auto block h-3 w-3 rounded-full bg-route">
              <span className="absolute inset-0 animate-[hub-pulse_2.6s_ease-out_infinite] rounded-full bg-route" />
            </span>
            <p className="display mt-3 text-[clamp(22px,2vw,32px)] text-route">Delivered.</p>
          </div>

          <div
            ref={shadowRef}
            className="pointer-events-none absolute left-0 top-0 z-[7] h-2.5 rounded-full bg-[#0F1730]/40 blur-[4px]"
            aria-hidden="true"
          />
          <div
            ref={truckRef}
            className="absolute left-0 top-0 z-[8] h-0 overflow-visible [perspective:900px]"
            style={{ width: "var(--truck-w)" }}
          >
            <img
              ref={sideRef}
              src="/brand/aw-truck.png"
              alt=""
              draggable={false}
              className="pointer-events-none absolute bottom-0 left-0 h-auto w-full max-w-none select-none"
              style={{
                transformOrigin: "50% 100%",
                transform: `translateX(-50%) translateY(${SIDE_BOTTOM_PAD * 100}%)`,
              }}
            />
            <div ref={topRef} className="pointer-events-none absolute left-0 top-0 w-full opacity-0">
              <TopTruck className="h-auto w-full" />
            </div>
          </div>
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
