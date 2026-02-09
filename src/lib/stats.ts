import type { ReadingEntry, Stats } from "@/lib/types";

export function computeStats(entries: ReadingEntry[]): Stats {
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
