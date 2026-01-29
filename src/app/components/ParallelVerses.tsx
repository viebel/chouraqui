"use client";

import { replaceTetragram } from "./tetragramMarkup";

type FrenchVerse = {
  verse: number;
  text: string;
};

type HebrewVerse = {
  verse: number;
  scripture: string;
};

type Props = {
  frenchVerses: FrenchVerse[];
  hebrewVerses: HebrewVerse[];
  bookName: string;
  chapter: number;
  selectedVerse: number;
  hasHebrew: boolean;
};

// Convert number to Hebrew letters (gematria)
function toHebrewNumeral(num: number): string {
  const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const hundreds = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];

  if (num <= 0) return "";
  if (num >= 1000) return num.toString();

  let result = "";

  // Handle hundreds
  const h = Math.floor(num / 100);
  if (h > 0) {
    result += hundreds[h];
    num %= 100;
  }

  // Special cases: 15 = טו, 16 = טז (to avoid spelling God's name)
  if (num === 15) {
    result += "טו";
  } else if (num === 16) {
    result += "טז";
  } else {
    // Handle tens
    const t = Math.floor(num / 10);
    if (t > 0) {
      result += tens[t];
      num %= 10;
    }

    // Handle ones
    if (num > 0) {
      result += ones[num];
    }
  }

  return result;
}

export function ParallelVerses({
  frenchVerses,
  hebrewVerses,
  bookName,
  chapter,
  selectedVerse,
  hasHebrew,
}: Props) {
  const hebrewMap = new Map(hebrewVerses.map((v) => [v.verse, v.scripture]));

  const formatText = (text: string) =>
    replaceTetragram(
      text
        .replace(/« /g, "«\u00A0")
        .replace(/ »/g, "\u00A0»")
        .replace(/‹ /g, "‹\u00A0")
        .replace(/ ›/g, "\u00A0›")
        .replace(/ ([?!;])/g, "\u00A0$1")
        .replace(/ ?:(?=\s)/g, "\u00A0:")
    );

  return (
    <div className="space-y-4">
        {frenchVerses.map((verse) => {
          const hebrewText = hebrewMap.get(verse.verse);
          const isSelected = verse.verse === selectedVerse;

          return (
            <div
              key={verse.verse}
              id={`verset-${verse.verse}`}
              className={`flex rounded-lg p-3 transition-colors scroll-mt-[400px] ${
                isSelected ? "bg-amber-100/80" : "hover:bg-amber-50/50"
              } ${hasHebrew ? "flex-row gap-6" : "flex-col"}`}
            >
              {/* Hebrew column */}
              {hasHebrew && (
                <div className="flex-1 text-right hebrew-text" dir="rtl">
                  <span className="ml-2 text-base font-semibold text-amber-800/70">
                    {toHebrewNumeral(verse.verse)}
                  </span>
                  <span className="font-[family-name:var(--font-hebrew)] text-2xl leading-10 text-zinc-700">
                    {hebrewText ?? "—"}
                  </span>
                </div>
              )}

              {/* French column */}
              <div className="flex-1">
                <span className="mr-2 text-xs font-semibold text-amber-800/70">
                  {verse.verse}
                </span>
                <span
                  className="verse-text text-lg leading-10 text-zinc-700"
                  dangerouslySetInnerHTML={{ __html: formatText(verse.text) }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
