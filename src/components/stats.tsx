import { Bookmark } from "lucide-react";
import type { Stats as StatsType } from "@/lib/types";

interface StatsProps {
  stats: StatsType;
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-stone-900 text-stone-50 p-6 rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="opacity-70 text-sm font-medium mb-1">
            Total Entries
          </div>
          <div className="text-4xl font-serif font-bold">
            {stats.totalEntries}
          </div>
        </div>
        <Bookmark
          className="absolute -bottom-4 -right-4 text-stone-800 opacity-50"
          size={80}
        />
      </div>
      <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-stone-500 text-sm font-medium mb-1">
            Books Started
          </div>
          <div className="text-4xl font-serif font-bold text-stone-900">
            {stats.booksRead}
            <span className="text-lg text-stone-400 font-sans font-normal">
              /66
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full -mr-4 -mt-4" />
      </div>
    </div>
  );
}
