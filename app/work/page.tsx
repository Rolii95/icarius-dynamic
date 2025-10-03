import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work — Icarius Consulting',
  description: 'See examples of the outcomes we help operations and finance teams deliver.',
}

const highlights = [
  {
    client: 'Global hospitality scale-up',
    result:
      'Integrated finance and workforce management systems across 12 countries, reducing manual reporting time by 45%.',
  },
  {
    client: 'Enterprise payroll provider',
    result:
      'Redesigned onboarding workflow and knowledge base, cutting time-to-value for new clients from weeks to days.',
  },
  {
    client: 'AI-enabled professional services firm',
    result:
      'Mapped the delivery lifecycle and introduced QA checkpoints that doubled customer satisfaction scores.',
  },
]

export default function WorkPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="space-y-10">
          <header className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">Our work</h1>
            <p className="text-lg text-slate-300">
              We specialise in engagements that blend operational rigour with the empathy required to
              steer change. Here are a few recent examples of the results our clients achieved.
            </p>
          </header>
          <ul className="space-y-6">
            {highlights.map((item) => (
              <li key={item.client} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
                <h2 className="text-xl font-semibold text-white">{item.client}</h2>
                <p className="mt-3 text-sm text-slate-300">{item.result}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
