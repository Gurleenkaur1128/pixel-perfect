import { createFileRoute } from "@tanstack/react-router";

import { BrandPromise } from "@/components/aw/BrandPromise";
import { Careers } from "@/components/aw/Careers";
import { FinalCta } from "@/components/aw/FinalCta";
import { Footer } from "@/components/aw/Footer";
import { Furniture } from "@/components/aw/Furniture";
import { Hero } from "@/components/aw/Hero";
import { Journey } from "@/components/aw/Journey";
import { Nav } from "@/components/aw/Nav";
import { NetworkMap } from "@/components/aw/NetworkMap";
import { Services, ServicesMobile } from "@/components/aw/Services";
import { Stats } from "@/components/aw/Stats";
import { WestWay } from "@/components/aw/WestWay";

const TITLE = "American West — Nationwide Furniture Logistics";
const DESC =
  "Specialized furniture transportation and final-mile logistics built around your reputation. Coast-to-coast network, white-glove care.";

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
      <NetworkMap />
      <Journey />
      <div className="hidden lg:block">
        <Services />
      </div>
      <div className="lg:hidden">
        <ServicesMobile />
      </div>
      <Furniture />
      <Stats />
      <BrandPromise />
      <Careers />
      <FinalCta />
      <Footer />
    </main>
  );
}
