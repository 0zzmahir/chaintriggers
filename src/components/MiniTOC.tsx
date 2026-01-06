"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  text: string;
};

export default function MiniTOC() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const headings = Array.from(
  document.querySelectorAll("h2")
) as HTMLHeadingElement[];

    const mapped = headings
      .map((h) => {
        const text = h.textContent?.trim();
        if (!text) return null;

        if (!h.id) {
          h.id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        }

        return { id: h.id, text };
      })
      .filter(Boolean) as Item[];

    setItems(mapped);
  }, []);

  if (items.length < 2) return null;

  return (
    <aside className="hidden xl:block fixed right-8 top-32 w-60">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur p-4">
        <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">
          On this page
        </p>

        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block text-slate-400 hover:text-cyan-400 transition"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
