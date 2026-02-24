"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
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

interface NotesViewerProps {
  isOpen: boolean;
  notes: string;
  onClose: () => void;
  /** When provided, shows an "Edit" button and saves directly */
  onSave?: (notes: string) => void;
}

export function NotesViewer({
  isOpen,
  notes,
  onClose,
  onSave,
}: NotesViewerProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");

  if (!isOpen) return null;

  const handleClose = () => {
    setMode("view");
    onClose();
  };

  const handleSave = (updatedNotes: string) => {
    onSave?.(updatedNotes);
    setMode("view");
    onClose();
  };

  // Portal to document.body to escape containers with backdrop-filter/transform
  // that create new containing blocks and trap fixed positioning
  return createPortal(
    <NotesEditorOverlay
      isOpen={isOpen}
      initialNotes={notes}
      onSave={handleSave}
      onCancel={handleClose}
      mode={mode}
      onEdit={onSave ? () => setMode("edit") : undefined}
    />,
    document.body
  );
}
