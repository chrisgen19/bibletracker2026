"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import type { ReadingEntry } from "@/lib/types";
import { DayCell } from "@/components/calendar-day-cell";
import { MonthPicker } from "@/components/calendar-month-picker";

/** Parse a date/datetime string as local time to avoid UTC timezone shift */
const parseLocalDate = (dateStr: string): Date => {
  // UTC datetime strings (e.g. from toISOString()) need native parsing
  // so the browser converts to the correct local date
  if (
    dateStr.includes("T") &&
    (dateStr.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(dateStr))
  ) {
    const d = new Date(dateStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  // Date-only or local datetime strings: extract parts directly
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Build a lookup map keyed by "YYYY-MM-DD" for O(1) access per cell */
const buildEntryMap = (
  entries: ReadingEntry[],
): Map<string, ReadingEntry[]> => {
  const map = new Map<string, ReadingEntry[]>();
  for (const entry of entries) {
    const date = parseLocalDate(entry.date);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const existing = map.get(key);
    if (existing) {
      existing.push(entry);
    } else {
      map.set(key, [entry]);
    }
  }
  return map;
};

/** Get the ISO 8601 week number for a given date */
const getISOWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

interface CalendarProps {
  currentDate: Date;
  selectedDate?: Date;
  entries: ReadingEntry[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday?: () => void;
  onDayClick?: (day: number) => void;
  onMonthSelect?: (year: number, month: number) => void;
  displayMode?: "DOTS_ONLY" | "REFERENCES_WITH_DOTS" | "REFERENCES_ONLY" | "HEATMAP";
  showMissedDays?: boolean;
  weekStartDay?: "SUNDAY" | "MONDAY";
  showWeekNumbers?: boolean;
  isLoading?: boolean;
}

const isTodayDate = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Minimum horizontal swipe distance in pixels
const SWIPE_THRESHOLD = 50;

export function Calendar({
  currentDate,
  selectedDate,
  entries,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDayClick,
  onMonthSelect,
  displayMode = "REFERENCES_WITH_DOTS",
  showMissedDays = true,
  weekStartDay = "SUNDAY",
  showWeekNumbers = false,
  isLoading = false,
}: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const rawFirstDay = new Date(year, month, 1).getDay();
  // Shift offset so Monday=0 when week starts on Monday
  const firstDay = weekStartDay === "MONDAY"
    ? (rawFirstDay + 6) % 7
    : rawFirstDay;

  const dayLabels = weekStartDay === "MONDAY"
    ? [...DAY_LABELS.slice(1), DAY_LABELS[0]]
    : DAY_LABELS;

  // Pre-compute entry lookup map — O(1) per cell instead of O(n) filtering
  const entryMap = useMemo(() => buildEntryMap(entries), [entries]);

  // Compute current reading streak as a Set of "YYYY-M-D" keys
  const streakDays = useMemo(() => {
    const set = new Set<string>();
    if (entries.length === 0) return set;

    // Collect unique date timestamps from all entries
    const uniqueTimestamps = new Set<number>();
    for (const entry of entries) {
      const d = parseLocalDate(entry.date);
      uniqueTimestamps.add(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());
    }

    // Sort descending (most recent first)
    const sorted = Array.from(uniqueTimestamps).sort((a, b) => b - a);

    const today = new Date();
    const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const yesterdayMs = todayMs - 86_400_000;

    // Streak must start from today or yesterday
    if (sorted[0] !== todayMs && sorted[0] !== yesterdayMs) return set;

    // Walk backwards through consecutive days
    let expected = sorted[0];
    for (const ts of sorted) {
      if (ts !== expected) break;
      const d = new Date(ts);
      set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      expected = ts - 86_400_000;
    }

    return set;
  }, [entries]);

  // Month summary: count of days with entries vs. total relevant days
  const monthSummary = useMemo(() => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const displayYear = currentDate.getFullYear();
    const displayMonth = currentDate.getMonth();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

    // Future month — hide summary
    if (displayYear > todayYear || (displayYear === todayYear && displayMonth > todayMonth)) {
      return null;
    }

    // Count unique days in displayed month that have entries
    const daysWithReading = new Set<number>();
    for (const entry of entries) {
      const d = parseLocalDate(entry.date);
      if (d.getFullYear() === displayYear && d.getMonth() === displayMonth) {
        daysWithReading.add(d.getDate());
      }
    }

    // Denominator: current month → today's date, past months → full month days
    const denominator =
      displayYear === todayYear && displayMonth === todayMonth
        ? today.getDate()
        : daysInMonth;

    return { daysWithEntries: daysWithReading.size, denominator };
  }, [entries, currentDate]);

  const blanks = Array(firstDay).fill(null);
  const dayNumbers = Array.from({ length: days }, (_, i) => i + 1);

  const isSelected = (day: number) =>
    selectedDate
      ? selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year
      : false;

  // Keyboard navigation state
  const [focusedDay, setFocusedDay] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Month picker state
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Swipe gesture state
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleMonthPickerSelect = useCallback(
    (y: number, m: number) => {
      onMonthSelect?.(y, m);
    },
    [onMonthSelect],
  );

  // Focus a specific day cell in the DOM
  const focusDayCell = (day: number) => {
    const cell = gridRef.current?.querySelector(
      `[data-day="${day}"]`,
    ) as HTMLElement | null;
    cell?.focus();
  };

  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    if (!onDayClick) return;

    const current = focusedDay ?? 1;
    let next = current;

    switch (e.key) {
      case "ArrowRight":
        next = Math.min(current + 1, days);
        break;
      case "ArrowLeft":
        next = Math.max(current - 1, 1);
        break;
      case "ArrowDown":
        next = Math.min(current + 7, days);
        break;
      case "ArrowUp":
        next = Math.max(current - 7, 1);
        break;
      case "Home":
        next = 1;
        break;
      case "End":
        next = days;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onDayClick(current);
        return;
      default:
        return;
    }

    e.preventDefault();
    setFocusedDay(next);
    // Wait for React to re-render with updated tabIndex, then focus
    requestAnimationFrame(() => focusDayCell(next));
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Only treat as horizontal swipe if horizontal movement exceeds vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      setIsSwiping(true);
      // Dampened offset for visual feedback (50% of actual movement)
      setSwipeOffset(deltaX * 0.5);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartRef.current && isSwiping) {
      if (swipeOffset > SWIPE_THRESHOLD) {
        onPrevMonth();
      } else if (swipeOffset < -SWIPE_THRESHOLD) {
        onNextMonth();
      }
    }
    touchStartRef.current = null;
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  const handleExport = async () => {
    if (!exportRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      const monthName = currentDate.toLocaleDateString("en-US", { month: "long" }).toLowerCase();
      link.download = `sola-scriptura-${monthName}-${year}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  // Chunk flat cells into rows of 7 for week number insertion
  const allCells = [...blanks, ...dayNumbers];
  const rows: (number | null)[][] = [];
  for (let i = 0; i < allCells.length; i += 7) {
    rows.push(allCells.slice(i, i + 7));
  }
  // Pad last row to 7 cells
  const lastRow = rows[rows.length - 1];
  while (lastRow.length < 7) {
    lastRow.push(null);
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/50 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        {/* Clickable month/year header — opens month picker */}
        <div className="relative">
          <button
            onClick={() => setShowMonthPicker((v) => !v)}
            className="text-2xl font-serif font-bold text-stone-900 hover:text-stone-600 transition-colors cursor-pointer flex items-center gap-1.5"
            aria-expanded={showMonthPicker}
            aria-haspopup="dialog"
          >
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 text-stone-400 ${showMonthPicker ? "rotate-90" : ""}`}
            />
          </button>
          {showMonthPicker && (
            <MonthPicker
              currentYear={year}
              currentMonth={month}
              onSelect={handleMonthPickerSelect}
              onClose={() => setShowMonthPicker(false)}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          {onDayClick && (
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              <span className="hidden sm:inline">Share My Month</span>
            </button>
          )}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow text-stone-600"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          {onToday && (
            <button
              onClick={onToday}
              className="px-3 py-2 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow text-xs font-bold text-stone-500 uppercase hover:text-stone-900"
            >
              Today
            </button>
          )}
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow text-stone-600"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
          </div>
        </div>
      </div>

      {/* Exportable area: grid + legend + summary */}
      <div ref={exportRef}>
        {/* Calendar grid with swipe support */}
        <div
          ref={gridRef}
          role="grid"
          aria-label={currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
          onKeyDown={handleGridKeyDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`grid gap-1.5 sm:gap-2 mb-2 ${isSwiping ? "" : "transition-transform duration-200"} ${showWeekNumbers ? "grid-cols-[auto_repeat(7,1fr)]" : "grid-cols-7"}`}
          style={{
            transform: swipeOffset ? `translateX(${swipeOffset}px)` : undefined,
          }}
        >
          {/* Header row */}
          {showWeekNumbers && (
            <div
              role="columnheader"
              className="text-center text-[0.6rem] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider py-2"
            >
              Wk
            </div>
          )}
          {dayLabels.map((d) => (
            <div
              key={d}
              role="columnheader"
              className="text-center text-xs font-semibold text-stone-400 uppercase tracking-wider py-2"
            >
              {d}
            </div>
          ))}

          {/* Calendar rows */}
          {rows.map((row, rowIndex) => {
            // Find first real day in this row for week number
            const firstDayInRow = row.find((cell): cell is number => cell !== null);
            const weekNumber = firstDayInRow
              ? getISOWeekNumber(new Date(year, month, firstDayInRow))
              : null;

            return (
              <div key={rowIndex} className={`grid gap-1.5 sm:gap-2 col-span-full ${showWeekNumbers ? "grid-cols-[auto_repeat(7,1fr)]" : "grid-cols-7"}`}>
                {showWeekNumbers && (
                  <div className="flex items-center justify-center text-[0.6rem] sm:text-xs font-medium text-stone-300 w-6 sm:w-8">
                    {weekNumber}
                  </div>
                )}
                {row.map((cell, cellIndex) => {
                  if (cell === null) {
                    return (
                      <div key={`empty-${rowIndex}-${cellIndex}`} role="gridcell" className="aspect-square" />
                    );
                  }

                  if (isLoading) {
                    return (
                      <div
                        key={cell}
                        role="gridcell"
                        className="aspect-square rounded-2xl bg-stone-100 animate-pulse"
                      />
                    );
                  }

                  const date = new Date(year, month, cell);
                  const dayEntries = entryMap.get(`${year}-${month}-${cell}`) ?? [];
                  const selected = isSelected(cell);
                  const today = isTodayDate(date);
                  const hasEntry = dayEntries.length > 0;
                  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                  const missed = showMissedDays && isPast && !hasEntry && !today;

                  return (
                    <DayCell
                      key={cell}
                      day={cell}
                      year={year}
                      month={month}
                      dayEntries={dayEntries}
                      selected={selected}
                      today={today}
                      missed={missed}
                      focused={focusedDay === cell}
                      interactive={!!onDayClick}
                      displayMode={displayMode}
                      isStreakDay={streakDays.has(`${year}-${month}-${cell}`)}
                      onDayClick={onDayClick}
                      onFocus={setFocusedDay}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend + Month summary */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-[0.65rem] sm:text-xs text-stone-500">
            {displayMode === "HEATMAP" ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-sm bg-stone-100 border border-stone-200" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-100/70" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-300/60" />
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/50" />
                <span>More</span>
              </div>
            ) : (
              <>
                {showMissedDays && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-50 ring-1 ring-red-200" />
                    <span>Missed</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Read</span>
                </div>
                {streakDays.size > 1 && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-50 ring-2 ring-emerald-400/60" />
                    <span>Streak</span>
                  </div>
                )}
                {onDayClick && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 rounded-full bg-stone-900" />
                    <span>Selected</span>
                  </div>
                )}
              </>
            )}
          </div>

          {monthSummary && (
            <div className="text-center text-xs text-stone-400">
              <span className="font-semibold text-stone-600">
                {monthSummary.daysWithEntries}/{monthSummary.denominator}
              </span>{" "}
              days read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
