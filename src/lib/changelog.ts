export const APP_VERSION = "0.6.0";

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
    version: "0.6.0",
    date: "2026-03-02",
    changes: [
      { type: "feat", description: "3-level prayer visibility: Private, Followers, and Public" },
      { type: "feat", description: "Community prayers feed with shared prayer requests from followed users" },
      { type: "feat", description: "'I Prayed For You' support button with optimistic UI" },
      { type: "feat", description: "Prayer detail page with supporter list at /u/[username]/prayers/[id]" },
      { type: "feat", description: "Notifications page with full history and filters at /notifications" },
      { type: "fix", description: "Privacy leak: community feed now respects isProfilePublic setting" },
      { type: "fix", description: "FOLLOWERS access control enforced in prayForPrayer server action" },
      { type: "fix", description: "Race condition in prayer support records using atomic createMany" },
      { type: "fix", description: "Dashboard prayer cards now link to prayer detail page instead of modal" },
      { type: "fix", description: "Mobile notification link taps no longer intercepted by click-outside handler" },
    ],
  },
  {
    version: "0.5.0",
    date: "2026-03-01",
    changes: [
      { type: "feat", description: "Prayer tracking with full CRUD, categories, and calendar integration" },
      { type: "feat", description: "Prayer sharing notifications and 'Prayed For You' support system" },
      { type: "feat", description: "Prayer content viewer with clickable previews in activity log" },
      { type: "feat", description: "Terms of Service and Privacy Policy pages" },
      { type: "feat", description: "OpenGraph image and social media metadata" },
      { type: "feat", description: "Improved mobile landing page with hero visual and steps section" },
      { type: "fix", description: "Signup terms checkbox label now properly associated with input" },
      { type: "fix", description: "Legal links open in new tab" },
    ],
  },
  {
    version: "0.4.0",
    date: "2026-03-01",
    changes: [
      { type: "feat", description: "Mobile bottom sheet for activity log with swipe-up drag handle" },
      { type: "feat", description: "Redesigned dashboard stats cards with longest streak" },
      { type: "feat", description: "Streak indicator redesign with teal gradient background" },
      { type: "feat", description: "3-column stats layout on mobile" },
      { type: "fix", description: "Redirect authenticated users from guest-only pages to dashboard" },
      { type: "fix", description: "Prevent body scroll lock on desktop when bottom sheet is open" },
      { type: "fix", description: "Mobile notification bell toggle not collapsing on second tap" },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-02-28",
    changes: [
      { type: "feat", description: "Calendar swipe navigation and month picker" },
      { type: "feat", description: "Streak visualization on calendar days" },
      { type: "feat", description: "Calendar heatmap mode" },
      { type: "feat", description: "Month summary stats panel" },
      { type: "feat", description: "Week start day preference (Sunday or Monday)" },
      { type: "feat", description: "Keyboard accessibility for calendar navigation" },
      { type: "feat", description: "Email verification on signup with Resend" },
      { type: "feat", description: "Forgot password and reset password flow" },
      { type: "fix", description: "Calendar timezone parsing bug causing wrong day highlights" },
      { type: "fix", description: "Friends streak calculation moved to client-side to fix timezone mismatch" },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-02-24",
    changes: [
      { type: "feat", description: "BlockNote rich text editor for reflections with formatting toolbar" },
      { type: "feat", description: "Read-only notes viewer with full-screen overlay" },
      { type: "feat", description: "Inline edit mode for notes (no redirect to entry form)" },
      { type: "feat", description: "Shareable notes page with copy-link button" },
      { type: "feat", description: "Searchable book combobox replacing native select" },
      { type: "feat", description: "Default book field to last book read" },
      { type: "feat", description: "SVG favicon matching the logo style" },
      { type: "fix", description: "Notes preview truncation on mobile" },
      { type: "fix", description: "Activity log card height on mobile" },
      { type: "style", description: "Notion-inspired editor typography and paper canvas" },
    ],
  },
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
