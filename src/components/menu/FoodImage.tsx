import { useState } from "react";

type FoodImageProps = {
  /** Ordered candidate sources. The first one that loads wins; if one fails
   * to load, the next is tried automatically until the list is exhausted. */
  sources?: string[] | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

/**
 * Image with a resilient fallback chain: Image 1 -> (on error) Image 2 ->
 * (on error) Image 3 -> ... -> branded placeholder. Never leaves a broken
 * image icon or an empty container on the page.
 */
export function FoodImage({ sources, alt, className, width, height }: FoodImageProps) {
  const list = sources?.filter(Boolean) ?? [];
  const [attempt, setAttempt] = useState(0);
  const [exhausted, setExhausted] = useState(list.length === 0);

  const src = list[attempt];

  if (exhausted || !src) {
    return (
      <div className={`food-image-fallback ${className ?? ""}`} role="img" aria-label={alt}>
        <span aria-hidden="true">✦</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      width={width}
      height={height}
      onError={() => {
        if (attempt + 1 < list.length) setAttempt((value) => value + 1);
        else setExhausted(true);
      }}
    />
  );
}
