import Link from "next/link";
import { getArticlesByCategory } from "@/data/articles";

type Props = {
  params: Promise<{
    category?: string;
  }>;
};

/**
 * Slug'ı güvenli şekilde başlığa çevirir
 * insurance-claims -> Insurance Claims
 */
function humanize(slug?: string) {
  if (!slug) return "";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * SEO metadata (NEXT 16 compatible)
 */
export async function generateMetadata({ params }: Props) {
  const { category = "" } = await params;
  const title = humanize(category);

  return {
    title: `${title} Triggers & Risk Factors | ChainTriggers`,
    description: `Educational articles explaining common ${title} triggers, risks, and scenarios. Informational purposes only.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category = "" } = await params;

  const articles = getArticlesByCategory(category);

  // EMPTY STATE (CRASH YOK)
  if (!articles || articles.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-4xl font-bold text-white mb-4">
          {humanize(category)} Triggers & Insights
        </h1>

        <p className="text-slate-400 max-w-2xl">
          Articles for this category are currently being prepared.
          Our editorial system is actively generating in-depth content.
          Please check back soon.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      {/* H1 */}
      <h1 className="text-4xl font-bold text-white mb-6">
        {humanize(category)} Triggers & Insights
      </h1>

      {/* Primary description */}
      <p className="text-slate-400 mb-6 max-w-3xl">
        Explore in-depth educational articles explaining common triggers,
        scenarios, and risk factors related to {humanize(category)}.
        Informational purposes only.
      </p>

      {/* Curated collection intro */}
      <p className="mb-8 text-slate-400 max-w-3xl">
        Below you will find a curated collection of in-depth articles
        examining various {humanize(category)} triggers and related scenarios.
      </p>

      {/* ARTICLE LIST */}
      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/${article.slug}`}
            className="group rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-cyan-500/40"
          >
            <h2 className="text-xl font-semibold text-white transition group-hover:text-cyan-400">
              {article.title}
            </h2>

            <p className="mt-3 text-sm text-slate-400 line-clamp-3">
              {article.description}
            </p>

            <span className="mt-4 inline-block text-sm text-cyan-400">
              Read article →
            </span>
          </Link>
        ))}
      </div>

      {/* TOPICAL HUB */}
      <section className="mt-20 border-t border-slate-800 pt-10">
        <h2 className="text-2xl font-bold text-white mb-4">
          Understanding {humanize(category)} Triggers
        </h2>

        <p className="text-slate-400 max-w-3xl">
          This page serves as an educational hub covering common causes,
          scenarios, and risk factors related to {humanize(category)}.
          The articles above explore how specific events or conditions
          may trigger legal, financial, regulatory, or operational consequences.
        </p>

        <p className="mt-4 text-slate-400 max-w-3xl">
          All content is provided strictly for educational and informational
          purposes only and does not constitute professional advice.
        </p>
      </section>
    </main>
  );
}
