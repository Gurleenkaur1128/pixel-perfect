import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Footer } from "@/components/aw/Footer";
import { Nav } from "@/components/aw/Nav";

export const Route = createFileRoute("/services")({
  component: ServicesLayout,
});

function ServicesLayout() {
  return (
    <main className="bg-white text-[#172033]">
      <Nav />
      <Outlet />
      <Footer />
    </main>
  );
}
