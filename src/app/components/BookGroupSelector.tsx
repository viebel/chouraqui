"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type GroupItem = {
  key: string;
  label: string;
  items: { bookNumber: number; displayName: string }[];
};

type Props = {
  groupBooks: GroupItem[];
  activeGroupKey: string;
  currentBookNumber: number;
  fallbackBook: number;
};

function SelectDropdown<T extends string | number>({
  label,
  value,
  options,
  getOptionLabel,
  onChange,
  className = "",
}: {
  label: string;
  value: T;
  options: T[];
  getOptionLabel: (opt: T) => string;
  onChange: (value: T) => void;
  className?: string;
}) {
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

  const displayLabel = options.length ? getOptionLabel(value) : "—";

  return (
    <div className={`flex flex-col gap-1.5 md:flex-row md:items-center ${className}`}>
      <label className="text-xs font-semibold uppercase tracking-wider text-amber-800/80 md:text-sm">
        {label}
      </label>
      <div className="relative w-full md:w-auto" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-amber-200/80 bg-gradient-to-b from-white to-amber-50/50 px-4 py-3 text-left text-sm font-medium text-amber-900 shadow-sm transition-all hover:border-amber-300 hover:shadow focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 md:rounded-full md:px-5 md:py-2"
        >
          <span className="truncate">{displayLabel}</span>
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
          <div className="absolute top-full left-0 z-50 mt-2 max-h-64 w-full min-w-[12rem] overflow-auto rounded-xl border border-amber-200/80 bg-white py-2 shadow-xl md:min-w-[14rem]">
            {options.map((option) => {
              const optionLabel = getOptionLabel(option);
              const isActive = option === value;
              return (
                <button
                  key={String(option)}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors first:pt-2 last:pb-2 ${
                    isActive
                      ? "bg-amber-100 font-semibold text-amber-900"
                      : "text-amber-800 hover:bg-amber-50"
                  }`}
                >
                  {optionLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function BookGroupSelector({
  groupBooks,
  activeGroupKey,
  currentBookNumber,
  fallbackBook,
}: Props) {
  const router = useRouter();
  const activeGroup = groupBooks.find((g) => g.key === activeGroupKey) ?? groupBooks[0];
  const groupOptions = groupBooks.map((g) => g.key);
  const bookOptions = activeGroup?.items ?? [];
  const currentBookInGroup = bookOptions.some((b) => b.bookNumber === currentBookNumber)
    ? currentBookNumber
    : bookOptions[0]?.bookNumber ?? fallbackBook;

  const handleGroupChange = (groupKey: string) => {
    const group = groupBooks.find((g) => g.key === groupKey);
    const firstBook = group?.items[0]?.bookNumber ?? fallbackBook;
    router.push(`/?group=${groupKey}&book=${firstBook}&chapter=1`);
  };

  const handleBookChange = (bookNumber: number) => {
    router.push(`/?group=${activeGroup.key}&book=${bookNumber}&chapter=1`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile: dropdowns */}
      <div className="flex flex-col gap-3 md:hidden">
        <SelectDropdown
          label="Section"
          value={activeGroupKey}
          options={groupOptions}
          getOptionLabel={(key) => groupBooks.find((g) => g.key === key)?.label ?? key}
          onChange={handleGroupChange}
        />
        <SelectDropdown
          label="Livre"
          value={currentBookInGroup}
          options={bookOptions.map((b) => b.bookNumber)}
          getOptionLabel={(num) => bookOptions.find((b) => b.bookNumber === num)?.displayName ?? String(num)}
          onChange={handleBookChange}
        />
      </div>

      {/* Desktop: pills */}
      <div className="hidden md:block">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {groupBooks.map((group) => {
            const isActive = group.key === activeGroupKey;
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
        <div className="flex flex-wrap items-center justify-center gap-2 min-h-[76px] mt-4">
          {activeGroup?.items.map((item) => {
            const isActive = item.bookNumber === currentBookNumber;
            return (
              <Link
                key={item.bookNumber}
                href={`/?group=${activeGroup.key}&book=${item.bookNumber}&chapter=1`}
                className={`rounded-full border-2 px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "border-amber-400 bg-amber-50 text-amber-900"
                    : "border-transparent text-amber-800/70 hover:bg-amber-50 hover:text-amber-900"
                }`}
              >
                {item.displayName}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
