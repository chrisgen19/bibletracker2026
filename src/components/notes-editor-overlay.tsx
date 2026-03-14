"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
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
  ArrowLeft,
  Pencil,
  Link as LinkIcon,
  Check,
  BookOpenText,
  Hash,
  Calendar,
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { audio, video, image, file, ...allowedBlockSpecs } = defaultBlockSpecs;

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

/** Contextual metadata displayed below the header */
interface EditorContext {
  /** Primary label — book name or prayer title */
  label: string;
  /** Badges shown as pills next to the label */
  badges?: Array<{
    text: string;
    icon?: "chapter" | "verse" | "category";
    color?: "emerald" | "amber" | "stone";
  }>;
  /** Date to display */
  date?: string;
}

interface NotesEditorOverlayProps {
  isOpen: boolean;
  initialNotes: string;
  onSave: (notes: string) => void;
  onCancel: () => void;
  mode?: "view" | "edit";
  onEdit?: () => void;
  /** When provided, shows a "Copy Link" button in view mode */
  shareUrl?: string;
  /** Header title — defaults to "Reflection" */
  title?: string;
  /** Extra content rendered below the header bar in view mode (e.g. prayer metadata) */
  headerContent?: ReactNode;
  /** Contextual metadata: book/chapter/verse or prayer title/category */
  context?: EditorContext;
}

export function NotesEditorOverlay({
  isOpen,
  initialNotes,
  onSave,
  onCancel,
  mode = "edit",
  onEdit,
  shareUrl,
  title = "Reflection",
  headerContent,
  context,
}: NotesEditorOverlayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(() => {
    if (!shareUrl) return;
    const fullUrl = `${window.location.origin}${shareUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrl]);
  // Lock body scroll when overlay is open to prevent double scrollbar
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const initialContent = useMemo(() => {
    if (!initialNotes) return undefined;
    const parsed = parseNotesJson(initialNotes);
    if (parsed) return parsed;
    // Legacy plain text → paragraph blocks
    return plainTextToBlocks(initialNotes);
  }, [initialNotes]);

  const isViewMode = mode === "view";

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

  const formattedDate = context?.date
    ? new Date(context.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-stone-50">
      {/* Header bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="flex items-center justify-between px-4 py-3">
          {isViewMode ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors px-3 py-1.5"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <h2 className="text-base font-serif font-bold text-stone-900">
                {title}
              </h2>
              <div className="flex items-center gap-1">
                {shareUrl && (
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors px-2 py-1.5"
                    title="Copy shareable link"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <LinkIcon size={14} />}
                    <span className={copied ? "text-emerald-600" : ""}>{copied ? "Copied" : "Share"}</span>
                  </button>
                )}
                {onEdit ? (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors px-2 py-1.5"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                ) : (
                  !shareUrl && <div className="px-3 py-1.5 w-[60px]" />
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors px-3 py-1.5"
              >
                Cancel
              </button>
              <h2 className="text-base font-serif font-bold text-stone-900">
                {title}
              </h2>
              <button
                type="button"
                onClick={handleSave}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-1.5"
              >
                Done
              </button>
            </>
          )}
        </div>

        {/* Context banner — shows reading/prayer metadata */}
        {context && (
          <div className="px-4 pb-3">
            <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-2 px-1">
              <span className="font-serif font-bold text-stone-800 text-sm">
                {context.label}
              </span>
              {context.badges?.map((badge, i) => {
                const colorMap = {
                  emerald: "bg-emerald-50 text-emerald-700",
                  amber: "bg-amber-50 text-amber-700",
                  stone: "bg-stone-100 text-stone-600",
                };
                const iconMap = {
                  chapter: <BookOpenText size={11} />,
                  verse: <Hash size={11} />,
                  category: null,
                };
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${colorMap[badge.color ?? "stone"]}`}
                  >
                    {badge.icon && iconMap[badge.icon]}
                    {badge.text}
                  </span>
                );
              })}
              {formattedDate && (
                <>
                  <span className="text-stone-300">|</span>
                  <span className="inline-flex items-center gap-1 text-xs text-stone-400">
                    <Calendar size={11} />
                    {formattedDate}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Static toolbar — centered to match canvas width (edit mode only) */}
      {!isViewMode && (
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-4xl mx-auto">
            <Toolbar editor={editor} />
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-0 sm:px-4 py-0 sm:py-6 bg-white sm:bg-stone-100">
        <div className="max-w-4xl mx-auto bg-white sm:rounded-lg sm:border sm:border-stone-200 sm:shadow-sm min-h-full px-4 sm:px-8 py-4 sm:py-8">
          {isViewMode && headerContent && (
            <div className="mb-4 pb-4 border-b border-stone-100">
              {headerContent}
            </div>
          )}
          <BlockNoteView
            editor={editor}
            editable={!isViewMode}
            theme="light"
            sideMenu={!isViewMode}
            emojiPicker={!isViewMode}
            formattingToolbar={!isViewMode}
          />
        </div>
      </div>
    </div>
  );
}
