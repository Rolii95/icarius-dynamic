import type { Metadata } from 'next'

import { Section } from '@/components/Section'

export const metadata: Metadata = {
  title: 'Accessibility statement — Icarius Consulting',
  description: 'Steps Icarius Consulting takes to keep this website usable for everyone.',
  alternates: { canonical: '/accessibility' },
}

export default function AccessibilityPage() {
  return (
    <Section className="py-12">
      <div className="prose prose-invert max-w-3xl mx-auto">
        <h1>Accessibility statement</h1>
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
