"use client";

import { useMemo } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Code2,
  Table,
  Minus,
  ChevronRight,
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

// Restricted schema: exclude file-storage blocks (audio, video, image, file) since no S3 yet
const {
  audio: _audio,
  video: _video,
  image: _image,
  file: _file,
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
    "p-1.5 rounded-md text-stone-400 hover:text-stone-800 hover:bg-stone-100 active:bg-emerald-50 active:text-emerald-700 transition-all duration-150 cursor-pointer";

  const sep = <div className="w-px h-4 bg-stone-200 mx-1 shrink-0" />;

  const toggleStyle = (style: "bold" | "italic" | "underline" | "strike") => {
    editor.toggleStyles({ [style]: true });
    editor.focus();
  };

  const toggleBlock = (
    type: "bulletListItem" | "numberedListItem" | "checkListItem" | "toggleListItem" | "heading" | "quote" | "codeBlock",
    headingLevel?: 1 | 2 | 3
  ) => {
    const current = editor.getTextCursorPosition().block;
    if (type === "heading") {
      const isCurrentHeading =
        current.type === "heading" &&
        (current.props as { level?: number }).level === headingLevel;
      if (isCurrentHeading) {
        editor.updateBlock(current, { type: "paragraph" });
      } else {
        editor.updateBlock(current, { type: "heading", props: { level: headingLevel } } as Parameters<typeof editor.updateBlock>[1]);
      }
    } else if (current.type === type) {
      editor.updateBlock(current, { type: "paragraph" });
    } else {
      editor.updateBlock(current, { type } as Parameters<typeof editor.updateBlock>[1]);
    }
    editor.focus();
  };

  const insertBlock = (type: "table" | "divider") => {
    const current = editor.getTextCursorPosition().block;
    editor.insertBlocks(
      [{ type } as Parameters<typeof editor.insertBlocks>[0][number]],
      current,
      "after"
    );
    editor.focus();
  };

  return (
    <div className="flex items-center justify-center gap-0.5 px-3 py-1.5 overflow-x-auto">
      {/* Text styles */}
      <button type="button" className={btn} onClick={() => toggleStyle("bold")} title="Bold">
        <Bold size={16} />
      </button>
      <button type="button" className={btn} onClick={() => toggleStyle("italic")} title="Italic">
        <Italic size={16} />
      </button>
      <button type="button" className={btn} onClick={() => toggleStyle("underline")} title="Underline">
        <Underline size={16} />
      </button>
      <button type="button" className={btn} onClick={() => toggleStyle("strike")} title="Strikethrough">
        <Strikethrough size={16} />
      </button>

      {sep}

      {/* Headings */}
      <button type="button" className={btn} onClick={() => toggleBlock("heading", 1)} title="Heading 1">
        <Heading1 size={16} />
      </button>
      <button type="button" className={btn} onClick={() => toggleBlock("heading", 2)} title="Heading 2">
        <Heading2 size={16} />
      </button>
      <button type="button" className={btn} onClick={() => toggleBlock("heading", 3)} title="Heading 3">
        <Heading3 size={16} />
      </button>

      {sep}

      {/* Lists & quote */}
      <button type="button" className={btn} onClick={() => toggleBlock("bulletListItem")} title="Bullet list">
        <List size={16} />
      </button>
      <button type="button" className={btn} onClick={() => toggleBlock("numberedListItem")} title="Numbered list">
        <ListOrdered size={16} />
      </button>
      <button type="button" className={btn} onClick={() => toggleBlock("checkListItem")} title="Check list">
        <ListChecks size={16} />
      </button>
      <button type="button" className={btn} onClick={() => toggleBlock("quote")} title="Quote">
        <Quote size={16} />
      </button>

      {sep}

      {/* Blocks */}
      <button type="button" className={btn} onClick={() => toggleBlock("toggleListItem")} title="Toggle">
        <ChevronRight size={16} />
      </button>
      <button type="button" className={btn} onClick={() => toggleBlock("codeBlock")} title="Code block">
        <Code2 size={16} />
      </button>
      <button type="button" className={btn} onClick={() => insertBlock("table")} title="Table">
        <Table size={16} />
      </button>
      <button type="button" className={btn} onClick={() => insertBlock("divider")} title="Divider">
        <Minus size={16} />
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

      {/* Static toolbar — centered to match canvas width */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto">
          <Toolbar editor={editor} />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-stone-100">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-stone-200 shadow-sm min-h-full px-8 py-8">
          <BlockNoteView
            editor={editor}
            theme="light"
            sideMenu={true}
            emojiPicker={true}
            formattingToolbar={true}
          />
        </div>
      </div>
    </div>
  );
}
