export const APP_VERSION = "0.1.0";

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: "feat" | "fix" | "style";
    description: string;
  }[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "0.1.0",
    date: "2026-02-11",
    changes: [
      { type: "feat", description: "Calendar missed days highlight with toggle setting" },
      { type: "feat", description: "Display notes on friend activity entries" },
      { type: "feat", description: "Friends activity load more pagination (6 cards at a time)" },
      { type: "feat", description: "Version footer and changelog page" },
      { type: "fix", description: "Sync entry ID after creation to prevent delete failure" },
      { type: "fix", description: "Production database migration for show_missed_days" },
      { type: "style", description: "Make edit and delete buttons always visible for touch screens" },
    ],
  },
];
