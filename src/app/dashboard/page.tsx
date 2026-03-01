import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardClient } from "@/components/dashboard-client";
import {
  getFriendsActivity,
  getUnreadNotificationCount,
} from "@/app/friends/actions";
import type { ReadingEntry, Prayer, PrayerCategory, PrayerStatus } from "@/lib/types";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [dbEntries, friendsActivity, user, unreadNotificationCount, dbPrayers] =
    await Promise.all([
      prisma.readingEntry.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
      }),
      getFriendsActivity(),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true, calendarDisplayMode: true, showMissedDays: true },
      }),
      getUnreadNotificationCount(),
      prisma.prayer.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
      }),
    ]);

  const entries: ReadingEntry[] = dbEntries.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    book: e.book,
    chapters: e.chapters,
    verses: e.verses,
    notes: e.notes,
  }));

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

  return (
    <DashboardClient
      username={user?.username ?? ""}
      initialEntries={entries}
      initialFriendsActivity={friendsActivity}
      calendarDisplayMode={user?.calendarDisplayMode || "REFERENCES_WITH_DOTS"}
      showMissedDays={user?.showMissedDays ?? true}
      unreadNotificationCount={unreadNotificationCount}
      initialPrayers={prayers}
    />
  );
}
