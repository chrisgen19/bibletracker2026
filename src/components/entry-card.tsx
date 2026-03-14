"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, ChevronRight, BookOpen } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { NotesViewer } from "@/components/notes-viewer";
import { extractPlainText } from "@/lib/notes";
import type { ReadingEntry, FriendsActivityEntry } from "@/lib/types";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface OwnEntryCardProps {
  variant?: "own";
  entry: ReadingEntry;
  username: string;
  onEdit: (entry: ReadingEntry) => void;
  onDelete: (id: string) => void;
  onUpdateNotes?: (entryId: string, notes: string) => void;
}

interface FriendEntryCardProps {
  variant: "friend";
  entry: FriendsActivityEntry;
  username?: never;
  onEdit?: never;
  onDelete?: never;
  onUpdateNotes?: never;
}

interface PublicEntryCardProps {
  variant: "public";
  entry: ReadingEntry;
  username: string;
  onEdit?: never;
  onDelete?: never;
  onUpdateNotes?: never;
}

type EntryCardProps = OwnEntryCardProps | FriendEntryCardProps | PublicEntryCardProps;

export function EntryCard(props: EntryCardProps) {
  const { entry, variant = "own" } = props;
  const [showConfirm, setShowConfirm] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  const isOwn = variant === "own";
  const isFriend = variant === "friend";
  const isPublic = variant === "public";
  const friendEntry = isFriend ? (entry as FriendsActivityEntry) : null;

  const chapterLabel = entry.verses
    ? `Chapter ${entry.chapters}, v. ${entry.verses}`
    : `Chapter ${entry.chapters}`;

  const notesPreview = entry.notes
    ? extractPlainText(entry.notes).slice(0, 150)
    : "";

  // Determine notes link URL for friend/public variants
  const notesUrl = isFriend && friendEntry
    ? `/u/${friendEntry.user.username}/notes/${entry.id}`
    : isPublic
      ? `/u/${(props as PublicEntryCardProps).username}/notes/${entry.id}`
      : null;

  // Public variant shows formatted date
  const formattedDate = isPublic
    ? new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="flex items-stretch">
          {/* Left accent strip */}
          <div className="w-1 bg-emerald-400 shrink-0 group-hover:bg-emerald-500 transition-colors" />

          <div className="flex-1 p-4 pl-4">
            {/* Friend author row */}
            {isFriend && friendEntry && (
              <div className="flex items-center justify-between mb-2">
                <Link
                  href={`/u/${friendEntry.user.username}`}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {friendEntry.user.firstName} {friendEntry.user.lastName}
                </Link>
                <span className="text-xs text-stone-400">
                  {timeAgo(entry.date)}
                </span>
              </div>
            )}

            {/* Header: book + chapter, actions on right */}
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-[1.1rem] leading-tight text-stone-900 truncate">
                  {entry.book}
                </h3>
                <p className="text-sm text-emerald-700/80 font-medium mt-0.5 flex items-center gap-1.5">
                  <BookOpen size={13} className="shrink-0 text-emerald-500/70" />
                  {chapterLabel}
                </p>
              </div>
              {isOwn && (
                <div className="flex items-center gap-0.5 shrink-0 hover-actions">
                  <button
                    type="button"
                    onClick={() => (props as OwnEntryCardProps).onEdit(entry as ReadingEntry)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Date for public variant */}
            {isPublic && formattedDate && (
              <p className="text-xs text-stone-400 mt-1.5">{formattedDate}</p>
            )}

            {/* Notes preview */}
            {notesPreview && (
              notesUrl ? (
                <Link
                  href={notesUrl}
                  className="block mt-3 pt-3 border-t border-stone-100 group/notes"
                >
                  <p className="text-stone-500 text-[0.8rem] leading-relaxed line-clamp-2 group-hover/notes:text-stone-700 transition-colors">
                    {notesPreview}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-emerald-600/70 group-hover/notes:text-emerald-600 transition-colors">
                    Read notes <ChevronRight size={11} />
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowViewer(true)}
                  className="w-full text-left mt-3 pt-3 border-t border-stone-100 group/notes cursor-pointer"
                >
                  <p className="text-stone-500 text-[0.8rem] leading-relaxed line-clamp-2 group-hover/notes:text-stone-700 transition-colors">
                    {notesPreview}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-emerald-600/70 group-hover/notes:text-emerald-600 transition-colors">
                    Read notes <ChevronRight size={11} />
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Own entry: in-place viewer modal */}
      {isOwn && (
        <NotesViewer
          isOpen={showViewer}
          notes={entry.notes ?? ""}
          onClose={() => setShowViewer(false)}
          onSave={(props as OwnEntryCardProps).onUpdateNotes
            ? (notes) => (props as OwnEntryCardProps).onUpdateNotes!(entry.id, notes)
            : undefined}
          shareUrl={(props as OwnEntryCardProps).username
            ? `/u/${(props as OwnEntryCardProps).username}/notes/${entry.id}`
            : undefined}
          context={{
            label: entry.book,
            badges: [
              { text: `Ch ${entry.chapters}`, icon: "chapter" as const, color: "emerald" as const },
              ...(entry.verses ? [{ text: `v. ${entry.verses}`, icon: "verse" as const, color: "amber" as const }] : []),
            ],
          }}
        />
      )}

      {/* Own entry: delete confirmation */}
      {isOwn && (
        <Modal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          title="Delete Entry"
        >
          <p className="text-stone-600 mb-2">
            Are you sure you want to delete this entry?
          </p>
          <p className="text-sm text-stone-500 mb-6">
            <span className="font-semibold">{entry.book}</span> Ch {entry.chapters}
            {entry.verses && ` : ${entry.verses}`}
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setShowConfirm(false);
                (props as OwnEntryCardProps).onDelete(entry.id);
              }}
              icon={Trash2}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
