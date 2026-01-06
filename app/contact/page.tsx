"use client";

import { useState } from "react";

export const dynamic = "force-static";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/maqnaykp", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        form.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <p className="badge bg-slate-900/80 border border-slate-700/60 text-[10px] text-slate-300">
            Contact
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Contact Us
          </h1>
          <p className="text-sm text-slate-400 md:text-base">
            Have a question, suggestion, or collaboration idea?  
            Send us a message and we’ll get back to you.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-slate-800 bg-slate-900/40 p-6"
        >
          <div className="space-y-1">
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-slate-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-300">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Write your message here..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none focus:border-slate-500"
            />
          </div>

          {/* spam bot engeli */}
          <input type="text" name="_gotcha" className="hidden" />

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-slate-200 px-5 py-2 text-sm font-medium text-slate-900 transition hover:bg-white"
          >
            Send Message
          </button>

          {status === "success" && (
            <p className="text-sm text-green-400">
              Your message has been sent successfully.
            </p>
          )}

          {status === "error" && (
            <p className="text-sm text-red-400">
              Something went wrong. Please try again later.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
