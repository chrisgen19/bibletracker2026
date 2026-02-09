import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getFollowing,
  getFollowers,
  getFollowCounts,
  getUnreadNotificationCount,
} from "./actions";
import { computeStats } from "@/lib/stats";
import { FriendsClient } from "@/components/friends-client";
import type { ReadingEntry } from "@/lib/types";

export default async function FriendsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [following, followers, friendStats, dbEntries, unreadNotificationCount] =
    await Promise.all([
      getFollowing(),
      getFollowers(),
      getFollowCounts(),
      prisma.readingEntry.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
      }),
      getUnreadNotificationCount(),
    ]);

  const entries: ReadingEntry[] = dbEntries.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    book: e.book,
    chapters: e.chapters,
    verses: e.verses,
    notes: e.notes,
  }));

  const navbarStats = computeStats(entries);

  return (
    <FriendsClient
      initialFollowing={following}
      initialFollowers={followers}
      stats={friendStats}
      navbarStats={navbarStats}
      unreadNotificationCount={unreadNotificationCount}
    />
  );
}
