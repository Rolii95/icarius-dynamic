import type { Metadata } from 'next'

import packagesData from '@/data/packages.json'
import { Section } from '@/components/Section'
import { PackageCard, type PackageCardProps } from '@/components/PackageCard'
import { PageHeader } from '@/components/PageHeader'

const title = 'HR technology consulting packages | Icarius Consulting'
const description =
  'Compare diagnostic sprints, programme leadership, and fractional support designed to unlock HR technology outcomes quickly and sustainably.'

const PACKAGES = packagesData as PackageCardProps[]

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
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} {...pkg} variant="compact" />
          ))}
        </div>
      </div>
    </Section>
  )
}
