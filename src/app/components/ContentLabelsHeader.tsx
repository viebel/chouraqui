"use client";

import { useChapter } from "./ChapterContext";

type Props = {
  bookName: string;
  hasHebrew: boolean;
};

export function ContentLabelsHeader({ bookName, hasHebrew }: Props) {
  const { currentChapter } = useChapter();

  return (
    <div className={`grid gap-6 rounded-t-2xl border border-amber-200/80 border-b-0 bg-white p-4 ${hasHebrew ? "md:grid-cols-2" : "grid-cols-1"}`}>
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
  );
}
