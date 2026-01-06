"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-50 border-b border-slate-800
        bg-gradient-to-b from-[#0b1220] to-[#0b1220]/80
        backdrop-blur transition-all duration-300
        ${scrolled ? "py-2" : "py-4"}
      `}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white"
        >
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Chain
          </span>
          <span>Triggers</span>
        </Link>

        {/* DESKTOP CATEGORY BUTTONS */}
        <nav className="hidden flex-wrap gap-2 md:flex">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`
                  rounded-full px-4 py-1.5 text-sm transition-all
                  ${
                    active
                      ? "bg-cyan-500/20 text-white border border-cyan-400/40"
                      : "border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-cyan-500/60"
                  }
                `}
              >
                {c.label}
              </Link>
            );
          })}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-slate-300 hover:text-white"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-[#0b1220]">
          <nav className="flex flex-col gap-2 px-6 py-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                {c.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
