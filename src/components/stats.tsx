import { Bookmark, Flame } from "lucide-react";
import type { Stats as StatsType } from "@/lib/types";

interface StatsProps {
  stats: StatsType;
}

export function Stats({ stats }: StatsProps) {
  const booksPercent = Math.round((stats.booksRead / 66) * 100);

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {/* Total Entries */}
      <div className="bg-stone-900 text-stone-50 p-3 sm:p-6 rounded-2xl sm:rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="opacity-70 text-xs sm:text-sm font-medium mb-1">
            Total Entries
          </div>
          <div className="text-2xl sm:text-4xl font-serif font-bold">
            {stats.totalEntries}
          </div>
        </div>
        <Bookmark
          className="absolute -bottom-4 -right-4 text-stone-800 opacity-50 hidden sm:block"
          size={80}
        />
      </div>

      {/* Books Read */}
      <div className="bg-white p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-stone-500 text-xs sm:text-sm font-medium mb-1">
            Books Read
          </div>
          <div className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
            {stats.booksRead}
            <span className="text-sm sm:text-lg text-stone-400 font-sans font-normal">
              /66
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 sm:mt-3 h-1 sm:h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${booksPercent}%` }}
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full -mr-4 -mt-4 hidden sm:block" />
      </div>

      {/* Reading Streak */}
      <div className="bg-amber-50/60 p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-amber-100/80 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-amber-700 text-xs sm:text-sm font-medium mb-1">
            Reading Streak
          </div>
          <div className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
            {stats.currentStreak}
            <span className="text-sm sm:text-lg text-stone-400 font-sans font-normal ml-0.5 sm:ml-1">
              days
            </span>
          </div>
          {stats.longestStreak > 0 && (
            <p className="text-[10px] sm:text-xs text-stone-400 mt-1">
              Best: {stats.longestStreak} days
            </p>
          )}
        </div>
        <Flame
          className="absolute -bottom-3 -right-3 text-amber-200 opacity-60 hidden sm:block"
          size={72}
        />
      </div>
    </div>
  );
}
