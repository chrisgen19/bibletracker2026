import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getAllNotifications,
  getUnreadNotificationCount,
  getCurrentUsername,
} from "@/app/friends/actions";
import { computeStats } from "@/lib/stats";
import { NotificationsClient } from "@/components/notifications-client";
import type { ReadingEntry } from "@/lib/types";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [notifications, unreadNotificationCount, currentUsername, dbEntries] =
    await Promise.all([
      getAllNotifications(),
      getUnreadNotificationCount(),
      getCurrentUsername(),
      prisma.readingEntry.findMany({
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

  const stats = computeStats(entries);

  return (
    <NotificationsClient
      initialNotifications={notifications}
      currentUsername={currentUsername}
      stats={stats}
      unreadNotificationCount={unreadNotificationCount}
    />
  );
}
