import type { PointerEvent } from "react";
import type { MenuPage } from "../../data/menu";
import { MenuPageContent } from "./MenuPageContent";
import { PageTurn } from "./PageTurn";

function MenuSheet({
  page,
  pageNumber,
  side,
  onOpen,
}: {
  page: MenuPage;
  pageNumber: number;
  side: "left" | "right";
  onOpen?: (() => void) | undefined;
}) {
  return (
    <article
      className={`menu-sheet sheet-${side} ${page.kind === "cover" ? "cover-sheet" : ""}`}
      onClick={(event) => {
        if (onOpen) onOpen();
        else if (event.clientX > window.innerWidth / 2)
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
        else window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      }}
    >
      <MenuPageContent page={page} pageNumber={pageNumber} onOpen={onOpen} />
    </article>
  );
}

export function MenuBook({
  isClosed,
  visiblePages,
  getPage,
  turn,
  onPointerDown,
  onPointerUp,
  onOpen,
}: {
  isClosed: boolean;
  visiblePages: number[];
  getPage: (index: number) => MenuPage;
  turn: { direction: "next" | "previous"; page: number } | null;
  onPointerDown: (event: PointerEvent) => void;
  onPointerUp: (event: PointerEvent) => void;
  onOpen: (index: number) => (() => void) | undefined;
}) {
  return (
    <section
      className={`book-shell ${isClosed ? "is-closed" : "is-open"}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      aria-live="polite"
    >
      <div className="book-shadow" aria-hidden="true" />
      <div className="book-pages">
        {visiblePages.map((index, position) => (
          <MenuSheet
            key={index}
            page={getPage(index)}
            pageNumber={index + 1}
            side={position === 0 ? "left" : "right"}
            onOpen={onOpen(index)}
          />
        ))}
        {turn && <PageTurn direction={turn.direction} page={turn.page} />}
      </div>
    </section>
  );
}
