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
