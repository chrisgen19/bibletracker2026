import type { ReadingEntry } from "./types";

export function generateMockData(): ReadingEntry[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  return [
    {
      id: "1",
      date: new Date(year, month, 2).toISOString(),
      book: "Genesis",
      chapters: "1-3",
      verses: "",
      notes: "In the beginning... truly striking how much order God brought out of chaos.",
    },
    {
      id: "2",
      date: new Date(year, month, 3).toISOString(),
      book: "Genesis",
      chapters: "4",
      verses: "",
      notes: "Cain and Abel. The first instance of jealousy destroying a family.",
    },
    {
      id: "3",
      date: new Date(year, month, 5).toISOString(),
      book: "Psalms",
      chapters: "23",
      verses: "1-6",
      notes: "Needed comfort today. 'He restores my soul' - exactly what I needed.",
    },
    {
      id: "4",
      date: new Date(year, month, 6).toISOString(),
      book: "John",
      chapters: "1",
      verses: "1-14",
      notes: "The Word became flesh. The concept of Logos is so deep.",
    },
    {
      id: "5",
      date: new Date(year, month, 8).toISOString(),
      book: "Romans",
      chapters: "8",
      verses: "",
      notes: "Nothing can separate us from the love of God. Powerful.",
    },
    {
      id: "6",
      date: new Date(year, month, today.getDate()).toISOString(),
      book: "James",
      chapters: "1",
      verses: "",
      notes: "Joy in trials. Easier said than done, but necessary perspective.",
    },
  ];
}
