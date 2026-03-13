"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, BookOpen, ChevronRight, HandHeart } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { extractPlainText } from "@/lib/notes";
import { PRAYER_CATEGORY_COLORS, PRAYER_CATEGORY_LABELS } from "@/lib/constants";
import type { Prayer } from "@/lib/types";

interface PrayerEntryCardProps {
  prayer: Prayer;
  username: string;
  onEdit: (prayer: Prayer) => void;
  onDelete: (id: string) => void;
}

export function PrayerEntryCard({ prayer, username, onEdit, onDelete }: PrayerEntryCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const contentPreview = prayer.content
    ? extractPlainText(prayer.content).slice(0, 150)
    : "";

  const hasLink = !!username;

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="flex items-stretch">
          {/* Left accent strip — amber for prayers */}
          <div className="w-1 bg-amber-400 shrink-0 group-hover:bg-amber-500 transition-colors" />

          <div className="flex-1 p-4 pl-4">
            {/* Header: title + category stacked, actions on right */}
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <HandHeart size={13} className="shrink-0 text-amber-500/70" />
                  {hasLink ? (
                    <Link
                      href={`/u/${username}/prayers/${prayer.id}`}
                      className="font-serif font-bold text-[1.1rem] leading-tight text-stone-900 truncate hover:text-emerald-700 transition-colors"
                    >
                      {prayer.title}
                    </Link>
                  ) : (
                    <h3 className="font-serif font-bold text-[1.1rem] leading-tight text-stone-900 truncate">
                      {prayer.title}
                    </h3>
                  )}
                </div>
                <p className="mt-0.5 ml-[21px]">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-md ${PRAYER_CATEGORY_COLORS[prayer.category]}`}
                  >
                    {PRAYER_CATEGORY_LABELS[prayer.category]}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0 hover-actions">
                <button
                  type="button"
                  onClick={() => onEdit(prayer)}
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
            </div>

            {/* Content preview */}
            {contentPreview && (
              hasLink ? (
                <Link
                  href={`/u/${username}/prayers/${prayer.id}`}
                  className="block mt-3 pt-3 border-t border-stone-100 group/notes"
                >
                  <p className="text-stone-500 text-[0.8rem] leading-relaxed line-clamp-2 group-hover/notes:text-stone-700 transition-colors">
                    {contentPreview}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-amber-600/70 group-hover/notes:text-amber-600 transition-colors">
                    View prayer <ChevronRight size={11} />
                  </span>
                </Link>
              ) : (
                <div className="mt-3 pt-3 border-t border-stone-100">
                  <p className="text-stone-500 text-[0.8rem] leading-relaxed line-clamp-2">
                    {contentPreview}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-amber-600/70">
                    View prayer <ChevronRight size={11} />
                  </span>
                </div>
              )
            )}

            {/* Scripture reference */}
            {prayer.scriptureReference && (
              <div className="flex items-center gap-1.5 mt-3 text-xs text-stone-400">
                <BookOpen size={12} />
                <span>{prayer.scriptureReference}</span>
              </div>
            )}
          </div>
        </div>
      </div>

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
