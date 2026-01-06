"use client";

import Link from "next/link";
import {
  Shield,
  Scale,
  Briefcase,
  DollarSign,
  Lock,
  FileText,
  Users,
  Heart,
  AlertTriangle,
  Package,
} from "lucide-react";

const categories = [
  {
    slug: "insurance",
    title: "Insurance",
    description: "Understand factors that affect coverage and claims",
    icon: Shield,
  },
  {
    slug: "personal-injury",
    title: "Personal Injury",
    description: "Legal considerations in injury and liability cases",
    icon: AlertTriangle,
  },
  {
    slug: "lawsuit",
    title: "Lawsuit",
    description: "Common scenarios that lead to legal action",
    icon: Scale,
  },
  {
    slug: "financial-risk",
    title: "Financial Risk",
    description: "Economic factors and financial exposure awareness",
    icon: DollarSign,
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    description: "Digital threats and data protection concerns",
    icon: Lock,
  },
  {
    slug: "regulatory",
    title: "Regulatory",
    description: "Compliance requirements and regulatory changes",
    icon: FileText,
  },
  {
    slug: "employment-law",
    title: "Employment Law",
    description: "Workplace rights and employment considerations",
    icon: Users,
  },
  {
    slug: "health-risk",
    title: "Health Risk",
    description: "Health-related liability and safety information",
    icon: Heart,
  },
  {
    slug: "product-recall",
    title: "Product Recall",
    description: "Consumer safety and product liability alerts",
    icon: Package,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Understand What Triggers Risk,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Liability, and Legal Consequences
              </span>
            </h1>

            <p className="mb-10 text-xl leading-relaxed text-slate-300">
              Comprehensive educational resources to help you understand factors
              that may lead to legal, financial, and regulatory risks.
            </p>

            <Link
              href="/category/insurance"
              className="inline-block rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/40"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Browse by Category
          </h2>
          <p className="text-lg text-slate-400">
            Select a topic to explore detailed information and insights
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-800 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-cyan-400">
                      {category.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-slate-700 bg-slate-800/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Why Trust ChainTriggers
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Clear, neutral, educational content focused on understanding risk
              and consequences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <TrustCard
              icon={Shield}
              title="Educational Purpose"
              text="All content is provided for informational and educational purposes only."
            />
            <TrustCard
              icon={FileText}
              title="Transparency"
              text="We clearly disclose that content is not professional advice."
            />
            <TrustCard
              icon={Scale}
              title="Neutral Information"
              text="Balanced, fact-based insights without promotional bias."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function TrustCard({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-8 text-center transition-colors duration-300 hover:border-cyan-500/30">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
      <p className="leading-relaxed text-slate-400">{text}</p>
    </div>
  );
}
