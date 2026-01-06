import { MetadataRoute } from "next";
import { getAllArticles } from "@/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chaintriggers.com";

  const articles = getAllArticles();

  const articleUrls = articles.map((a) => ({
    url: `${baseUrl}/${a.slug}`,
    lastModified: new Date(),
  }));

  // category’leri slug’dan türet (TS-safe)
  const categorySet = new Set(
    articles.map((a) => a.slug.split("-")[0])
  );

  const categoryUrls = Array.from(categorySet).map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    ...categoryUrls,
    ...articleUrls,
  ];
}
  