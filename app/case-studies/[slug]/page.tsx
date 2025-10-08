import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { CASE_STUDIES, type CaseStudySlug } from "@/data/caseStudies";

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const data = CASE_STUDIES[params.slug as CaseStudySlug];
  return data ? { title: `${data.title} – Case Study | Icarius Consulting` } : {};
}

export default function Page({ params }: { params: { slug: string } }) {
  const data = CASE_STUDIES[params.slug as CaseStudySlug];
  if (!data) return notFound();
  return (
    <main className="prose p-8">
      <PageHeader
        title={data.title}
        className="not-prose mb-6"
        headingClassName="text-4xl font-semibold tracking-tight text-white"
        contentClassName="space-y-2"
        href="/case-studies"
      />
      <p>{data.excerpt}</p>
    </main>
  );
}
