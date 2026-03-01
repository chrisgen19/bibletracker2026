import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { extractPlainText } from "@/lib/notes";
import { PrayerDetailClient } from "@/components/prayer-detail-client";
import type { PublicPrayer, PrayerCategory, PrayerStatus } from "@/lib/types";

interface PageProps {
  params: Promise<{ username: string; prayerId: string }>;
}

async function getPrayerWithUser(
  username: string,
  prayerId: string,
  currentUserId: string | null,
): Promise<{
  prayer: PublicPrayer;
  authorName: string;
  isOwnPrayer: boolean;
} | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      isProfilePublic: true,
    },
  });

  if (!user || !user.isProfilePublic) return null;

  const prayer = await prisma.prayer.findUnique({
    where: { id: prayerId },
    include: {
      _count: { select: { supports: true } },
      supports: currentUserId
        ? { where: { userId: currentUserId }, take: 1 }
        : false,
    },
  });

  // Prayer must exist, belong to this user, and be public
  if (!prayer || prayer.userId !== user.id || !prayer.isPublic) return null;

  return {
    prayer: {
      id: prayer.id,
      date: prayer.date.toISOString(),
      title: prayer.title,
      content: prayer.content,
      category: prayer.category as PrayerCategory,
      status: prayer.status as PrayerStatus,
      answeredAt: prayer.answeredAt?.toISOString() ?? null,
      answeredNote: prayer.answeredNote,
      scriptureReference: prayer.scriptureReference,
      isPublic: prayer.isPublic,
      createdAt: prayer.createdAt.toISOString(),
      updatedAt: prayer.updatedAt.toISOString(),
      user: {
        id: user.id,
        username: user.username!,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      supportCount: prayer._count.supports,
      hasPrayed: Array.isArray(prayer.supports)
        ? prayer.supports.length > 0
        : false,
    },
    authorName: `${user.firstName} ${user.lastName}`,
    isOwnPrayer: currentUserId === user.id,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username, prayerId } = await params;
  const result = await getPrayerWithUser(username, prayerId, null);

  if (!result) {
    return { title: "Prayer Not Found" };
  }

  const { prayer, authorName } = result;
  const title = `${prayer.title} — ${authorName}`;
  const description = prayer.content
    ? extractPlainText(prayer.content).slice(0, 160)
    : `${authorName}'s prayer request: ${prayer.title}`;

  return { title, description, openGraph: { title, description } };
}

export default async function PrayerDetailPage({ params }: PageProps) {
  const { username, prayerId } = await params;
  const session = await auth();
  const currentUserId = session?.user?.id ?? null;

  const result = await getPrayerWithUser(username, prayerId, currentUserId);

  if (!result) {
    notFound();
  }

  return (
    <PrayerDetailClient
      username={username}
      authorName={result.authorName}
      prayer={result.prayer}
      isLoggedIn={!!currentUserId}
      isOwnPrayer={result.isOwnPrayer}
    />
  );
}
