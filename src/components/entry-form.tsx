"use client";

import { useState } from "react";
import { Check, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookSelector } from "@/components/ui/book-selector";
import { Modal } from "@/components/ui/modal";
import { NotesEditor } from "@/components/notes-editor";
import { BIBLE_BOOKS } from "@/lib/constants";
import { extractPlainText } from "@/lib/notes";
import type { EntryFormData } from "@/lib/types";

interface EntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: EntryFormData;
  onFormChange: (data: EntryFormData) => void;
  onSave: () => void;
  isEditing?: boolean;
}

export function EntryForm({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSave,
  isEditing = false,
}: EntryFormProps) {
  const [notesEditorOpen, setNotesEditorOpen] = useState(false);

  const notesPreview = formData.notes
    ? extractPlainText(formData.notes)
    : "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Entry" : "Log Reading"}>
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Book
          </label>
          <BookSelector
            value={formData.book}
            onChange={(book) => onFormChange({ ...formData, book })}
            books={BIBLE_BOOKS}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Chapters
            </label>
            <input
              type="text"
              placeholder="e.g. 1-3"
              value={formData.chapters}
              onChange={(e) =>
                onFormChange({ ...formData, chapters: e.target.value })
              }
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none placeholder:text-stone-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Verses{" "}
              <span className="text-stone-300 font-normal normal-case">
                (Optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. 1-10"
              value={formData.verses}
              onChange={(e) =>
                onFormChange({ ...formData, verses: e.target.value })
              }
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none placeholder:text-stone-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Reflection
          </label>
          <button
            type="button"
            onClick={() => setNotesEditorOpen(true)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-left min-h-[6rem] flex items-start gap-2 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            {notesPreview ? (
              <p className="text-stone-900 text-sm leading-relaxed line-clamp-4 flex-1">
                {notesPreview}
              </p>
            ) : (
              <span className="text-stone-300 text-sm flex items-center gap-2">
                <PenLine size={14} />
                Tap to add a reflection...
              </span>
            )}
          </button>
          <NotesEditor
            isOpen={notesEditorOpen}
            initialNotes={formData.notes}
            onSave={(notes) => {
              onFormChange({ ...formData, notes });
              setNotesEditorOpen(false);
            }}
            onCancel={() => setNotesEditorOpen(false)}
          />
        </div>

        <div className="pt-2">
          <Button onClick={onSave} className="w-full py-3 text-lg" icon={Check}>
            {isEditing ? "Update Entry" : "Save Entry"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
