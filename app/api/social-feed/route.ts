import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Article = {
  slug: string;
  title: string;
  description?: string;
};

const ARTICLES_DIR = path.join(
  process.cwd(),
  "src/data/articles"
);

export async function GET() {
  try {
    const files = fs.readdirSync(ARTICLES_DIR);

    let allArticles: any[] = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(ARTICLES_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed: Article[] = JSON.parse(raw);

      const category = file.replace(".json", "");

      const enriched = parsed.map((a) => ({
        slug: a.slug,
        title: a.title,
        summary: a.description?.slice(0, 160) || "",
        category,
        url: `https://chaintriggers.com/${a.slug}`,
      }));

      allArticles.push(...enriched);
    }

    // karıştır
    allArticles.sort(() => Math.random() - 0.5);

    // max 20
    return NextResponse.json(allArticles.slice(0, 20));
  } catch (e) {
    return NextResponse.json(
      { error: "social-feed error" },
      { status: 500 }
    );
  }
}
