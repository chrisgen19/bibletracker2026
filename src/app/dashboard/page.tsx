import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardClient } from "@/components/dashboard-client";
import { getFriendsActivity } from "@/app/friends/actions";
import type { ReadingEntry } from "@/lib/types";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [dbEntries, friendsActivity] = await Promise.all([
    prisma.readingEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    }),
    getFriendsActivity(),
  ]);

  const entries: ReadingEntry[] = dbEntries.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    book: e.book,
    chapters: e.chapters,
    verses: e.verses,
    notes: e.notes,
  }));

  return (
    <DashboardClient
      initialEntries={entries}
      initialFriendsActivity={friendsActivity}
    />
  );
}
