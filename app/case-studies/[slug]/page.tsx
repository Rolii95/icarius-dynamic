import type { Metadata } from "next";
import { notFound } from "next/navigation";

const CASES = {
  "hcm-migration": {
    title: "HCM Migration",
    body: "Case study coming soon.",
  },
  "retail-audit-sprint": {
    title: "Retail Audit Sprint",
    body: "Case study coming soon.",
  },
  "hr-ops-assistant": {
    title: "HR Ops Assistant",
    body: "Case study coming soon.",
  },
} as const;

type Slug = keyof typeof CASES;

export async function generateStaticParams() {
  return Object.keys(CASES).map((slug) => ({ slug }));
}

// Optional but nice for SEO
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const data = CASES[params.slug as Slug];
  if (!data) return {};
  return { title: `${data.title} – Case Study | Icarius Consulting` };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const data = CASES[params.slug as Slug];
  if (!data) return notFound();

  return (
    <main className="prose p-8">
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </main>
  );
}
