"use client";

type HebrewVerse = {
  verse: number;
  scripture: string;
};

type Props = {
  verses: HebrewVerse[];
  bookName: string;
  chapter: number;
  selectedVerse: number;
};

export function HebrewVerses({
  verses,
  bookName,
  chapter,
  selectedVerse,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-amber-950">
        {bookName} {chapter}
      </p>
      <div className="space-y-3 text-lg leading-8 text-zinc-700" dir="rtl">
        {verses.map((verse) => (
          <p
            key={verse.verse}
            className={`scroll-mt-[400px] rounded-lg px-2 py-1 transition-colors ${
              verse.verse === selectedVerse ? "bg-amber-100/80" : ""
            }`}
          >
            <span className="ml-2 text-xs font-semibold text-amber-800/70">
              {verse.verse}
            </span>
            <span className="font-serif">{verse.scripture}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
