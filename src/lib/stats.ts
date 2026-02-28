import type { ReadingEntry, Stats } from "@/lib/types";

const DAY_MS = 86400000;

/** Get unique sorted dates (newest first) from entries */
const getUniqueDates = (entries: ReadingEntry[]): Date[] => {
  const seen = new Set<number>();
  const dates: Date[] = [];

  for (const entry of entries) {
    const d = new Date(entry.date);
    d.setHours(0, 0, 0, 0);
    const t = d.getTime();
    if (!seen.has(t)) {
      seen.add(t);
      dates.push(d);
    }
  }

  return dates.sort((a, b) => b.getTime() - a.getTime());
};

export function computeStats(entries: ReadingEntry[]): Stats {
  const totalEntries = entries.length;
  const booksRead = new Set(entries.map((e) => e.book)).size;

  const uniqueDates = getUniqueDates(entries);
  const readingDays = uniqueDates.length;

  // Current streak: must include today or yesterday
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (uniqueDates.length > 0) {
    const firstDate = uniqueDates[0];
    const gapFromToday = today.getTime() - firstDate.getTime();

    if (gapFromToday === 0 || gapFromToday === DAY_MS) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        if (uniqueDates[i - 1].getTime() - uniqueDates[i].getTime() === DAY_MS) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // Longest streak: walk all unique dates tracking consecutive chains
  let longestStreak = 0;
  if (uniqueDates.length > 0) {
    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      if (uniqueDates[i - 1].getTime() - uniqueDates[i].getTime() === DAY_MS) {
        streak++;
      } else {
        longestStreak = Math.max(longestStreak, streak);
        streak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, streak);
  }

  return { totalEntries, booksRead, currentStreak, longestStreak, readingDays };
}
