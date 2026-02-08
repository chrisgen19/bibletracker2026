export interface ReadingEntry {
  id: number;
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
