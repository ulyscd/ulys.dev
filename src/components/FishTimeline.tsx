/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, Maximize2 } from "lucide-react";

type FishTimelineVariant = "compact" | "extended";

interface FishTimelineProps {
  variant?: FishTimelineVariant;
  onExtend?: () => void;
}

interface FishTimelineItem {
  src: string;
  caption: string;
  date: string;
}

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const FISH_TIMELINE_ITEMS: FishTimelineItem[] = [
  {
    src: publicAsset("fish/trout.jpg"),
    caption: "the perfect fly day, end of an era.",
    date: "Dec. 2025",
  },
  {
    src: publicAsset("fish/bfscoho.jpeg"),
    caption: "coho rodeo 2, date.",
    date: "Nov. 2025",
  },
  {
    src: publicAsset("fish/king.jpg"),
    caption: "filled the freezer.",
    date: "Sept. 2025",
  },
  {
    src: publicAsset("fish/brown.jpg"),
    caption: "exotic pattern pic.",
    date: "Jul. 2025",
  },
  {
    src: publicAsset("fish/fallqua.jpg"),
    caption: "chromer w/ the brotisserie.",
    date: "Jul. 2025",
  },
  {
    src: publicAsset("fish/bull.jpg"),
    caption: "snowy alpine bull",
    date: "Dec. 2024",
  },
  {
    src: publicAsset("fish/twitch.jpg"),
    caption: "full kipe twitcher bite",
    date: "Nov. 2024",
  },
  {
    src: publicAsset("fish/quasilvers.jpg"),
    caption: "doubled up silvers",
    date: "Oct. 2024",
  },
  {
    src: publicAsset("fish/chrome.jpg"),
    caption: "let this dimer grow",
    date: "Oct. 2024",
  },
  {
    src: publicAsset("fish/shad.jpg"),
    caption: "pnw mini tarpon",
    date: "Jun. 2024",
  },
  {
    src: publicAsset("fish/steel.jpg"),
    caption: "steel prophecy",
    date: "Feb. 2024",
  },
  {
    src: publicAsset("fish/coho.jpg"),
    caption: "reignited, coho rodeo",
    date: "Oct. 2023",
  },
  {
    src: publicAsset("fish/origin.jpg"),
    caption: "the conception",
    date: "*error*",
  },
];

export default function FishTimeline({
  variant = "compact",
  onExtend,
}: FishTimelineProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const captionTimer = useRef<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const isExtended = variant === "extended";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });

    return () => {
      if (captionTimer.current !== null) {
        window.clearTimeout(captionTimer.current);
      }
    };
  }, []);

  const handleGoToBottom = () => {
    const scroller = scrollRef.current;

    if (!scroller) return;

    scroller.scrollTo({
      top: scroller.scrollHeight,
      behavior: "smooth",
    });
  };

  const revealCaption = (index: number) => {
    setRevealedIndex(index);

    if (captionTimer.current !== null) {
      window.clearTimeout(captionTimer.current);
    }

    captionTimer.current = window.setTimeout(() => {
      setRevealedIndex(null);
      captionTimer.current = null;
    }, 4000);
  };

  return (
    <div
      className={`fish-timeline-window relative min-h-0 overflow-hidden rounded border border-[var(--theme-hot)]/30 bg-white/55 shadow-[0_18px_50px_rgba(var(--theme-rgb),0.12)] backdrop-blur-xl ${
        isExtended ? "flex h-full flex-col" : "h-[330px] md:h-[390px]"
      }`}
    >
      <div className="relative z-20 flex items-center justify-between gap-2 border-b border-[var(--theme-hot)]/15 bg-white/80 px-3 py-2">
        <span className="font-mono text-[8px] uppercase tracking-widest text-[var(--theme-hot)]/70">
          fish_timeline
        </span>
        <div className="flex items-center gap-2">
          {!isExtended && onExtend && (
            <button
              type="button"
              onClick={onExtend}
              className="shrink-0 p-1 border border-[var(--theme-hot)]/30 rounded hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none"
              aria-label="Extend fish timeline view"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleGoToBottom}
            className="shrink-0 p-1 border border-[var(--theme-hot)]/30 rounded hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none"
            aria-label="Go to bottom of fish timeline"
          >
            <ArrowDownToLine className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`relative min-h-0 snap-y snap-mandatory overflow-y-auto scrollbar-hidden ${
          isExtended ? "flex-1" : "h-[calc(100%-41px)]"
        }`}
        data-testid={`fish-timeline-${variant}`}
      >
        <div className="relative min-h-full">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0 flex justify-center">
            <div className="relative h-full border-l border-dashed border-[var(--theme-hot)]/45">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 font-mono text-base leading-none text-[var(--theme-hot)]/65">
                ⇡
              </span>
            </div>
          </div>

          {FISH_TIMELINE_ITEMS.map((item, index) => (
            <section
              key={`${item.src}-${item.date}`}
              className={`relative z-10 flex snap-start items-center justify-center px-4 py-7 ${
                isExtended ? "min-h-[calc(100dvh-86px)]" : "h-full"
              }`}
            >
              <button
                type="button"
                onClick={() => revealCaption(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  setCursorPosition({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                  });
                }}
                className={`group relative block w-full overflow-hidden rounded border border-[var(--theme-hot)]/35 bg-white/85 p-1 shadow-[0_14px_40px_rgba(var(--theme-rgb),0.14)] transition-shadow hover:shadow-[0_20px_50px_rgba(var(--theme-rgb),0.22)] focus:outline-none ${
                  isExtended ? "max-w-[760px]" : "max-w-[430px]"
                }`}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className={`w-full rounded-sm object-cover ${
                    isExtended
                      ? "h-[min(70dvh,680px)]"
                      : "h-[250px] md:h-[305px]"
                  }`}
                  draggable={false}
                />
                <span className="absolute right-2 top-2 rounded border border-[var(--theme-hot)]/40 bg-white/90 px-2 py-1 font-mono text-[8px] uppercase tracking-widest text-[var(--theme-hot)] shadow-[0_8px_20px_rgba(var(--theme-rgb),0.14)]">
                  {item.date}
                </span>
                {hoveredIndex === index && (
                  <span
                    className="pointer-events-none absolute z-20 max-w-[220px] rounded border border-[var(--theme-hot)]/30 bg-white/95 px-2 py-1 text-left font-mono text-[9px] leading-snug text-[var(--theme-hot)] shadow-[0_8px_22px_rgba(var(--theme-rgb),0.18)]"
                    style={{
                      left: Math.min(cursorPosition.x + 12, 300),
                      top: Math.max(cursorPosition.y - 10, 8),
                    }}
                  >
                    {item.caption}
                  </span>
                )}
                {revealedIndex === index && (
                  <span className="pointer-events-none absolute bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] -translate-x-1/2 rounded border border-[var(--theme-hot)]/30 bg-white/95 px-3 py-2 text-center font-mono text-[10px] leading-snug text-[var(--theme-hot)] shadow-[0_8px_24px_rgba(var(--theme-rgb),0.2)]">
                    {item.caption}
                  </span>
                )}
              </button>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
