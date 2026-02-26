import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { extractPlainText } from "@/lib/notes";
import { NotesPageClient } from "@/components/notes-page-client";

interface PageProps {
  params: Promise<{ username: string; entryId: string }>;
}

async function getEntryWithUser(username: string, entryId: string) {
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

  if (!user) return null;

  const entry = await prisma.readingEntry.findUnique({
    where: { id: entryId },
    select: {
      id: true,
      date: true,
      book: true,
      chapters: true,
      verses: true,
      notes: true,
      userId: true,
    },
  });

  // Entry must exist and belong to this user
  if (!entry || entry.userId !== user.id) return null;

  return { user, entry };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username, entryId } = await params;
  const result = await getEntryWithUser(username, entryId);

  if (!result || !result.user.isProfilePublic) {
    return { title: "Entry Not Found | Sola Scriptura" };
  }

  const { user, entry } = result;
  const title = `${entry.book} Ch ${entry.chapters}${entry.verses ? `: ${entry.verses}` : ""} — ${user.firstName} ${user.lastName} | Sola Scriptura`;
  const description = entry.notes
    ? extractPlainText(entry.notes).slice(0, 160)
    : `${user.firstName}'s reading of ${entry.book} Chapter ${entry.chapters}`;

  return { title, description };
}

export default async function NotesPage({ params }: PageProps) {
  const { username, entryId } = await params;
  const [result, session] = await Promise.all([
    getEntryWithUser(username, entryId),
    auth(),
  ]);

  if (!result) {
    notFound();
  }

  const { user, entry } = result;

  if (!user.isProfilePublic) {
    // Reuse the private profile pattern inline
    const { PublicProfileClient } = await import(
      "@/components/public-profile-client"
    );
    return (
      <PublicProfileClient
        isPrivate
        username={username}
        isLoggedIn={!!session?.user?.id}
      />
    );
  }

  return (
    <NotesPageClient
      username={username}
      authorName={`${user.firstName} ${user.lastName}`}
      entry={{
        id: entry.id,
        date: entry.date.toISOString(),
        book: entry.book,
        chapters: entry.chapters,
        verses: entry.verses,
        notes: entry.notes,
      }}
      isLoggedIn={!!session?.user?.id}
    />
  );
}
