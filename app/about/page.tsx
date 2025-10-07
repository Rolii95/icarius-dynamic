import type { Metadata } from 'next'

import { Section } from '@/components/Section'
import { ConditionalGoBackButton } from '@/components/ConditionalGoBackButton'

const title = 'HRIT advisory HR systems audit HR AI PMO leadership'
const description =
  'Meet the HRIT advisory strategists blending HR systems audit insight, HR AI experimentation, and PMO stewardship to steer every transformation with clarity.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/about' },
  openGraph: {
    title,
    description,
    url: '/about',
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

export default function AboutPage() {
  return (
    <Section className="py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <ConditionalGoBackButton />
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight">About Icarius Consulting</h1>
          <p className="text-lg text-slate-300">
            Icarius Consulting partners with finance and operations leaders who need a pragmatic
            guide through complex transformation. We blend enterprise experience with the agility of a
            boutique firm, helping clients modernise processes without losing momentum.
          </p>
          <p className="text-slate-300">
            Our team has implemented global back-office platforms, optimised service delivery models,
            and steered change programmes in highly regulated industries. Every engagement pairs
            strategic thinking with hands-on delivery support so initiatives launch quickly and land
            successfully.
          </p>
          <p className="text-slate-300">
            We operate as an embedded partner, collaborating directly with your team, technology
            stack, and stakeholders. That proximity lets us uncover the friction that slows teams down
            and design interventions that stick. The result is measurable improvement, faster decision
            cycles, and a calmer path to scale.
          </p>
        </div>
      </div>
    </Section>
  )
}
