import type { Block } from "@blocknote/core";

/**
 * Detect whether a notes string is BlockNote JSON or legacy plain text.
 * Returns parsed Block[] if JSON, null if plain text.
 */
export const parseNotesJson = (notes: string): Block[] | null => {
  if (!notes || !notes.startsWith("[")) return null;
  try {
    return JSON.parse(notes) as Block[];
  } catch {
    return null;
  }
};

/**
 * Extract plain text from a notes string (BlockNote JSON or legacy plain text).
 * Used for card previews and anywhere we need a text-only representation.
 */
export const extractPlainText = (notes: string): string => {
  const blocks = parseNotesJson(notes);
  if (!blocks) return notes;

  const extractFromBlock = (block: Block): string => {
    const inlineText =
      block.content && Array.isArray(block.content)
        ? (block.content as Array<{ type: string; text?: string }>)
            .filter((ic) => ic.type === "text" && ic.text)
            .map((ic) => ic.text)
            .join("")
        : "";

    const childrenText =
      block.children && block.children.length > 0
        ? block.children.map(extractFromBlock).join("\n")
        : "";

    return [inlineText, childrenText].filter(Boolean).join("\n");
  };

  return blocks.map(extractFromBlock).join("\n").trim();
};

/** Serialize Block[] to a JSON string for storage. */
export const serializeNotes = (blocks: Block[]): string =>
  JSON.stringify(blocks);

/**
 * Convert legacy plain text to BlockNote paragraph blocks for editing.
 * Each non-empty line becomes a separate paragraph block.
 */
export const plainTextToBlocks = (text: string): Block[] => {
  const lines = text.split("\n");
  return lines.map(
    (line) =>
      ({
        type: "paragraph",
        content: line
          ? [{ type: "text", text: line, styles: {} }]
          : [],
        children: [],
      }) as unknown as Block
  );
};
