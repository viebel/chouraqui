"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Verse = {
  verse: number;
  text: string;
};

type Props = {
  maxChapter: number | null;
  currentChapter: number;
  verses: Verse[];
  selectedVerse: number;
  bookNumber: number;
};

type CustomDropdownProps = {
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
};

function CustomDropdown({ label, value, options, onChange }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-amber-800/80 md:text-sm">
        {label}
      </label>
      <div className="relative w-full md:w-auto" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm transition-all hover:border-amber-300 hover:shadow focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 md:w-auto md:rounded-full md:px-5 md:py-2"
        >
          <span className="min-w-[2ch] text-center">{value}</span>
          <svg
            className={`h-4 w-4 shrink-0 text-amber-700 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 max-h-72 w-[min(100vw-2rem,20rem)] overflow-auto rounded-xl border border-amber-200/80 bg-white py-3 px-3 shadow-xl md:w-auto md:min-w-[12rem] md:rounded-2xl">
            <div className="grid grid-cols-8 gap-1.5 md:grid-cols-10">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`flex h-9 min-h-[2.25rem] items-center justify-center rounded-lg text-sm font-medium transition-all touch-manipulation md:h-8 md:rounded-md ${
                    option === value
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-amber-800 hover:bg-amber-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ChapterVerseSelector({
  maxChapter,
  currentChapter,
  verses,
  selectedVerse,
  bookNumber,
}: Props) {
  const router = useRouter();

  const handleChapterChange = (chapter: number) => {
    router.push(`/?book=${bookNumber}&chapter=${chapter}`);
  };

  const handleVerseChange = (verseNumber: number) => {
    router.push(
      `/?book=${bookNumber}&chapter=${currentChapter}&verse=${verseNumber}`,
      { scroll: false }
    );

    // Scroll to verse after URL update renders
    setTimeout(() => {
      const verseElement = document.getElementById(`verset-${verseNumber}`);
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const chapterOptions = maxChapter
    ? Array.from({ length: maxChapter }, (_, i) => i + 1)
    : [];

  const verseOptions = verses.map((v) => v.verse);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6 md:flex-wrap">
      <CustomDropdown
        label="Chapitre"
        value={currentChapter}
        options={chapterOptions}
        onChange={handleChapterChange}
      />

      {verses.length > 0 && (
        <CustomDropdown
          label="Verset"
          value={selectedVerse}
          options={verseOptions}
          onChange={handleVerseChange}
        />
      )}
    </div>
  );
}
