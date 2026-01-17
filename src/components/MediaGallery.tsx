"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type {
  MediaFilterId,
  MediaItem,
  MediaSection,
  MediaSectionName,
} from "../../content/media";

type MediaGalleryProps = {
  items: MediaItem[];
  sections: MediaSection[];
  filters: Array<{
    id: MediaFilterId;
    label: string;
    sections: MediaSectionName[];
  }>;
  filterLabel: string;
  videoFallback: string;
};

const defaultImageRatio = 4 / 3;
const defaultVideoRatio = 16 / 9;

const tileHeightClasses = "h-[260px] sm:h-[320px] lg:h-[360px]";

const getScrollAmount = (element: HTMLDivElement | null) => {
  const width = element?.clientWidth ?? 0;
  return Math.round(width * 0.9);
};

const railFadeLeft =
  "absolute inset-y-0 left-0 w-8 bg-[linear-gradient(90deg,var(--background),transparent)]";
const railFadeRight =
  "absolute inset-y-0 right-0 w-8 bg-[linear-gradient(270deg,var(--background),transparent)]";

export default function MediaGallery({
  items,
  sections,
  filters,
  filterLabel,
  videoFallback,
}: MediaGalleryProps) {
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [activeFilter, setActiveFilter] = useState<MediaFilterId>(
    filters[0]?.id ?? "all",
  );

  const setRatio = (id: string, ratio: number) => {
    setRatios((prev) => {
      const current = prev[id];
      if (current && Math.abs(current - ratio) < 0.01) return prev;
      return { ...prev, [id]: ratio };
    });
  };

  const ratioMap = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((item) => {
      const fallback = item.type === "video" ? defaultVideoRatio : defaultImageRatio;
      map[item.id] = ratios[item.id] ?? fallback;
    });
    return map;
  }, [items, ratios]);

  const activeSections =
    filters.find((filter) => filter.id === activeFilter)?.sections ??
    filters[0]?.sections ??
    [];

  const visibleSections = sections
    .filter((section) => activeSections.includes(section.name))
    .map((section) => ({
      ...section,
      items: items.filter((item) => item.section === section.name),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="grid min-w-0 gap-12">
      <div className="flex flex-wrap items-center gap-4 border-y border-border py-3 text-xs uppercase tracking-[0.32em] text-muted">
        <span className="font-mono">{filterLabel}</span>
        <div className="flex flex-wrap gap-4">
          {filters.map((filter) => {
            const isActive = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`relative pb-1 text-xs uppercase tracking-[0.32em] transition-colors ${
                  isActive ? "text-foreground" : "text-muted"
                }`}
                aria-pressed={isActive}
              >
                <span>{filter.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[1px] w-full bg-accent transition-transform duration-200 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {visibleSections.map((section) => (
        <MediaRail
          key={section.id}
          section={section}
          items={section.items}
          ratioMap={ratioMap}
          setRatio={setRatio}
          videoFallback={videoFallback}
        />
      ))}
    </div>
  );
}

type MediaRailProps = {
  section: MediaSection & { items: MediaItem[] };
  items: MediaItem[];
  ratioMap: Record<string, number>;
  setRatio: (id: string, ratio: number) => void;
  videoFallback: string;
};

function MediaRail({
  section,
  items,
  ratioMap,
  setRatio,
  videoFallback,
}: MediaRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const dragState = useRef({
    isDown: false,
    dragged: false,
    startX: 0,
    scrollLeft: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
    isOverflowing: false,
  });

  const updateScrollState = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const epsilon = el.clientWidth * 0.01;
    const isOverflowing = max > epsilon;
    const canScrollLeft = el.scrollLeft > epsilon;
    const canScrollRight = el.scrollLeft < max - epsilon;
    setScrollState({ canScrollLeft, canScrollRight, isOverflowing });
  };

  useEffect(() => {
    updateScrollState();
  }, [ratioMap, items.length]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });

    // ResizeObserver catches layout/image load changes affecting scrollWidth.
    const ro = new ResizeObserver(() => updateScrollState());
    ro.observe(el);
    const row = el.firstElementChild;
    if (row instanceof HTMLElement) {
      ro.observe(row);
    }

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const scrollBy = (direction: number) => {
    const amount = getScrollAmount(railRef.current) * direction;
    railRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollBy(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollBy(-1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (
      target.closest(
        "button, a, input, select, textarea, summary, [data-no-drag]",
      )
    ) {
      return;
    }
    if (target.closest("video")) return;

    const rail = railRef.current;
    if (!rail) return;

    dragState.current = {
      isDown: true,
      dragged: false,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
    };

    rail.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDown) return;
    const rail = railRef.current;
    if (!rail) return;

    const delta = event.clientX - dragState.current.startX;
    if (Math.abs(delta) > 4) dragState.current.dragged = true;

    rail.scrollLeft = dragState.current.scrollLeft - delta;
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDown) return;

    dragState.current.isDown = false;
    setIsDragging(false);

    const rail = railRef.current;
    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.dragged) return;
    dragState.current.dragged = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <section className="grid min-w-0 gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.32em] text-muted">
          {section.label}
        </p>
        {section.caption ? (
          <p className="text-sm text-muted">{section.caption}</p>
        ) : null}
      </div>

      {/* Constrained wrapper is CRITICAL so right arrow doesn't get clipped */}
      <div className="relative w-full max-w-full min-w-0">
        <div className={`${railFadeLeft} pointer-events-none`} />
        <div className={`${railFadeRight} pointer-events-none`} />

        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className={`absolute left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-border bg-background text-xs uppercase tracking-[0.3em] text-muted transition-opacity hover:text-foreground md:flex ${
            scrollState.canScrollLeft && scrollState.isOverflowing
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-label={`Scroll ${section.label} gallery left`}
        >
          <span aria-hidden="true">&lt;</span>
        </button>

        <button
          type="button"
          onClick={() => scrollBy(1)}
          className={`absolute right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-border bg-background text-xs uppercase tracking-[0.3em] text-muted transition-opacity hover:text-foreground md:flex ${
            scrollState.canScrollRight && scrollState.isOverflowing
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-label={`Scroll ${section.label} gallery right`}
        >
          <span aria-hidden="true">&gt;</span>
        </button>

        {/* Use overflow-x-auto + flex w-max so the overflow happens INSIDE this box */}
        <div
          ref={railRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onClickCapture={handleClickCapture}
          aria-label={`${section.label} gallery rail`}
          data-role="media-rail-scroll"
          className={`rail-scroll w-full max-w-full min-w-0 snap-x snap-proximity overflow-x-auto overflow-y-hidden overscroll-x-contain ${
            isDragging ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
          style={{ WebkitOverflowScrolling: "touch" as any }}
        >
          {/* IMPORTANT: flex + w-max forces this row to take content width */}
          <div className="flex w-max items-start gap-6 px-6 py-2 sm:px-8">
            {items.map((item) => {
              const ratio = ratioMap[item.id];
              const objectClass =
                item.mode === "cover" ? "object-cover" : "object-contain";

              return (
                <figure key={item.id} className="shrink-0 snap-start">
                  <div
                    className={`relative ${tileHeightClasses} overflow-hidden border border-border bg-highlight`}
                    style={{ aspectRatio: `${ratio}` }}
                  >
                    {item.type === "image" ? (
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 520px, (min-width: 640px) 420px, 80vw"
                        className={objectClass}
                        draggable={false}
                        onLoadingComplete={(image) => {
                          if (image.naturalWidth && image.naturalHeight) {
                            setRatio(
                              item.id,
                              image.naturalWidth / image.naturalHeight,
                            );
                          }
                        }}
                      />
                    ) : (
                      <video
                        className={`h-full w-full ${objectClass}`}
                        controls
                        preload="metadata"
                        playsInline
                        onLoadedMetadata={(event) => {
                          const target = event.currentTarget;
                          if (target.videoWidth && target.videoHeight) {
                            setRatio(
                              item.id,
                              target.videoWidth / target.videoHeight,
                            );
                          }
                        }}
                        style={{ backgroundColor: "var(--highlight)" }}
                      >
                        <source src={item.src} />
                        {videoFallback}
                      </video>
                    )}
                  </div>

                  <figcaption className="mt-3 grid gap-2">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.32em] text-muted">
                      <span className="font-mono">{section.label}</span>
                      <span>{item.type === "video" ? "Video" : "Image"}</span>
                    </div>
                    <p className="text-base font-semibold text-foreground">
                      {item.title}
                    </p>
                    {item.caption ? (
                      <p className="text-sm text-muted">{item.caption}</p>
                    ) : null}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
