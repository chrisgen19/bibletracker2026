"use client";

import { useState, useMemo } from "react";
import { HandHeart, Search } from "lucide-react";
import { PrayerCard } from "@/components/prayer-card";
import type { Prayer, PrayerCategory } from "@/lib/types";

type PrayerTab = "ACTIVE" | "ANSWERED" | "ALL";

interface MyPrayersSectionProps {
  prayers: Prayer[];
  username: string;
  onEdit: (prayer: Prayer) => void;
  onDelete: (id: string) => void;
  onMarkAnswered: (id: string, note?: string) => void;
  onMarkNoLongerPraying: (id: string) => void;
  onReactivate: (id: string) => void;
}

export function MyPrayersSection({
  prayers,
  username,
  onEdit,
  onDelete,
  onMarkAnswered,
  onMarkNoLongerPraying,
  onReactivate,
}: MyPrayersSectionProps) {
  const [activeTab, setActiveTab] = useState<PrayerTab>("ACTIVE");
  const [categoryFilter, setCategoryFilter] = useState<PrayerCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrayers = useMemo(() => {
    let result = prayers;

    if (activeTab !== "ALL") {
      result = result.filter((p) => p.status === activeTab);
    }

    if (categoryFilter !== "ALL") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    return result;
  }, [prayers, activeTab, categoryFilter, searchQuery]);

  const tabCounts = useMemo(
    () => ({
      ACTIVE: prayers.filter((p) => p.status === "ACTIVE").length,
      ANSWERED: prayers.filter((p) => p.status === "ANSWERED").length,
      ALL: prayers.length,
    }),
    [prayers],
  );

  const tabClass = (tab: PrayerTab) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      activeTab === tab
        ? "bg-stone-900 text-white"
        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
    }`;

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setActiveTab("ACTIVE")} className={tabClass("ACTIVE")}>
          Active ({tabCounts.ACTIVE})
        </button>
        <button type="button" onClick={() => setActiveTab("ANSWERED")} className={tabClass("ANSWERED")}>
          Answered ({tabCounts.ANSWERED})
        </button>
        <button type="button" onClick={() => setActiveTab("ALL")} className={tabClass("ALL")}>
          All ({tabCounts.ALL})
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as PrayerCategory | "ALL")}
          className="bg-white border border-stone-200 text-stone-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none appearance-none"
        >
          <option value="ALL">All Categories</option>
          <option value="PERSONAL">Personal</option>
          <option value="FAMILY">Family</option>
          <option value="FRIENDS">Friends</option>
          <option value="CHURCH">Church</option>
          <option value="MISSIONS">Missions</option>
          <option value="HEALTH">Health</option>
          <option value="WORK">Work</option>
          <option value="OTHER">Other</option>
        </select>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search prayers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200 text-stone-700 rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none placeholder:text-stone-300"
          />
        </div>
      </div>

      {/* Prayer cards */}
      <div className="space-y-4">
        {filteredPrayers.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 opacity-60">
            <div className="bg-stone-100 p-4 rounded-full mb-4">
              <HandHeart size={32} className="text-stone-400" />
            </div>
            <p className="text-stone-500 font-medium">
              {searchQuery || categoryFilter !== "ALL"
                ? "No prayers match your filters."
                : activeTab === "ACTIVE"
                  ? "No active prayers."
                  : activeTab === "ANSWERED"
                    ? "No answered prayers yet."
                    : "No prayers logged yet."}
            </p>
            <p className="text-stone-400 text-sm mt-2">
              {!searchQuery && categoryFilter === "ALL" && activeTab === "ACTIVE"
                ? "Start by logging your first prayer."
                : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          filteredPrayers.map((prayer) => (
            <PrayerCard
              key={prayer.id}
              prayer={prayer}
              username={username}
              onEdit={onEdit}
              onDelete={onDelete}
              onMarkAnswered={onMarkAnswered}
              onMarkNoLongerPraying={onMarkNoLongerPraying}
              onReactivate={onReactivate}
            />
          ))
        )}
      </div>
    </>
  );
}
