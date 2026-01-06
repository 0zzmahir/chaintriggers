import "dotenv/config";
import fs from "fs";
import path from "path";
import { generateText } from "./openrouter";
import { shouldRejectArticle } from "./dedupe";

// ---- CLI ARGS ----
// usage: npx tsx scripts/generate-articles.ts insurance 5
const [, , CATEGORY, COUNT] = process.argv;

if (!CATEGORY) {
  throw new Error("❌ Category missing. Example: insurance");
}

const TARGET_COUNT = Number(COUNT) || 1;
const MAX_RETRIES_PER_ARTICLE = 8;

const MODELS = [
  "deepseek/deepseek-r1-0528-qwen3-8b",
  "google/gemini-2.0-flash-exp:free",
  "google/gemini-2.5-flash-lite-preview-09-2025",
];

// ---- PATHS ----
const DATA_DIR = path.join(process.cwd(), "src", "data", "articles");
const DATA_PATH = path.join(DATA_DIR, `${CATEGORY}.json`);

// ---- TYPES ----
type Article = {
  slug: string;
  title: string;
  description: string;
  content: string;
  faq: { q: string; a: string }[];
};

type Blueprint = {
  title: string;
  angle?: string;
  narrative: string;
};

// ---- UTILS ----
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function pickModel() {
  return MODELS[Math.floor(Math.random() * MODELS.length)];
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---- DATA SAFETY ----
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2));
  }
}

function loadExisting(): Article[] {
  if (!fs.existsSync(DATA_PATH)) return [];

  const raw = fs.readFileSync(DATA_PATH, "utf-8").trim();
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2));
    return [];
  }
}

function saveAll(articles: Article[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2));
}

// ---- PROMPTS ----
function blueprintPrompt() {
  return `
RETURN VALID JSON ONLY.

Schema:
{
  "title": "natural, non-generic article title",
  "angle": "why people misunderstand this topic",
  "narrative": "real-world framing with everyday situations"
}

Rules:
- No legal textbook framing
- No academic tone
- Title must sound human-written

Topic context:
${CATEGORY} situations, triggers, and overlooked risks
`;
}

function articlePrompt(blueprint: Blueprint) {
  return `
You are writing for a modern, high-RPM informational website.

STRICT RULES:
- DO NOT write academic or textbook-style explanations
- DO NOT repeat the title as a markdown H1
- DO NOT use generic filler phrases

STYLE:
- Human
- Scenario-driven
- Short paragraphs
- Cause → trigger → consequence

STRUCTURE:

## Real-World Injury Scenarios
## Trigger Chains That Lead to Injury
## Why These Situations Turn Into Legal Claims
## Risk Patterns Most People Miss
## What People Usually Realize Too Late
## Frequently Asked Questions
## Disclaimer

Narrative context:
${blueprint.narrative}
`;
}

// ---- MAIN ----
async function run() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("❌ OPENROUTER_API_KEY missing");
  }

  ensureDataFile();
  const existing = loadExisting();

  while (existing.length < TARGET_COUNT) {
    console.log(`🟡 ${CATEGORY}: ${existing.length + 1}/${TARGET_COUNT}`);

    let attempts = 0;

    while (attempts < MAX_RETRIES_PER_ARTICLE) {
      attempts++;
      const model = pickModel();

      try {
        // ---- BLUEPRINT ----
        const blueprintRaw = await generateText(
          blueprintPrompt(),
          model
        );

        const start = blueprintRaw.indexOf("{");
        const end = blueprintRaw.lastIndexOf("}");

        if (start === -1 || end === -1) {
          throw new Error("Invalid blueprint JSON");
        }

        const blueprint: Blueprint = JSON.parse(
          blueprintRaw.slice(start, end + 1)
        );

        if (!blueprint.title || !blueprint.narrative) {
          throw new Error("Incomplete blueprint");
        }

        // ---- ARTICLE ----
        const articleRaw = await generateText(
          articlePrompt(blueprint),
          model
        );

        const title = blueprint.title;
        const slug = slugify(title);

        const reason = shouldRejectArticle({
          slug,
          title,
          content: articleRaw,
          existingSlugs: existing.map((a) => a.slug),
          existingTitles: existing.map((a) => a.title),
          existingContents: existing.map((a) => a.content),
        });

        if (reason) {
          console.log(`⛔ Rejected: ${reason}`);
          continue;
        }

        existing.push({
          slug,
          title,
          description: blueprint.angle || title,
          content: articleRaw,
          faq: [],
        });

        saveAll(existing);
        console.log(`✅ Saved: ${title}`);
        break;
      } catch (e: any) {
        const msg = String(e);
        console.log(`⚠️ Attempt failed: ${msg}`);
        await sleep(msg.includes("429") ? 15000 : 3000);
      }
    }
  }

  console.log("🎉 DONE");
}

run();
