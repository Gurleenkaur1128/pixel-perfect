import { createFileRoute, notFound } from "@tanstack/react-router";

import { ServiceDetail } from "@/components/aw/ServiceDetail";
import { getService } from "@/data/services";

export const Route = createFileRoute("/services/$slug")({
  beforeLoad: ({ params }) => {
    if (!getService(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const service = getService(params.slug);
    const title = service ? `${service.title} — American West` : "Services — American West";
    const description = service?.tagline ?? "American West specialized transportation.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ServiceSlugRoute,
});

function ServiceSlugRoute() {
  const { slug } = Route.useParams();
  const service = getService(slug);
  if (!service) return null;
  return <ServiceDetail service={service} />;
}
