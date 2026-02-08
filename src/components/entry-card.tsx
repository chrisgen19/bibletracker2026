import { X } from "lucide-react";
import type { ReadingEntry } from "@/lib/types";

interface EntryCardProps {
  entry: ReadingEntry;
  onDelete: (id: number) => void;
}

export function EntryCard({ entry, onDelete }: EntryCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-baseline gap-2">
          <span className="font-serif font-bold text-lg text-stone-900">
            {entry.book}
          </span>
          <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md text-sm">
            Ch {entry.chapters} {entry.verses && `: ${entry.verses}`}
          </span>
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>

      {entry.notes && (
        <div className="relative pl-4 mt-3">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-200 rounded-full" />
          <p className="text-stone-600 text-sm leading-relaxed italic">
            &ldquo;{entry.notes}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
