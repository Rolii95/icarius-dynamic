import Link from 'next/link'
import { Linkedin, Mail } from 'lucide-react'

import Brand from '@/components/site/Brand'
import { bookingUrl } from '@/lib/booking'
import { footerNavLinks, primaryNavLinks } from '@/lib/navigation'

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/icarius-consulting',
    icon: Linkedin,
  },
]

export function Footer() {
  const insightsMailto = 'mailto:contact@icarius-consulting.com?subject=Site%20Insights%20CTA'
  const ctaHref = bookingUrl || insightsMailto
  const ctaClasses =
    'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(12,18,30,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(12,18,30,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60 sm:px-6 sm:py-3 sm:text-base'
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-[#0B1324] text-slate-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Brand />
            <p className="max-w-md text-sm leading-relaxed text-slate-300">
              Partners to HR technology leaders shipping reliable systems, data integrity, and AI-enabled employee experiences.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={ctaHref} target="_blank" rel="noopener noreferrer" className={`${ctaClasses} w-full sm:w-auto`}>
                Book a 30-min call
              </a>
              <a
                href="mailto:contact@icarius-consulting.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60"
              >
                <Mail className="size-4" aria-hidden="true" />
                contact@icarius-consulting.com
              </a>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60"
                  >
                    <Icon className="size-4" aria-hidden="true" focusable="false" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Explore</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {primaryNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Resources</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {footerNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-[0_18px_60px_rgba(10,16,28,0.45)]">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Ready for your next delivery sprint?</h2>
              <p className="text-sm leading-relaxed text-slate-300">
                Book a working session to de-risk your HRIS roadmap, AI pilots, or operating model.
              </p>
              <a href={ctaHref} target="_blank" rel="noopener noreferrer" className={ctaClasses}>
                Book a 30-min call
              </a>
              <p className="text-xs text-slate-400">
                Prefer email?{' '}
                <a href="mailto:contact@icarius-consulting.com" className="font-medium text-slate-200 transition hover:text-white">
                  contact@icarius-consulting.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex sm:items-center sm:justify-between">
          <p>© {year} Icarius Consulting. All rights reserved.</p>
          <p className="mt-3 sm:mt-0">Building trusted HR data foundations and AI-readiness programmes.</p>
        </div>
      </div>
    </footer>
  )
}
