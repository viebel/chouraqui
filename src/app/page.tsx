import Link from "next/link";

import {
  getBook,
  getBooks,
  getMaxChapter,
  getVerses,
} from "@/lib/chouraqui-db";

export const runtime = "nodejs";

type HomeProps = {
  searchParams?: {
    book?: string;
    chapter?: string;
  };
};

export default function Home({ searchParams }: HomeProps) {
  const books = getBooks();
  const fallbackBook = books[0]?.bookNumber ?? 10;
  const requestedBook = Number(searchParams?.book ?? fallbackBook);
  const requestedChapter = Number(searchParams?.chapter ?? 1);

  const book = getBook(requestedBook) ?? getBook(fallbackBook);
  const maxChapter = book ? getMaxChapter(book.bookNumber) : null;
  const chapterFallback = requestedChapter || 1;
  const chapter = Math.max(
    1,
    Math.min(chapterFallback, maxChapter ?? chapterFallback)
  );

  const verses = book ? getVerses(book.bookNumber, chapter) : [];
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
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 sm:py-16">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold tracking-[0.3em] text-amber-800/80">
            TRADUCTION D’ANDRE CHOURAQUI
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-amber-950 sm:text-4xl">
            Lecture du texte biblique en vis-a-vis
          </h1>
          <p className="max-w-3xl text-base leading-7 text-zinc-700">
            Parcourez les livres et chapitres pour afficher la traduction
            francaise et preparer l'integration de la version hebraique.
          </p>
        </header>

        <section className="rounded-2xl border border-amber-200/80 bg-white/80 p-6 shadow-sm backdrop-blur">
          <form
            className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end"
            method="get"
          >
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              Livre
              <select
                className="h-11 rounded-lg border border-amber-200 bg-white px-3 text-sm text-zinc-900 shadow-inner"
                name="book"
                defaultValue={book?.bookNumber ?? fallbackBook}
              >
                {books.map((item) => (
                  <option key={item.bookNumber} value={item.bookNumber}>
                    {item.longName}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              Chapitre
              <input
                className="h-11 w-full rounded-lg border border-amber-200 bg-white px-3 text-sm text-zinc-900 shadow-inner"
                name="chapter"
                type="number"
                min={1}
                max={maxChapter ?? undefined}
                defaultValue={chapter}
              />
            </label>
            <button
              className="h-11 rounded-lg bg-amber-900 px-5 text-sm font-semibold text-amber-50 hover:bg-amber-800"
              type="submit"
            >
              Afficher
            </button>
          </form>
        </section>

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
                    <p key={verse.verse}>
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

        <section className="flex flex-wrap items-center gap-4 text-sm text-zinc-700">
          <span className="font-semibold text-amber-900/80">
            Navigation rapide
          </span>
          <div className="flex items-center gap-3">
            {prevChapter ? (
              <Link
                className="rounded-full border border-amber-200/80 px-4 py-2 text-amber-900 hover:border-transparent hover:bg-amber-100/60"
                href={`/?book=${book?.bookNumber ?? fallbackBook}&chapter=${prevChapter}`}
              >
                Chapitre précédent
              </Link>
            ) : null}
            {nextChapter ? (
              <Link
                className="rounded-full border border-amber-200/80 px-4 py-2 text-amber-900 hover:border-transparent hover:bg-amber-100/60"
                href={`/?book=${book?.bookNumber ?? fallbackBook}&chapter=${nextChapter}`}
              >
                Chapitre suivant
              </Link>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-amber-200/60 bg-white/75 p-6 text-sm text-zinc-700">
          <p className="font-semibold text-amber-900/80">
            Prochaines etapes
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            <li>Importer les données de versets hébreux et français.</li>
            <li>Ajouter la navigation par livre, chapitre et verset.</li>
            <li>Synchroniser les versets hébreux et français ligne par ligne.</li>
            <li>Préparer le déploiement sur Vercel.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
