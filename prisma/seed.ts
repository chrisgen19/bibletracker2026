import { readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type LegacyReadingRow = {
  id: string;
  userId: string;
  bibleBook: string;
  chapters: string;
  verses: string | null;
  dateRead: string;
  completed: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const TARGET_EMAIL = process.env.SEED_TARGET_EMAIL ?? "chrisgen19@gmail.com";
const SOURCE_USER_ID = process.env.SEED_SOURCE_USER_ID;
const CLEAR_EXISTING = process.env.SEED_CLEAR_EXISTING === "true";
const SEED_SQL_FILE =
  process.env.SEED_SQL_FILE ?? path.resolve(process.cwd(), "bible_readings.sql");

function parseSqlValue(raw: string): string | null {
  const value = raw.trim();
  if (value.toUpperCase() === "NULL") return null;
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'");
  }
  return value;
}

function splitSqlFields(tuple: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inString = false;

  for (let i = 0; i < tuple.length; i++) {
    const ch = tuple[i];

    if (ch === "'") {
      current += ch;
      const next = tuple[i + 1];
      if (inString && next === "'") {
        current += next;
        i++;
        continue;
      }
      inString = !inString;
      continue;
    }

    if (ch === "," && !inString) {
      fields.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  fields.push(current.trim());
  return fields;
}

function extractTupleBodies(valuesBlock: string): string[] {
  const tuples: string[] = [];
  let inString = false;
  let depth = 0;
  let start = -1;

  for (let i = 0; i < valuesBlock.length; i++) {
    const ch = valuesBlock[i];

    if (ch === "'") {
      const next = valuesBlock[i + 1];
      if (inString && next === "'") {
        i++;
        continue;
      }
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === "(") {
      if (depth === 0) start = i + 1;
      depth++;
      continue;
    }

    if (ch === ")") {
      depth--;
      if (depth === 0 && start >= 0) {
        tuples.push(valuesBlock.slice(start, i));
        start = -1;
      }
    }
  }

  return tuples;
}

function parseLegacyRows(sql: string): LegacyReadingRow[] {
  const match = sql.match(
    /INSERT INTO\s+"bible_readings"\s*\([^)]+\)\s*VALUES\s*([\s\S]*?);/i
  );
  if (!match) {
    throw new Error("Could not find INSERT INTO bible_readings VALUES block.");
  }

  const tupleBodies = extractTupleBodies(match[1]);
  if (tupleBodies.length === 0) {
    throw new Error("No values found in bible_readings.sql.");
  }

  return tupleBodies.map((tuple, index) => {
    const fields = splitSqlFields(tuple).map(parseSqlValue);
    if (fields.length !== 10) {
      throw new Error(
        `Unexpected column count in tuple #${index + 1}. Expected 10, got ${fields.length}.`
      );
    }

    const [
      id,
      userId,
      bibleBook,
      chapters,
      verses,
      dateRead,
      completed,
      notes,
      createdAt,
      updatedAt,
    ] = fields;

    if (!id || !userId || !bibleBook || !chapters || !dateRead || !createdAt || !updatedAt) {
      throw new Error(`Missing required value in tuple #${index + 1}.`);
    }

    return {
      id,
      userId,
      bibleBook,
      chapters,
      verses,
      dateRead,
      completed: completed === "1" || completed?.toLowerCase() === "true",
      notes,
      createdAt,
      updatedAt,
    };
  });
}

function parseTimestamp(value: string): Date {
  const iso = value.includes("T") ? value : value.replace(" ", "T");
  const withZone = /Z$|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`;
  const parsed = new Date(withZone);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid timestamp value: ${value}`);
  }

  return parsed;
}

function chooseSourceUserId(rows: LegacyReadingRow[]): string {
  if (SOURCE_USER_ID) return SOURCE_USER_ID;

  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.userId, (counts.get(row.userId) ?? 0) + 1);
  }

  let selected = "";
  let maxCount = -1;
  for (const [userId, count] of counts) {
    if (count > maxCount) {
      selected = userId;
      maxCount = count;
    }
  }

  if (!selected) {
    throw new Error("Could not determine source user ID from bible_readings.sql.");
  }

  return selected;
}

async function main() {
  const sql = await readFile(SEED_SQL_FILE, "utf8");
  const legacyRows = parseLegacyRows(sql);

  const sourceUserId = chooseSourceUserId(legacyRows);
  const sourceRows = legacyRows.filter((row) => row.userId === sourceUserId);
  const incompleteCount = sourceRows.filter((row) => !row.completed).length;

  console.log(
    `Parsed ${legacyRows.length} rows from ${path.basename(SEED_SQL_FILE)}. ` +
      `Using source user ${sourceUserId} with ${sourceRows.length} rows ` +
      `(${incompleteCount} marked incomplete in legacy data).`
  );

  const user = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
  });

  if (!user) {
    console.error(`User with email ${TARGET_EMAIL} not found.`);
    process.exit(1);
  }

  console.log(`Found user: ${user.firstName} ${user.lastName} (${user.id})`);

  const existing = await prisma.readingEntry.count({
    where: { userId: user.id },
  });

  if (existing > 0 && !CLEAR_EXISTING) {
    console.log(
      `User already has ${existing} entries. ` +
        "Set SEED_CLEAR_EXISTING=true to replace entries from bible_readings.sql."
    );
    return;
  }

  if (CLEAR_EXISTING && existing > 0) {
    const deleted = await prisma.readingEntry.deleteMany({
      where: { userId: user.id },
    });
    console.log(`Deleted ${deleted.count} existing entries for ${TARGET_EMAIL}.`);
  }

  const entries = sourceRows.map((row) => ({
    id: row.id,
    userId: user.id,
    date: parseTimestamp(row.dateRead),
    book: row.bibleBook,
    chapters: row.chapters,
    verses: row.verses ?? "",
    notes: row.notes ?? "",
    createdAt: parseTimestamp(row.createdAt),
    updatedAt: parseTimestamp(row.updatedAt),
  }));

  const result = await prisma.readingEntry.createMany({
    data: entries,
    skipDuplicates: true,
  });

  const total = await prisma.readingEntry.count({
    where: { userId: user.id },
  });

  console.log(
    `Seeded ${result.count} entries for ${TARGET_EMAIL} from legacy user ${sourceUserId}.`
  );
  console.log(`User now has ${total} reading entries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
