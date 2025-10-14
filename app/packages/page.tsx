import type { Metadata } from 'next'

import services from '@/data/services.json'
import { Section } from '@/components/Section'
import { PageHeader } from '@/components/PageHeader'

const title = 'HR technology consulting packages | Icarius Consulting'
const description =
  'Compare diagnostic sprints, programme leadership, and fractional support designed to unlock HR technology outcomes quickly and sustainably.'

type Service = {
  id: string
  title: string
  oneLiner: string
  bullets: string[]
  chips: string
}

const SERVICES = services as Service[]

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/packages' },
  openGraph: {
    title,
    description,
    url: '/packages',
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

export default function PackagesPage() {
  return (
    <Section className="py-16" style={{ minHeight: '500px' }}>
      <PageHeader
        title="Packages"
        className="mb-10"
        headingClassName="text-4xl font-semibold tracking-tight heading-underline"
        contentClassName="max-w-3xl space-y-4"
        backHref="/"
        backLabel="Back to home"
      >
        <p className="text-lg text-slate-300">
          Compare HRIT offers tailored to your programme stage—diagnostics, implementation leadership, transformation partnership, or fractional oversight—with measurable checkpoints baked in.
        </p>
      </PageHeader>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((offer) => (
            <article
              key={offer.id}
              className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/40 p-6 transition hover:border-[color:var(--primary)]/40 hover:bg-slate-900/60"
            >
              <span className="text-xs font-medium uppercase tracking-widest text-slate-400">{offer.chips}</span>
              <h2 className="mt-3 text-2xl font-semibold text-white">{offer.title}</h2>
              <p className="mt-4 text-sm text-slate-300">{offer.oneLiner}</p>
              {offer.bullets.length > 0 && (
                <ul className="mt-6 space-y-2 text-sm text-slate-300">
                  {offer.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}
