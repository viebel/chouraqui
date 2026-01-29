"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useChapter } from "./ChapterContext";
import { replaceTetragram } from "./tetragramMarkup";

type FrenchVerse = {
  verse: number;
  text: string;
};

type HebrewVerse = {
  verse: number;
  scripture: string;
};

type ChapterData = {
  chapter: number;
  frenchVerses: FrenchVerse[];
  hebrewVerses: HebrewVerse[];
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

// Convert number to Hebrew letters (gematria)
function toHebrewNumeral(num: number): string {
  const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const hundreds = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];

  if (num <= 0) return "";
  if (num >= 1000) return num.toString();

  let result = "";
  let n = num;

  // Handle hundreds
  const h = Math.floor(n / 100);
  if (h > 0) {
    result += hundreds[h];
    n %= 100;
  }

  // Special cases: 15 = טו, 16 = טז (to avoid spelling God's name)
  if (n === 15) {
    result += "טו";
  } else if (n === 16) {
    result += "טז";
  } else {
    // Handle tens
    const t = Math.floor(n / 10);
    if (t > 0) {
      result += tens[t];
      n %= 10;
    }

    // Handle ones
    if (n > 0) {
      result += ones[n];
    }
  }

  return result;
}

export function InfiniteParallelVerses({
  bookNumber,
  initialChapter,
  initialFrenchVerses,
  initialHebrewVerses,
  maxChapter,
  selectedVerse,
  bookName,
  hasHebrew,
}: Props) {
  const { setCurrentChapter } = useChapter();
  const [chapters, setChapters] = useState<ChapterData[]>([
    { chapter: initialChapter, frenchVerses: initialFrenchVerses, hebrewVerses: initialHebrewVerses },
  ]);
  const [loadingNext, setLoadingNext] = useState(false);
  const [loadingPrev, setLoadingPrev] = useState(false);
  const nextTriggerRef = useRef<HTMLDivElement>(null);
  const prevTriggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Track visible chapter using scroll event
  useEffect(() => {
    const handleScroll = () => {
      const viewportTop = window.scrollY + 350; // Account for sticky header
      let closestChapter = initialChapter;
      let closestDistance = Infinity;

      chapterRefs.current.forEach((el, chapter) => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = elementTop + rect.height;
        
        // Check if this chapter is visible and closest to the top
        if (elementBottom > viewportTop && elementTop < viewportTop + window.innerHeight) {
          const distance = Math.abs(viewportTop - elementTop);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestChapter = chapter;
          }
        }
      });

      setCurrentChapter(closestChapter);
    };

    // Initial call
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapters, setCurrentChapter, initialChapter]);

  // Update refs when chapters change
  const setChapterRef = useCallback((chapter: number, el: HTMLDivElement | null) => {
    if (el) {
      chapterRefs.current.set(chapter, el);
    } else {
      chapterRefs.current.delete(chapter);
    }
  }, []);

  const firstChapter = chapters[0]?.chapter ?? initialChapter;
  const lastChapter = chapters[chapters.length - 1]?.chapter ?? initialChapter;
  const hasNext = lastChapter < maxChapter;
  const hasPrev = firstChapter > 1;

  useEffect(() => {
    // Reset chapters when book or initial chapter changes
    setChapters([{ chapter: initialChapter, frenchVerses: initialFrenchVerses, hebrewVerses: initialHebrewVerses }]);
  }, [bookNumber, initialChapter, initialFrenchVerses, initialHebrewVerses]);

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
                { chapter: nextChapter, frenchVerses: data.verses, hebrewVerses: data.hebrewVerses ?? [] },
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
          { chapter: prevChapter, frenchVerses: data.verses, hebrewVerses: data.hebrewVerses ?? [] },
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
          className="flex items-center justify-center py-6 text-sm text-amber-800/60"
        >
          {loadingPrev ? "Chargement..." : ""}
        </div>
      )}

      {chapters.map((chapterData, chapterIndex) => {
        const hebrewMap = new Map(chapterData.hebrewVerses.map((v) => [v.verse, v.scripture]));
        const isInitialChapter = chapterData.chapter === initialChapter;

        return (
          <div
            key={chapterData.chapter}
            ref={(el) => setChapterRef(chapterData.chapter, el)}
            data-chapter={chapterData.chapter}
            className="space-y-4"
          >
            {/* Chapter separator (not for first displayed chapter) */}
            {chapterIndex > 0 && (
              <div className="flex items-center gap-4 py-4">
                <div className="h-px flex-1 bg-amber-200/70" />
                <span className="text-sm font-semibold text-amber-800/70">
                  {bookName} {chapterData.chapter}
                </span>
                <div className="h-px flex-1 bg-amber-200/70" />
              </div>
            )}

            {chapterData.frenchVerses.map((verse) => {
              const hebrewText = hebrewMap.get(verse.verse);
              const isSelected = isInitialChapter && verse.verse === selectedVerse;

              return (
                <div
                  key={`${chapterData.chapter}-${verse.verse}`}
                  id={isInitialChapter ? `verset-${verse.verse}` : undefined}
                  className={`flex rounded-lg p-3 transition-colors scroll-mt-[400px] ${
                    isSelected ? "bg-amber-100/80" : "hover:bg-amber-50/50"
                  } ${hasHebrew ? "flex-row gap-6" : "flex-col"}`}
                >
                  {/* Hebrew column */}
                  {hasHebrew && (
                    <div className="flex-1 text-right" dir="rtl">
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
                      className="text-lg leading-10 text-zinc-700"
                      dangerouslySetInnerHTML={{ __html: formatText(verse.text) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {hasNext && (
        <div
          ref={nextTriggerRef}
          className="flex items-center justify-center py-6 text-sm text-amber-800/60"
        >
          {loadingNext ? "Chargement..." : ""}
        </div>
      )}
    </div>
  );
}
