import { getAllArticles } from "@/data/articles";

export default function sitemap() {
  const baseUrl = "https://chaintriggers.com";

  const articles = getAllArticles();

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categories = Array.from(
    new Set(
      articles.map(
        (a) => a.category || a.slug.split("-")[0]
      )
    )
  );

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}
