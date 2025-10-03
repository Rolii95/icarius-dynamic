import type { Metadata } from 'next'

import { Section } from '@/components/Section'

const title = 'HRIT advisory HR systems audit HR AI PMO privacy guard'
const description =
  'See how our HRIT advisory, HR systems audit, HR AI, and PMO engagements handle contact data, protect confidentiality, and honour trust you extend to Icarius.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/privacy' },
  openGraph: {
    title,
    description,
    url: '/privacy',
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

export default function PrivacyPage() {
  return (
    <Section className="py-12">
      <div className="prose prose-invert max-w-3xl mx-auto">
        <h1>Privacy policy</h1>
        <p>
          Icarius Consulting operates as a boutique advisory firm. We only collect the personal
          information that you choose to share with us—typically when you book a call, subscribe to
          updates, or reach out via email. This page explains what we collect, how we use it, and how
          you can contact us about your data.
        </p>
        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Contact details:</strong> your name, work email address, company and any context
            you include when you complete a form or send us a message.
          </li>
          <li>
            <strong>Usage data:</strong> high-level analytics about how the website is used. We rely on
            a privacy-focused analytics provider that does not use cookies unless you explicitly grant
            consent.
          </li>
        </ul>
        <h2>How we use your information</h2>
        <p>
          We process the details you provide solely to respond to your enquiry, deliver consulting
          services, or share information you asked for. We do not sell or rent personal data, and we
          only keep it for as long as necessary to fulfil the purpose for which it was collected.
        </p>
        <h2>Your rights and choices</h2>
        <p>
          You can request a copy of the information we hold about you, ask us to update it, or request
          deletion at any time. To exercise these rights, simply email
          <a href="mailto:privacy@icarius-consulting.com"> privacy@icarius-consulting.com</a> and we will
          respond within two business days.
        </p>
        <h2>Third-party services</h2>
        <p>
          We use trusted processors to host this website, schedule calls, and send transactional
          emails. Those providers only process your data on our instructions and under strict
          confidentiality obligations. We do not enable third-party advertising trackers.
        </p>
        <h2>Updates</h2>
        <p>
          We review this policy periodically to ensure it remains accurate. Significant changes will be
          highlighted on this page with a new “last updated” date.
        </p>
        <p>Last updated: {new Date().toLocaleDateString('en-GB')}</p>
      </div>
    </Section>
  )
}
