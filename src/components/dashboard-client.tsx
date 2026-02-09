"use client";

import { useState, useTransition, useMemo } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Calendar } from "@/components/calendar";
import { Stats } from "@/components/stats";
import { ActivityLog } from "@/components/activity-log";
import { EntryForm } from "@/components/entry-form";
import { createEntry, updateEntry, deleteEntry } from "@/app/dashboard/actions";
import { computeStats } from "@/lib/stats";
import type { ReadingEntry, EntryFormData, FriendsActivityEntry } from "@/lib/types";

function getEntriesForDate(entries: ReadingEntry[], date: Date) {
  return entries.filter((e) => {
    const entryDate = new Date(e.date);
    return (
      entryDate.getDate() === date.getDate() &&
      entryDate.getMonth() === date.getMonth() &&
      entryDate.getFullYear() === date.getFullYear()
    );
  });
}

interface DashboardClientProps {
  initialEntries: ReadingEntry[];
  initialFriendsActivity: FriendsActivityEntry[];
}

export function DashboardClient({
  initialEntries,
  initialFriendsActivity,
}: DashboardClientProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [formData, setFormData] = useState<EntryFormData>({
    book: "Genesis",
    chapters: "",
    verses: "",
    notes: "",
  });

  const stats = useMemo(() => computeStats(entries), [entries]);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleDayClick = (day: number) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
  };

  const handleEditEntry = (entry: ReadingEntry) => {
    setEditingEntryId(entry.id);
    setFormData({
      book: entry.book,
      chapters: entry.chapters,
      verses: entry.verses,
      notes: entry.notes,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntryId(null);
    setFormData({ book: "Genesis", chapters: "", verses: "", notes: "" });
  };

  const handleSaveEntry = () => {
    const data = { ...formData };

    if (editingEntryId) {
      // Optimistic update
      const originalEntry = entries.find((e) => e.id === editingEntryId);
      setEntries((prev) =>
        prev.map((e) => (e.id === editingEntryId ? { ...e, ...data } : e))
      );
      handleCloseModal();
      toast.success("Entry updated");

      startTransition(async () => {
        try {
          await updateEntry(editingEntryId, data);
        } catch {
          if (originalEntry) {
            setEntries((prev) =>
              prev.map((e) => (e.id === originalEntry.id ? originalEntry : e))
            );
          }
          toast.error("Failed to update entry");
        }
      });
    } else {
      const dateStr = selectedDate.toISOString();

      // Optimistic: add to local state with a temp ID
      const tempEntry: ReadingEntry = {
        id: `temp-${Date.now()}`,
        date: dateStr,
        ...data,
      };
      setEntries((prev) => [...prev, tempEntry]);
      handleCloseModal();
      toast.success("Entry logged successfully");

      startTransition(async () => {
        try {
          await createEntry(data, dateStr);
        } catch {
          setEntries((prev) => prev.filter((e) => e.id !== tempEntry.id));
          toast.error("Failed to save entry");
        }
      });
    }
  };

  const handleDeleteEntry = (id: string) => {
    const removedEntry = entries.find((e) => e.id === id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Entry deleted");

    startTransition(async () => {
      try {
        await deleteEntry(id);
      } catch {
        if (removedEntry) {
          setEntries((prev) => [...prev, removedEntry]);
        }
        toast.error("Failed to delete entry");
      }
    });
  };

  const selectedDateEntries = getEntriesForDate(entries, selectedDate);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar stats={stats} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Calendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              entries={entries}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              onDayClick={handleDayClick}
            />
            <Stats stats={stats} />
          </div>

          <div className="lg:col-span-5">
            <ActivityLog
              selectedDate={selectedDate}
              entries={selectedDateEntries}
              friendsEntries={initialFriendsActivity}
              onAddEntry={() => setIsModalOpen(true)}
              onEditEntry={handleEditEntry}
              onDeleteEntry={handleDeleteEntry}
            />
          </div>
        </div>
      </main>

      <EntryForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSaveEntry}
        isEditing={!!editingEntryId}
      />
    </div>
  );
}
