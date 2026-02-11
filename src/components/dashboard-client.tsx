"use client";

import { useState, useTransition, useMemo } from "react";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Calendar } from "@/components/calendar";
import { Stats } from "@/components/stats";
import { ActivityLog } from "@/components/activity-log";
import { EntryForm } from "@/components/entry-form";
import { createEntry, updateEntry, deleteEntry } from "@/app/dashboard/actions";
import { computeStats } from "@/lib/stats";
import { APP_VERSION } from "@/lib/changelog";
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
  calendarDisplayMode: "DOTS_ONLY" | "REFERENCES_WITH_DOTS" | "REFERENCES_ONLY";
  showMissedDays: boolean;
  unreadNotificationCount: number;
}

export function DashboardClient({
  initialEntries,
  initialFriendsActivity,
  calendarDisplayMode,
  showMissedDays,
  unreadNotificationCount,
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
          const savedEntry = await createEntry(data, dateStr);
          setEntries((prev) =>
            prev.map((e) => (e.id === tempEntry.id ? savedEntry : e))
          );
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
      <Navbar stats={stats} unreadCount={unreadNotificationCount} />

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
              displayMode={calendarDisplayMode}
              showMissedDays={showMissedDays}
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

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <BookOpen size={16} />
            <span className="font-serif font-medium">Sola Scriptura</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Sola Scriptura. All rights
              reserved.
            </p>
            <a
              href="/changelog"
              className="hover:text-stone-600 transition-colors"
            >
              v{APP_VERSION}
            </a>
          </div>
        </div>
      </footer>

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
