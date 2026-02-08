"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateId } from "@/lib/ulid";
import type { EntryFormData, ReadingEntry } from "@/lib/types";

export async function getEntries(): Promise<ReadingEntry[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const entries = await prisma.readingEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  return entries.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    book: e.book,
    chapters: e.chapters,
    verses: e.verses,
    notes: e.notes,
  }));
}

export async function createEntry(formData: EntryFormData, date: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.readingEntry.create({
    data: {
      id: generateId(),
      userId: session.user.id,
      date: new Date(date),
      book: formData.book,
      chapters: formData.chapters,
      verses: formData.verses,
      notes: formData.notes,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateEntry(entryId: string, formData: EntryFormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.readingEntry.update({
    where: {
      id: entryId,
      userId: session.user.id,
    },
    data: {
      book: formData.book,
      chapters: formData.chapters,
      verses: formData.verses,
      notes: formData.notes,
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteEntry(entryId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.readingEntry.delete({
    where: {
      id: entryId,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
}
