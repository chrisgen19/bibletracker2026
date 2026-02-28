"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface MonthPickerProps {
  currentYear: number;
  currentMonth: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}

export function MonthPicker({
  currentYear,
  currentMonth,
  onSelect,
  onClose,
}: MonthPickerProps) {
  const [pickerYear, setPickerYear] = useState(currentYear);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 z-40 bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-4 w-64 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Year navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setPickerYear((y) => y - 1)}
          className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-600"
          aria-label="Previous year"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-stone-900">{pickerYear}</span>
        <button
          onClick={() => setPickerYear((y) => y + 1)}
          className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-600"
          aria-label="Next year"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 3x4 month grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {MONTH_LABELS.map((label, i) => {
          const isCurrentMonth =
            pickerYear === currentYear && i === currentMonth;
          const isTodayMonth =
            pickerYear === todayYear && i === todayMonth;

          return (
            <button
              key={label}
              onClick={() => {
                onSelect(pickerYear, i);
                onClose();
              }}
              className={`
                px-2 py-2 rounded-xl text-sm font-medium transition-all
                ${isCurrentMonth ? "bg-stone-900 text-white" : "hover:bg-stone-100 text-stone-700"}
                ${!isCurrentMonth && isTodayMonth ? "ring-1 ring-stone-300" : ""}
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
