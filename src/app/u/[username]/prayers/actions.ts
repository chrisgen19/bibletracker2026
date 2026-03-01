"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateId } from "@/lib/ulid";

export async function prayForPrayer(prayerId: string, prayerOwnerId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (session.user.id === prayerOwnerId) {
    throw new Error("Cannot support your own prayer");
  }

  const prayer = await prisma.prayer.findUnique({
    where: { id: prayerId },
    select: { id: true, userId: true, isPublic: true },
  });

  if (!prayer || !prayer.isPublic) {
    throw new Error("Prayer not found or is private");
  }

  if (prayer.userId !== prayerOwnerId) {
    throw new Error("Invalid prayer owner");
  }

  // Create support record — unique constraint handles duplicates
  await prisma.prayerSupport.create({
    data: {
      id: generateId(),
      prayerId,
      userId: session.user.id,
    },
  });

  // Notify the prayer owner
  await prisma.notification.create({
    data: {
      id: generateId(),
      userId: prayerOwnerId,
      actorId: session.user.id,
      type: "PRAYED_FOR",
      prayerId,
    },
  });

  revalidatePath(`/u`);
  revalidatePath("/dashboard");
}
