import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { CheckCircle2, ChevronDown, Phone } from 'lucide-react'
import type { Metadata } from 'next'

import { AssistantForm } from '@/components/AssistantForm'
import type { ContactModalTriggerProps } from '@/components/ContactModal'
import { HeroIllustration } from '@/components/HeroIllustration'
import { Section } from '@/components/Section'

const DynamicROIWidget = dynamic(() => import('@/components/ROIWidget').then((mod) => mod.ROIWidget), {
  ssr: false,
  loading: () => (
    <Section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <div className="h-40 animate-pulse rounded-lg border border-white/10 bg-white/5" />
    </Section>
  ),
})

const DynamicContactTrigger = dynamic<ContactModalTriggerProps>(
  () => import('@/components/ContactModal').then((mod) => mod.ContactModalTrigger),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm text-slate-300 opacity-70">
        Loading…
      </span>
    ),
  }
)

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

const title = 'HRIT advisory HR systems audit HR AI PMO experts guide'
const description =
  'Navigate HRIT advisory, HR systems audit, HR AI innovation, and PMO delivery with Icarius—boutique consultants keeping people, process, and platforms in sync.'

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

export default function Page({ searchParams }: PageProps) {
  const planParam = searchParams?.plan
  const defaultPlan = Array.isArray(planParam) ? planParam[0] : planParam ?? undefined

  return (
    <div className="space-y-12">
      <Hero />
      <Services />
      <Pricing />
      <DynamicROIWidget />
      <Work />
      <Testimonials />
      <FAQ />
      <Suspense fallback={<CTAFallback />}>
        <CTA defaultPlan={defaultPlan} />
      </Suspense>
    </div>
  )
}

function CTAFallback() {
  return (
    <Section id="contact" className="py-16">
      <div className="card p-8 md:p-10 animate-pulse">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),minmax(0,420px)] lg:items-start">
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="h-10 w-40 rounded-full border border-white/10" />
          </div>
          <div className="card p-6 shadow-none space-y-4">
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-5/6 rounded bg-white/10" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="h-10 w-full rounded bg-white/10" />
          </div>
        </div>
      </div>
    </Section>
  )
}

function Hero() {
  return (
    <Section className="py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Transform your <span className="bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] bg-clip-text text-transparent">HR Technology</span>
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            HRIT Advisory • Project Delivery • System Audits • AI Solutions. We de-risk complex change and ship measurable outcomes.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#pricing" className="rounded-full bg-[color:var(--primary)] text-slate-900 px-5 py-3">View Packages</a>
            <DynamicContactTrigger cta="hero" className="rounded-full border px-5 py-3">
              Book a call
            </DynamicContactTrigger>
          </div>
        </div>
        <HeroIllustration />
      </div>
    </Section>
  )
}

function Services() {
  return (
    <Section id="services" className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold">What we do</h2>
      <ul className="mt-4 grid md:grid-cols-4 gap-4">
        <li className="card"><h3 className="font-semibold">HRIT Advisory</h3><p className="text-slate-300 text-sm mt-1">Target architecture, integration patterns, and build/buy guidance tailored to HR.</p></li>
        <li className="card"><h3 className="font-semibold">Project Delivery</h3><p className="text-slate-300 text-sm mt-1">PMO without the drag: RAID, burn‑down, change enablement, and crisp cutover plans.</p></li>
        <li className="card"><h3 className="font-semibold">System Audits</h3><p className="text-slate-300 text-sm mt-1">Fact‑based config &amp; data reviews with prioritised fixes.</p></li>
        <li className="card"><h3 className="font-semibold">AI Solutions</h3><p className="text-slate-300 text-sm mt-1">Pragmatic automation for HR Ops and knowledge.</p></li>
      </ul>
    </Section>
  )
}

function Pricing() {
  const cards = [
    { name: 'Audit Sprint', price: 6000, plan: 'audit-sprint' },
    { name: 'Delivery Jumpstart', price: 12000, plan: 'delivery-jumpstart' },
    { name: 'AI Readiness', price: 9000, plan: 'ai-readiness' },
  ] as const

  return (
    <Section id="pricing" className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold">Packages</h2>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.name} className="card">
            <h3 className="font-semibold">{card.name}</h3>
            <p className="text-3xl font-bold mt-2">£{card.price}</p>
            <ul className="mt-3 text-sm text-slate-300 space-y-1">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Executive readout</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Findings &amp; backlog</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} /> 30-day support</li>
            </ul>
            <DynamicContactTrigger
              cta="pricing"
              plan={card.plan}
              className="mt-4 inline-block rounded-full bg-[color:var(--primary)] text-slate-900 px-4 py-2"
            >
              Book
            </DynamicContactTrigger>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Work() {
  return (
    <Section id="work" className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold">Selected Work</h2>
      <ul className="mt-4 grid md:grid-cols-3 gap-4">
        <li id="cs-hcm" className="card"><h3 className="font-semibold">Global HCM replacement</h3><p className="text-sm text-slate-300 mt-1">Vendor selection and readiness for 40k employees.</p></li>
        <li id="cs-payroll" className="card"><h3 className="font-semibold">Payroll consolidation</h3><p className="text-sm text-slate-300 mt-1">12‑country integration and control framework.</p></li>
        <li id="cs-ai" className="card"><h3 className="font-semibold">HR Ops AI assistant</h3><p className="text-sm text-slate-300 mt-1">Reduced resolution time by 34%.</p></li>
      </ul>
    </Section>
  )
}

function Testimonials() {
  return (
    <Section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold">What clients say</h2>
      <ul className="mt-4 grid md:grid-cols-3 gap-4">
        <li className="card grid grid-cols-[auto,1fr] gap-3 items-start">
          <div className="h-14 w-14 rounded-full border" />
          <div>
            <blockquote className="text-base">“Icarius brought clarity and pace to a complex HCM migration.”</blockquote>
            <p className="text-sm text-slate-300">— CIO, FTSE250</p>
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <a className="mini-link" href="/work/global-hris-audit">View full case study →</a>
          </div>
        </li>
        <li className="card grid grid-cols-[auto,1fr] gap-3 items-start">
          <div className="h-14 w-14 rounded-full border" />
          <div>
            <blockquote className="text-base">“The audit sprint gave us a pragmatic backlog we actually shipped.”</blockquote>
            <p className="text-sm text-slate-300">— HR Director, Retail</p>
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <a className="mini-link" href="/work/pmo-reboot">View full case study →</a>
          </div>
        </li>
        <li className="card grid grid-cols-[auto,1fr] gap-3 items-start">
          <div className="h-14 w-14 rounded-full border" />
          <div>
            <blockquote className="text-base">“Our HR Ops assistant cut average handle time dramatically.”</blockquote>
            <p className="text-sm text-slate-300">— Shared Services Lead</p>
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <a className="mini-link" href="/work/ai-readiness">View full case study →</a>
          </div>
        </li>
      </ul>
    </Section>
  )
}

function FAQ() {
  const qas = [
    { q: 'How quickly can we start?', a: 'We can kick off within 2 weeks, often faster for audits.' },
    { q: 'Do you work globally?', a: 'Yes, we deliver across EMEA/NA with remote-first governance.' },
    { q: 'What systems do you cover?', a: 'Workday, SuccessFactors, Dayforce, Oracle, plus payroll/ATS/IDM.' },
  ] as const

  return (
    <Section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold">FAQ</h2>
      <ul className="divide-y divide-[rgba(255,255,255,.06)]">
        {qas.map((qa, index) => (
          <li key={qa.q + index}>
            <details className="group py-3">
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-left">
                <span className="font-medium">{qa.q}</span>
                <ChevronDown className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="pt-3 text-slate-300">{qa.a}</div>
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
      <div className="card p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),minmax(0,420px)] lg:items-start">
          <div className="space-y-4 text-left">
            <h2 className="text-3xl font-semibold">Ready to reduce delivery risk?</h2>
            <p className="text-slate-300">Tell us about your goals. We’ll respond within one business day.</p>
            <p className="text-sm text-slate-400">
              Prefer to jump straight to a conversation? Use the booking link and we’ll tailor the agenda.
            </p>
            <DynamicContactTrigger
              cta="contact"
              plan={defaultPlan}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3"
            >
              <Phone size={18} /> Book a call
            </DynamicContactTrigger>
          </div>
          <AssistantForm plan={defaultPlan} className="card p-6 shadow-none" />
        </div>
      </div>
    </Section>
  )
}
