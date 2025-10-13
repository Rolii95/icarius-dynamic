import type { Metadata } from 'next'
import { bookingUrl } from '@/lib/booking'
import { Section } from '@/components/Section'
import { siteConfig } from '@/lib/siteConfig'
import { BackLink } from '@/components/BackLink'

const title = 'Contact Icarius Consulting | Book an HRIT consult'
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
    label: 'Book a call with our expert',
    href: bookingUrl,
    description: 'Outline your HRIS, payroll, or analytics priority and we will map the fastest, safest path to value.',
    newTab: true,
    cta: 'contact-page',
    plan: 'general',
  },
  {
    label: 'Email the team',
    href: `mailto:${siteConfig.contactEmail}`,
    description: 'Send RFPs, context, or supporting detail—expect a tailored response within one business day.',
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
            <p className="text-lg text-slate-300">Tell us your HR goal; we’ll propose the shortest path.</p>
            <p className="text-sm text-slate-400">Replies within 1 business day · UK/EU time zone.</p>
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
                  {method.newTab ? 'Book a call' : siteConfig.contactEmail} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
