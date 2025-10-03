import type { Metadata } from 'next'
import { bookingUrl } from '@/lib/booking'

export const metadata: Metadata = {
  title: 'Contact — Icarius Consulting',
  description: 'Book time with the Icarius team or request more information about our services.',
}

const contactMethods = [
  {
    label: 'Book an intro call',
    href: bookingUrl,
    description: 'Schedule a 30-minute call to discuss your goals and whether we are the right fit.',
    newTab: true,
    cta: 'contact-page',
    plan: 'general',
  },
  {
    label: 'Email the team',
    href: 'mailto:hello@icarius-consulting.com',
    description: 'Share context, RFPs, or supporting information and we will reply within one business day.',
    newTab: false,
    cta: 'contact-page-email',
    plan: 'general',
  },
]

export default function ContactPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="space-y-6">
          <header className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
            <p className="text-lg text-slate-300">
              We would love to learn about the challenges in front of you. Choose the option below that
              suits you best and we will respond quickly.
            </p>
          </header>
          <ul className="space-y-4">
            {contactMethods.map((method) => (
              <li key={method.label} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
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
    </section>
  )
}
