import { createFileRoute } from "@tanstack/react-router";

import { ServicesPage } from "@/components/aw/ServicesPage";

const TITLE = "Services — American West";
const DESC =
  "Specialized transportation solutions built around your freight. Nationwide LTL, blanket wrap, home delivery, pool distribution, and warehousing.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return <ServicesPage />;
}
