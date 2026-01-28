"use client";

import { useChapter } from "./ChapterContext";

// Convert number to Hebrew letters (gematria)
function toHebrewNumeral(num: number): string {
  const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const hundreds = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];

  if (num <= 0) return "";
  if (num >= 1000) return num.toString();

  let result = "";
  let n = num;

  const h = Math.floor(n / 100);
  if (h > 0) {
    result += hundreds[h];
    n %= 100;
  }

  if (n === 15) {
    result += "טו";
  } else if (n === 16) {
    result += "טז";
  } else {
    const t = Math.floor(n / 10);
    if (t > 0) {
      result += tens[t];
      n %= 10;
    }
    if (n > 0) {
      result += ones[n];
    }
  }

  return result;
}

type Props = {
  bookName: string;
  hebrewBookName: string | null;
  commonFrenchName: string | null;
  hasHebrew: boolean;
};

export function ContentLabelsHeader({ bookName, hebrewBookName, commonFrenchName, hasHebrew }: Props) {
  const { currentChapter } = useChapter();
  const frenchDisplayName = commonFrenchName 
    ? `${commonFrenchName} (${bookName})`
    : bookName;

  return (
    <div className="rounded-t-2xl border border-amber-200/80 border-b-0 bg-white px-6 py-4">
      <div className={`flex items-baseline p-3 ${hasHebrew ? "flex-row gap-6" : "flex-col"}`}>
        {hasHebrew && (
          <div className="flex-1 text-right" dir="rtl">
            <span className="text-2xl text-amber-800/70 font-[family-name:var(--font-hebrew)]">
              {hebrewBookName ?? bookName} פרק {toHebrewNumeral(currentChapter)}
            </span>
          </div>
        )}
        <div className="flex-1 text-left">
          <span className="text-lg text-amber-800/70">{frenchDisplayName} Chapitre {currentChapter}</span>
        </div>
      </div>
    </div>
  );
}
