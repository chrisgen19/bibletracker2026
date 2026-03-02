export interface ReadingEntry {
  id: string;
  date: string;
  book: string;
  chapters: string;
  verses: string;
  notes: string;
}

export interface EntryFormData {
  book: string;
  chapters: string;
  verses: string;
  notes: string;
}

export interface Stats {
  totalEntries: number;
  booksRead: number;
  currentStreak: number;
  longestStreak: number;
  readingDays: number;
}

export interface FriendUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  isFollowing: boolean;
}

export interface NotificationItem {
  id: string;
  type: "FOLLOW" | "PRAYER_SHARED" | "PRAYED_FOR";
  read: boolean;
  createdAt: string;
  actor: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    isFollowing: boolean;
  };
  prayer?: {
    id: string;
    title: string;
    hasPrayed?: boolean;
  };
}

export type PrayerCategory =
  | "PERSONAL"
  | "FAMILY"
  | "FRIENDS"
  | "CHURCH"
  | "MISSIONS"
  | "HEALTH"
  | "WORK"
  | "OTHER";

export type PrayerStatus = "ACTIVE" | "ANSWERED" | "NO_LONGER_PRAYING";

export type PrayerVisibility = "PRIVATE" | "FOLLOWERS" | "PUBLIC";

export interface Prayer {
  id: string;
  date: string;
  title: string;
  content: string;
  category: PrayerCategory;
  status: PrayerStatus;
  answeredAt: string | null;
  answeredNote: string | null;
  scriptureReference: string | null;
  visibility: PrayerVisibility;
  supportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerFormData {
  title: string;
  content: string;
  category: PrayerCategory;
  scriptureReference: string;
  visibility: PrayerVisibility;
}

export interface PrayerSupporter {
  id: string;
  firstName: string;
  lastName: string;
}

export interface PublicPrayer extends Prayer {
  user: { id: string; username: string; firstName: string; lastName: string };
  hasPrayed: boolean;
  supporters: PrayerSupporter[];
}

export interface FriendsActivityEntry {
  id: string;
  date: string;
  book: string;
  chapters: string;
  verses: string;
  notes: string;
  user: {
    username: string;
    firstName: string;
    lastName: string;
  };
}
