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
}

export interface FriendUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  isFollowing: boolean;
}

export interface FriendsActivityEntry {
  id: string;
  date: string;
  book: string;
  chapters: string;
  verses: string;
  user: {
    username: string;
    firstName: string;
    lastName: string;
  };
}
