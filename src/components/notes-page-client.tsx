"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { BookOpen, ArrowLeft, Loader2, FileText } from "lucide-react";

const NotesBlockViewer = dynamic(
  () =>
    import("@/components/notes-block-viewer").then(
      (mod) => mod.NotesBlockViewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-stone-400" size={32} />
      </div>
    ),
  }
);

interface NotesPageEntry {
  id: string;
  date: string;
  book: string;
  chapters: string;
  verses: string;
  notes: string;
}

interface NotesPageClientProps {
  username: string;
  authorName: string;
  entry: NotesPageEntry;
  isLoggedIn: boolean;
}

export function NotesPageClient({
  username,
  authorName,
  entry,
  isLoggedIn,
}: NotesPageClientProps) {
  const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3">
            <div className="bg-stone-900 text-white p-2 rounded-xl">
              <BookOpen size={20} />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">
              Sola Scriptura
            </span>
          </Link>
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link
          href={`/u/${username}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {authorName}&apos;s profile
        </Link>

        {/* Entry header */}
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-6 sm:p-8 border border-stone-100">
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
                {entry.book}
              </span>
              <span className="text-emerald-600 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-md text-sm">
                Ch {entry.chapters}
                {entry.verses && `: ${entry.verses}`}
              </span>
            </div>
            <p className="text-sm text-stone-500">{formattedDate}</p>
            <p className="text-sm text-stone-400 mt-1">by {authorName}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-stone-100 mb-6" />

          {/* Notes content */}
          {entry.notes ? (
            <div className="prose-sm">
              <NotesBlockViewer notes={entry.notes} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-stone-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText size={32} className="text-stone-400" />
              </div>
              <p className="text-stone-500 font-medium">
                No notes for this entry
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
