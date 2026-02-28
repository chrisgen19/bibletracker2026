"use client";

import { useMemo } from "react";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
} from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/style.css";
import "@blocknote/shadcn/style.css";

import { parseNotesJson, plainTextToBlocks } from "@/lib/notes";

// Same restricted schema as notes-editor-overlay.tsx
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { audio, video, image, file, ...allowedBlockSpecs } = defaultBlockSpecs;

const schema = BlockNoteSchema.create({
  blockSpecs: allowedBlockSpecs,
  inlineContentSpecs: defaultInlineContentSpecs,
  styleSpecs: defaultStyleSpecs,
});

interface NotesBlockViewerProps {
  notes: string;
}

export function NotesBlockViewer({ notes }: NotesBlockViewerProps) {
  const initialContent = useMemo(() => {
    if (!notes) return undefined;
    const parsed = parseNotesJson(notes);
    if (parsed) return parsed;
    return plainTextToBlocks(notes);
  }, [notes]);

  const editor = useCreateBlockNote(
    {
      schema,
      initialContent: initialContent as typeof schema.PartialBlock[] | undefined,
    },
    [initialContent]
  );

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      theme="light"
      sideMenu={false}
      emojiPicker={false}
      formattingToolbar={false}
    />
  );
}
