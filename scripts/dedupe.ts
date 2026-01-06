function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(a: string, b: string): number {
  const s1 = normalize(a);
  const s2 = normalize(b);

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1;

  const costs = [];
  for (let i = 0; i <= longer.length; i++) costs[i] = i;

  for (let j = 1; j <= shorter.length; j++) {
    let prev = j;
    for (let i = 1; i <= longer.length; i++) {
      const temp = costs[i];
      costs[i] = Math.min(
        costs[i] + 1,
        costs[i - 1] + 1,
        prev + (longer[i - 1] === shorter[j - 1] ? 0 : 1)
      );
      prev = temp;
    }
  }

  return 1 - costs[longer.length] / longer.length;
}

function extractIntro(content: string, words = 300): string {
  return content.split(/\s+/).slice(0, words).join(" ");
}

export function shouldRejectArticle({
  slug,
  title,
  content,
  existingSlugs,
  existingTitles,
  existingContents,
}: {
  slug: string;
  title: string;
  content: string;
  existingSlugs: string[];
  existingTitles: string[];
  existingContents: string[];
}): string | null {
  if (existingSlugs.includes(slug)) return "Duplicate slug";

  if (
    existingTitles.some(
      (t) => normalize(t) === normalize(title)
    )
  ) return "Duplicate title";

  if (
    existingTitles.some(
      (t) => similarity(title, t) >= 0.85
    )
  ) return "Title too similar";

  const intro = extractIntro(content);
  if (
    existingContents.some(
      (c) => similarity(intro, extractIntro(c)) >= 0.7
    )
  ) return "Content intro too similar";

  return null;
}
