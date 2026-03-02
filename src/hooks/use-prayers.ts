"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createPrayer,
  updatePrayer,
  deletePrayer,
  markPrayerAnswered,
  markPrayerNoLongerPraying,
  reactivatePrayer,
} from "@/app/prayers/actions";
import type { Prayer, PrayerFormData, PrayerStatus } from "@/lib/types";

const DEFAULT_FORM_DATA: PrayerFormData = {
  title: "",
  content: "",
  category: "PERSONAL",
  scriptureReference: "",
  visibility: "PRIVATE",
};

interface UsePrayersOptions {
  initialPrayers: Prayer[];
  /** Returns the date string to use when creating a new prayer */
  getDateForCreate?: () => string;
}

export function usePrayers({ initialPrayers, getDateForCreate }: UsePrayersOptions) {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrayerId, setEditingPrayerId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PrayerFormData>(DEFAULT_FORM_DATA);
  const [, startTransition] = useTransition();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPrayerId(null);
    setFormData(DEFAULT_FORM_DATA);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleEditPrayer = (prayer: Prayer) => {
    setEditingPrayerId(prayer.id);
    setFormData({
      title: prayer.title,
      content: prayer.content,
      category: prayer.category,
      scriptureReference: prayer.scriptureReference ?? "",
      visibility: prayer.visibility,
    });
    setIsModalOpen(true);
  };

  const handleSavePrayer = () => {
    const data = { ...formData };
    // Capture editingPrayerId before closing modal to avoid stale closure
    const currentEditingId = editingPrayerId;

    if (currentEditingId) {
      const original = prayers.find((p) => p.id === currentEditingId);
      setPrayers((prev) =>
        prev.map((p) =>
          p.id === currentEditingId
            ? {
                ...p,
                title: data.title,
                content: data.content,
                category: data.category,
                scriptureReference: data.scriptureReference || null,
                visibility: data.visibility,
              }
            : p,
        ),
      );
      handleCloseModal();
      toast.success("Prayer updated");

      startTransition(async () => {
        try {
          const updated = await updatePrayer(currentEditingId, data);
          setPrayers((prev) =>
            prev.map((p) => (p.id === currentEditingId ? updated : p)),
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
      const dateStr = getDateForCreate?.() ?? new Date().toISOString();
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
        visibility: data.visibility,
        supportCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
          ? {
              ...p,
              status: "ANSWERED" as PrayerStatus,
              answeredAt: new Date().toISOString(),
              answeredNote: note ?? null,
            }
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
        p.id === id
          ? { ...p, status: "NO_LONGER_PRAYING" as PrayerStatus }
          : p,
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
          ? {
              ...p,
              status: "ACTIVE" as PrayerStatus,
              answeredAt: null,
              answeredNote: null,
            }
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

  return {
    prayers,
    setPrayers,
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
  };
}
