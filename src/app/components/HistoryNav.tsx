"use client";

export function HistoryNav() {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => history.back()}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-200 text-zinc-800 hover:bg-zinc-300 cursor-pointer text-sm font-semibold"
      >
        ←
      </button>
      <button
        onClick={() => history.forward()}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-200 text-zinc-800 hover:bg-zinc-300 cursor-pointer text-sm font-semibold"
      >
        →
      </button>
    </div>
  );
}
