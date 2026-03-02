"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { Prayer } from "@/lib/types";

interface PrayerCardActionsProps {
  prayer: Prayer;
  onEdit: (prayer: Prayer) => void;
  onDelete: (id: string) => void;
  onMarkAnswered: (id: string, note?: string) => void;
  onMarkNoLongerPraying: (id: string) => void;
  onReactivate: (id: string) => void;
}

export function PrayerCardActions({
  prayer,
  onEdit,
  onDelete,
  onMarkAnswered,
  onMarkNoLongerPraying,
  onReactivate,
}: PrayerCardActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAnsweredModal, setShowAnsweredModal] = useState(false);
  const [answeredNote, setAnsweredNote] = useState("");

  return (
    <>
      <div className="flex items-center gap-1 ml-2 shrink-0">
        {prayer.status === "ACTIVE" && (
          <>
            <button
              type="button"
              onClick={() => onEdit(prayer)}
              className="p-1.5 text-stone-300 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => setShowAnsweredModal(true)}
              className="p-1.5 text-stone-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Mark as Answered"
            >
              <CheckCircle2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => onMarkNoLongerPraying(prayer.id)}
              className="p-1.5 text-stone-300 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              title="No Longer Praying"
            >
              <XCircle size={14} />
            </button>
          </>
        )}
        {prayer.status !== "ACTIVE" && (
          <button
            type="button"
            onClick={() => onReactivate(prayer.id)}
            className="p-1.5 text-stone-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Reactivate"
          >
            <RotateCcw size={14} />
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Delete confirmation */}
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

      {/* Mark as Answered modal */}
      <Modal
        isOpen={showAnsweredModal}
        onClose={() => {
          setShowAnsweredModal(false);
          setAnsweredNote("");
        }}
        title="Prayer Answered"
      >
        <p className="text-stone-600 mb-4">
          How did God answer this prayer?
        </p>
        <textarea
          value={answeredNote}
          onChange={(e) => setAnsweredNote(e.target.value)}
          placeholder="Share how this prayer was answered... (optional)"
          className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none placeholder:text-stone-300 min-h-[100px] resize-none"
        />
        <div className="flex gap-3 mt-4">
          <Button
            variant="secondary"
            onClick={() => {
              setShowAnsweredModal(false);
              setAnsweredNote("");
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onMarkAnswered(prayer.id, answeredNote || undefined);
              setShowAnsweredModal(false);
              setAnsweredNote("");
            }}
            icon={CheckCircle2}
            className="flex-1"
          >
            Mark Answered
          </Button>
        </div>
      </Modal>
    </>
  );
}
