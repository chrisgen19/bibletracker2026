"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { ReadingEntry } from "@/lib/types";

interface EntryCardProps {
  entry: ReadingEntry;
  onEdit: (entry: ReadingEntry) => void;
  onDelete: (id: string) => void;
}

export function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

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
          <div className="relative pl-4 mt-3">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-200 rounded-full" />
            <p className="text-stone-600 text-sm leading-relaxed italic line-clamp-2">
              &ldquo;{entry.notes}&rdquo;
            </p>
          </div>
        )}
      </div>

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
