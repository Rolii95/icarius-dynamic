import dynamic from 'next/dynamic'
import { CheckCircle2, ChevronDown, Phone, Lightbulb, Rocket, Search, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'

import { AssistantForm } from '@/components/AssistantForm'
import { BookCTA } from '@/components/BookCTA'
import { HeroIllustration } from '@/components/HeroIllustration'
import { Section } from '@/components/Section'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import { metadata as rootMetadata } from '@/app/layout'
import { buildFaqPageSchema, coreServices, type FAQItem, stringifyJsonLd } from '@/lib/structured-data'
import { siteOrigin } from '@/lib/config/site'

// Lazy load ROI widget (interactive component, below fold)
const DynamicROIWidget = dynamic(() => import('@/components/ROIWidget').then((mod) => mod.ROIWidget), {
  ssr: false,
  loading: () => (
    <Section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <SkeletonLoader minHeight="160px" />
    </Section>
  ),
})

// Lazy load below-the-fold sections for better initial load
const DynamicWork = dynamic(() => Promise.resolve(Work), { 
  ssr: true,
  loading: () => (
    <Section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <div className="h-8 w-48 rounded bg-white/5 mb-4" />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="min-h-[140px] rounded-2xl border border-white/10 bg-white/5 p-6" />
        ))}
      </div>
    </Section>
  ),
})
const DynamicTestimonials = dynamic(() => Promise.resolve(Testimonials), { 
  ssr: true,
  loading: () => (
    <Section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <div className="h-8 w-48 rounded bg-white/5 mb-4" />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="min-h-[200px] rounded-2xl border border-white/10 bg-white/5 p-6" />
        ))}
      </div>
    </Section>
  ),
})
const DynamicFAQ = dynamic(() => Promise.resolve(FAQ), { 
  ssr: true,
  loading: () => (
    <Section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <div className="h-8 w-32 rounded bg-white/5 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-16 rounded bg-white/5" />
        ))}
      </div>
    </Section>
  ),
})

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

const homepageFaqItems = [
  {
    question: 'What outcomes do you deliver in the first month?',
    answer:
      'Within 30 days you receive a quantified current-state assessment, risk heatmap, and prioritised backlog so leadership can fund the right changes immediately.',
  },
  {
    question: 'How do you work with our internal team?',
    answer:
      'We embed into your ceremonies, co-lead stand-ups, and mentor internal owners so capability and context stay with your team after go-live.',
  },
  {
    question: 'Which platforms and regions do you cover?',
    answer:
      'Workday, SuccessFactors, Dayforce, Oracle, UKG, and surrounding payroll, ATS, and IDM estates across the UK, EMEA, and North America.',
  },
] satisfies readonly FAQItem[]

const title = 'HR technology change that lands and lasts | Icarius Consulting'
const description =
  'Icarius Consulting helps HR, finance, and operations leaders deliver HR technology programmes that pay back fast—HRIT advisory, delivery leadership, audits, and pragmatic AI enablement.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: '/',
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

const metadataBase =
  rootMetadata.metadataBase instanceof URL
    ? rootMetadata.metadataBase
    : new URL((rootMetadata.metadataBase as string | undefined) ?? siteOrigin)

export default function Page({ searchParams }: PageProps) {
  const planParam = searchParams?.plan
  const defaultPlan = Array.isArray(planParam) ? planParam[0] : planParam ?? undefined

  return (
    <div className="space-y-12">
      <Hero />
      <Services />
      <Pricing />
      <DynamicROIWidget />
      <DynamicWork />
      <DynamicTestimonials />
      <DynamicFAQ />
      <CTA defaultPlan={defaultPlan} />
    </div>
  )
}

function Hero() {
  return (
    <Section className="py-16 md:py-24 hero-watermark">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight heading-underline">
            Lead <span className="bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] bg-clip-text text-transparent">HR technology change</span> that lands and lasts
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Boutique HRIT advisors who turn complex roadmaps into measurable outcomes—delivery leadership, platform audits, and AI enablement tuned to your timeline.
          </p>
          {/* Mobile CTA - Stacked with full width */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <BookCTA
              data-cta="hero"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] px-6 py-3 text-base font-semibold text-slate-950 shadow-[0_18px_45px_rgba(12,18,30,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(12,18,30,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60 sm:w-auto"
            >
              Book a 15-min fit call
            </BookCTA>
            <a
              href="#pricing"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-[color:var(--primary)]/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60 sm:w-auto"
            >
              See packages →
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Trusted by FTSE 250 brands, PE-backed scale-ups, and global shared services teams.
          </p>
        </div>
        <HeroIllustration />
      </div>
    </Section>
  )
}

function Services() {
  const serviceIcons = {
    'hrit-advisory': Lightbulb,
    'pmo-delivery': Rocket,
    'hr-systems-audit': Search,
    'hr-ai': Sparkles,
  }

  return (
    <Section id="services" className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold heading-underline">Where we accelerate value</h2>
      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        Targeted interventions that keep strategy, delivery, and run-state operations in lockstep.
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {coreServices.map((service) => {
          const Icon = serviceIcons[service.id as keyof typeof serviceIcons]
          return (
            <li
              key={service.id}
              className="card flex min-h-[200px] flex-col border-white/10 bg-slate-950/50 p-6 transition hover:border-[color:var(--primary)]/40 hover:bg-slate-900/60"
            >
              <Icon className="text-[color:var(--primary-2)] mb-3" size={24} />
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <p className="text-slate-300 text-base mt-2">{service.description}</p>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function Pricing() {
  const cards = [
    {
      name: 'Audit sprint',
      price: 6000,
      plan: 'audit-sprint',
      tagline: 'Three-week diagnostic that quantifies risk, value, and the roadmap to unlock both.',
    },
    {
      name: 'Delivery jumpstart',
      price: 12000,
      plan: 'delivery-jumpstart',
      tagline: 'Embedded delivery leadership to stand up cadence, cutover, and stakeholder confidence fast.',
    },
    {
      name: 'AI readiness',
      price: 9000,
      plan: 'ai-readiness',
      tagline: 'Design safe, compliant AI pilots that reduce handling time without compromising governance.',
    },
  ] as const

  return (
    <Section id="pricing" className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold heading-underline">Packages</h2>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.name}
            className="card flex h-full flex-col border-white/10 bg-slate-950/50 p-6 hover:border-[color:var(--primary)]/40 hover:bg-slate-900/60"
          >
            <h3 className="text-xl font-semibold capitalize">{card.name}</h3>
            <p className="mt-2 text-sm text-slate-400">{card.tagline}</p>
            <p className="mt-4 text-3xl font-bold tracking-tight text-white">£{card.price.toLocaleString('en-GB')}</p>
            <ul className="mt-4 space-y-1 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} /> Board-ready findings deck
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} /> Prioritised backlog with owners
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} /> 30-day co-pilot support
              </li>
            </ul>
            <BookCTA
              data-cta="pricing"
              plan={card.plan}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-[color:var(--primary)]/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60"
            >
              Book a 15-min fit call
            </BookCTA>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Work() {
  return (
    <Section id="work" className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold heading-underline">Proof from recent programmes</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <li
          id="cs-hcm"
          className="card border-white/10 bg-slate-950/50 p-6 transition hover:border-[color:var(--primary)]/40 hover:bg-slate-900/60"
        >
          <h3 className="text-lg font-semibold">Global HCM replacement</h3>
          <p className="mt-2 text-sm text-slate-300">Unified seven regional stacks and staged rollout for 40k colleagues.</p>
        </li>
        <li
          id="cs-payroll"
          className="card border-white/10 bg-slate-950/50 p-6 transition hover:border-[color:var(--primary)]/40 hover:bg-slate-900/60"
        >
          <h3 className="text-lg font-semibold">Payroll consolidation</h3>
          <p className="mt-2 text-sm text-slate-300">12-country payroll control framework with automated reconciliations.</p>
        </li>
        <li
          id="cs-ai"
          className="card border-white/10 bg-slate-950/50 p-6 transition hover:border-[color:var(--primary)]/40 hover:bg-slate-900/60"
        >
          <h3 className="text-lg font-semibold">HR Ops AI assistant</h3>
          <p className="mt-2 text-sm text-slate-300">AI co-pilot that lifted satisfaction and cut resolution time by 34%.</p>
        </li>
      </ul>
    </Section>
  )
}

function Testimonials() {
  const headingId = 'testimonials-heading'

  return (
    <Section
      className="py-12 border-t border-[rgba(255,255,255,.06)]"
      aria-labelledby={headingId}
      role="region"
    >
      <h2 id={headingId} className="text-2xl font-semibold heading-underline">
        Leaders who trust Icarius
      </h2>
      <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <li className="card grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-3 items-start">
          <div className="h-14 w-14 rounded-full border mx-auto sm:mx-0" />
          <div className="text-center sm:text-left">
            <blockquote className="text-base">“Icarius translated our global HCM ambition into a sequenced, fundable plan.”</blockquote>
            <p className="text-sm text-slate-300">— CIO, FTSE 250 hospitality group</p>
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <a className="mini-link" href="/work/global-hcm-replacement">View full case study →</a>
          </div>
        </li>
        <li className="card grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-3 items-start">
          <div className="h-14 w-14 rounded-full border mx-auto sm:mx-0" />
          <div className="text-center sm:text-left">
            <blockquote className="text-base">“The audit sprint exposed risks, quick wins, and gave the board confidence to invest.”</blockquote>
            <p className="text-sm text-slate-300">— HR Director, retail group</p>
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <a className="mini-link" href="/work/payroll-consolidation">View full case study →</a>
          </div>
        </li>
        <li className="card grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-3 items-start">
          <div className="h-14 w-14 rounded-full border mx-auto sm:mx-0" />
          <div className="text-center sm:text-left">
            <blockquote className="text-base">“Our HR Ops assistant now resolves cases in minutes and agents finally trust the data.”</blockquote>
            <p className="text-sm text-slate-300">— Shared services lead, global firm</p>
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <a className="mini-link" href="/work/hr-ops-ai-assistant">View full case study →</a>
          </div>
        </li>
      </ul>
    </Section>
  )
}

function FAQ() {
  const faqJsonLd = stringifyJsonLd(
    buildFaqPageSchema({
      baseUrl: metadataBase,
      path: '/',
      items: homepageFaqItems,
    }),
  )

  return (
    <Section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold heading-underline">Questions leaders ask</h2>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <ul className="divide-y divide-[rgba(255,255,255,.06)]">
        {homepageFaqItems.map((qa, index) => (
          <li key={qa.question + index}>
            <details className="group py-3">
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-left">
                <span className="font-medium">{qa.question}</span>
                <ChevronDown className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="pt-3 text-slate-300">{qa.answer}</div>
            </details>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function CTA({ defaultPlan }: { defaultPlan?: string }) {
  return (
    <Section id="contact" className="py-16">
      <div className="card border-white/10 bg-gradient-to-br from-slate-950/70 via-slate-950/50 to-slate-900/40 p-6 shadow-[0_24px_60px_rgba(12,18,30,0.45)] sm:p-8 md:p-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr),minmax(0,420px)] lg:items-start">
          <div className="space-y-4 text-left">
            <h2 className="text-2xl sm:text-3xl font-semibold heading-underline">Let’s scope your next milestone</h2>
            <p className="text-slate-300">
              Share the change you need to land—new platform, payroll clean-up, or AI enablement—and we’ll outline the fastest, safest route to value.
            </p>
            <p className="text-sm text-slate-400">
              You’ll hear back within one business day with suggested next steps and who from our team will be involved.
            </p>
            <BookCTA
              data-cta="contact"
              plan={defaultPlan}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(12,18,30,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(12,18,30,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]/60 sm:px-6 sm:py-3 sm:text-base"
            >
              <Phone size={18} /> Book a 15-min fit call
            </BookCTA>
          </div>
          <AssistantForm plan={defaultPlan} className="card border-white/10 bg-slate-950/50 p-4 shadow-none sm:p-6" />
        </div>
      </div>
    </Section>
  )
}
