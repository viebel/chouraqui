import Database from "better-sqlite3";
import path from "path";

export type Book = {
  bookNumber: number;
  shortName: string;
  longName: string;
  bookColor: string;
};

export type Verse = {
  bookNumber: number;
  chapter: number;
  verse: number;
  text: string;
};

let db: Database.Database | null = null;

function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), "data", "Chouraqui.SQLite3");
    db = new Database(dbPath, { readonly: true, fileMustExist: true });
  }
  return db;
}

// Common French book names mapping
const commonFrenchNames: Record<number, string> = {
  10: "Genèse",
  20: "Exode",
  30: "Lévitique",
  40: "Nombres",
  50: "Deutéronome",
  60: "Josué",
  70: "Juges",
  80: "Ruth",
  90: "1 Samuel",
  100: "2 Samuel",
  110: "1 Rois",
  120: "2 Rois",
  130: "1 Chroniques",
  140: "2 Chroniques",
  150: "Esdras",
  160: "Néhémie",
  190: "Esther",
  220: "Job",
  230: "Psaumes",
  240: "Proverbes",
  250: "Ecclésiaste",
  260: "Cantique des Cantiques",
  290: "Isaïe",
  300: "Jérémie",
  310: "Lamentations",
  330: "Ézéchiel",
  340: "Daniel",
  350: "Osée",
  360: "Joël",
  370: "Amos",
  380: "Abdias",
  390: "Jonas",
  400: "Michée",
  410: "Nahum",
  420: "Habacuc",
  430: "Sophonie",
  440: "Aggée",
  450: "Zacharie",
  460: "Malachie",
};

export function getCommonFrenchName(bookNumber: number): string | null {
  return commonFrenchNames[bookNumber] ?? null;
}

export function getBooks(): Book[] {
  return getDb()
    .prepare(
      `SELECT book_number AS bookNumber,
              short_name AS shortName,
              long_name AS longName,
              book_color AS bookColor
       FROM books
       ORDER BY book_number`
    )
    .all() as Book[];
}

export function getBook(bookNumber: number): Book | undefined {
  return getDb()
    .prepare(
      `SELECT book_number AS bookNumber,
              short_name AS shortName,
              long_name AS longName,
              book_color AS bookColor
       FROM books
       WHERE book_number = ?`
    )
    .get(bookNumber) as Book | undefined;
}

export function getMaxChapter(bookNumber: number): number | null {
  const row = getDb()
    .prepare(
      "SELECT MAX(chapter) AS maxChapter FROM verses WHERE book_number = ?"
    )
    .get(bookNumber) as { maxChapter: number | null } | undefined;
  return row?.maxChapter ?? null;
}

export function getVerses(bookNumber: number, chapter: number): Verse[] {
  return getDb()
    .prepare(
      `SELECT book_number AS bookNumber,
              chapter,
              verse,
              text
       FROM verses
       WHERE book_number = ? AND chapter = ?
       ORDER BY verse`
    )
    .all(bookNumber, chapter) as Verse[];
}
