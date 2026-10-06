import {
  GitBranch,
  Globe,
  Home,
  Network,
  Package,
  Shield,
  Store,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

import blanket from "@/assets/blanket-wrap.jpg";
import delivery from "@/assets/delivery.jpg";
import driver from "@/assets/driver.jpg";
import finalMile from "@/assets/final-mile.jpg";
import fleet from "@/assets/fleet.jpg";
import highway from "@/assets/hero-highway.jpg";
import warehouse from "@/assets/warehouse.jpg";

export type ServiceIcon =
  "truck" | "shield" | "home" | "package" | "globe" | "network" | "routes" | "booth" | "warehouse";

export type ServiceGroupId = "transportation" | "handling" | "distribution";

export type ServiceProcess = {
  label: string;
  body: string;
};

export type ServiceCapability = {
  title: string;
  body: string;
};

export type ServiceRecord = {
  slug: string;
  number: string;
  title: string;
  navLabel: string;
  menuTitle: string;
  descriptor: string;
  tagline: string;
  group: ServiceGroupId;
  icon: ServiceIcon;
  image: string;
  supportImage: string;
  imagePosition?: string;
  paragraphs: string[];
  chips?: string[];
  callouts?: string[];
  path?: string[];
  hub?: boolean;
  capabilities: ServiceCapability[];
  process?: ServiceProcess[];
  related: string[];
};

export const SERVICE_ICONS: Record<ServiceIcon, LucideIcon> = {
  truck: Truck,
  shield: Shield,
  home: Home,
  package: Package,
  globe: Globe,
  network: Network,
  routes: GitBranch,
  booth: Store,
  warehouse: Warehouse,
};

export const SERVICE_GROUPS: { id: ServiceGroupId; label: string }[] = [
  { id: "transportation", label: "Transportation" },
  { id: "handling", label: "Specialized Handling" },
  { id: "distribution", label: "Distribution" },
];

export const HERO_IMAGE = highway;

export const FINAL_MILE_STEPS = [
  "Order Entry",
  "Vendor Pickup",
  "AW Facility Distribution",
  "Home Delivery Hub",
  "Consumer",
] as const;

const finalMileProcess: ServiceProcess[] = [
  {
    label: "Order Entry",
    body: "The shipment is entered and matched to the delivery program.",
  },
  {
    label: "Vendor Pickup",
    body: "American West picks up from the vendor on the scheduled window.",
  },
  {
    label: "AW Facility Distribution",
    body: "Freight moves through an American West facility for the next leg.",
  },
  {
    label: "Home Delivery Hub",
    body: "The hub prepares the product for the final stop.",
  },
  {
    label: "Consumer",
    body: "Delivery reaches the customer with the care the brand promised.",
  },
];

export const SERVICES: ServiceRecord[] = [
  {
    slug: "b2b-ltl-retail-final-mile",
    number: "01",
    title: "B2B / LTL / Retail / Final Mile",
    navLabel: "B2B / LTL / Retail",
    menuTitle: "B2B / LTL / Retail / Final Mile",
    descriptor: "Nationwide LTL for retail and final mile",
    tagline: "Right-sized transportation for every shipment",
    group: "transportation",
    icon: "truck",
    image: fleet,
    supportImage: highway,
    paragraphs: [
      "American West is a nationwide LTL carrier for shipments that do not fit a standard plan. Showrooms, retail floors, and distribution centers each need the right truck, the right timing, and a driver who understands the freight.",
      "As an asset-based specialized carrier, we match equipment and trained drivers to the shipment — daily pickups, scheduled programs, hand load and hand offload, and final-mile home delivery. No shipment is too small, and no freight is too delicate.",
    ],
    chips: ["LTL", "Retail", "Distribution", "Final Mile"],
    capabilities: [
      {
        title: "Nationwide LTL",
        body: "Specialized less-than-truckload service for furniture and related freight across the country.",
      },
      {
        title: "Right equipment",
        body: "Truck sizes and options are matched to the shipment, the deadline, and the delivery site.",
      },
      {
        title: "Retail and showroom",
        body: "Delivery into showrooms, retail floors, and distribution centers, including no-forklift environments.",
      },
      {
        title: "Hand load and offload",
        body: "Associates hand load and hand offload so the product is not left to a standard dock process.",
      },
      {
        title: "Scheduled programs",
        body: "Daily pickups, weekly runs, consolidated orders, and appointment delivery.",
      },
      {
        title: "Final mile",
        body: "The same specialized network can finish at the customer’s home.",
      },
    ],
    process: finalMileProcess,
    related: ["blanket-wrap", "ecommerce-home-delivery", "pool-distribution"],
  },
  {
    slug: "blanket-wrap",
    number: "02",
    title: "Blanket Wrap",
    navLabel: "Blanket Wrap",
    menuTitle: "Blanket Wrap",
    descriptor: "Forklift-free furniture protection",
    tagline: "Protecting your brand from pickup to placement",
    group: "handling",
    icon: "shield",
    image: blanket,
    supportImage: blanket,
    paragraphs: [
      "Furniture integrity begins at pickup. American West associates handle each piece as if it were going into their own home, in a forklift-free environment.",
      "Blanket wrap keeps upholstery and casegoods protected so the product is delivered without damage, ready for the showroom or the home.",
    ],
    callouts: ["Hand-wrapped", "Specialized handling", "Forklift-free", "Damage prevention"],
    capabilities: [
      {
        title: "Care from pickup",
        body: "Protection starts when the piece is picked up, not when it arrives.",
      },
      {
        title: "Trained associates",
        body: "Teams handle furniture as if it were going into their own home.",
      },
      {
        title: "Forklift-free",
        body: "A no-forklift environment keeps finished goods off standard warehouse equipment.",
      },
      {
        title: "Damage prevention",
        body: "Blanket wrap is there so upholstery and casegoods arrive without damage.",
      },
    ],
    process: [
      {
        label: "Pickup",
        body: "The piece is received and inspected at the point of pickup.",
      },
      {
        label: "Hand wrap",
        body: "Associates blanket wrap the furniture before it moves.",
      },
      {
        label: "Transport",
        body: "Wrapped freight travels in a forklift-free, specialized operation.",
      },
      {
        label: "Placement",
        body: "The product is delivered ready for the showroom or the home.",
      },
    ],
    related: ["b2b-ltl-retail-final-mile", "ecommerce-home-delivery", "trade-show"],
  },
  {
    slug: "ecommerce-home-delivery",
    number: "03",
    title: "E-commerce & Home Delivery",
    navLabel: "E-commerce & Home",
    menuTitle: "E-commerce & Home Delivery",
    descriptor: "Home delivery that protects your brand",
    tagline: "Your reputation arrives with every delivery",
    group: "handling",
    icon: "home",
    image: delivery,
    supportImage: finalMile,
    paragraphs: [
      "With every e-commerce order and every shopping-cart checkout, your reputation is on the line. Your customers are depending on you for a quality product and a seamless delivery.",
      "American West receives, warehouses, schedules, assembles, and delivers — blanket wrapped, with real-time tracking — so the last mile matches the promise made at checkout.",
    ],
    chips: ["Receive", "Warehouse", "Schedule", "Assemble", "Deliver"],
    capabilities: [
      {
        title: "Reputation at checkout",
        body: "Every online order puts the customer’s experience, and your brand, on the line.",
      },
      {
        title: "Receive and warehouse",
        body: "Product is received into American West facilities and held against the delivery plan.",
      },
      {
        title: "Schedule",
        body: "Delivery is scheduled so the customer knows when the order will arrive.",
      },
      {
        title: "Assemble and deliver",
        body: "In-home work includes assembly, blanket wrap, and a uniformed delivery team.",
      },
      {
        title: "Real-time tracking",
        body: "Customers and account teams can follow the order through delivery.",
      },
    ],
    process: finalMileProcess,
    related: ["blanket-wrap", "b2b-ltl-retail-final-mile", "warehousing"],
  },
  {
    slug: "general-commodity",
    number: "04",
    title: "General Commodity",
    navLabel: "General Commodity",
    menuTitle: "General Commodity",
    descriptor: "Specialized freight beyond furniture",
    tagline: "Special attention beyond furniture",
    group: "transportation",
    icon: "package",
    image: driver,
    supportImage: highway,
    imagePosition: "center",
    paragraphs: [
      "Furniture remains the primary focus. The same care extends into other specialized categories, including fitness equipment, restaurant furniture, and healthcare and medical equipment.",
      "Skilled drivers protect the product, the brand, and the reputation attached to every delivery.",
    ],
    capabilities: [
      {
        title: "Furniture first",
        body: "The network is built around furniture, and that standard carries into other freight.",
      },
      {
        title: "Fitness equipment",
        body: "Specialized handling for equipment that needs more than a standard trailer.",
      },
      {
        title: "Restaurant furniture",
        body: "Casegoods and seating for restaurant programs, handled with the same care.",
      },
      {
        title: "Healthcare and medical",
        body: "Medical equipment and furniture move with attention to condition and timing.",
      },
    ],
    process: [
      {
        label: "Identify the freight",
        body: "The team confirms the commodity, the destination, and the handling need.",
      },
      {
        label: "Match the equipment",
        body: "The right truck and crew are assigned to the shipment.",
      },
      {
        label: "Protect the brand",
        body: "Drivers treat the freight as an extension of the customer’s reputation.",
      },
    ],
    related: ["b2b-ltl-retail-final-mile", "logistics-brokerage", "warehousing"],
  },
  {
    slug: "international",
    number: "05",
    title: "International",
    navLabel: "International",
    menuTitle: "International",
    descriptor: "Inbound containers and cross-border",
    tagline: "From container to destination",
    group: "transportation",
    icon: "globe",
    image: highway,
    supportImage: fleet,
    imagePosition: "72% center",
    paragraphs: [
      "Inbound container services take overseas product from the port to its next destination. Dedicated account teams manage the documentation for Mexico and Canada and stay with the freight.",
      "Distribution support then moves that product through the American West network, from the container to the facility to the final stop.",
    ],
    path: ["Port", "AW Network", "Destination"],
    capabilities: [
      {
        title: "Inbound containers",
        body: "Overseas product is received and moved on to the next destination.",
      },
      {
        title: "Mexico and Canada",
        body: "Account teams handle the documentation cross-border programs require.",
      },
      {
        title: "Dedicated account teams",
        body: "One team coordinates the move instead of handing it off unnamed.",
      },
      {
        title: "Distribution support",
        body: "After the container, freight can flow into American West distribution.",
      },
    ],
    process: [
      {
        label: "Port",
        body: "Inbound containers are coordinated as product arrives from overseas.",
      },
      {
        label: "Account team",
        body: "Documentation and the next move are managed by a dedicated team.",
      },
      {
        label: "AW Network",
        body: "Freight transfers into the American West distribution network.",
      },
      {
        label: "Destination",
        body: "Product is delivered to the facility, retailer, or region it was booked for.",
      },
    ],
    related: ["logistics-brokerage", "warehousing", "pool-distribution"],
  },
  {
    slug: "logistics-brokerage",
    number: "06",
    title: "Logistics Brokerage",
    navLabel: "Logistics Brokerage",
    menuTitle: "Logistics Brokerage",
    descriptor: "Extra capacity, coordinated routing",
    tagline: "Extra capacity. The same level of control.",
    group: "transportation",
    icon: "network",
    image: highway,
    supportImage: fleet,
    imagePosition: "28% center",
    paragraphs: [
      "Some shipments need capacity beyond a single plan. American West logistics brokerage covers unique shipping needs with specialized programs, documentation, and carrier coordination.",
      "Dedicated support specialists arrange the routing so the shipment can move where it needs to go, with the same level of control you expect from American West.",
    ],
    capabilities: [
      {
        title: "Unique shipping needs",
        body: "Brokerage is there when the freight does not fit a standard American West move.",
      },
      {
        title: "Specialized programs",
        body: "Programs are built around the shipment, not a generic load board.",
      },
      {
        title: "Documentation",
        body: "Support specialists handle the paperwork that keeps the move on track.",
      },
      {
        title: "Carrier coordination",
        body: "Capacity is arranged and followed so control stays with the account team.",
      },
      {
        title: "Routing",
        body: "The shipment can be routed to move where it needs to go.",
      },
    ],
    process: [
      {
        label: "The need",
        body: "The account team reviews what is moving and where it has to be.",
      },
      {
        label: "Documentation",
        body: "Paperwork and program details are set before the freight is tendered.",
      },
      {
        label: "Coordination",
        body: "Carriers are arranged to cover the capacity the shipment requires.",
      },
      {
        label: "Routing",
        body: "Support specialists follow the route through to delivery.",
      },
    ],
    related: ["international", "general-commodity", "b2b-ltl-retail-final-mile"],
  },
  {
    slug: "pool-distribution",
    number: "07",
    title: "Pool Distribution",
    navLabel: "Pool Distribution",
    menuTitle: "Pool Distribution",
    descriptor: "Regional consolidation and delivery",
    tagline: "Consolidate smarter. Distribute further.",
    group: "distribution",
    icon: "routes",
    image: fleet,
    supportImage: warehouse,
    imagePosition: "15% center",
    paragraphs: [
      "Pool distribution is built for product that has to reach numerous destination points inside one region. Orders consolidate, then move out together.",
      "That consolidation is how shippers lower freight cost compared with typical LTL, while still choosing the distribution method that fits the freight.",
    ],
    hub: true,
    capabilities: [
      {
        title: "Many destinations",
        body: "Product moving to multiple points in a region can travel as one pool.",
      },
      {
        title: "Consolidation",
        body: "Orders are combined before they fan out to the individual stops.",
      },
      {
        title: "Cost against typical LTL",
        body: "Pooling is designed to reduce freight cost versus shipping each order as separate LTL.",
      },
      {
        title: "The right method",
        body: "The distribution method is chosen around the freight, the region, and the delivery window.",
      },
    ],
    process: [
      {
        label: "Consolidate",
        body: "Orders bound for the same region are pooled.",
      },
      {
        label: "Hub",
        body: "Freight stages at a central point before it splits.",
      },
      {
        label: "Regional routes",
        body: "Deliveries fan out to the destination points in that geography.",
      },
      {
        label: "Deliver",
        body: "Each stop receives its freight without a separate long-haul LTL move.",
      },
    ],
    related: ["warehousing", "b2b-ltl-retail-final-mile", "international"],
  },
  {
    slug: "trade-show",
    number: "08",
    title: "Trade Show",
    navLabel: "Trade Show",
    menuTitle: "Trade Show",
    descriptor: "Direct to the exhibit floor",
    tagline: "Arrive ready to make an impression",
    group: "handling",
    icon: "booth",
    image: finalMile,
    supportImage: delivery,
    paragraphs: [
      "Thousands of buyers and designers will see the furniture on the floor. Upholstery and casegoods need to reach the exhibit in excellent condition.",
      "American West delivers direct to the tradeshow, on the scheduled arrival date, into the designated staging area — so the booth is ready before the doors open.",
    ],
    capabilities: [
      {
        title: "Buyers and designers",
        body: "The delivery is planned around the people who will see the product on the floor.",
      },
      {
        title: "Condition on arrival",
        body: "Upholstery and casegoods are protected so they show up damage-free.",
      },
      {
        title: "Direct to the show",
        body: "Freight goes to the tradeshow rather than through an extra handoff.",
      },
      {
        title: "Scheduled staging",
        body: "Arrival is set for the scheduled date and the designated staging area.",
      },
    ],
    process: [
      {
        label: "Schedule",
        body: "The arrival date and staging area are set before the show.",
      },
      {
        label: "Protect",
        body: "Upholstery and casegoods are handled to arrive in show condition.",
      },
      {
        label: "Direct delivery",
        body: "The shipment is taken to the tradeshow.",
      },
      {
        label: "Staging",
        body: "Product is placed in the designated area, ready for the floor.",
      },
    ],
    related: ["blanket-wrap", "b2b-ltl-retail-final-mile", "ecommerce-home-delivery"],
  },
  {
    slug: "warehousing",
    number: "09",
    title: "Warehousing",
    navLabel: "Warehousing",
    menuTitle: "Warehousing",
    descriptor: "Storage, staging, and quick ship",
    tagline: "Storage built around your supply chain",
    group: "distribution",
    icon: "warehouse",
    image: warehouse,
    supportImage: warehouse,
    paragraphs: [
      "Warehousing at American West is built for supply-chain efficiency: quick-ship programs, 24/7 inventory visibility, and a single point of contact.",
      "Teams devan cartons, ocean containers, and air freight, then support retail-compliant fulfillment — routing guides, EDI, UCC128, and RF — so product can ship when the program calls for it.",
    ],
    chips: ["Storage", "Staging", "Distribution", "Quick Ship"],
    capabilities: [
      {
        title: "Quick-ship programs",
        body: "Inventory is positioned so product can leave when the order does.",
      },
      {
        title: "24/7 visibility",
        body: "Account teams can see inventory instead of waiting on a status call.",
      },
      {
        title: "Single point of contact",
        body: "One American West contact coordinates the operation.",
      },
      {
        title: "Devanning",
        body: "Cartons, ocean containers, and air freight are stripped and received.",
      },
      {
        title: "Retail-compliant fulfillment",
        body: "Routing guide management, EDI, UCC128, and RF support retailer requirements.",
      },
    ],
    process: [
      {
        label: "Receive",
        body: "Inbound cartons, containers, and air freight are devanned.",
      },
      {
        label: "Store",
        body: "Inventory is held with visibility for the account team.",
      },
      {
        label: "Stage",
        body: "Orders are prepared to the retailer’s routing and label rules.",
      },
      {
        label: "Quick ship",
        body: "Product leaves on the program the supply chain was built around.",
      },
    ],
    related: ["pool-distribution", "ecommerce-home-delivery", "blanket-wrap"],
  },
];

const bySlug = new Map(SERVICES.map((service) => [service.slug, service]));

export function getService(slug: string) {
  return bySlug.get(slug);
}

export function servicesInGroup(group: ServiceGroupId) {
  return SERVICES.filter((service) => service.group === group);
}

export function relatedServices(service: ServiceRecord) {
  return service.related
    .map((slug) => bySlug.get(slug))
    .filter((item): item is ServiceRecord => Boolean(item));
}
