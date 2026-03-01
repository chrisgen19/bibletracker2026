"use client";

import { useState, useTransition, useMemo } from "react";
import { toast } from "sonner";
import { HandHeart, Plus, Search } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { PrayerCard } from "@/components/prayer-card";
import { PrayerForm } from "@/components/prayer-form";
import {
  createPrayer,
  updatePrayer,
  deletePrayer,
  markPrayerAnswered,
  markPrayerNoLongerPraying,
  reactivatePrayer,
} from "@/app/prayers/actions";
import type {
  Prayer,
  PrayerFormData,
  PrayerCategory,
  PrayerStatus,
  Stats,
} from "@/lib/types";

type PrayerTab = "ACTIVE" | "ANSWERED" | "ALL";

interface PrayerListProps {
  initialPrayers: Prayer[];
  stats: Stats;
  unreadNotificationCount: number;
}

const DEFAULT_FORM_DATA: PrayerFormData = {
  title: "",
  content: "",
  category: "PERSONAL",
  scriptureReference: "",
  isPublic: false,
};

export function PrayerList({
  initialPrayers,
  stats,
  unreadNotificationCount,
}: PrayerListProps) {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [activeTab, setActiveTab] = useState<PrayerTab>("ACTIVE");
  const [categoryFilter, setCategoryFilter] = useState<PrayerCategory | "ALL">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrayerId, setEditingPrayerId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PrayerFormData>(DEFAULT_FORM_DATA);
  const [, startTransition] = useTransition();

  const filteredPrayers = useMemo(() => {
    let result = prayers;

    // Tab filter
    if (activeTab !== "ALL") {
      result = result.filter((p) => p.status === activeTab);
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Search filter (client-side, by title)
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPrayerId(null);
    setFormData(DEFAULT_FORM_DATA);
  };

  const handleEditPrayer = (prayer: Prayer) => {
    setEditingPrayerId(prayer.id);
    setFormData({
      title: prayer.title,
      content: prayer.content,
      category: prayer.category,
      scriptureReference: prayer.scriptureReference ?? "",
      isPublic: prayer.isPublic,
    });
    setIsModalOpen(true);
  };

  const handleSavePrayer = () => {
    const data = { ...formData };

    if (editingPrayerId) {
      // Optimistic update
      const original = prayers.find((p) => p.id === editingPrayerId);
      setPrayers((prev) =>
        prev.map((p) =>
          p.id === editingPrayerId
            ? { ...p, title: data.title, content: data.content, category: data.category, scriptureReference: data.scriptureReference || null, isPublic: data.isPublic }
            : p,
        ),
      );
      handleCloseModal();
      toast.success("Prayer updated");

      startTransition(async () => {
        try {
          const updated = await updatePrayer(editingPrayerId, data);
          setPrayers((prev) =>
            prev.map((p) => (p.id === editingPrayerId ? updated : p)),
          );
        } catch {
          if (original) {
            setPrayers((prev) =>
              prev.map((p) => (p.id === original.id ? original : p)),
            );
          }
          toast.error("Failed to update prayer");
        }
      });
    } else {
      const dateStr = new Date().toISOString();
      const tempPrayer: Prayer = {
        id: `temp-${Date.now()}`,
        date: dateStr,
        title: data.title,
        content: data.content,
        category: data.category,
        status: "ACTIVE",
        answeredAt: null,
        answeredNote: null,
        scriptureReference: data.scriptureReference || null,
        isPublic: data.isPublic,
        createdAt: dateStr,
        updatedAt: dateStr,
      };
      setPrayers((prev) => [tempPrayer, ...prev]);
      handleCloseModal();
      toast.success("Prayer logged");

      startTransition(async () => {
        try {
          const saved = await createPrayer(data, dateStr);
          setPrayers((prev) =>
            prev.map((p) => (p.id === tempPrayer.id ? saved : p)),
          );
        } catch {
          setPrayers((prev) => prev.filter((p) => p.id !== tempPrayer.id));
          toast.error("Failed to save prayer");
        }
      });
    }
  };

  const handleDeletePrayer = (id: string) => {
    const removed = prayers.find((p) => p.id === id);
    setPrayers((prev) => prev.filter((p) => p.id !== id));
    toast.success("Prayer deleted");

    startTransition(async () => {
      try {
        await deletePrayer(id);
      } catch {
        if (removed) setPrayers((prev) => [...prev, removed]);
        toast.error("Failed to delete prayer");
      }
    });
  };

  const handleMarkAnswered = (id: string, note?: string) => {
    const original = prayers.find((p) => p.id === id);
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "ANSWERED" as PrayerStatus, answeredAt: new Date().toISOString(), answeredNote: note ?? null }
          : p,
      ),
    );
    toast.success("Prayer marked as answered");

    startTransition(async () => {
      try {
        const updated = await markPrayerAnswered(id, note);
        setPrayers((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch {
        if (original) {
          setPrayers((prev) => prev.map((p) => (p.id === id ? original : p)));
        }
        toast.error("Failed to update prayer");
      }
    });
  };

  const handleMarkNoLongerPraying = (id: string) => {
    const original = prayers.find((p) => p.id === id);
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "NO_LONGER_PRAYING" as PrayerStatus } : p,
      ),
    );
    toast.success("Prayer closed");

    startTransition(async () => {
      try {
        const updated = await markPrayerNoLongerPraying(id);
        setPrayers((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch {
        if (original) {
          setPrayers((prev) => prev.map((p) => (p.id === id ? original : p)));
        }
        toast.error("Failed to update prayer");
      }
    });
  };

  const handleReactivate = (id: string) => {
    const original = prayers.find((p) => p.id === id);
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "ACTIVE" as PrayerStatus, answeredAt: null, answeredNote: null }
          : p,
      ),
    );
    toast.success("Prayer reactivated");

    startTransition(async () => {
      try {
        const updated = await reactivatePrayer(id);
        setPrayers((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch {
        if (original) {
          setPrayers((prev) => prev.map((p) => (p.id === id ? original : p)));
        }
        toast.error("Failed to reactivate prayer");
      }
    });
  };

  const tabClass = (tab: PrayerTab) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      activeTab === tab
        ? "bg-stone-900 text-white"
        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
    }`;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar stats={stats} unreadCount={unreadNotificationCount} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              Prayers
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {tabCounts.ACTIVE} active · {tabCounts.ANSWERED} answered
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            icon={Plus}
            className="rounded-2xl"
          >
            Log Prayer
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("ACTIVE")}
            className={tabClass("ACTIVE")}
          >
            Active ({tabCounts.ACTIVE})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ANSWERED")}
            className={tabClass("ANSWERED")}
          >
            Answered ({tabCounts.ANSWERED})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={tabClass("ALL")}
          >
            All ({tabCounts.ALL})
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as PrayerCategory | "ALL")
            }
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
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
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
                onEdit={handleEditPrayer}
                onDelete={handleDeletePrayer}
                onMarkAnswered={handleMarkAnswered}
                onMarkNoLongerPraying={handleMarkNoLongerPraying}
                onReactivate={handleReactivate}
              />
            ))
          )}
        </div>
      </main>

      <PrayerForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSavePrayer}
        isEditing={!!editingPrayerId}
      />
    </div>
  );
}
