"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/entry-card";
import { FriendEntryCard } from "@/components/friend-entry-card";
import type { ReadingEntry, FriendsActivityEntry } from "@/lib/types";

interface ActivityLogProps {
  selectedDate: Date;
  entries: ReadingEntry[];
  friendsEntries: FriendsActivityEntry[];
  onAddEntry: () => void;
  onEditEntry: (entry: ReadingEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export function ActivityLog({
  selectedDate,
  entries,
  friendsEntries,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}: ActivityLogProps) {
  const [activeTab, setActiveTab] = useState<"my" | "friends">("my");

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="sticky top-24">
      <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-[2rem] p-6 sm:p-8 min-h-[600px] flex flex-col relative overflow-hidden shadow-2xl shadow-stone-200/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-stone-100/50 to-transparent rounded-bl-[100%] pointer-events-none -z-10" />

        {/* Tabs */}
        <div className="flex gap-2 mb-4 justify-between items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("my")}
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
              onClick={() => setActiveTab("friends")}
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
              className="rounded-2xl"
            >
              Log
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

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
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
                  onEdit={onEditEntry}
                  onDelete={onDeleteEntry}
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
            friendsEntries.map((entry) => (
              <FriendEntryCard key={entry.id} entry={entry} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
