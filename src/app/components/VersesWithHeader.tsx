"use client";

import { useEffect } from "react";
import { InfiniteParallelVerses } from "./InfiniteParallelVerses";
import { useChapter } from "./ChapterContext";

type FrenchVerse = {
  verse: number;
  text: string;
};

type HebrewVerse = {
  verse: number;
  scripture: string;
};

type Props = {
  bookNumber: number;
  initialChapter: number;
  initialFrenchVerses: FrenchVerse[];
  initialHebrewVerses: HebrewVerse[];
  maxChapter: number;
  selectedVerse: number;
  bookName: string;
  hasHebrew: boolean;
};

export function VersesHeader({
  bookName,
  chapter,
  hasHebrew,
}: {
  bookName: string;
  chapter: number;
  hasHebrew: boolean;
}) {
  return (
    <div className={`grid gap-6 ${hasHebrew ? "md:grid-cols-2" : "grid-cols-1"}`}>
      {hasHebrew && (
        <div className="flex items-center justify-between text-sm font-semibold text-amber-900/70">
          <span className="text-base font-semibold text-amber-950">{bookName} {chapter}</span>
          <span className="rounded-full bg-amber-100/70 px-3 py-1 text-xs text-amber-800">
            עברית
          </span>
        </div>
      )}
      <div className="flex items-center justify-between text-sm font-semibold text-amber-900/70">
        <span className="text-base font-semibold text-amber-950">{bookName} {chapter}</span>
        <span className="rounded-full bg-amber-100/70 px-3 py-1 text-xs text-amber-800">
          Traduction André Chouraqui
        </span>
      </div>
    </div>
  );
}

export function VersesWithHeader({
  bookNumber,
  initialChapter,
  initialFrenchVerses,
  initialHebrewVerses,
  maxChapter,
  selectedVerse,
  bookName,
  hasHebrew,
}: Props) {
  const { currentChapter, setCurrentChapter } = useChapter();

  // Reset current chapter when navigating to a new book/chapter
  useEffect(() => {
    setCurrentChapter(initialChapter);
  }, [bookNumber, initialChapter, setCurrentChapter]);

  return (
    <div className="relative">
      {/* Sticky header with dynamic chapter */}
      <div className="sticky top-[252px] z-[15] mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className={`grid gap-6 rounded-t-2xl border border-amber-200/80 border-b-0 bg-white p-4 shadow-sm ${hasHebrew ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {hasHebrew && (
            <div className="flex items-center justify-between text-sm font-semibold text-amber-900/70">
              <span className="text-base font-semibold text-amber-950">{bookName} {currentChapter}</span>
              <span className="rounded-full bg-amber-100/70 px-3 py-1 text-xs text-amber-800">
                עברית
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm font-semibold text-amber-900/70">
            <span className="text-base font-semibold text-amber-950">{bookName} {currentChapter}</span>
            <span className="rounded-full bg-amber-100/70 px-3 py-1 text-xs text-amber-800">
              Traduction André Chouraqui
            </span>
          </div>
        </div>
      </div>

      {/* Verses */}
      <main className="mx-auto flex w-full max-w-6xl flex-col px-6 sm:px-10 -mt-[2px]">
        <article className="rounded-t-none rounded-b-2xl border border-amber-200/80 border-t-0 bg-white/85 shadow-sm backdrop-blur mb-6">
          <div className="p-6 pt-4">
            {initialFrenchVerses.length === 0 ? (
              <p className="text-zinc-700">Aucun verset trouvé pour ce chapitre.</p>
            ) : (
              <InfiniteParallelVerses
                bookNumber={bookNumber}
                initialChapter={initialChapter}
                initialFrenchVerses={initialFrenchVerses}
                initialHebrewVerses={initialHebrewVerses}
                maxChapter={maxChapter}
                selectedVerse={selectedVerse}
                bookName={bookName}
                hasHebrew={hasHebrew}
              />
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
