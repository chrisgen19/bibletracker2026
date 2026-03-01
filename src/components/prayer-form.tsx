"use client";

import { useState } from "react";
import { Check, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { NotesEditor } from "@/components/notes-editor";
import { extractPlainText } from "@/lib/notes";
import type { PrayerFormData, PrayerCategory } from "@/lib/types";

const CATEGORY_OPTIONS: { value: PrayerCategory; label: string }[] = [
  { value: "PERSONAL", label: "Personal" },
  { value: "FAMILY", label: "Family" },
  { value: "FRIENDS", label: "Friends" },
  { value: "CHURCH", label: "Church" },
  { value: "MISSIONS", label: "Missions" },
  { value: "HEALTH", label: "Health" },
  { value: "WORK", label: "Work" },
  { value: "OTHER", label: "Other" },
];

interface PrayerFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: PrayerFormData;
  onFormChange: (data: PrayerFormData) => void;
  onSave: () => void;
  isEditing?: boolean;
}

export function PrayerForm({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSave,
  isEditing = false,
}: PrayerFormProps) {
  const [notesEditorOpen, setNotesEditorOpen] = useState(false);

  const contentPreview = formData.content
    ? extractPlainText(formData.content)
    : "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Prayer" : "Log Prayer"}>
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Title
          </label>
          <input
            type="text"
            placeholder="What are you praying for?"
            value={formData.title}
            onChange={(e) =>
              onFormChange({ ...formData, title: e.target.value })
            }
            className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none placeholder:text-stone-300"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              onFormChange({
                ...formData,
                category: e.target.value as PrayerCategory,
              })
            }
            className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none appearance-none"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Prayer Content{" "}
            <span className="text-stone-300 font-normal normal-case">
              (Optional)
            </span>
          </label>
          <button
            type="button"
            onClick={() => setNotesEditorOpen(true)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-left min-h-[6rem] flex items-start gap-2 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            {contentPreview ? (
              <p className="text-stone-900 text-sm leading-relaxed line-clamp-4 flex-1">
                {contentPreview}
              </p>
            ) : (
              <span className="text-stone-300 text-sm flex items-center gap-2">
                <PenLine size={14} />
                Tap to add prayer details...
              </span>
            )}
          </button>
          <NotesEditor
            isOpen={notesEditorOpen}
            initialNotes={formData.content}
            onSave={(content) => {
              onFormChange({ ...formData, content });
              setNotesEditorOpen(false);
            }}
            onCancel={() => setNotesEditorOpen(false)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Scripture Reference{" "}
            <span className="text-stone-300 font-normal normal-case">
              (Optional)
            </span>
          </label>
          <input
            type="text"
            placeholder="e.g. Philippians 4:6"
            value={formData.scriptureReference}
            onChange={(e) =>
              onFormChange({
                ...formData,
                scriptureReference: e.target.value,
              })
            }
            className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none placeholder:text-stone-300"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isPublic}
            onChange={(e) =>
              onFormChange({ ...formData, isPublic: e.target.checked })
            }
            className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
          />
          <span className="text-sm text-stone-600">
            Make this prayer public
          </span>
        </label>

        <div className="pt-2">
          <Button onClick={onSave} className="w-full py-3 text-lg" icon={Check}>
            {isEditing ? "Update Prayer" : "Save Prayer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
