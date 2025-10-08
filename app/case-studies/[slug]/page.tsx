import type { Metadata } from "next";
import { notFound } from "next/navigation";

const CASE_STUDIES = {
  "hcm-migration": {
    title: "HCM Migration",
    summary:
      "Discover how Icarius guided a global enterprise through a seamless human capital management migration.",
  },
  "retail-audit-sprint": {
    title: "Retail Audit Sprint",
    summary:
      "Explore the rapid discovery sprint that helped a retail leader uncover critical gaps in store operations.",
  },
  "hr-ops-assistant": {
    title: "HR Ops Assistant",
    summary:
      "See how an intelligent assistant empowered HR teams to streamline everyday workflows.",
  },
} as const;

type CaseStudySlug = keyof typeof CASE_STUDIES;

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const data = CASE_STUDIES[params.slug as CaseStudySlug];
  if (!data) {
    return {};
  }

  return {
    title: `${data.title} Case Study | Icarius Consulting`,
    description: data.summary,
  };
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = CASE_STUDIES[params.slug as CaseStudySlug];

  if (!data) {
    return notFound();
  }

  return (
    <main className="prose mx-auto max-w-3xl px-6 py-16">
      <h1>{data.title}</h1>
      <p>{data.summary}</p>
      <p className="text-sm text-muted-foreground">
        Full case study content is on the way. Check back soon for detailed results
        and insights.
      </p>
    </main>
  );
}
