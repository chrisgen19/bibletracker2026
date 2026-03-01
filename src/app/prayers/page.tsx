import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PrayerList } from "@/components/prayer-list";
import { getUnreadNotificationCount } from "@/app/friends/actions";
import { computeStats } from "@/lib/stats";
import type { ReadingEntry, Prayer, PrayerCategory, PrayerStatus } from "@/lib/types";

export default async function PrayersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [dbPrayers, dbEntries, unreadNotificationCount] = await Promise.all([
    prisma.prayer.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    }),
    prisma.readingEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    }),
    getUnreadNotificationCount(),
  ]);

  const prayers: Prayer[] = dbPrayers.map((p) => ({
    id: p.id,
    date: p.date.toISOString(),
    title: p.title,
    content: p.content,
    category: p.category as PrayerCategory,
    status: p.status as PrayerStatus,
    answeredAt: p.answeredAt?.toISOString() ?? null,
    answeredNote: p.answeredNote,
    scriptureReference: p.scriptureReference,
    isPublic: p.isPublic,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const entries: ReadingEntry[] = dbEntries.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    book: e.book,
    chapters: e.chapters,
    verses: e.verses,
    notes: e.notes,
  }));

  const stats = computeStats(entries);

  return (
    <PrayerList
      initialPrayers={prayers}
      stats={stats}
      unreadNotificationCount={unreadNotificationCount}
    />
  );
}
