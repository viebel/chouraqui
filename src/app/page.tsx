import Link from "next/link";

import { HistoryNav } from "./components/HistoryNav";
import {
  getBook,
  getBooks,
  getMaxChapter,
  getVerses,
} from "@/lib/chouraqui-db";

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
  const selectedVerse = params.verse ? Number(params.verse) : 1;
  const prevChapter = chapter > 1 ? chapter - 1 : null;
  const nextChapter =
    maxChapter && chapter < maxChapter ? chapter + 1 : null;

  return (
    <div className="min-h-screen bg-[#fdfaf4] text-zinc-900">
      <div className="border-b border-amber-200/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 text-xs uppercase tracking-[0.28em] text-amber-800/80 sm:px-10">
          <span>La Bible de Chouraqui</span>
          <span>Edition numerique</span>
        </div>
      </div>
      <div className="sticky top-0 z-10 bg-[#fdfaf4]/95 backdrop-blur-sm pb-4 pt-4 border-b border-amber-200/50">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 sm:px-10">
          <section className="rounded-2xl border border-amber-200/80 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <HistoryNav />
              {groupBooks.map((group) => {
                const isActive = group.key === activeGroup?.key;
                const groupBook = group.items[0];
                return (
                  <Link
                    key={group.key}
                    href={`/?group=${group.key}&book=${groupBook?.bookNumber ?? fallbackBook}&chapter=1`}
                    className={`rounded-md px-6 py-2 text-sm font-semibold ${
                      isActive
                        ? "bg-zinc-800 text-white"
                        : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
                    }`}
                  >
                    {group.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {activeGroup?.items.map((item) => {
                const isActive = item.bookNumber === book?.bookNumber;
                return (
                  <Link
                    key={item.bookNumber}
                    href={`/?group=${activeGroup?.key}&book=${item.bookNumber}&chapter=1`}
                    className={`rounded-md px-4 py-2 text-sm font-semibold ${
                      isActive
                        ? "bg-zinc-800 text-white"
                        : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
                    }`}
                  >
                    {item.longName}
                  </Link>
                );
              })}
            </div>
          </div>
          </section>

          <section className="rounded-2xl border border-amber-200/80 bg-white/90 p-4 shadow-sm">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800/80">
                Chapitres
              </p>
              <div className="grid grid-cols-10 gap-2 text-center">
                {maxChapter
                  ? Array.from({ length: maxChapter }, (_, index) => {
                      const chapterNumber = index + 1;
                      const isActive = chapterNumber === chapter;
                      return (
                        <Link
                          key={chapterNumber}
                          href={`/?book=${book?.bookNumber ?? fallbackBook}&chapter=${chapterNumber}`}
                          className={`flex h-8 items-center justify-center rounded-md text-sm font-semibold transition ${
                            isActive
                              ? "bg-zinc-800 text-white"
                              : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
                          }`}
                        >
                          {chapterNumber}
                        </Link>
                      );
                    })
                  : null}
              </div>
            </div>
          </section>

          {verses.length > 0 && (
            <section className="rounded-2xl border border-amber-200/80 bg-white/90 p-4 shadow-sm">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800/80">
                  Versets
                </p>
                <div className="grid grid-cols-10 gap-2 text-center">
                  {verses.map((verse) => {
                    const isActive = verse.verse === selectedVerse;
                    return (
                      <Link
                        key={verse.verse}
                        href={`/?book=${book?.bookNumber ?? fallbackBook}&chapter=${chapter}&verse=${verse.verse}#verset-${verse.verse}`}
                        className={`flex h-8 items-center justify-center rounded-md text-sm font-semibold transition ${
                          isActive
                            ? "bg-amber-700 text-white"
                            : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                        }`}
                      >
                        {verse.verse}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 sm:py-16">
        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-amber-200/80 bg-white/85 p-6 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between text-sm font-semibold text-amber-900/70">
              <span>עברית</span>
              <span className="rounded-full bg-amber-100/70 px-3 py-1 text-xs text-amber-800">
                Texte source
              </span>
            </div>
            <div className="space-y-4 text-right" dir="rtl">
              <p className="text-lg font-semibold text-amber-950">
                {book?.longName ?? "Livre"} {chapter}
              </p>
              <p className="text-sm leading-6 text-zinc-600">
                Le texte hebreu n'est pas present dans la base actuelle. Ajoutez
                une source hebraique pour l'affichage parallele.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-amber-200/80 bg-white/85 p-6 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between text-sm font-semibold text-amber-900/70">
              <span>Francais</span>
              <span className="rounded-full bg-amber-100/70 px-3 py-1 text-xs text-amber-800">
                Traduction Andre Chouraqui
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-lg font-semibold text-amber-950">
                {book?.longName ?? "Livre"} {chapter}
              </p>
              <div className="space-y-3 text-base leading-7 text-zinc-700">
                {verses.length === 0 ? (
                  <p>Aucun verset trouve pour ce chapitre.</p>
                ) : (
                  verses.map((verse) => (
                    <p
                      key={verse.verse}
                      id={`verset-${verse.verse}`}
                      className={`scroll-mt-[400px] rounded-lg px-2 py-1 transition-colors ${
                        verse.verse === selectedVerse
                          ? "bg-amber-100/80"
                          : ""
                      }`}
                    >
                      <span className="mr-2 text-xs font-semibold text-amber-800/70">
                        {verse.verse}
                      </span>
                      {verse.text}
                    </p>
                  ))
                )}
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
