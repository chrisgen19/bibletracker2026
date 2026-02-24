"use client";

import { useMemo } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading2,
} from "lucide-react";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
} from "@blocknote/core";
import type { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/style.css";
import "@blocknote/shadcn/style.css";

import { parseNotesJson, plainTextToBlocks, serializeNotes } from "@/lib/notes";

// Restricted schema: only paragraph, heading, bulletListItem, numberedListItem, quote, checkListItem
const {
  audio: _audio,
  video: _video,
  image: _image,
  file: _file,
  table: _table,
  codeBlock: _codeBlock,
  divider: _divider,
  toggleListItem: _toggleListItem,
  ...allowedBlockSpecs
} = defaultBlockSpecs;

const schema = BlockNoteSchema.create({
  blockSpecs: allowedBlockSpecs,
  inlineContentSpecs: defaultInlineContentSpecs,
  styleSpecs: defaultStyleSpecs,
});

type EditorType = typeof schema extends BlockNoteSchema<infer B, infer I, infer S>
  ? BlockNoteEditor<B, I, S>
  : never;

/** Static formatting toolbar — always visible above the editor */
function Toolbar({ editor }: { editor: EditorType }) {
  const btn =
    "p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 active:bg-stone-200 transition-colors";

  const toggleStyle = (style: "bold" | "italic" | "underline") => {
    editor.toggleStyles({ [style]: true });
    editor.focus();
  };

  const toggleBlock = (type: "bulletListItem" | "numberedListItem" | "heading" | "quote") => {
    const current = editor.getTextCursorPosition().block;
    if (current.type === type) {
      editor.updateBlock(current, { type: "paragraph" });
    } else if (type === "heading") {
      editor.updateBlock(current, { type: "heading", props: { level: 2 } } as Parameters<typeof editor.updateBlock>[1]);
    } else {
      editor.updateBlock(current, { type } as Parameters<typeof editor.updateBlock>[1]);
    }
    editor.focus();
  };

  return (
    <div className="flex items-center gap-0.5 px-4 py-2 border-b border-stone-200 bg-white overflow-x-auto">
      <button type="button" className={btn} onClick={() => toggleStyle("bold")} title="Bold">
        <Bold size={18} />
      </button>
      <button type="button" className={btn} onClick={() => toggleStyle("italic")} title="Italic">
        <Italic size={18} />
      </button>
      <button type="button" className={btn} onClick={() => toggleStyle("underline")} title="Underline">
        <Underline size={18} />
      </button>

      <div className="w-px h-5 bg-stone-200 mx-1" />

      <button type="button" className={btn} onClick={() => toggleBlock("heading")} title="Heading">
        <Heading2 size={18} />
      </button>
      <button type="button" className={btn} onClick={() => toggleBlock("bulletListItem")} title="Bullet list">
        <List size={18} />
      </button>
      <button type="button" className={btn} onClick={() => toggleBlock("numberedListItem")} title="Numbered list">
        <ListOrdered size={18} />
      </button>
      <button type="button" className={btn} onClick={() => toggleBlock("quote")} title="Quote">
        <Quote size={18} />
      </button>
    </div>
  );
}

interface NotesEditorOverlayProps {
  isOpen: boolean;
  initialNotes: string;
  onSave: (notes: string) => void;
  onCancel: () => void;
}

export function NotesEditorOverlay({
  isOpen,
  initialNotes,
  onSave,
  onCancel,
}: NotesEditorOverlayProps) {
  const initialContent = useMemo(() => {
    if (!initialNotes) return undefined;
    const parsed = parseNotesJson(initialNotes);
    if (parsed) return parsed;
    // Legacy plain text → paragraph blocks
    return plainTextToBlocks(initialNotes);
  }, [initialNotes]);

  const editor = useCreateBlockNote(
    {
      schema,
      initialContent: initialContent as typeof schema.PartialBlock[] | undefined,
    },
    [initialContent]
  );

  if (!isOpen) return null;

  const handleSave = () => {
    const blocks = editor.document;
    // If editor is empty (single empty paragraph), save empty string
    const hasContent = blocks.some((block) => {
      if (!block.content || !Array.isArray(block.content)) return false;
      return (block.content as Array<{ text?: string }>).some(
        (ic) => ic.text && ic.text.trim().length > 0
      );
    });
    onSave(hasContent ? serializeNotes(blocks) : "");
  };

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-stone-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-white">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors px-3 py-1.5"
        >
          Cancel
        </button>
        <h2 className="text-base font-serif font-bold text-stone-900">
          Reflection
        </h2>
        <button
          type="button"
          onClick={handleSave}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-1.5"
        >
          Done
        </button>
      </div>

      {/* Static toolbar */}
      <Toolbar editor={editor} />

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <BlockNoteView
            editor={editor}
            theme="light"
            sideMenu={false}
            emojiPicker={false}
            formattingToolbar={false}
          />
        </div>
      </div>
    </div>
  );
}
