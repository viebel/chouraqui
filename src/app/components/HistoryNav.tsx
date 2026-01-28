"use client";

export function HistoryNav() {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => history.back()}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/50 text-amber-700 hover:border-amber-300 hover:shadow-sm cursor-pointer transition-all"
        aria-label="Précédent"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => history.forward()}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/50 text-amber-700 hover:border-amber-300 hover:shadow-sm cursor-pointer transition-all"
        aria-label="Suivant"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
