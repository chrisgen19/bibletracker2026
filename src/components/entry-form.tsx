import { ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BIBLE_BOOKS } from "@/lib/constants";
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Entry" : "Log Reading"}>
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Book
          </label>
          <div className="relative">
            <select
              value={formData.book}
              onChange={(e) =>
                onFormChange({ ...formData, book: e.target.value })
              }
              className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-lg font-serif font-medium rounded-xl p-3 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none appearance-none cursor-pointer"
            >
              {BIBLE_BOOKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              <ChevronRight className="rotate-90" size={18} />
            </div>
          </div>
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
          <textarea
            rows={4}
            placeholder="What did you learn today?"
            value={formData.notes}
            onChange={(e) =>
              onFormChange({ ...formData, notes: e.target.value })
            }
            className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none placeholder:text-stone-300 resize-none"
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
