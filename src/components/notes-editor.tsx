"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const NotesEditorOverlay = dynamic(
  () =>
    import("@/components/notes-editor-overlay").then(
      (mod) => mod.NotesEditorOverlay
    ),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-stone-400" size={32} />
      </div>
    ),
  }
);

interface NotesEditorProps {
  isOpen: boolean;
  initialNotes: string;
  onSave: (notes: string) => void;
  onCancel: () => void;
}

export function NotesEditor({
  isOpen,
  initialNotes,
  onSave,
  onCancel,
}: NotesEditorProps) {
  // Only render the dynamic import when the overlay is open
  if (!isOpen) return null;

  return (
    <NotesEditorOverlay
      isOpen={isOpen}
      initialNotes={initialNotes}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}
