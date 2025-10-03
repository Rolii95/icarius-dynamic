import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of service — Icarius Consulting',
  description: 'Commercial terms governing consulting engagements with Icarius Consulting.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <section className="py-12">
      <div className="prose prose-invert max-w-3xl mx-auto">
        <h1>Terms of service</h1>
        <p>
          These terms outline the basis on which Icarius Consulting delivers advisory and project
          services. We aim to keep them concise and human readable. For any engagement, we will provide
          a statement of work that supplements these principles.
        </p>
        <h2>Scope of services</h2>
        <p>
          Work is defined in writing before we begin. Any change in scope, deliverables, or timeline is
          agreed collaboratively in email or through an updated statement of work.
        </p>
        <h2>Fees and invoicing</h2>
        <p>
          Unless otherwise stated, fees are quoted exclusive of applicable taxes. We invoice either at
          the end of each milestone or monthly in arrears for time-and-materials engagements. Payment
          terms are 14 days from invoice date.
        </p>
        <h2>Client responsibilities</h2>
        <p>
          Successful delivery depends on timely access to people, systems, and information. The client
          will nominate an executive sponsor and day-to-day contact to help resolve blockers quickly.
        </p>
        <h2>Confidentiality</h2>
        <p>
          Both parties agree to keep confidential information private and to use it solely for the
          purpose of delivering the engagement. Icarius Consulting may reference anonymised learnings in
          future work but will never disclose client-identifiable data without consent.
        </p>
        <h2>Intellectual property</h2>
        <p>
          Deliverables created specifically for the engagement belong to the client once fees are paid
          in full. Icarius Consulting retains ownership of pre-existing frameworks, templates, or tools
          used to deliver the work and may reuse them in other projects.
        </p>
        <h2>Liability</h2>
        <p>
          Our aggregate liability arising from an engagement is limited to the fees paid for the relevant
          services. We do not accept responsibility for indirect or consequential losses.
        </p>
        <h2>Cancellation</h2>
        <p>
          Either party may end an engagement with 14 days&apos; written notice. Work completed or committed
          prior to termination will be billed. We will cooperate to hand over materials and knowledge
          smoothly.
        </p>
        <p>Last updated: {new Date().toLocaleDateString('en-GB')}</p>
      </div>
    </section>
  )
}
