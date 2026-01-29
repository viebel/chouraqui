"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { replaceTetragram } from "./tetragramMarkup";

type Verse = {
  verse: number;
  text: string;
};

type ChapterData = {
  chapter: number;
  verses: Verse[];
};

type Props = {
  bookNumber: number;
  initialChapter: number;
  initialVerses: Verse[];
  maxChapter: number;
  selectedVerse: number;
  bookName: string;
};

export function InfiniteVerses({
  bookNumber,
  initialChapter,
  initialVerses,
  maxChapter,
  selectedVerse,
  bookName,
}: Props) {
  const [chapters, setChapters] = useState<ChapterData[]>([
    { chapter: initialChapter, verses: initialVerses },
  ]);
  const [loadingNext, setLoadingNext] = useState(false);
  const [loadingPrev, setLoadingPrev] = useState(false);
  const nextTriggerRef = useRef<HTMLDivElement>(null);
  const prevTriggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const firstChapter = chapters[0]?.chapter ?? initialChapter;
  const lastChapter = chapters[chapters.length - 1]?.chapter ?? initialChapter;
  const hasNext = lastChapter < maxChapter;
  const hasPrev = firstChapter > 1;

  useEffect(() => {
    // Reset chapters when book or initial chapter changes
    setChapters([{ chapter: initialChapter, verses: initialVerses }]);
  }, [bookNumber, initialChapter, initialVerses]);

  // Load next chapter
  useEffect(() => {
    if (!hasNext || loadingNext || !nextTriggerRef.current) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !loadingNext) {
          setLoadingNext(true);
          const nextChapter = lastChapter + 1;

          try {
            const res = await fetch(
              `/api/verses?book=${bookNumber}&chapter=${nextChapter}`
            );
            const data = await res.json();

            if (data.verses && data.verses.length > 0) {
              setChapters((prev) => [
                ...prev,
                { chapter: nextChapter, verses: data.verses },
              ]);
            }
          } catch (error) {
            console.error("Failed to fetch next chapter:", error);
          } finally {
            setLoadingNext(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(nextTriggerRef.current);

    return () => observer.disconnect();
  }, [hasNext, loadingNext, lastChapter, bookNumber]);

  // Load previous chapter
  const loadPrevChapter = useCallback(async () => {
    if (!hasPrev || loadingPrev) return;

    setLoadingPrev(true);
    const prevChapter = firstChapter - 1;

    // Store scroll position before adding content
    const scrollY = window.scrollY;
    const contentHeight = contentRef.current?.offsetHeight ?? 0;

    try {
      const res = await fetch(
        `/api/verses?book=${bookNumber}&chapter=${prevChapter}`
      );
      const data = await res.json();

      if (data.verses && data.verses.length > 0) {
        setChapters((prev) => [
          { chapter: prevChapter, verses: data.verses },
          ...prev,
        ]);

        // Restore scroll position after content is added
        requestAnimationFrame(() => {
          const newContentHeight = contentRef.current?.offsetHeight ?? 0;
          const heightDiff = newContentHeight - contentHeight;
          window.scrollTo(0, scrollY + heightDiff);
        });
      }
    } catch (error) {
      console.error("Failed to fetch previous chapter:", error);
    } finally {
      setLoadingPrev(false);
    }
  }, [hasPrev, loadingPrev, firstChapter, bookNumber]);

  useEffect(() => {
    if (!hasPrev || loadingPrev || !prevTriggerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingPrev) {
          loadPrevChapter();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(prevTriggerRef.current);

    return () => observer.disconnect();
  }, [hasPrev, loadingPrev, loadPrevChapter]);

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
    <div ref={contentRef} className="space-y-8">
      {hasPrev && (
        <div
          ref={prevTriggerRef}
          className="flex items-center justify-center py-8 text-sm text-amber-800/60"
        >
          {loadingPrev ? "Chargement..." : "Chapitre précédent..."}
        </div>
      )}

      {chapters.map((chapterData) => (
        <div key={chapterData.chapter} className="space-y-4">
          <p className="text-lg font-semibold text-amber-950">
            {bookName} {chapterData.chapter}
          </p>
          <div className="space-y-3 text-base leading-7 text-zinc-700">
            {chapterData.verses.map((verse) => (
              <p
                key={`${chapterData.chapter}-${verse.verse}`}
                id={
                  chapterData.chapter === initialChapter
                    ? `verset-${verse.verse}`
                    : undefined
                }
                className={`french-text scroll-mt-[400px] rounded-lg px-2 py-1 transition-colors ${
                  chapterData.chapter === initialChapter &&
                  verse.verse === selectedVerse
                    ? "bg-amber-100/80"
                    : ""
                }`}
              >
                <span className="mr-2 text-xs font-semibold text-amber-800/70">
                  {verse.verse}
                </span>
                <span
                  className="french-text__content verse-text"
                  dangerouslySetInnerHTML={{ __html: formatText(verse.text) }}
                />
              </p>
            ))}
          </div>
        </div>
      ))}

      {hasNext && (
        <div
          ref={nextTriggerRef}
          className="flex items-center justify-center py-8 text-sm text-amber-800/60"
        >
          {loadingNext ? "Chargement..." : "Chapitre suivant..."}
        </div>
      )}
    </div>
  );
}
