import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReadingEntry } from "@/lib/types";
import { formatReferenceShort } from "@/lib/constants";

interface CalendarProps {
  currentDate: Date;
  selectedDate?: Date;
  entries: ReadingEntry[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday?: () => void;
  onDayClick?: (day: number) => void;
  displayMode?: "DOTS_ONLY" | "REFERENCES_WITH_DOTS" | "REFERENCES_ONLY";
  showMissedDays?: boolean;
}

function getEntriesForDate(entries: ReadingEntry[], date: Date) {
  return entries.filter((e) => {
    const entryDate = new Date(e.date);
    return (
      entryDate.getDate() === date.getDate() &&
      entryDate.getMonth() === date.getMonth() &&
      entryDate.getFullYear() === date.getFullYear()
    );
  });
}

function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar({
  currentDate,
  selectedDate,
  entries,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDayClick,
  displayMode = "REFERENCES_WITH_DOTS",
  showMissedDays = true,
}: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const blanks = Array(firstDay).fill(null);
  const dayNumbers = Array.from({ length: days }, (_, i) => i + 1);

  const isSelected = (day: number) =>
    selectedDate
      ? selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year
      : false;

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/50 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow text-stone-600"
          >
            <ChevronLeft size={20} />
          </button>
          {onToday && (
            <button
              onClick={onToday}
              className="px-3 text-xs font-bold text-stone-500 uppercase hover:text-stone-900"
            >
              Today
            </button>
          )}
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow text-stone-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-stone-400 uppercase tracking-wider py-2"
          >
            {d}
          </div>
        ))}

        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="aspect-square" />
        ))}

        {dayNumbers.map((day) => {
          const date = new Date(year, month, day);
          const dayEntries = getEntriesForDate(entries, date);
          const hasEntry = dayEntries.length > 0;
          const selected = isSelected(day);
          const today = isToday(date);
          const firstEntry = dayEntries[0];
          const additionalCount = dayEntries.length > 1 ? dayEntries.length - 1 : 0;

          const DayTag = onDayClick ? "button" : "div";
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
          const missed = showMissedDays && isPast && !hasEntry && !today;

          return (
            <DayTag
              key={day}
              {...(onDayClick ? { onClick: () => onDayClick(day) } : {})}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-300 px-1
                ${selected ? "bg-stone-900 text-white shadow-lg scale-105 z-10" : onDayClick ? "hover:bg-stone-100 text-stone-700" : "text-stone-700"}
                ${!selected && today ? "bg-stone-100 font-bold ring-1 ring-stone-300" : ""}
                ${!selected && hasEntry ? "bg-emerald-50/50" : ""}
                ${!selected && missed ? "bg-red-50/50" : ""}
              `}
            >
              <span className={`text-sm ${selected ? "font-medium" : ""}`}>
                {day}
              </span>
              {firstEntry && displayMode !== "DOTS_ONLY" && (
                <>
                  {/* Mobile: Book + Chapters only */}
                  <span className={`sm:hidden text-[0.6rem] leading-tight mt-0.5 ${selected ? "text-stone-300" : "text-stone-500"}`}>
                    {formatReferenceShort(firstEntry.book, firstEntry.chapters, "", 8)}
                    {additionalCount > 0 && ` +${additionalCount}`}
                  </span>
                  {/* Desktop: Book + Chapters + Verses */}
                  <span className={`hidden sm:inline text-[0.6rem] leading-tight mt-0.5 ${selected ? "text-stone-300" : "text-stone-500"}`}>
                    {formatReferenceShort(firstEntry.book, firstEntry.chapters, firstEntry.verses, 10)}
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
            </DayTag>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-stone-500">
        {showMissedDays && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-50 ring-1 ring-red-200" />
            <span>Missed</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Read</span>
        </div>
        {onDayClick && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-stone-900" />
            <span>Selected</span>
          </div>
        )}
      </div>
    </div>
  );
}
