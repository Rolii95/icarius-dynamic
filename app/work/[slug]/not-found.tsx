import Link from 'next/link'

import { Section } from '@/components/Section'

export default function NotFound() {
  return (
    <Section className="py-24">
      <div className="container mx-auto max-w-3xl rounded-3xl border border-[rgba(255,255,255,0.08)] bg-slate-950/60 p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl h1-accent heading-underline">
          Case study not available
        </h1>
        <p className="mt-4 text-base text-slate-300">
          The case study you were looking for has moved or is no longer published. You can browse the latest programmes we can
          share from our work index.
        </p>
        <Link
          href="/work"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-[color:var(--primary)]/60 hover:text-white"
        >
          Return to work case studies
        </Link>
      </div>
    </Section>
  )
}
