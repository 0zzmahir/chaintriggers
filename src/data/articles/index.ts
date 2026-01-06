import fs from "fs";
import path from "path";

export type Article = {
  slug: string;
  title: string;
  description: string;
  content: string;
  faq?: { q: string; a: string }[];
};

const ARTICLES_DIR = path.join(process.cwd(), "src", "data", "articles");

function readCategoryFile(category: string): Article[] {
  const filePath = path.join(ARTICLES_DIR, `${category}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

export function getArticlesByCategory(category: string): Article[] {
  if (!category) return [];
  return readCategoryFile(category);
}

export function getAllCategoriesWithArticles(): { category: string; articles: Article[] }[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const category = file.replace(/\.json$/, "");
    return { category, articles: readCategoryFile(category) };
  });
}

export function getAllArticles(): Article[] {
  return getAllCategoriesWithArticles().flatMap((x) => x.articles);
}

export function getArticleBySlug(slug: string): { article: Article; category: string } | null {
  if (!slug) return null;

  const all = getAllCategoriesWithArticles();
  for (const { category, articles } of all) {
    const found = articles.find((a) => a.slug === slug);
    if (found) return { article: found, category };
  }
  return null;
}

export function getRelatedArticles(currentSlug: string, category: string, limit = 4): Article[] {
  const articles = getArticlesByCategory(category);
  return articles.filter((a) => a.slug !== currentSlug).slice(0, limit);
}

export function getNextPrevInCategory(slug: string, category: string): { prev?: Article; next?: Article } {
  const articles = getArticlesByCategory(category);
  const idx = articles.findIndex((a) => a.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? articles[idx - 1] : undefined,
    next: idx < articles.length - 1 ? articles[idx + 1] : undefined,
  };
}
