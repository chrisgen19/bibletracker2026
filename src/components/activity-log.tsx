import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/entry-card";
import type { ReadingEntry } from "@/lib/types";

interface ActivityLogProps {
  selectedDate: Date;
  entries: ReadingEntry[];
  onAddEntry: () => void;
  onDeleteEntry: (id: string) => void;
}

export function ActivityLog({
  selectedDate,
  entries,
  onAddEntry,
  onDeleteEntry,
}: ActivityLogProps) {
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="sticky top-24">
      <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-[2rem] p-6 sm:p-8 min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl shadow-stone-200/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-stone-100/50 to-transparent rounded-bl-[100%] pointer-events-none -z-10" />

        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">
              Activity Log
            </h3>
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              {formattedDate}
            </h2>
          </div>
          <Button
            onClick={onAddEntry}
            variant="primary"
            icon={Plus}
            className="rounded-2xl"
          >
            Log
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {entries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
              <div className="bg-stone-100 p-4 rounded-full mb-4">
                <CalendarIcon size={32} className="text-stone-400" />
              </div>
              <p className="text-stone-500 font-medium">
                No reading logged for this day.
              </p>
              <p className="text-stone-400 text-sm mt-2">
                Take a moment to read and reflect.
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onDelete={onDeleteEntry}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
