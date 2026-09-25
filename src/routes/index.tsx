import { createFileRoute } from "@tanstack/react-router";
import { FlipBook } from "../components/menu/FlipBook";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Slivasa Restaurant & Café — Our Menu" },
      {
        name: "description",
        content:
          "Turn the pages of Slivasa's digital menu and discover handmade brownies, tea cakes, celebration cakes, cookies, and chocolates.",
      },
      { property: "og:title", content: "Slivasa Restaurant & Café — Our Menu" },
      {
        property: "og:description",
        content:
          "A beautifully crafted digital menu of handmade bakes and confections from Slivasa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SlivasaMenu,
});

function SlivasaMenu() {
  return (
    <main className="menu-stage" aria-label="Slivasa restaurant menu">
      <div className="ambient-mark" aria-hidden="true">
        S
      </div>
      <FlipBook />
    </main>
  );
}
