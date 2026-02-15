"use client";

import { useState } from "react";

type Props = {
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function SelectorFoldable({
  summary,
  children,
  defaultOpen = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-amber-200/80 bg-white/90 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="md:hidden flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-inset"
      >
        <span className="text-sm font-semibold text-amber-900 truncate">
          {summary}
        </span>
        <svg
          className={`h-5 w-5 shrink-0 text-amber-700 transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out border-t border-amber-200/80 md:border-t-0 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} md:grid-rows-[1fr]`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="p-4 flex flex-col gap-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
