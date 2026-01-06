import "dotenv/config";
import fetch from "node-fetch";
export async function generateText(prompt: string, model: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://chaintriggers.com",
      "X-Title": "ChainTriggers Content Engine",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error: ${err}`);
  }

  const json = (await res.json()) as any;

return json.choices?.[0]?.message?.content ?? "";

}
