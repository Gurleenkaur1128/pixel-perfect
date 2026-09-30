import { createFileRoute } from "@tanstack/react-router";

import { BlanketWrap } from "@/components/aw/BlanketWrap";
import { Careers } from "@/components/aw/Careers";
import { Excellence } from "@/components/aw/Excellence";
import { FinalCta } from "@/components/aw/FinalCta";
import { Footer } from "@/components/aw/Footer";
import { Hero } from "@/components/aw/Hero";
import { Journey } from "@/components/aw/Journey";
import { Nav } from "@/components/aw/Nav";
import { NetworkMap } from "@/components/aw/NetworkMap";
import { ServiceModes } from "@/components/aw/ServiceModes";
import { Stats } from "@/components/aw/Stats";
import { WestWay } from "@/components/aw/WestWay";

const TITLE = "American West — Nationwide Furniture Logistics";
const DESC =
  "Specialized furniture transportation and final-mile logistics built around your reputation. Blanket wrap, warehousing and nationwide delivery.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <Hero />
      <WestWay />
      <BlanketWrap />
      <NetworkMap />
      <Journey />
      <Excellence />
      <Stats />
      <ServiceModes />
      <Careers />
      <FinalCta />
      <Footer />
    </main>
  );
}
