import ReadingProgress from "@/components/ReadingProgress";
import MiniTOC from "@/components/MiniTOC";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  getNextPrevInCategory,
} from "@/data/articles";

type Props = {
  params: Promise<{ slug?: string }>;
};

/** Markdown normalize: başlık/paragraf arası boşluk üretir */
function normalizeMarkdown(md: string) {
  return (md || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n?(##\s)/g, "\n\n## ")
    .replace(/\n?(###\s)/g, "\n\n### ")
    .replace(/\n?(-\s)/g, "\n\n- ")
    .replace(/([a-zA-Z0-9\)])\n([A-Z])/g, "$1\n\n$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** ## başlıklarına göre bölümlere ayır */
function splitByH2(md: string) {
  const text = normalizeMarkdown(md);
  const parts = text.split(/\n##\s+/g);
  const first = parts.shift() || "";
  const sections = parts.map((p) => {
    const [rawTitle, ...rest] = p.split("\n");
    const title = (rawTitle || "").trim();
    const body = rest.join("\n").trim();
    return { title, body };
  });

  return { intro: first.trim(), sections };
}

function slugifyHeading(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug = "" } = await params;
  const found = getArticleBySlug(slug);
  if (!found) return { title: "Not Found | ChainTriggers" };

  return {
    title: `${found.article.title} | ChainTriggers`,
    description: found.article.description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug = "" } = await params;

  const found = getArticleBySlug(slug);
  if (!found) notFound();

  const { article, category } = found;
  const related = getRelatedArticles(slug, category, 4);
  const { prev, next } = getNextPrevInCategory(slug, category);

  const { intro, sections } = splitByH2(article.content);

  return (
    <>
      {/* LEVEL 1 — Reading progress */}
      <ReadingProgress />

      {/* LEVEL 2 — Sticky mini TOC (desktop only) */}
      <MiniTOC />

      <main className="mx-auto max-w-6xl px-6 py-20">
        {/* HERO */}
        <header className="grid gap-10 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-xs text-slate-300">
              Category:
              <Link
                className="text-cyan-400 hover:underline"
                href={`/category/${category}`}
              >
                {category}
              </Link>
            </p>

            <h1 className="mt-4 text-4xl font-bold text-white leading-tight">
              {article.title}
            </h1>

            <p className="mt-4 text-lg text-slate-300 max-w-3xl">
              {article.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/category/${category}`}
                className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-cyan-500/40"
              >
                Explore more in {category} →
              </Link>

              {next && (
                <Link
                  href={`/${next.slug}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm text-slate-200 hover:border-cyan-500/40"
                >
                  Next article →
                </Link>
              )}
            </div>
          </div>

          {/* TOC PANEL */}
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="text-sm font-semibold text-white">
              On this page
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.title}>
                  <a
                    className="text-slate-300 hover:text-cyan-400"
                    href={`#${slugifyHeading(s.title)}`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </header>

        {/* INTRO */}
        {intro && (
          <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/40 p-7">
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {intro}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {/* CONTENT SECTIONS */}
        <section className="mt-10 space-y-6">
          {sections.map((s) => (
            <div
              key={s.title}
              id={slugifyHeading(s.title)}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7"
            >
              <h2 className="text-2xl font-bold text-white">
                {s.title}
              </h2>

              <div className="mt-5 prose prose-invert prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {s.body}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </section>

        {/* DISCLAIMER */}
        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-300">
          <p className="font-semibold text-white">
            Editorial note
          </p>
          <p className="mt-2 text-slate-400">
            This content is provided for educational and informational purposes only.
          </p>
        </section>

        {/* LEVEL 3 — Magazine-style related */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-white mb-6">
              Related articles
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${a.slug}`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:border-cyan-500/40 transition"
                >
                  <h3 className="font-semibold text-white leading-snug line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-400 line-clamp-3">
                    {a.description}
                  </p>
                  <span className="mt-4 inline-block text-sm text-cyan-400">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* PREV / NEXT */}
        <section className="mt-14 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/${prev.slug}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-cyan-500/40 transition"
            >
              <p className="text-xs text-slate-400">Previous</p>
              <p className="mt-2 font-semibold text-white">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 text-slate-500">
              No previous article yet.
            </div>
          )}

          {next ? (
            <Link
              href={`/${next.slug}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-cyan-500/40 transition"
            >
              <p className="text-xs text-slate-400">Next</p>
              <p className="mt-2 font-semibold text-white">
                {next.title}
              </p>
            </Link>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 text-slate-500">
              No next article yet.
            </div>
          )}
        </section>
      </main>
    </>
  );
}
