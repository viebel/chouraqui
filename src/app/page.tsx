export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:px-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Bible Chouraqui
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Affichage de la Bible en hébreu et en français
          </h1>
          <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
            Lisez le texte hébreu à côté de la traduction française d'André
            Chouraqui. Ce projet est prêt à accueillir les données des versets
            et la navigation.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              <span>עברית</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                Texte source
              </span>
            </div>
            <div className="space-y-3 text-right" dir="rtl">
              <p className="text-lg font-semibold">בראשית</p>
              <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">
                הטקסט העברי יופיע כאן ברמת פסוק.
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              <span>Français</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                Traduction André Chouraqui
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-lg font-semibold">Genèse</p>
              <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">
                La traduction française apparaîtra ici, alignée au verset
                hébreu.
              </p>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300">
            Prochaines étapes
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
