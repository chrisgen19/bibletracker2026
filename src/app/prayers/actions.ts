"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateId } from "@/lib/ulid";
import { createPrayerSchema, answerPrayerSchema } from "@/lib/validations/prayer";
import type { Prayer, PrayerCategory, PrayerStatus } from "@/lib/types";

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
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  isPublic: p.isPublic,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
});

function revalidate() {
  revalidatePath("/prayers");
  revalidatePath("/dashboard");
}

/** Notify all followers when a prayer is made public */
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
      isPublic: parsed.data.isPublic,
    },
  });

  if (prayer.isPublic) {
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

  // Fetch current state to detect public/private transitions
  const current = await prisma.prayer.findUnique({
    where: { id: prayerId, userId: session.user.id },
    select: { isPublic: true },
  });
  if (!current) throw new Error("Prayer not found");

  const prayer = await prisma.prayer.update({
    where: { id: prayerId, userId: session.user.id },
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      category: parsed.data.category,
      scriptureReference: parsed.data.scriptureReference || null,
      isPublic: parsed.data.isPublic,
    },
  });

  // Handle public/private transitions
  if (!current.isPublic && parsed.data.isPublic) {
    await notifyFollowersOfPrayer(session.user.id, prayer.id);
  } else if (current.isPublic && !parsed.data.isPublic) {
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
  });

  revalidate();
  return serializePrayer(prayer);
}
