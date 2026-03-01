"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateId } from "@/lib/ulid";
import type { Prayer, PrayerFormData, PrayerCategory, PrayerStatus } from "@/lib/types";

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

export async function createPrayer(
  formData: PrayerFormData,
  date: string,
): Promise<Prayer> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const prayer = await prisma.prayer.create({
    data: {
      id: generateId(),
      userId: session.user.id,
      date: new Date(date),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      scriptureReference: formData.scriptureReference || null,
      isPublic: formData.isPublic,
    },
  });

  revalidate();
  return serializePrayer(prayer);
}

export async function getPrayers(filters?: {
  status?: PrayerStatus;
  category?: PrayerCategory;
}): Promise<Prayer[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const where: Record<string, unknown> = { userId: session.user.id };
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
  formData: PrayerFormData,
): Promise<Prayer> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const prayer = await prisma.prayer.update({
    where: { id: prayerId, userId: session.user.id },
    data: {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      scriptureReference: formData.scriptureReference || null,
      isPublic: formData.isPublic,
    },
  });

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

  const prayer = await prisma.prayer.update({
    where: { id: prayerId, userId: session.user.id },
    data: {
      status: "ANSWERED",
      answeredAt: new Date(),
      answeredNote: answeredNote || null,
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
