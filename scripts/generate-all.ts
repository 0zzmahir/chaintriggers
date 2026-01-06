import "dotenv/config";
import fs from "fs";
import path from "path";
import { generateText } from "./openrouter";
import { shouldRejectArticle } from "./dedupe";
import { categories } from "../src/data/categories";

// usage: npx tsx scripts/generate-all.ts 5
const [, , COUNT_ARG] = process.argv;
const PER_CATEGORY = Number(COUNT_ARG) || 5;

const MAX_RETRIES_PER_ARTICLE = 6;

const MODELS = [
  "deepseek/deepseek-r1-0528-qwen3-8b",
  "google/gemini-2.0-flash-exp:free",
];

const ARTICLES_DIR = path.join(
  process.cwd(),
  "src",
  "data",
  "articles"
);

type Article = {
  slug: string;
  title: string;
  description: string;
  content: string;
  faq: { q: string; a: string }[];
};

// ---------- UTILS ----------
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

function ensureFile(category: string) {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  }

  const file = path.join(ARTICLES_DIR, `${category}.json`);

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]");
  }

  return file;
}

function load(category: string): Article[] {
  const file = path.join(ARTICLES_DIR, `${category}.json`);

  try {
    const raw = fs.readFileSync(file, "utf-8").trim();
    if (!raw) {
      fs.writeFileSync(file, "[]");
      return [];
    }
    return JSON.parse(raw);
  } catch {
    console.log(`⚠️ Corrupted JSON detected, resetting: ${category}`);
    fs.writeFileSync(file, "[]");
    return [];
  }
}

function save(category: string, items: Article[]) {
  fs.writeFileSync(
    path.join(ARTICLES_DIR, `${category}.json`),
    JSON.stringify(items, null, 2)
  );
}

// ---------- PROMPTS (EDITORIAL KİLİT) ----------
function blueprintPrompt(category: string) {
  return `
RETURN VALID JSON ONLY.

Schema:
{
  "title": "Highly specific editorial-style title",
  "angle": "Unique analytical angle",
  "narrative": "Calm, investigative, educational tone"
}

Topic: "${category} triggers, causes, and risk scenarios"

Rules:
- NO generic titles
- NO clickbait
- Must sound like a professional publication
`;
}

function articlePrompt(bp: any) {
  return `
You are writing a PREMIUM EDUCATIONAL EDITORIAL ARTICLE.

ABSOLUTE RULES:
- VALID MARKDOWN
- ONE blank line between ALL paragraphs
- Clear section separation
- No wall-of-text
- Neutral, authoritative tone
- NO advice, NO persuasion

MANDATORY STRUCTURE:

# ${bp.title}

## Overview
Write 2–3 well-developed paragraphs introducing the topic.

## Core Explanation
Explain the concept in depth with clear logic and definitions.

## Key Triggers
Use bullet points.
Each bullet MUST be followed by a full explanatory paragraph.

## Risk & Consequences
Explain realistic implications without advice.

## Practical Considerations
Explain what readers should conceptually understand.

## Frequently Asked Questions

### Question 1
Answer in 2–3 paragraphs.

### Question 2
Answer in 2–3 paragraphs.

### Question 3
Answer in 2–3 paragraphs.

## Disclaimer
State clearly that the content is informational only.

CONTENT REQUIREMENTS:
- 1800–2600 words
- No filler
- No repetition
- Natural paragraph spacing

Narrative style:
${bp.narrative}
`;
}

// ---------- MAIN ----------
async function run() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY missing");
  }

  for (const { slug: category } of categories) {
    console.log(`\n📂 CATEGORY: ${category}`);
    ensureFile(category);

    const existing = load(category);

    while (existing.length < PER_CATEGORY) {
      console.log(`🟡 ${existing.length + 1}/${PER_CATEGORY}`);

      let attempts = 0;

      while (attempts < MAX_RETRIES_PER_ARTICLE) {
        attempts++;
        const model = pickModel();

        try {
          // ---- BLUEPRINT ----
          const bpRaw = await generateText(
            blueprintPrompt(category),
            model
          );

          const bp = JSON.parse(
            bpRaw.slice(
              bpRaw.indexOf("{"),
              bpRaw.lastIndexOf("}") + 1
            )
          );

          // ---- ARTICLE ----
          const content = await generateText(
            articlePrompt(bp),
            model
          );

          const titleMatch = content.match(/^#\s(.+)/m);
          const title = titleMatch?.[1]?.trim() || bp.title;
          const slug = slugify(title);

          const reason = shouldRejectArticle({
            slug,
            title,
            content,
            existingSlugs: existing.map((a) => a.slug),
            existingTitles: existing.map((a) => a.title),
            existingContents: existing.map((a) => a.content),
          });

          if (reason) {
            console.log(`❌ Rejected: ${reason}`);
            continue;
          }

          existing.push({
            slug,
            title,
            description: bp.angle || title,
            content,
            faq: [],
          });

          save(category, existing);
          console.log(`✅ Saved: ${title}`);
          break;
        } catch (e: any) {
          if (String(e).includes("429")) {
            console.log("⏳ Rate limit — waiting 15s");
            await sleep(15000);
          } else {
            console.log("⚠️ Error — retrying");
          }
        }
      }
    }
  }

  console.log("\n🎉 ALL CATEGORIES DONE");
}

run();
