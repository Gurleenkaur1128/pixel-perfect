import { createFileRoute } from "@tanstack/react-router";

import { Careers } from "@/components/aw/Careers";
import { Footer } from "@/components/aw/Footer";
import { Hero } from "@/components/aw/Hero";
import { Journey } from "@/components/aw/Journey";
import { Nav } from "@/components/aw/Nav";
import { NetworkMap } from "@/components/aw/NetworkMap";
import { Preloader } from "@/components/aw/Preloader";

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
      <Preloader />
      <Nav />
      <Hero />
      <Journey />
      <NetworkMap />
      <Careers />
      <Footer />
    </main>
  );
}
