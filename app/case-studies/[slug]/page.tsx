import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
      <h1>{data.title}</h1>
      <p>{data.excerpt}</p>
    </main>
  );
}
