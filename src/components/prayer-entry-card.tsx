"use client";

import { useState } from "react";
import { Pencil, Trash2, BookOpen, HandHeart, ChevronDown } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { NotesViewer } from "@/components/notes-viewer";
import { extractPlainText } from "@/lib/notes";
import { PRAYER_CATEGORY_COLORS, PRAYER_CATEGORY_LABELS } from "@/lib/constants";
import type { Prayer } from "@/lib/types";

interface PrayerEntryCardProps {
  prayer: Prayer;
  onEdit: (prayer: Prayer) => void;
  onDelete: (id: string) => void;
}

export function PrayerEntryCard({ prayer, onEdit, onDelete }: PrayerEntryCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  const contentPreview = prayer.content
    ? extractPlainText(prayer.content).slice(0, 150)
    : "";

  return (
    <>
      <div className="group bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <HandHeart size={14} className="text-stone-400 shrink-0" />
              <h3 className="font-serif font-bold text-lg text-stone-900 truncate">
                {prayer.title}
              </h3>
            </div>
            <span
              className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md ${PRAYER_CATEGORY_COLORS[prayer.category]}`}
            >
              {PRAYER_CATEGORY_LABELS[prayer.category]}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(prayer)}
              className="p-1.5 text-stone-300 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {contentPreview && (
          <button
            type="button"
            onClick={() => setShowViewer(true)}
            className="w-full text-left relative pl-4 mt-3 group/notes cursor-pointer"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-200 rounded-full group-hover/notes:bg-emerald-400 transition-colors" />
            <p className="text-stone-600 text-sm leading-relaxed italic line-clamp-2 group-hover/notes:text-stone-800 transition-colors">
              &ldquo;{contentPreview}&rdquo;
            </p>
            <span className="flex items-center gap-1 mt-1.5 text-xs text-stone-400 group-hover/notes:text-emerald-600 transition-colors">
              Read more <ChevronDown size={12} />
            </span>
          </button>
        )}

        {prayer.scriptureReference && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-stone-400">
            <BookOpen size={12} />
            <span>{prayer.scriptureReference}</span>
          </div>
        )}
      </div>

      <NotesViewer
        isOpen={showViewer}
        notes={prayer.content}
        onClose={() => setShowViewer(false)}
        title="Prayer"
        headerContent={
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {prayer.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md ${PRAYER_CATEGORY_COLORS[prayer.category]}`}
              >
                {PRAYER_CATEGORY_LABELS[prayer.category]}
              </span>
              {prayer.scriptureReference && (
                <span className="flex items-center gap-1 text-xs text-stone-500">
                  <BookOpen size={12} />
                  {prayer.scriptureReference}
                </span>
              )}
            </div>
          </div>
        }
      />

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Delete Prayer"
      >
        <p className="text-stone-600 mb-2">
          Are you sure you want to delete this prayer?
        </p>
        <p className="text-sm text-stone-500 mb-6 font-semibold">
          {prayer.title}
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
              onDelete(prayer.id);
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
