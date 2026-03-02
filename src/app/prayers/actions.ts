"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateId } from "@/lib/ulid";
import { createPrayerSchema, answerPrayerSchema } from "@/lib/validations/prayer";
import type { Prayer, PrayerCategory, PrayerStatus, PrayerVisibility, PublicPrayer } from "@/lib/types";

const serializePrayer = (p: {
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
  _count?: { supports: number };
}): Prayer => ({
  id: p.id,
  date: p.date.toISOString(),
  title: p.title,
  content: p.content,
  category: p.category as PrayerCategory,
  status: p.status as PrayerStatus,
  answeredAt: p.answeredAt?.toISOString() ?? null,
  answeredNote: p.answeredNote,
  scriptureReference: p.scriptureReference,
  visibility: p.visibility as PrayerVisibility,
  supportCount: p._count?.supports ?? 0,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
});

function revalidate() {
  revalidatePath("/prayers");
  revalidatePath("/dashboard");
}

/** Notify all followers when a prayer is shared (FOLLOWERS or PUBLIC) */
async function notifyFollowersOfPrayer(userId: string, prayerId: string) {
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    select: { followerId: true },
  });

  if (followers.length === 0) return;

  await prisma.notification.createMany({
    skipDuplicates: true,
    data: followers.map((f) => ({
      id: generateId(),
      userId: f.followerId,
      actorId: userId,
      type: "PRAYER_SHARED" as const,
      prayerId,
    })),
  });

  revalidatePath("/dashboard");
}

export async function createPrayer(
  formData: unknown,
  date: string,
): Promise<Prayer> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = createPrayerSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid prayer data");
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date");
  }

  const prayer = await prisma.prayer.create({
    data: {
      id: generateId(),
      userId: session.user.id,
      date: parsedDate,
      title: parsed.data.title,
      content: parsed.data.content,
      category: parsed.data.category,
      scriptureReference: parsed.data.scriptureReference || null,
      visibility: parsed.data.visibility,
    },
    include: { _count: { select: { supports: true } } },
  });

  if (prayer.visibility !== "PRIVATE") {
    await notifyFollowersOfPrayer(session.user.id, prayer.id);
  }

  revalidate();
  return serializePrayer(prayer);
}

export async function getPrayers(filters?: {
  status?: PrayerStatus;
  category?: PrayerCategory;
}): Promise<Prayer[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const where: { userId: string; status?: PrayerStatus; category?: PrayerCategory } = {
    userId: session.user.id,
  };
  if (filters?.status) where.status = filters.status;
  if (filters?.category) where.category = filters.category;

  const prayers = await prisma.prayer.findMany({
    where,
    orderBy: { date: "desc" },
    include: { _count: { select: { supports: true } } },
  });

  return prayers.map(serializePrayer);
}

export async function updatePrayer(
  prayerId: string,
  formData: unknown,
): Promise<Prayer> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = createPrayerSchema.safeParse(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid prayer data");
  }

  // Fetch current state to detect visibility transitions
  const current = await prisma.prayer.findUnique({
    where: { id: prayerId, userId: session.user.id },
    select: { visibility: true },
  });
  if (!current) throw new Error("Prayer not found");

  const prayer = await prisma.prayer.update({
    where: { id: prayerId, userId: session.user.id },
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      category: parsed.data.category,
      scriptureReference: parsed.data.scriptureReference || null,
      visibility: parsed.data.visibility,
    },
    include: { _count: { select: { supports: true } } },
  });

  // Handle visibility transitions
  const wasShared = current.visibility !== "PRIVATE";
  const isNowShared = parsed.data.visibility !== "PRIVATE";

  if (!wasShared && isNowShared) {
    // Went from private → shared: notify followers
    await notifyFollowersOfPrayer(session.user.id, prayer.id);
  } else if (wasShared && !isNowShared) {
    // Went from shared → private: remove share notifications
    await prisma.notification.deleteMany({
      where: { prayerId: prayer.id, type: "PRAYER_SHARED" },
    });
  }

  revalidate();
  return serializePrayer(prayer);
}

export async function deletePrayer(prayerId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.prayer.delete({
    where: { id: prayerId, userId: session.user.id },
  });

  revalidate();
}

export async function markPrayerAnswered(
  prayerId: string,
  answeredNote?: string,
): Promise<Prayer> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = answerPrayerSchema.safeParse({ answeredNote });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid note");
  }

  const prayer = await prisma.prayer.update({
    where: { id: prayerId, userId: session.user.id },
    data: {
      status: "ANSWERED",
      answeredAt: new Date(),
      answeredNote: parsed.data.answeredNote || null,
    },
    include: { _count: { select: { supports: true } } },
  });

  revalidate();
  return serializePrayer(prayer);
}

export async function markPrayerNoLongerPraying(
  prayerId: string,
): Promise<Prayer> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const prayer = await prisma.prayer.update({
    where: { id: prayerId, userId: session.user.id },
    data: { status: "NO_LONGER_PRAYING" },
    include: { _count: { select: { supports: true } } },
  });

  revalidate();
  return serializePrayer(prayer);
}

export async function reactivatePrayer(prayerId: string): Promise<Prayer> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const prayer = await prisma.prayer.update({
    where: { id: prayerId, userId: session.user.id },
    data: {
      status: "ACTIVE",
      answeredAt: null,
      answeredNote: null,
    },
    include: { _count: { select: { supports: true } } },
  });

  revalidate();
  return serializePrayer(prayer);
}

/**
 * Fetch community prayers visible to the current user:
 * - FOLLOWERS prayers from users the current user follows
 * - PUBLIC prayers from all other users
 * Excludes own prayers. For PUBLIC prayers from non-followed users,
 * only firstName is exposed (lastName/username redacted).
 */
export async function getCommunityPrayers(): Promise<PublicPrayer[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userId = session.user.id;

  // Get IDs of users the current user follows
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followedIds = following.map((f) => f.followingId);

  // Fetch FOLLOWERS prayers from followed users + PUBLIC prayers from everyone else
  const prayers = await prisma.prayer.findMany({
    where: {
      userId: { not: userId },
      status: "ACTIVE",
      OR: [
        { visibility: "FOLLOWERS", userId: { in: followedIds } },
        { visibility: "PUBLIC" },
      ],
    },
    include: {
      user: { select: { id: true, username: true, firstName: true, lastName: true } },
      _count: { select: { supports: true } },
      supports: {
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return prayers.map((p) => {
    const isFollowed = followedIds.includes(p.userId);
    const hasPrayed = p.supports.some((s) => s.userId === userId);

    return {
      id: p.id,
      date: p.date.toISOString(),
      title: p.title,
      content: p.content,
      category: p.category as PrayerCategory,
      status: p.status as PrayerStatus,
      answeredAt: p.answeredAt?.toISOString() ?? null,
      answeredNote: p.answeredNote,
      scriptureReference: p.scriptureReference,
      visibility: p.visibility as PrayerVisibility,
      supportCount: p._count.supports,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      user: isFollowed
        ? { id: p.user.id, username: p.user.username ?? "", firstName: p.user.firstName, lastName: p.user.lastName }
        : { id: p.user.id, username: "", firstName: p.user.firstName, lastName: "" },
      hasPrayed,
      supporters: p.supports.map((s) => ({
        id: s.user.id,
        firstName: s.user.firstName,
        lastName: s.user.lastName,
      })),
    };
  });
}
