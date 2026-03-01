export const BIBLE_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah",
  "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians",
  "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation",
] as const;

export const BOOK_ABBREVIATIONS: Record<string, string> = {
  "Genesis": "Gen",
  "Exodus": "Exod",
  "Leviticus": "Lev",
  "Numbers": "Num",
  "Deuteronomy": "Deut",
  "Joshua": "Josh",
  "Judges": "Judg",
  "Ruth": "Ruth",
  "1 Samuel": "1 Sam",
  "2 Samuel": "2 Sam",
  "1 Kings": "1 Kgs",
  "2 Kings": "2 Kgs",
  "1 Chronicles": "1 Chr",
  "2 Chronicles": "2 Chr",
  "Ezra": "Ezra",
  "Nehemiah": "Neh",
  "Esther": "Esth",
  "Job": "Job",
  "Psalms": "Ps",
  "Proverbs": "Prov",
  "Ecclesiastes": "Eccl",
  "Song of Solomon": "Song",
  "Isaiah": "Isa",
  "Jeremiah": "Jer",
  "Lamentations": "Lam",
  "Ezekiel": "Ezek",
  "Daniel": "Dan",
  "Hosea": "Hos",
  "Joel": "Joel",
  "Amos": "Amos",
  "Obadiah": "Obad",
  "Jonah": "Jonah",
  "Micah": "Mic",
  "Nahum": "Nah",
  "Habakkuk": "Hab",
  "Zephaniah": "Zeph",
  "Haggai": "Hag",
  "Zechariah": "Zech",
  "Malachi": "Mal",
  "Matthew": "Matt",
  "Mark": "Mark",
  "Luke": "Luke",
  "John": "John",
  "Acts": "Acts",
  "Romans": "Rom",
  "1 Corinthians": "1 Cor",
  "2 Corinthians": "2 Cor",
  "Galatians": "Gal",
  "Ephesians": "Eph",
  "Philippians": "Phil",
  "Colossians": "Col",
  "1 Thessalonians": "1 Thess",
  "2 Thessalonians": "2 Thess",
  "1 Timothy": "1 Tim",
  "2 Timothy": "2 Tim",
  "Titus": "Titus",
  "Philemon": "Phlm",
  "Hebrews": "Heb",
  "James": "Jas",
  "1 Peter": "1 Pet",
  "2 Peter": "2 Pet",
  "1 John": "1 John",
  "2 John": "2 John",
  "3 John": "3 John",
  "Jude": "Jude",
  "Revelation": "Rev",
};

import type { PrayerCategory } from "@/lib/types";

export const PRAYER_CATEGORY_COLORS: Record<PrayerCategory, string> = {
  PERSONAL: "bg-blue-50 text-blue-700",
  FAMILY: "bg-rose-50 text-rose-700",
  FRIENDS: "bg-violet-50 text-violet-700",
  CHURCH: "bg-amber-50 text-amber-700",
  MISSIONS: "bg-emerald-50 text-emerald-700",
  HEALTH: "bg-red-50 text-red-700",
  WORK: "bg-cyan-50 text-cyan-700",
  OTHER: "bg-stone-100 text-stone-700",
};

export const PRAYER_CATEGORY_LABELS: Record<PrayerCategory, string> = {
  PERSONAL: "Personal",
  FAMILY: "Family",
  FRIENDS: "Friends",
  CHURCH: "Church",
  MISSIONS: "Missions",
  HEALTH: "Health",
  WORK: "Work",
  OTHER: "Other",
};

export function formatReferenceShort(book: string, chapters: string, verses: string, maxLength = 12): string {
  const abbrev = BOOK_ABBREVIATIONS[book] || book;
  let reference = `${abbrev} ${chapters}${verses ? `:${verses}` : ""}`;

  if (reference.length > maxLength) {
    reference = reference.substring(0, maxLength - 3) + "...";
  }

  return reference;
}
