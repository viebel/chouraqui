import Link from "next/link";

import { ChapterVerseSelector } from "./components/ChapterVerseSelector";
import { HistoryNav } from "./components/HistoryNav";
import { ChapterProvider } from "./components/ChapterContext";
import { ContentLabelsHeader } from "./components/ContentLabelsHeader";
import { InfiniteParallelVerses } from "./components/InfiniteParallelVerses";
import { Tetragram } from "./components/Tetragram";
import {
  getBook,
  getBooks,
  getMaxChapter,
  getVerses,
  getCommonFrenchName,
} from "@/lib/chouraqui-db";
import { getHebrewVerses, hasHebrewText, getHebrewBookName } from "@/lib/tanakh-db";

export const runtime = "nodejs";

type SearchParams = {
  book?: string;
  chapter?: string;
  group?: string;
  verse?: string;
};

type HomeProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {};
  const books = getBooks();
  const fallbackBook = books[0]?.bookNumber ?? 10;
  const requestedBook = Number(params.book ?? fallbackBook);
  const requestedChapter = Number(params.chapter ?? 1);

  const pentateuque = new Set([10, 20, 30, 40, 50]);
  const prophetes = new Set([
    60, 70, 90, 100, 110, 120, 290, 300, 330, 350, 360, 370, 380, 390, 400,
    410, 420, 430, 440, 450, 460,
  ]);
  const hagiographes = new Set([
    80, 130, 140, 150, 160, 190, 220, 230, 240, 250, 260, 310, 340,
  ]);

  const groupBooks = [
    {
      key: "pentateuque",
      label: "Pentateuque",
      items: books.filter((bookItem) => pentateuque.has(bookItem.bookNumber)),
    },
    {
      key: "prophetes",
      label: "Prophètes",
      items: books.filter((bookItem) => prophetes.has(bookItem.bookNumber)),
    },
    {
      key: "hagiographes",
      label: "Hagiographes",
      items: books.filter((bookItem) => hagiographes.has(bookItem.bookNumber)),
    },
  ];

  const book = getBook(requestedBook) ?? getBook(fallbackBook);
  const selectedGroupKey =
    groupBooks.find((group) =>
      group.items.some((item) => item.bookNumber === book?.bookNumber)
    )?.key ?? groupBooks[0]?.key;
  const activeGroupKey = groupBooks.some(
    (group) => group.key === params.group
  )
    ? params.group
    : selectedGroupKey;
  const activeGroup =
    groupBooks.find((group) => group.key === activeGroupKey) ?? groupBooks[0];
  const maxChapter = book ? getMaxChapter(book.bookNumber) : null;
  const chapterFallback = requestedChapter || 1;
  const chapter = Math.max(
    1,
    Math.min(chapterFallback, maxChapter ?? chapterFallback)
  );

  const verses = book ? getVerses(book.bookNumber, chapter) : [];
  const hebrewVerses = book ? getHebrewVerses(book.bookNumber, chapter) : [];
  const hasHebrew = book ? hasHebrewText(book.bookNumber) : false;
  const hebrewBookName = book ? getHebrewBookName(book.bookNumber) : null;
  const commonFrenchName = book ? getCommonFrenchName(book.bookNumber) : null;
  const selectedVerse = params.verse ? Number(params.verse) : 1;
  const prevChapter = chapter > 1 ? chapter - 1 : null;
  const nextChapter =
    maxChapter && chapter < maxChapter ? chapter + 1 : null;

  return (
    <ChapterProvider initialChapter={chapter}>
    <div className="min-h-screen bg-[#fdfaf4] text-zinc-900">
      <div className="sticky top-0 z-20 bg-[#fdfaf4] backdrop-blur-sm">
        <div className="border-b border-amber-200/70">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-xs uppercase tracking-[0.28em] text-amber-800/80 sm:px-10">
            <span>La Bible de Chouraqui</span>
            <Tetragram className="tetragram--header" />
            <span>Edition numerique</span>
          </div>
        </div>
        <div className="pb-3 pt-3">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 sm:px-10">
          <section className="rounded-2xl border border-amber-200/80 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {groupBooks.map((group) => {
                const isActive = group.key === activeGroup?.key;
                const groupBook = group.items[0];
                return (
                  <Link
                    key={group.key}
                    href={`/?group=${group.key}&book=${groupBook?.bookNumber ?? fallbackBook}&chapter=1`}
                    className={`rounded-full border-2 px-5 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? "border-amber-400 bg-amber-50 text-amber-900"
                        : "border-transparent bg-gradient-to-b from-white to-amber-50/50 text-amber-800/70 hover:border-amber-200 hover:text-amber-900"
                    }`}
                  >
                    {group.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 min-h-[76px]">
              {activeGroup?.items.map((item) => {
                const isActive = item.bookNumber === book?.bookNumber;
                const displayName = getCommonFrenchName(item.bookNumber) ?? item.longName;
                return (
                  <Link
                    key={item.bookNumber}
                    href={`/?group=${activeGroup?.key}&book=${item.bookNumber}&chapter=1`}
                    className={`rounded-full border-2 px-4 py-1.5 text-sm font-medium transition-all ${
                      isActive
                        ? "border-amber-400 bg-amber-50 text-amber-900"
                        : "border-transparent text-amber-800/70 hover:bg-amber-50 hover:text-amber-900"
                    }`}
                  >
                    {displayName}
                  </Link>
                );
              })}
            </div>
          </div>
          </section>

          <section className="rounded-2xl border border-amber-200/80 bg-white/90 p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <HistoryNav />
              <ChapterVerseSelector
                maxChapter={maxChapter}
                currentChapter={chapter}
                verses={verses}
                selectedVerse={selectedVerse}
                bookNumber={book?.bookNumber ?? fallbackBook}
              />
            </div>
          </section>

        </div>
        </div>
        {/* Content labels - sticky with the rest of the header */}
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <ContentLabelsHeader
            bookName={book?.longName ?? "Livre"}
            hebrewBookName={hebrewBookName}
            commonFrenchName={commonFrenchName}
            hasHebrew={hasHebrew}
          />
        </div>
      </div>

      {/* Verses */}
      <main className="mx-auto flex w-full max-w-6xl flex-col px-6 sm:px-10 -mt-[2px]">
        <article className="rounded-t-none rounded-b-2xl border border-amber-200/80 border-t-0 bg-white/85 shadow-sm backdrop-blur mb-6">
          <div className="p-6 pt-4">
            {verses.length === 0 ? (
              <p className="text-zinc-700">Aucun verset trouvé pour ce chapitre.</p>
            ) : (
              <InfiniteParallelVerses
                bookNumber={book?.bookNumber ?? fallbackBook}
                initialChapter={chapter}
                initialFrenchVerses={verses}
                initialHebrewVerses={hebrewVerses}
                maxChapter={maxChapter ?? 1}
                selectedVerse={selectedVerse}
                bookName={book?.longName ?? "Livre"}
                hasHebrew={hasHebrew}
              />
            )}
          </div>
        </article>
      </main>
    </div>
    </ChapterProvider>
  );
}
