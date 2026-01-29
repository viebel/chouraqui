"use client";

import { useRouter } from "next/navigation";

type Verse = {
  verse: number;
  text: string;
};

type Props = {
  verses: Verse[];
  selectedVerse: number;
  bookNumber: number;
  chapter: number;
};

export function VerseSelector({
  verses,
  selectedVerse,
  bookNumber,
  chapter,
}: Props) {
  const router = useRouter();

  const handleVerseClick = (verseNumber: number) => {
    // Update URL
    router.push(
      `/?book=${bookNumber}&chapter=${chapter}&verse=${verseNumber}`,
      { scroll: false }
    );

    // Scroll to verse
    const verseElement = document.getElementById(`verset-${verseNumber}`);
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="grid grid-cols-10 gap-2 text-center">
      {verses.map((verse) => {
        const isActive = verse.verse === selectedVerse;
        return (
          <button
            key={verse.verse}
            onClick={() => handleVerseClick(verse.verse)}
            className={`flex h-8 items-center justify-center rounded-md text-sm font-semibold transition cursor-pointer ${
              isActive
                ? "bg-amber-700 text-white"
                : "bg-amber-100 text-amber-900 hover:bg-amber-200"
            }`}
          >
            {verse.verse}
          </button>
        );
      })}
    </div>
  );
}
