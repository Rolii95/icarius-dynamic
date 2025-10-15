import type { Metadata } from 'next'
import { CASE_STUDIES } from './case-studies'
import { Section } from '@/components/Section'
import { PageHeader } from '@/components/PageHeader'
import { WorkCard } from '@/components/WorkCard'

const title = 'HR technology case studies | Icarius Consulting'
const description =
  'Browse case studies showing how HRIT advisory, programme leadership, audits, and AI enablement delivered measurable improvements for global organisations.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/work' },
  openGraph: {
    title,
    description,
    url: '/work',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: '/twitter-image', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default function WorkPage() {
  return (
    <Section className="py-16" style={{ minHeight: '600px' }}>
      <PageHeader
        title="HR technology outcomes we've delivered"
        className="mb-12"
        headingClassName="text-4xl font-semibold tracking-tight text-white heading-underline"
        contentClassName="max-w-3xl space-y-4"
        eyebrow={
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300/80">Selected work</p>
        }
        backLabel="Back to home"
        backHref="/"
      >
        <p className="text-lg text-slate-300">Real outcomes from focused HR technology sprints.</p>
      </PageHeader>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {CASE_STUDIES.map((study) => (
            <WorkCard key={study.slug} study={study} />
          ))}
        </div>
      </div>
    </Section>
  )
}
