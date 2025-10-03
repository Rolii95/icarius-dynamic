import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services — Icarius Consulting',
  description:
    'Explore the consulting services Icarius offers to modernise operations and finance teams.',
  alternates: { canonical: '/services' },
}

const services = [
  {
    title: 'Operating model design',
    description:
      'Align roles, systems, and processes around the outcomes that matter most so teams can scale',
  },
  {
    title: 'Platform implementation leadership',
    description:
      'Navigate ERP, HRIS, or billing deployments with a partner who has led global rollouts before.',
  },
  {
    title: 'Process optimisation sprints',
    description:
      'Identify waste, codify best practices, and automate the manual steps that slow delivery.',
  },
  {
    title: 'Fractional operations support',
    description:
      'Bridge leadership gaps or accelerate change with an embedded, outcomes-focused operator.',
  },
]

export default function ServicesPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="space-y-10">
          <header className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">Services</h1>
            <p className="text-lg text-slate-300">
              Each engagement is tailored to your stage of growth, but the pillars below outline how
              we typically help founders and operators remove operational friction.
            </p>
          </header>
          <dl className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="rounded-xl border border-slate-800 bg-slate-950/40 p-6">
                <dt className="text-xl font-medium text-white">{service.title}</dt>
                <dd className="mt-3 text-sm text-slate-300">{service.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
