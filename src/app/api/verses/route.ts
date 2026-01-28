import { NextRequest, NextResponse } from "next/server";
import { getBook, getVerses, getMaxChapter } from "@/lib/chouraqui-db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bookNumber = Number(searchParams.get("book"));
  const chapter = Number(searchParams.get("chapter"));

  if (!bookNumber || !chapter) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const book = getBook(bookNumber);
  const verses = getVerses(bookNumber, chapter);
  const maxChapter = getMaxChapter(bookNumber);

  return NextResponse.json({
    book,
    chapter,
    verses,
    maxChapter,
    hasNextChapter: chapter < (maxChapter ?? 0),
  });
}
