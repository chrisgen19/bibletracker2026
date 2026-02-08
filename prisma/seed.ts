import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { ulid } from "ulidx";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const OLD_READINGS = [
  { book: "Romans", chapters: "8", verses: "1-39", date: "2025-08-08" },
  { book: "Romans", chapters: "9", verses: "1-33", date: "2025-08-09" },
  { book: "Romans", chapters: "10", verses: "1-21", date: "2025-08-10" },
  { book: "Romans", chapters: "11", verses: "1-36", date: "2025-08-11" },
  { book: "Romans", chapters: "12", verses: "1-21", date: "2025-08-12" },
  { book: "1 Corinthians", chapters: "1", verses: "1-31", date: "2025-08-28" },
  { book: "1 Corinthians", chapters: "2", verses: "1-16", date: "2025-09-01" },
  { book: "1 Corinthians", chapters: "3", verses: "1-23", date: "2025-09-02" },
  { book: "1 Corinthians", chapters: "4", verses: "1-21", date: "2025-09-03" },
  { book: "1 Corinthians", chapters: "5", verses: "1-13", date: "2025-09-05" },
  { book: "1 Corinthians", chapters: "6", verses: "1-20", date: "2025-09-07" },
  { book: "1 Corinthians", chapters: "7", verses: "1-40", date: "2025-09-08" },
  { book: "1 Corinthians", chapters: "8", verses: "1-13", date: "2025-09-09" },
  { book: "1 Corinthians", chapters: "9", verses: "1-27", date: "2025-09-11" },
  { book: "1 Corinthians", chapters: "10", verses: "1-33", date: "2025-09-12" },
  { book: "1 Corinthians", chapters: "11", verses: "1-34", date: "2025-09-13" },
  { book: "1 Corinthians", chapters: "12", verses: "1-31", date: "2025-09-14" },
  { book: "1 Corinthians", chapters: "13", verses: "1-13", date: "2025-09-15" },
  { book: "1 Corinthians", chapters: "14", verses: "1-40", date: "2025-09-19" },
  { book: "1 Corinthians", chapters: "15", verses: "1-58", date: "2025-09-23" },
  { book: "1 Corinthians", chapters: "16", verses: "1-24", date: "2025-09-24" },
  { book: "2 Corinthians", chapters: "1", verses: "1-24", date: "2025-09-28" },
  { book: "2 Corinthians", chapters: "2", verses: "1-17", date: "2025-09-30" },
  { book: "2 Corinthians", chapters: "3", verses: "1-18", date: "2025-10-01" },
  { book: "2 Corinthians", chapters: "4", verses: "1-18", date: "2025-10-02" },
  { book: "2 Corinthians", chapters: "5", verses: "1-21", date: "2025-10-03" },
  { book: "2 Corinthians", chapters: "6", verses: "1-18", date: "2025-10-04" },
  { book: "2 Corinthians", chapters: "7", verses: "1-16", date: "2025-10-05" },
  { book: "2 Corinthians", chapters: "8", verses: "1-24", date: "2025-10-06" },
  { book: "2 Corinthians", chapters: "9", verses: "1-15", date: "2025-10-07" },
  { book: "2 Corinthians", chapters: "10", verses: "1-18", date: "2025-10-08" },
  { book: "2 Corinthians", chapters: "11", verses: "1-33", date: "2025-10-10" },
  { book: "2 Corinthians", chapters: "12", verses: "1-21", date: "2025-10-11" },
  { book: "2 Corinthians", chapters: "13", verses: "1-14", date: "2025-10-12" },
  { book: "Galatians", chapters: "1", verses: "1-24", date: "2025-10-13" },
  { book: "Galatians", chapters: "2", verses: "1-21", date: "2025-10-14" },
  { book: "Galatians", chapters: "3", verses: "1-29", date: "2025-10-15" },
  { book: "Galatians", chapters: "4", verses: "1-31", date: "2025-10-16" },
  { book: "Galatians", chapters: "5", verses: "1-26", date: "2025-10-17" },
  { book: "Galatians", chapters: "6", verses: "1-18", date: "2025-10-18" },
  { book: "Ephesians", chapters: "1", verses: "1-23", date: "2025-10-19" },
  { book: "Ephesians", chapters: "2", verses: "1-22", date: "2025-10-20" },
  { book: "Ephesians", chapters: "3", verses: "1-20", date: "2025-10-21" },
  { book: "Ephesians", chapters: "4", verses: "1-32", date: "2025-10-22" },
  { book: "Ephesians", chapters: "5", verses: "1-33", date: "2025-10-23" },
  { book: "Ephesians", chapters: "6", verses: "1-24", date: "2025-10-24" },
  { book: "Philippians", chapters: "1", verses: "1-30", date: "2025-10-25" },
  { book: "Philippians", chapters: "2", verses: "1-30", date: "2025-10-26" },
  { book: "Philippians", chapters: "3", verses: "1-21", date: "2025-10-27" },
];

const TARGET_EMAIL = "chrisgen19@gmail.com";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.error(`User with email ${TARGET_EMAIL} not found.`);
    process.exit(1);
  }

  console.log(`Found user: ${user.firstName} ${user.lastName} (${user.id})`);

  // Check for existing entries to avoid duplicates
  const existing = await prisma.readingEntry.count({
    where: { userId: user.id },
  });

  if (existing > 0) {
    console.log(`User already has ${existing} entries. Skipping seed to avoid duplicates.`);
    console.log("To re-seed, delete existing entries first.");
    return;
  }

  const entries = OLD_READINGS.map((r) => ({
    id: ulid(),
    userId: user.id,
    date: new Date(`${r.date}T00:00:00.000Z`),
    book: r.book,
    chapters: r.chapters,
    verses: r.verses,
    notes: "",
    createdAt: new Date(`${r.date}T00:00:00.000Z`),
    updatedAt: new Date(`${r.date}T00:00:00.000Z`),
  }));

  const result = await prisma.readingEntry.createMany({ data: entries });
  console.log(`Seeded ${result.count} reading entries for ${TARGET_EMAIL}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
