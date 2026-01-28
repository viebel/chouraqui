import Database from "better-sqlite3";
import path from "path";

export type HebrewVerse = {
  book: number;
  chapter: number;
  verse: number;
  scripture: string;
};

let db: Database.Database | null = null;

function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), "data", "tanakh.bbl.mybible");
    db = new Database(dbPath, { readonly: true, fileMustExist: true });
  }
  return db;
}

// Mapping from Chouraqui book numbers to Tanakh (KJV) book numbers
const chouraquiToTanakh: Record<number, number> = {
  10: 1,   // Genesis
  20: 2,   // Exodus
  30: 3,   // Leviticus
  40: 4,   // Numbers
  50: 5,   // Deuteronomy
  60: 6,   // Joshua
  70: 7,   // Judges
  80: 8,   // Ruth
  90: 9,   // 1 Samuel
  100: 10, // 2 Samuel
  110: 11, // 1 Kings
  120: 12, // 2 Kings
  130: 13, // 1 Chronicles
  140: 14, // 2 Chronicles
  150: 15, // Ezra
  160: 16, // Nehemiah
  190: 17, // Esther
  220: 18, // Job
  230: 19, // Psalms
  240: 20, // Proverbs
  250: 21, // Ecclesiastes
  260: 22, // Song of Solomon
  290: 23, // Isaiah
  300: 24, // Jeremiah
  310: 25, // Lamentations
  330: 26, // Ezekiel
  340: 27, // Daniel
  350: 28, // Hosea
  360: 29, // Joel
  370: 30, // Amos
  380: 31, // Obadiah
  390: 32, // Jonah
  400: 33, // Micah
  410: 34, // Nahum
  420: 35, // Habakkuk
  430: 36, // Zephaniah
  440: 37, // Haggai
  450: 38, // Zechariah
  460: 39, // Malachi
};

// Hebrew book names mapping
const hebrewBookNames: Record<number, string> = {
  10: "בְּרֵאשִׁית",      // Genesis - Bereshit
  20: "שְׁמוֹת",          // Exodus - Shemot
  30: "וַיִּקְרָא",        // Leviticus - Vayikra
  40: "בְּמִדְבַּר",       // Numbers - Bamidbar
  50: "דְּבָרִים",        // Deuteronomy - Devarim
  60: "יְהוֹשֻׁעַ",        // Joshua - Yehoshua
  70: "שׁוֹפְטִים",       // Judges - Shoftim
  80: "רוּת",            // Ruth - Rut
  90: "שְׁמוּאֵל א",      // 1 Samuel - Shmuel Aleph
  100: "שְׁמוּאֵל ב",     // 2 Samuel - Shmuel Bet
  110: "מְלָכִים א",      // 1 Kings - Melakhim Aleph
  120: "מְלָכִים ב",      // 2 Kings - Melakhim Bet
  130: "דִּבְרֵי הַיָּמִים א", // 1 Chronicles - Divrei HaYamim Aleph
  140: "דִּבְרֵי הַיָּמִים ב", // 2 Chronicles - Divrei HaYamim Bet
  150: "עֶזְרָא",         // Ezra - Ezra
  160: "נְחֶמְיָה",        // Nehemiah - Nechemya
  190: "אֶסְתֵּר",        // Esther - Ester
  220: "אִיּוֹב",         // Job - Iyov
  230: "תְּהִלִּים",       // Psalms - Tehilim
  240: "מִשְׁלֵי",        // Proverbs - Mishlei
  250: "קֹהֶלֶת",         // Ecclesiastes - Kohelet
  260: "שִׁיר הַשִּׁירִים",  // Song of Solomon - Shir HaShirim
  290: "יְשַׁעְיָהוּ",      // Isaiah - Yeshayahu
  300: "יִרְמְיָהוּ",       // Jeremiah - Yirmeyahu
  310: "אֵיכָה",          // Lamentations - Eicha
  330: "יְחֶזְקֵאל",       // Ezekiel - Yechezkel
  340: "דָּנִיֵּאל",        // Daniel - Daniel
  350: "הוֹשֵׁעַ",         // Hosea - Hoshea
  360: "יוֹאֵל",          // Joel - Yoel
  370: "עָמוֹס",          // Amos - Amos
  380: "עֹבַדְיָה",        // Obadiah - Ovadya
  390: "יוֹנָה",          // Jonah - Yona
  400: "מִיכָה",          // Micah - Mikha
  410: "נַחוּם",          // Nahum - Nachum
  420: "חֲבַקּוּק",        // Habakkuk - Chavakuk
  430: "צְפַנְיָה",        // Zephaniah - Tzefanya
  440: "חַגַּי",          // Haggai - Chaggai
  450: "זְכַרְיָה",        // Zechariah - Zecharya
  460: "מַלְאָכִי",        // Malachi - Malakhi
};

export function getHebrewBookName(chouraquiBookNumber: number): string | null {
  return hebrewBookNames[chouraquiBookNumber] ?? null;
}

export function getTanakhBookNumber(chouraquiBookNumber: number): number | null {
  return chouraquiToTanakh[chouraquiBookNumber] ?? null;
}

export function hasHebrewText(chouraquiBookNumber: number): boolean {
  return chouraquiBookNumber in chouraquiToTanakh;
}

export function getHebrewVerses(
  chouraquiBookNumber: number,
  chapter: number
): HebrewVerse[] {
  const tanakhBook = getTanakhBookNumber(chouraquiBookNumber);
  if (tanakhBook === null) {
    return [];
  }

  return getDb()
    .prepare(
      `SELECT book, chapter, verse, scripture
       FROM bible
       WHERE book = ? AND chapter = ?
       ORDER BY verse`
    )
    .all(tanakhBook, chapter) as HebrewVerse[];
}

export function getHebrewVerse(
  chouraquiBookNumber: number,
  chapter: number,
  verse: number
): HebrewVerse | null {
  const tanakhBook = getTanakhBookNumber(chouraquiBookNumber);
  if (tanakhBook === null) {
    return null;
  }

  return (
    (getDb()
      .prepare(
        `SELECT book, chapter, verse, scripture
         FROM bible
         WHERE book = ? AND chapter = ? AND verse = ?`
      )
      .get(tanakhBook, chapter, verse) as HebrewVerse | undefined) ?? null
  );
}
