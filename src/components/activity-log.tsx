"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/entry-card";
import { FriendEntryCard } from "@/components/friend-entry-card";
import type { ReadingEntry, FriendsActivityEntry } from "@/lib/types";

interface ActivityLogProps {
  username: string;
  selectedDate: Date;
  entries: ReadingEntry[];
  friendsEntries: FriendsActivityEntry[];
  onAddEntry: () => void;
  onEditEntry: (entry: ReadingEntry) => void;
  onDeleteEntry: (id: string) => void;
  onUpdateNotes: (entryId: string, notes: string) => void;
}

export function ActivityLog({
  username,
  selectedDate,
  entries,
  friendsEntries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  onUpdateNotes,
}: ActivityLogProps) {
  const [activeTab, setActiveTab] = useState<"my" | "friends">("my");
  const [visibleCount, setVisibleCount] = useState(6);

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Check if selected date is today
  const today = new Date();
  const isToday =
    selectedDate.getDate() === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();

  // Should pulse when viewing today with no entries
  const shouldPulse = isToday && entries.length === 0 && activeTab === "my";

  return (
    <>
      {/* Custom subtle pulse animation */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>

      <div className="sticky top-24">
      <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-[2rem] p-6 sm:p-8 lg:min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl shadow-stone-200/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-stone-100/50 to-transparent rounded-bl-[100%] pointer-events-none -z-10" />

        {/* Tabs */}
        <div className="flex gap-2 mb-4 justify-between items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab("my"); setVisibleCount(6); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "my"
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              My Activity
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("friends"); setVisibleCount(6); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === "friends"
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Friends
            </button>
          </div>
          {activeTab === "my" && (
            <Button
              onClick={onAddEntry}
              variant="primary"
              icon={Plus}
              className={`rounded-2xl hidden sm:flex ${shouldPulse ? "animate-pulse-subtle" : ""}`}
            >
              Log Entry
            </Button>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">
            Activity Log
          </h3>
          {activeTab === "my" && (
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              {formattedDate}
            </h2>
          )}
          {activeTab === "friends" && (
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              Friends
            </h2>
          )}
        </div>

        <div className="lg:flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {activeTab === "my" ? (
            entries.length === 0 ? (
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
                  username={username}
                  onEdit={onEditEntry}
                  onDelete={onDeleteEntry}
                  onUpdateNotes={onUpdateNotes}
                />
              ))
            )
          ) : friendsEntries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
              <div className="bg-stone-100 p-4 rounded-full mb-4">
                <Users size={32} className="text-stone-400" />
              </div>
              <p className="text-stone-500 font-medium">
                No friend activity yet
              </p>
              <p className="text-stone-400 text-sm mt-2">
                Follow friends to see their reading activity here.
              </p>
            </div>
          ) : (
            <>
              {friendsEntries.slice(0, visibleCount).map((entry) => (
                <FriendEntryCard key={entry.id} entry={entry} />
              ))}
              {visibleCount < friendsEntries.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="w-full py-3 text-sm font-medium text-stone-500 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating button for mobile - only shows on My Activity tab */}
      {activeTab === "my" && (
        <Button
          onClick={onAddEntry}
          variant="primary"
          icon={Plus}
          className={`fixed bottom-6 right-6 rounded-2xl shadow-lg sm:hidden z-50 ${shouldPulse ? "animate-pulse-subtle" : ""}`}
        >
          Log Entry
        </Button>
      )}
    </div>
    </>
  );
}
