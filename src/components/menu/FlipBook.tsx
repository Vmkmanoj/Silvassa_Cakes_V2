import HTMLFlipBook from "react-pageflip";
import {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import { pages, getPage } from "../../data/menu";
import { MenuPageContent } from "./MenuPageContent";
import { Navigation } from "./Navigation";

/* ─────────────────────────────────────────────────────────────
   BookPage
   react-pageflip clones children and passes a ref to the root
   DOM element so the library can position/animate it.
   Every child MUST be a forwardRef component.
───────────────────────────────────────────────────────────── */
const BookPage = forwardRef<
  HTMLDivElement,
  { pageIndex: number; isCover?: boolean }
>(({ pageIndex, isCover }, ref) => {
  const page = getPage(pageIndex);
  return (
    <div
      ref={ref}
      className={`book-page${isCover ? " book-page--cover" : ""}`}
      // react-pageflip reads data-density to decide hard vs soft flip
      data-density={isCover ? "hard" : "soft"}
    >
      {/* Inner wrapper clips content strictly inside the physical page */}
      <div className="book-page-inner">
        <MenuPageContent page={page} pageNumber={pageIndex + 1} />
      </div>
    </div>
  );
});
BookPage.displayName = "BookPage";

/* ─────────────────────────────────────────────────────────────
   useBookLayout
   Calculates single-page width/height from the viewport.

   DESKTOP (≥ 900 px):
     Shell = 2 × pageW so the library stays in landscape / two-page mode.
     — THIS BRANCH IS UNCHANGED —

   MOBILE (< 900 px):
     Uses visualViewport.height (the actual visible area after browser
     chrome is subtracted) instead of window.innerHeight which can
     include hidden browser UI on some mobile browsers.

     Aspect ratio (ASPECT = width / height = 2 ÷ 3 = 0.667) is enforced
     so the page always maintains its physical book proportions.

     The page is constrained by BOTH width and height:
       If the aspect-projected height exceeds available height → height
       becomes the primary constraint and width is derived from it.
       Otherwise → width is the primary constraint.

     Fixed overheads subtracted:
       – HEADER_H  : compact mobile header
       – NAV_H     : navigation bar below the book
       – SAFE_H    : notch / home indicator allowance
       – STAGE_PAD : top/bottom stage padding
───────────────────────────────────────────────────────────── */
function useBookLayout() {
  const BREAKPOINT = 900; // px — anything ≥ this is desktop

  // Mobile overhead constants (must match CSS variables below)
  // No external header — masthead removed from the page shell.
  // Only navigation bar + tiny safe-area padding.
  const NAV_H     = 36;  // compact nav bar (2.2rem ≈ 35px)
  const SAFE_H    = 20;  // safe-area top + bottom (env insets)
  const STAGE_PAD = 8;   // 4px top + 4px bottom stage padding
  const TOTAL_OH  = NAV_H + SAFE_H + STAGE_PAD;

  // Target page aspect ratio: width ÷ height (portrait, like a real menu)
  const ASPECT = 2 / 3; // 0.667 — narrower than A4, feels like a restaurant menu

  // Max page dimensions — raised so bigger phones fill more screen
  const MAX_W = 480;
  const MAX_H = 800;

  function calc() {
    if (typeof window === "undefined") {
      return { pageW: 320, pageH: 480, isDesktop: false };
    }

    const vw = window.innerWidth;
    const isDesktop = vw >= BREAKPOINT;

    if (isDesktop) {
      // ── Desktop: maximise book in available space ────────────
      const vh = window.innerHeight;
      // 95% of viewport width for the two-page spread (was 88%)
      const bookW = Math.min(Math.floor(vw * 0.95), 1280);
      const pageW = Math.floor(bookW / 2);
      // Navigation ≈ 42px + minimal top/bottom padding ≈ 16px total
      const available = vh - 58;
      // No hard 700px cap — allow up to 90% of viewport height
      const pageH = Math.min(Math.max(Math.floor(available), 480), Math.floor(vh * 0.90));
      return { pageW, pageH, isDesktop };
    }

    // ── Mobile: aspect-ratio-constrained sizing ──────────────
    //
    // Use visualViewport.height when available: it already excludes the
    // browser address bar (unlike window.innerHeight which can differ
    // between browsers when the address bar is shown/hidden).
    const visH = window.visualViewport?.height ?? window.innerHeight;
    const availW = Math.floor(vw * 0.97); // 97 vw — nearly full screen width
    const availH = Math.max(Math.floor(visH - TOTAL_OH), 360); // never below 360

    // Option A: width-constrained
    const wFromW = Math.min(availW, MAX_W);
    const hFromW = Math.floor(wFromW / ASPECT);

    // Option B: height-constrained
    const hFromH = Math.min(availH, MAX_H);
    const wFromH = Math.floor(hFromH * ASPECT);

    // Pick whichever option produces a page that fits within both constraints
    let pageW: number;
    let pageH: number;
    if (hFromW <= availH && hFromW <= MAX_H) {
      // Width constraint is the binding one → derive height
      pageW = wFromW;
      pageH = hFromW;
    } else {
      // Height constraint is the binding one → derive width
      pageH = hFromH;
      pageW = Math.min(wFromH, availW, MAX_W);
    }

    return { pageW, pageH, isDesktop };
  }

  const [layout, setLayout] = useState(calc);

  useLayoutEffect(() => {
    const update = () => setLayout(calc());

    // window resize covers desktop and orientation change
    window.addEventListener("resize", update);

    // visualViewport resize fires when the browser chrome shows/hides
    // (e.g. scrolling in Safari iOS expands/collapses the address bar)
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return layout;
}

/* ─────────────────────────────────────────────────────────────
   FlipBook
───────────────────────────────────────────────────────────── */
export function FlipBook() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.length;
  const layout = useBookLayout();
  const { pageW, pageH, isDesktop } = layout;

  // Imperative flip helpers
  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);
  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipNext();
      if (e.key === "ArrowLeft") flipPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipNext, flipPrev]);

  // Track current page from library events
  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  // Navigation state
  const prevDisabled = currentPage === 0;
  const nextDisabled = currentPage >= totalPages - 1;

  // Status label
  let statusLabel: string;
  if (!isDesktop) {
    statusLabel = `${currentPage + 1} / ${totalPages}`;
  } else if (currentPage === 0) {
    statusLabel = `1 / ${totalPages}`;
  } else {
    const right = Math.min(currentPage + 1, totalPages);
    statusLabel = `${currentPage}–${right} / ${totalPages}`;
  }

  /*
    IMPORTANT: The `.book-shell` wrapper must be exactly:
      Desktop: width = 2 × pageW  (forces landscape mode)
      Mobile:  width = 1 × pageW  (stays in portrait mode)

    react-pageflip reads the parentElement clientWidth to decide
    landscape vs portrait. Giving it exactly 2*pageW ensures it
    always shows two pages on desktop without needing size="stretch".

    CRITICAL: showCover={true} on mobile causes the library to treat
    the cover as a right-side page in a two-page spread — leaving an
    invisible empty left page and clipping the right edge. Disable it
    on mobile so the cover renders as a full single page.

    The `key` prop forces a clean remount when the breakpoint changes
    so the library never carries over stale two-page orientation state.
  */
  const shellW = isDesktop ? pageW * 2 : pageW;

  return (
    <div className="book-wrapper">
      {/* Ambient drop shadow BEHIND the book */}
      <div
        className="book-ambient-shadow"
        style={{ width: shellW }}
        aria-hidden="true"
      />

      {/* Shell: exact pixel width so library knows landscape vs portrait */}
      <div
        className={`book-shell${isDesktop ? " book-shell--desktop" : " book-shell--mobile"}`}
        style={{ width: shellW, height: pageH }}
      >
        <HTMLFlipBook
          key={isDesktop ? "desktop" : "mobile"}
          ref={bookRef}
          className="book-root"
          style={{ display: "block" }}
          // width/height = SINGLE PAGE dimensions
          width={pageW}
          height={pageH}
          size="fixed"
          minWidth={pageW}
          maxWidth={pageW}
          minHeight={pageH}
          maxHeight={pageH}
          // Portrait = single-page on mobile; auto on desktop (container drives it)
          usePortrait={!isDesktop}
          // Visual settings
          drawShadow={true}
          maxShadowOpacity={0.3}
          flippingTime={750}
          // showCover on desktop only — on mobile it causes the cover to be
          // positioned as the right-side page of a landscape spread, pushing
          // it off-screen and leaving a blank left half.
          showCover={isDesktop}
          showPageCorners={true}
          // Interaction
          useMouseEvents={true}
          mobileScrollSupport={false}
          swipeDistance={25}
          clickEventForward={true}
          disableFlipByClick={false}
          // Layout
          startZIndex={10}
          autoSize={false}
          startPage={0}
          // Events
          onFlip={onFlip}
        >
          {pages.map((_, i) => (
            <BookPage
              key={i}
              pageIndex={i}
              isCover={i === 0 || i === pages.length - 1}
            />
          ))}
        </HTMLFlipBook>

        {/* Subtle spine — only visible in desktop two-page mode, not on cover */}
        {isDesktop && currentPage > 0 && (
          <div className="book-spine" aria-hidden="true" />
        )}
      </div>

      <Navigation
        onPrevious={flipPrev}
        onNext={flipNext}
        previousDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        statusLabel={statusLabel}
        hintLabel={
          isDesktop ? "Use arrows or click page edges" : "← Swipe to turn →"
        }
      />
    </div>
  );
}
