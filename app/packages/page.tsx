import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Packages — Icarius Consulting',
  description: 'Choose the engagement model that fits your operational goals and pace.',
  alternates: { canonical: '/packages' },
}

const packages = [
  {
    name: 'Diagnostic sprint',
    summary:
      'A three-week assessment that surfaces quick wins, risks, and a prioritised roadmap for change.',
  },
  {
    name: 'Transformation partner',
    summary:
      'Embedded leadership across delivery squads to guide major platform or process rollouts.',
  },
  {
    name: 'Fractional operator',
    summary:
      'Part-time executive support to keep initiatives moving while you hire permanent leadership.',
  },
]

export default function PackagesPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="space-y-10">
          <header className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">Packages</h1>
            <p className="text-lg text-slate-300">
              These outlines show how we typically partner with clients. Every package can be adjusted
              to match your stage, geography, and team structure.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {packages.map((offer) => (
              <article
                key={offer.name}
                className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/40 p-6"
              >
                <h2 className="text-2xl font-semibold text-white">{offer.name}</h2>
                <p className="mt-4 text-sm text-slate-300">{offer.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
