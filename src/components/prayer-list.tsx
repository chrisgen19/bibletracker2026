"use client";

import { useState } from "react";
import { HandHeart, Plus, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { MyPrayersSection } from "@/components/my-prayers-section";
import { PrayerForm } from "@/components/prayer-form";
import { CommunityPrayers } from "@/components/community-prayers";
import { usePrayers } from "@/hooks/use-prayers";
import type { Prayer, PublicPrayer, Stats } from "@/lib/types";

type SectionTab = "mine" | "community";

interface PrayerListProps {
  initialPrayers: Prayer[];
  communityPrayers: PublicPrayer[];
  stats: Stats;
  unreadNotificationCount: number;
  username: string;
}

export function PrayerList({
  initialPrayers,
  communityPrayers,
  stats,
  unreadNotificationCount,
  username,
}: PrayerListProps) {
  const {
    prayers,
    isModalOpen,
    editingPrayerId,
    formData,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleEditPrayer,
    handleSavePrayer,
    handleDeletePrayer,
    handleMarkAnswered,
    handleMarkNoLongerPraying,
    handleReactivate,
  } = usePrayers({ initialPrayers });

  const [sectionTab, setSectionTab] = useState<SectionTab>("mine");

  const activePrayerCount = prayers.filter((p) => p.status === "ACTIVE").length;
  const answeredPrayerCount = prayers.filter((p) => p.status === "ANSWERED").length;

  const sectionTabClass = (tab: SectionTab) =>
    `flex-1 py-2.5 text-sm font-semibold transition-all border-b-2 ${
      sectionTab === tab
        ? "border-stone-900 text-stone-900"
        : "border-transparent text-stone-400 hover:text-stone-600"
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
              {activePrayerCount} active · {answeredPrayerCount} answered
            </p>
          </div>
          <Button onClick={handleOpenModal} icon={Plus} className="rounded-2xl">
            Log Prayer
          </Button>
        </div>

        {/* Section toggle: My Prayers | Community */}
        <div className="flex border-b border-stone-200 mb-5">
          <button type="button" onClick={() => setSectionTab("mine")} className={sectionTabClass("mine")}>
            <span className="inline-flex items-center gap-1.5">
              <HandHeart size={16} />
              My Prayers
            </span>
          </button>
          <button type="button" onClick={() => setSectionTab("community")} className={sectionTabClass("community")}>
            <span className="inline-flex items-center gap-1.5">
              <Users size={16} />
              Community
              {communityPrayers.length > 0 && (
                <span className="bg-stone-200 text-stone-600 text-xs font-medium px-1.5 py-0.5 rounded-full">
                  {communityPrayers.length}
                </span>
              )}
            </span>
          </button>
        </div>

        {sectionTab === "mine" ? (
          <MyPrayersSection
            prayers={prayers}
            username={username}
            onEdit={handleEditPrayer}
            onDelete={handleDeletePrayer}
            onMarkAnswered={handleMarkAnswered}
            onMarkNoLongerPraying={handleMarkNoLongerPraying}
            onReactivate={handleReactivate}
          />
        ) : (
          <CommunityPrayers prayers={communityPrayers} />
        )}
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
