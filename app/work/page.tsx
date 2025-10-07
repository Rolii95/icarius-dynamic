import type { Metadata } from 'next'
import Link from 'next/link'

import { CASE_STUDIES } from './case-studies'
import { Section } from '@/components/Section'
import { ConditionalGoBackButton } from '@/components/ConditionalGoBackButton'

const title = 'HRIT advisory HR systems audit HR AI PMO outcomes portfolio'
const description =
  'Browse case studies where HRIT advisory blueprints, HR systems audit remediations, HR AI pilots, and PMO governance de-risked global people technology change.'

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
    <Section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center mb-6">
            <ConditionalGoBackButton className="mr-3" />
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300/80">Selected work</p>
          </div>
          <div className="text-center">
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Outcomes our clients trust us to deliver</h1>
            <p className="mt-4 text-lg text-slate-300">
              Every engagement balances operational rigour with change empathy. Explore a few recent programmes and the
              impact they created across HR and finance operations.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {CASE_STUDIES.map((study) => (
            <Link
              key={study.slug}
              href={`/work/${study.slug}`}
              className="group flex h-full flex-col justify-between rounded-3xl border border-[rgba(255,255,255,0.08)] bg-slate-950/40 p-6 transition hover:border-slate-500/60 hover:bg-slate-900/50"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/80">{study.hero.eyebrow}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{study.title}</h2>
                <p className="mt-3 text-sm text-slate-300">{study.summary}</p>
              </div>
              <div className="mt-6 flex items-center text-sm font-medium text-sky-300">
                <span>View case study</span>
                <span aria-hidden className="ml-2 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  )
}
