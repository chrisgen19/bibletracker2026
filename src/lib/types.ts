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
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerFormData {
  title: string;
  content: string;
  category: PrayerCategory;
  scriptureReference: string;
  isPublic: boolean;
}

export interface PublicPrayer extends Prayer {
  user: { id: string; username: string; firstName: string; lastName: string };
  supportCount: number;
  hasPrayed: boolean;
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
