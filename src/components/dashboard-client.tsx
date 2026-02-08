"use client";

import { useState, useTransition, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Calendar } from "@/components/calendar";
import { Stats } from "@/components/stats";
import { ActivityLog } from "@/components/activity-log";
import { EntryForm } from "@/components/entry-form";
import { createEntry, deleteEntry } from "@/app/dashboard/actions";
import type { ReadingEntry, EntryFormData, Stats as StatsType } from "@/lib/types";

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

function computeStats(entries: ReadingEntry[]): StatsType {
  const totalEntries = entries.length;
  const booksRead = new Set(entries.map((e) => e.book)).size;

  let currentStreak = 0;
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastEntryDate =
    sortedEntries.length > 0 ? new Date(sortedEntries[0].date) : null;
  if (lastEntryDate) lastEntryDate.setHours(0, 0, 0, 0);

  if (
    lastEntryDate &&
    (today.getTime() === lastEntryDate.getTime() ||
      today.getTime() - lastEntryDate.getTime() === 86400000)
  ) {
    let checkDate = lastEntryDate;
    currentStreak = 1;

    for (let i = 1; i < sortedEntries.length; i++) {
      const prevDate = new Date(sortedEntries[i].date);
      prevDate.setHours(0, 0, 0, 0);
      const diff = checkDate.getTime() - prevDate.getTime();

      if (diff === 86400000) {
        currentStreak++;
        checkDate = prevDate;
      } else if (diff === 0) {
        continue;
      } else {
        break;
      }
    }
  }

  return { totalEntries, booksRead, currentStreak };
}

interface DashboardClientProps {
  initialEntries: ReadingEntry[];
}

export function DashboardClient({
  initialEntries,
}: DashboardClientProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleSaveEntry = () => {
    const dateStr = selectedDate.toISOString();
    const data = { ...formData };

    // Optimistic: add to local state with a temp ID
    const tempEntry: ReadingEntry = {
      id: `temp-${Date.now()}`,
      date: dateStr,
      ...data,
    };
    setEntries((prev) => [...prev, tempEntry]);
    setFormData({ book: "Genesis", chapters: "", verses: "", notes: "" });
    setIsModalOpen(false);

    startTransition(async () => {
      try {
        await createEntry(data, dateStr);
      } catch {
        // Revert on error
        setEntries((prev) => prev.filter((e) => e.id !== tempEntry.id));
      }
    });
  };

  const handleDeleteEntry = (id: string) => {
    const removedEntry = entries.find((e) => e.id === id);
    setEntries((prev) => prev.filter((e) => e.id !== id));

    startTransition(async () => {
      try {
        await deleteEntry(id);
      } catch {
        // Revert on error
        if (removedEntry) {
          setEntries((prev) => [...prev, removedEntry]);
        }
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
              onAddEntry={() => setIsModalOpen(true)}
              onDeleteEntry={handleDeleteEntry}
            />
          </div>
        </div>
      </main>

      <EntryForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onFormChange={setFormData}
        onSave={handleSaveEntry}
      />
    </div>
  );
}
