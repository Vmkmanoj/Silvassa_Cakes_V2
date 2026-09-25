import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { MenuBook } from "../components/menu/MenuBook";
import { MobileBook } from "../components/menu/MobileBook";
import { Navigation } from "../components/menu/Navigation";
import { getPage, pages } from "../data/menu";

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

function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return desktop;
}

function SlivasaMenu() {
  const isDesktop = useDesktop();
  const [pageIndex, setPageIndex] = useState(0);
  const [turn, setTurn] = useState<{ direction: "next" | "previous"; page: number } | null>(null);
  const gestureStart = useRef<number | null>(null);
  const turning = turn !== null;

  const step = isDesktop && pageIndex > 0 ? 2 : 1;
  const nextIndex = pageIndex === 0 ? 1 : Math.min(pageIndex + step, pages.length - 1);
  const previousIndex = pageIndex <= 1 ? 0 : Math.max(1, pageIndex - (isDesktop ? 2 : 1));

  const turnPage = useCallback(
    (direction: "next" | "previous") => {
      if (turning) return;
      const target = direction === "next" ? nextIndex : previousIndex;
      if (target === pageIndex) return;
      setTurn({
        direction,
        page:
          direction === "next"
            ? isDesktop && pageIndex > 0
              ? Math.min(pageIndex + 1, pages.length - 1)
              : pageIndex
            : pageIndex,
      });
      window.setTimeout(() => setPageIndex(target), 330);
      window.setTimeout(() => setTurn(null), 760);
    },
    [isDesktop, nextIndex, pageIndex, previousIndex, turning],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") turnPage("next");
      if (event.key === "ArrowLeft") turnPage("previous");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turnPage]);

  const visiblePages = useMemo(() => {
    if (!isDesktop || pageIndex === 0) return [pageIndex];
    return [pageIndex, Math.min(pageIndex + 1, pages.length - 1)].filter(
      (value, index, array) => array.indexOf(value) === index,
    );
  }, [isDesktop, pageIndex]);

  const onPointerDown = (event: PointerEvent) => {
    gestureStart.current = event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (gestureStart.current === null) return;
    const movement = event.clientX - gestureStart.current;
    gestureStart.current = null;
    if (Math.abs(movement) > 45) turnPage(movement < 0 ? "next" : "previous");
  };

  const countLabel =
    isDesktop && pageIndex > 0 && pageIndex < pages.length - 1
      ? `${pageIndex + 1}–${Math.min(pageIndex + 2, pages.length)} / ${pages.length}`
      : `${pageIndex + 1} / ${pages.length}`;

  return (
    <main className="menu-stage" aria-label="Slivasa restaurant menu">
      <div className="ambient-mark" aria-hidden="true">
        S
      </div>
      <header className="menu-masthead">
        <span className="brand-mark">S</span>
        <div>
          <strong>Slivasa</strong>
          <span>Restaurant & Café</span>
        </div>
      </header>

      {!isDesktop ? (
        <MobileBook />
      ) : (
        <>
          <MenuBook
            isClosed={pageIndex === 0}
            visiblePages={visiblePages}
            getPage={getPage}
            turn={turn}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onOpen={(index) => (index === 0 ? () => turnPage("next") : undefined)}
          />
          <Navigation
            onPrevious={() => turnPage("previous")}
            onNext={() => turnPage("next")}
            previousDisabled={pageIndex === 0 || turning}
            nextDisabled={pageIndex === pages.length - 1 || turning}
            statusLabel={countLabel}
            hintLabel="Use arrows or page edges"
          />
        </>
      )}
    </main>
  );
}
