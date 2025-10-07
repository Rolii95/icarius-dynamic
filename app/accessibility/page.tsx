import type { Metadata } from 'next'

import { Section } from '@/components/Section'
import { ConditionalGoBackButton } from '@/components/ConditionalGoBackButton'

const title = 'HRIT advisory HR systems audit HR AI PMO access pledge'
const description =
  'See how our HRIT advisory culture, HR systems audit rigor, HR AI experimentation, and PMO discipline inform accessible design standards upheld across this site.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/accessibility' },
  openGraph: {
    title,
    description,
    url: '/accessibility',
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

export default function AccessibilityPage() {
  return (
    <Section className="py-12">
      <div className="prose prose-invert max-w-3xl mx-auto">
        <div className="mb-6 not-prose">
          <div className="ml-8 mb-2">
            <ConditionalGoBackButton />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight m-0">Accessibility statement</h1>
        </div>
        <p>
          We want everyone to be able to browse icarius-consulting.com without barriers. This statement
          summarises the measures we have taken so far and how you can let us know if something is not
          working as expected.
        </p>
        <h2>What we&apos;re doing</h2>
        <ul>
          <li>Using semantic HTML and proper heading structure across the site.</li>
          <li>Maintaining sufficient colour contrast between text and backgrounds.</li>
          <li>Supporting keyboard navigation for all interactive elements, including the booking modal.</li>
          <li>Testing new components with screen-reader and reduced-motion preferences in mind.</li>
        </ul>
        <h2>Ongoing improvements</h2>
        <p>
          Accessibility is an ongoing effort. As we add new features or content, we review them against
          WCAG 2.1 AA guidelines. If you encounter an issue, we would appreciate you telling us so we can
          address it quickly.
        </p>
        <h2>Contact us</h2>
        <p>
          Email <a href="mailto:hello@icarius-consulting.com">hello@icarius-consulting.com</a> with
          “Accessibility feedback” in the subject line and we&apos;ll get back to you within two business
          days.
        </p>
        <p>Last updated: {new Date().toLocaleDateString('en-GB')}</p>
      </div>
    </Section>
  )
}
