import type { Metadata } from 'next'
import { bookingUrl } from '@/lib/booking'
import { Section } from '@/components/Section'
import { BUSINESS_ADDRESS, CONTACT_PHONE, CONTACT_PHONE_URI } from '@/lib/structured-data'
import { siteConfig } from '@/lib/siteConfig'
import { BackLink } from '@/components/BackLink'

const title = 'Contact Icarius Consulting | Book a fit call'
const description =
  'Connect with HR technology specialists to scope HRIT, payroll, or AI programmes shaped around your stakeholders, timelines, and outcomes.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title,
    description,
    url: '/contact',
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

const contactMethods = [
  {
    label: 'Book a 15-min fit call',
    href: bookingUrl,
    description: 'Confirm goals, success metrics, and whether we are the right partner in a focused 15-minute fit call.',
    newTab: true,
    cta: 'contact-page',
    plan: 'general',
  },
  {
    label: 'Email the team',
    href: `mailto:${siteConfig.contactEmail}`,
    description: 'Share context, RFPs, or supporting information and we will reply within one business day with next steps.',
    newTab: false,
    cta: 'contact-page-email',
    plan: 'general',
  },
]

export default function ContactPage() {
  return (
    <Section className="py-16" style={{ minHeight: '500px' }}>
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-6 space-y-2">
          <BackLink className="inline-flex -translate-x-1 sm:-translate-x-1.5" />
          <h1 className="min-w-0 text-4xl font-semibold tracking-tight heading-underline">Contact</h1>
        </div>
        <div className="space-y-6">
          <header className="space-y-4">
            <p className="text-lg text-slate-300">
              Let’s get your next milestone unstuck—launch, conversion lift, or internal tooling upgrade. Pick the option that fits and we’ll reply with feasibility, timeline, and who will lead the work.
            </p>
            <p className="text-sm text-slate-400">
              Based in {BUSINESS_ADDRESS.addressLocality} {BUSINESS_ADDRESS.postalCode}, {BUSINESS_ADDRESS.addressRegion}, we partner with clients across the UK, EMEA, and North America. Expect clear comms, weekly touchpoints, and quick answers. Prefer to speak now? Call{' '}
              <a href={`tel:${CONTACT_PHONE_URI}`} className="text-[color:var(--primary)]">
                {CONTACT_PHONE}
              </a>
              .
            </p>
          </header>
          <ul className="space-y-4">
            {contactMethods.map((method) => (
              <li
                key={method.label}
                className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 transition hover:border-[color:var(--primary)]/40 hover:bg-slate-900/60"
              >
                <h2 className="text-xl font-semibold text-white">{method.label}</h2>
                <p className="mt-2 text-sm text-slate-300">{method.description}</p>
                <a
                  href={method.href}
                  className="mt-4 inline-flex text-sm font-medium text-[color:var(--primary)]"
                  target={method.newTab ? '_blank' : undefined}
                  rel={method.newTab ? 'noreferrer noopener' : undefined}
                  data-cta={method.cta}
                  data-plan={method.plan}
                >
                  {method.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
