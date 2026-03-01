"use client";

import { useState } from "react";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { NotesViewer } from "@/components/notes-viewer";
import { extractPlainText } from "@/lib/notes";
import type { ReadingEntry } from "@/lib/types";

interface EntryCardProps {
  entry: ReadingEntry;
  username: string;
  onEdit: (entry: ReadingEntry) => void;
  onDelete: (id: string) => void;
  onUpdateNotes?: (entryId: string, notes: string) => void;
}

export function EntryCard({ entry, username, onEdit, onDelete, onUpdateNotes }: EntryCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  return (
    <>
      <div className="group bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-lg text-stone-900">
              {entry.book}
            </span>
            <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md text-sm">
              Ch {entry.chapters} {entry.verses && `: ${entry.verses}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(entry)}
              className="p-1.5 text-stone-300 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {entry.notes && (
          <button
            type="button"
            onClick={() => setShowViewer(true)}
            className="w-full text-left relative pl-4 mt-3 group/notes cursor-pointer"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-200 rounded-full group-hover/notes:bg-emerald-400 transition-colors" />
            <p className="text-stone-600 text-sm leading-relaxed italic line-clamp-2 group-hover/notes:text-stone-800 transition-colors">
              &ldquo;{extractPlainText(entry.notes).slice(0, 150)}&rdquo;
            </p>
            <span className="flex items-center gap-1 mt-1.5 text-xs text-stone-400 group-hover/notes:text-emerald-600 transition-colors">
              Read more <ChevronDown size={12} />
            </span>
          </button>
        )}
      </div>

      <NotesViewer
        isOpen={showViewer}
        notes={entry.notes ?? ""}
        onClose={() => setShowViewer(false)}
        onSave={onUpdateNotes ? (notes) => onUpdateNotes(entry.id, notes) : undefined}
        shareUrl={username ? `/u/${username}/notes/${entry.id}` : undefined}
      />

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
              onDelete(entry.id);
            }}
            icon={Trash2}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
