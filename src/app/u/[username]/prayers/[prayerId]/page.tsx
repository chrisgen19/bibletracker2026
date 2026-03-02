import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { extractPlainText } from "@/lib/notes";
import { PrayerDetailClient } from "@/components/prayer-detail-client";
import type { PublicPrayer, PrayerCategory, PrayerStatus, PrayerVisibility } from "@/lib/types";

interface PageProps {
  params: Promise<{ username: string; prayerId: string }>;
}

interface PrayerWithCounts {
  id: string;
  date: Date;
  title: string;
  content: string;
  category: string;
  status: string;
  answeredAt: Date | null;
  answeredNote: string | null;
  scriptureReference: string | null;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  _count: { supports: number };
  supports: { id: string; userId: string; user: { id: string; firstName: string; lastName: string } }[] | boolean;
}

const serializePublicPrayer = (
  prayer: PrayerWithCounts,
  user: { id: string; username: string; firstName: string; lastName: string },
  currentUserId: string | null,
): PublicPrayer => ({
  id: prayer.id,
  date: prayer.date.toISOString(),
  title: prayer.title,
  content: prayer.content,
  category: prayer.category as PrayerCategory,
  status: prayer.status as PrayerStatus,
  answeredAt: prayer.answeredAt?.toISOString() ?? null,
  answeredNote: prayer.answeredNote,
  scriptureReference: prayer.scriptureReference,
  visibility: prayer.visibility as PrayerVisibility,
  supportCount: prayer._count.supports,
  createdAt: prayer.createdAt.toISOString(),
  updatedAt: prayer.updatedAt.toISOString(),
  user: { id: user.id, username: user.username, firstName: user.firstName, lastName: user.lastName },
  hasPrayed: Array.isArray(prayer.supports)
    ? prayer.supports.some((s) => s.userId === currentUserId)
    : false,
  supporters: Array.isArray(prayer.supports)
    ? prayer.supports.map((s) => ({ id: s.user.id, firstName: s.user.firstName, lastName: s.user.lastName }))
    : [],
});

async function getPrayerWithUser(
  username: string,
  prayerId: string,
  currentUserId: string | null,
) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, firstName: true, lastName: true, username: true, isProfilePublic: true },
  });

  if (!user || !user.isProfilePublic) return null;

  const prayer = await prisma.prayer.findUnique({
    where: { id: prayerId },
    include: {
      _count: { select: { supports: true } },
      supports: {
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!prayer || prayer.userId !== user.id || prayer.visibility === "PRIVATE") return null;

  // For FOLLOWERS visibility, verify the viewer is a follower or the owner
  if (prayer.visibility === "FOLLOWERS") {
    const isOwner = currentUserId === user.id;
    if (!isOwner) {
      if (!currentUserId) return null;
      const isFollowing = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: currentUserId, followingId: user.id } },
      });
      if (!isFollowing) return null;
    }
  }

  // For PUBLIC visibility from non-followed users, show first name only
  let displayUser = { id: user.id, username: user.username!, firstName: user.firstName, lastName: user.lastName };
  if (prayer.visibility === "PUBLIC" && currentUserId !== user.id) {
    const isFollowing = currentUserId
      ? await prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: currentUserId, followingId: user.id } },
        })
      : null;
    if (!isFollowing) {
      displayUser = { id: user.id, username: "", firstName: user.firstName, lastName: "" };
    }
  }

  return {
    prayer: serializePublicPrayer(prayer, displayUser, currentUserId),
    authorName: displayUser.lastName
      ? `${displayUser.firstName} ${displayUser.lastName}`
      : displayUser.firstName,
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
