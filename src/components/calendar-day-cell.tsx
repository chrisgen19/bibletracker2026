"use client";

import { HandHeart } from "lucide-react";
import type { ReadingEntry } from "@/lib/types";
import { formatReferenceShort } from "@/lib/constants";

interface DayCellProps {
  day: number;
  year: number;
  month: number;
  dayEntries: ReadingEntry[];
  selected: boolean;
  today: boolean;
  missed: boolean;
  focused: boolean;
  interactive: boolean;
  displayMode: "DOTS_ONLY" | "REFERENCES_WITH_DOTS" | "REFERENCES_ONLY" | "HEATMAP";
  isStreakDay: boolean;
  hasPrayer?: boolean;
  onDayClick?: (day: number) => void;
  onFocus?: (day: number) => void;
}

/** Return a Tailwind bg class based on entry count for heatmap mode */
const getHeatmapBg = (count: number): string => {
  if (count === 0) return "";
  if (count === 1) return "bg-emerald-100/70";
  if (count === 2) return "bg-emerald-300/60";
  return "bg-emerald-500/50";
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function DayCell({
  day,
  dayEntries,
  selected,
  today,
  missed,
  focused,
  interactive,
  displayMode,
  isStreakDay,
  hasPrayer = false,
  onDayClick,
  onFocus,
  year,
  month,
}: DayCellProps) {
  const hasEntry = dayEntries.length > 0;
  const firstEntry = dayEntries[0];
  const additionalCount = dayEntries.length > 1 ? dayEntries.length - 1 : 0;
  const DayTag = interactive ? "button" : "div";

  // Build accessible label: "February 28, 2026 — 2 entries: Genesis 1, Exodus 2"
  const entryDescriptions = dayEntries
    .map((e) => `${e.book} ${e.chapters}`)
    .join(", ");
  const ariaLabel = `${MONTH_NAMES[month]} ${day}, ${year}${
    today ? " (today)" : ""
  }${selected ? " (selected)" : ""}${
    hasEntry
      ? ` — ${dayEntries.length} ${dayEntries.length === 1 ? "entry" : "entries"}: ${entryDescriptions}`
      : missed
        ? " — no reading"
        : ""
  }${hasPrayer ? " — has prayer" : ""}`;

  return (
    <DayTag
      {...(interactive ? { onClick: () => onDayClick?.(day) } : {})}
      onFocus={() => onFocus?.(day)}
      tabIndex={interactive ? (focused ? 0 : -1) : undefined}
      role="gridcell"
      aria-label={ariaLabel}
      aria-current={today ? "date" : undefined}
      aria-selected={interactive ? selected : undefined}
      data-day={day}
      className={`
        group relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-300 px-1
        ${selected ? "bg-stone-900 text-white shadow-lg scale-105 z-10 ring-2 ring-stone-900/20" : interactive ? "hover:bg-stone-100 text-stone-700" : "text-stone-700"}
        ${!selected && today ? "bg-stone-100 font-bold ring-1 ring-stone-300" : ""}
        ${!selected && hasEntry ? (displayMode === "HEATMAP" ? getHeatmapBg(dayEntries.length) : "bg-emerald-50/50") : ""}
        ${!selected && missed && displayMode !== "HEATMAP" ? "bg-red-50/50" : ""}
        ${focused && !selected ? "ring-2 ring-stone-400" : ""}
        outline-none
      `}
    >
      <span className={`text-sm ${selected ? "font-medium" : ""}`}>
        {day}
      </span>

      {/* Missed day indicator — small red dash below the number */}
      {missed && !selected && displayMode !== "HEATMAP" && (
        <div className="w-3 h-0.5 rounded-full bg-red-300 mt-0.5" />
      )}

      {/* Hide reference text and dots in heatmap mode — color IS the indicator */}
      {displayMode !== "HEATMAP" && (
        <>
          {firstEntry && displayMode !== "DOTS_ONLY" && (
            <>
              {/* Mobile: Book + Chapter only, no +count — tap for full details */}
              <span
                className={`sm:hidden text-[0.6rem] leading-tight mt-0.5 ${selected ? "text-stone-300" : "text-stone-500"}`}
              >
                {formatReferenceShort(firstEntry.book, firstEntry.chapters, "", 7)}
              </span>
              {/* Desktop: Book + Chapters + Verses */}
              <span
                className={`hidden sm:inline text-xs leading-tight mt-0.5 ${selected ? "text-stone-300" : "text-stone-500"}`}
              >
                {formatReferenceShort(
                  firstEntry.book,
                  firstEntry.chapters,
                  firstEntry.verses,
                  10,
                )}
                {additionalCount > 0 && ` +${additionalCount}`}
              </span>
            </>
          )}

          {displayMode !== "REFERENCES_ONLY" && (
            <div className="flex gap-0.5 mt-1 h-1.5">
              {dayEntries.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full ${selected ? "bg-stone-500" : "bg-emerald-500"}`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Prayer indicator — small icon in top-right corner */}
      {hasPrayer && (
        <div className="absolute top-0.5 right-0.5 pointer-events-none">
          <HandHeart size={10} className={selected ? "text-amber-300" : "text-amber-500"} />
        </div>
      )}

      {/* Streak indicator — subtle gradient rising from bottom of cell */}
      {!selected && isStreakDay && hasEntry && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-teal-200/40 via-teal-100/15 to-transparent pointer-events-none" />
      )}

      {/* Desktop tooltip — shows full reference on hover for any day with entries */}
      {dayEntries.length >= 1 && (
        <div className="hidden sm:group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
          <div className="bg-stone-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            {dayEntries.map((entry, i) => (
              <div key={i} className="leading-relaxed">
                {entry.book} {entry.chapters}
                {entry.verses ? `:${entry.verses}` : ""}
              </div>
            ))}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
          </div>
        </div>
      )}
    </DayTag>
  );
}
