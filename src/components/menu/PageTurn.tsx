import { getPage, pages } from "../../data/menu";
import { MenuPageContent } from "./MenuPageContent";

export function PageTurn({ direction, page }: { direction: "next" | "previous"; page: number }) {
  const otherPage =
    direction === "next" ? Math.min(page + 1, pages.length - 1) : Math.max(page - 1, 0);
  const otherPageNumber = direction === "next" ? Math.min(page + 2, pages.length) : page;

  return (
    <div className={`turning-sheet turn-${direction}`} aria-hidden="true">
      <div className="turning-face turning-front">
        <MenuPageContent page={getPage(page)} pageNumber={page + 1} />
      </div>
      <div className="turning-face turning-back">
        <MenuPageContent page={getPage(otherPage)} pageNumber={otherPageNumber} />
      </div>
    </div>
  );
}
