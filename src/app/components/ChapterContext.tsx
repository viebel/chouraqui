"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ChapterContextType = {
  currentChapter: number;
  setCurrentChapter: (chapter: number) => void;
};

const ChapterContext = createContext<ChapterContextType | null>(null);

export function ChapterProvider({
  children,
  initialChapter,
}: {
  children: ReactNode;
  initialChapter: number;
}) {
  const [currentChapter, setCurrentChapter] = useState(initialChapter);

  return (
    <ChapterContext.Provider value={{ currentChapter, setCurrentChapter }}>
      {children}
    </ChapterContext.Provider>
  );
}

export function useChapter() {
  const context = useContext(ChapterContext);
  if (!context) {
    throw new Error("useChapter must be used within a ChapterProvider");
  }
  return context;
}
