import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { getPage, pages } from "../../data/menu";
import { MenuPageContent } from "./MenuPageContent";
import { Navigation } from "./Navigation";

const TURN_MS = 620;

export function MobileBook() {
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState<{ dir: "next" | "previous"; p: number; drag: boolean } | null>(
    null,
  );
  const shell = useRef<HTMLElement>(null);
  const start = useRef<{ x: number; y: number; t: number } | null>(null);
  const busy = useRef(false);
  const last = pages.length - 1;

  const finish = useCallback(
    (dir: "next" | "previous", complete: boolean) => {
      busy.current = true;
      setAnim({ dir, p: complete ? 1 : 0, drag: false });
      window.setTimeout(() => {
        if (complete)
          setIndex((i) => (dir === "next" ? Math.min(i + 1, last) : Math.max(i - 1, 0)));
        setAnim(null);
        busy.current = false;
      }, TURN_MS);
    },
    [last],
  );

  const turn = useCallback(
    (dir: "next" | "previous") => {
      if (busy.current || anim) return;
      if (dir === "next" ? index >= last : index <= 0) return;
      busy.current = true;
      setAnim({ dir, p: 0, drag: false });
      requestAnimationFrame(() => requestAnimationFrame(() => finish(dir, true)));
    },
    [anim, finish, index, last],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") turn("next");
      if (e.key === "ArrowLeft") turn("previous");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn]);

  const onDown = (e: PointerEvent) => {
    if (!busy.current) start.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onMove = (e: PointerEvent) => {
    const s = start.current;
    if (!s || busy.current) return;
    const dx = e.clientX - s.x;
    if (!anim && (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(e.clientY - s.y))) return;
    const dir = anim?.dir ?? (dx < 0 ? "next" : "previous");
    if (dir === "next" ? index >= last : index <= 0) return;
    const w = shell.current?.offsetWidth ?? 360;
    const p = Math.min(Math.max((dir === "next" ? -dx : dx) / w, 0), 1);
    setAnim({ dir, p, drag: true });
  };
  const onUp = (e: PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s || !anim || !anim.drag) return;
    const v = Math.abs(e.clientX - s.x) / Math.max(performance.now() - s.t, 1);
    finish(anim.dir, anim.p > 0.35 || (v > 0.6 && anim.p > 0.08));
  };

  // Geometry: the moving sheet always hinges on its left edge.
  // next: current page lifts 0 -> -180deg revealing the next page beneath.
  // previous: previous page returns -180 -> 0deg covering the current page.
  const base = anim ? (anim.dir === "next" ? index + 1 : index) : index;
  const sheet = anim ? (anim.dir === "next" ? index : index - 1) : null;
  const p = anim?.p ?? 0;
  const angle = anim ? (anim.dir === "next" ? -180 * p : -180 * (1 - p)) : 0;
  const lift = Math.sin((Math.abs(angle) / 180) * Math.PI);
  const transition =
    anim && !anim.drag
      ? `transform ${TURN_MS}ms cubic-bezier(.33,.7,.25,1), opacity ${TURN_MS}ms ease`
      : "none";

  return (
    <>
      <section
        ref={shell}
        className="m-book"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        aria-live="polite"
      >
        <article
          className={`m-page ${getPage(base).kind === "cover" ? "cover-sheet" : ""}`}
          onClick={() => {
            if (!anim && base === 0) turn("next");
          }}
        >
          <MenuPageContent
            page={getPage(base)}
            pageNumber={base + 1}
            onOpen={base === 0 ? () => turn("next") : undefined}
          />
          <div
            className="m-under-shade"
            style={{ opacity: anim ? 0.45 * (1 - Math.abs(angle) / 180) : 0, transition }}
          />
        </article>
        {sheet !== null && (
          <div
            className="m-sheet"
            style={{ transform: `rotateY(${angle}deg)`, transition }}
            aria-hidden="true"
          >
            <div
              className={`m-face m-front ${getPage(sheet).kind === "cover" ? "cover-sheet" : ""}`}
            >
              <MenuPageContent page={getPage(sheet)} pageNumber={sheet + 1} />
              <div className="m-curl" style={{ opacity: lift, transition }} />
            </div>
            <div className="m-face m-back">
              <div className="m-curl m-curl-back" style={{ opacity: lift, transition }} />
            </div>
            <div className="m-cast" style={{ opacity: lift * 0.9, transition }} />
          </div>
        )}
      </section>
      <Navigation
        onPrevious={() => turn("previous")}
        onNext={() => turn("next")}
        previousDisabled={index === 0 || !!anim}
        nextDisabled={index === last || !!anim}
        statusLabel={`${index + 1} / ${pages.length}`}
        hintLabel="← Swipe to turn →"
      />
    </>
  );
}
