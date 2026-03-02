"use client";

import { useState, useTransition } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { prayForPrayer } from "@/app/u/[username]/prayers/actions";
import { CommunityPrayerCard } from "@/components/community-prayer-card";
import type { PublicPrayer } from "@/lib/types";

interface CommunityPrayersProps {
  prayers: PublicPrayer[];
}

export function CommunityPrayers({ prayers: initialPrayers }: CommunityPrayersProps) {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [, startTransition] = useTransition();

  const handlePrayFor = (prayer: PublicPrayer) => {
    if (prayer.hasPrayed) return;

    // Optimistic update
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === prayer.id
          ? { ...p, hasPrayed: true, supportCount: p.supportCount + 1 }
          : p,
      ),
    );
    toast.success("Prayed for this request");

    startTransition(async () => {
      try {
        await prayForPrayer(prayer.id, prayer.user.id);
      } catch {
        // Revert on error
        setPrayers((prev) =>
          prev.map((p) =>
            p.id === prayer.id
              ? { ...p, hasPrayed: false, supportCount: p.supportCount - 1 }
              : p,
          ),
        );
        toast.error("Failed to record prayer support");
      }
    });
  };

  if (prayers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 opacity-60">
        <div className="bg-stone-100 p-4 rounded-full mb-4">
          <Users size={32} className="text-stone-400" />
        </div>
        <p className="text-stone-500 font-medium">No community prayers yet.</p>
        <p className="text-stone-400 text-sm mt-2">
          Follow others to see their shared prayer requests here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prayers.map((prayer) => (
        <CommunityPrayerCard
          key={prayer.id}
          prayer={prayer}
          onPrayFor={handlePrayFor}
        />
      ))}
    </div>
  );
}
