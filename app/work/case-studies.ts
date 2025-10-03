export type CaseStudy = {
  slug: string
  title: string
  summary: string
  hero: {
    eyebrow: string
    title: string
    description: string
  }
  overview: {
    client: string
    industry: string
    geography: string
    timeframe: string
    services: string[]
  }
  challenge: string[]
  approach: {
    heading: string
    description: string
  }[]
  outcomes: {
    label: string
    value: string
  }[]
  testimonial?: {
    quote: string
    person: string
    role: string
  }
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'global-hcm-replacement',
    title: 'Global HCM replacement',
    summary: 'Vendor selection and readiness for 40k employees.',
    hero: {
      eyebrow: 'FTSE250 hospitality group',
      title: 'Replacing fragmented HR platforms with a single global HCM',
      description:
        'Icarius led the vendor selection, commercial negotiation, and deployment planning for a hospitality group operating across 40 countries. The programme created a unified employee record, payroll interface, and analytics capability for 40,000 colleagues.',
    },
    overview: {
      client: 'Global hospitality scale-up',
      industry: 'Hospitality & Leisure',
      geography: '40 countries',
      timeframe: '9-month engagement',
      services: [
        'Vendor selection',
        'Programme leadership',
        'Change management',
        'Data readiness',
      ],
    },
    challenge: [
      'The client was running seven regional HR platforms with inconsistent data structures, access controls, and compliance coverage.',
      'Leadership needed clarity on the total cost of ownership and roadmap to consolidate onto a single platform without disrupting day-to-day operations during peak trading periods.',
      'The existing team lacked capacity to run a full market scan while managing ongoing payroll remediation work.',
    ],
    approach: [
      {
        heading: 'Shaped the business case and roadmap',
        description:
          'We created a quantified current-state assessment covering compliance risk, support effort, and integration spend. This informed a board-approved business case with staged benefits realisation checkpoints.',
      },
      {
        heading: 'Ran an accelerated market evaluation',
        description:
          'Icarius facilitated vendor demos, reference checks, and commercial negotiations across three shortlisted platforms. We introduced a decision framework that aligned HR, Finance, and IT stakeholders on the future-state blueprint.',
      },
      {
        heading: 'Established delivery foundations',
        description:
          'Our team designed the global template, data cleansing playbooks, and change plan covering 22 localisation tracks. We onboarded a blended client and partner team and set up PMO and risk controls ready for deployment.',
      },
    ],
    outcomes: [
      { label: 'Annual run-rate savings', value: '£4.2m' },
      { label: 'Manual HR reporting reduction', value: '45%' },
      { label: 'Countries live in wave one', value: '14' },
    ],
    testimonial: {
      quote: 'Icarius brought clarity and pace to a complex HCM migration.',
      person: 'Chief Information Officer',
      role: 'FTSE250 hospitality group',
    },
  },
  {
    slug: 'payroll-consolidation',
    title: 'Payroll consolidation',
    summary: '12-country integration and control framework.',
    hero: {
      eyebrow: 'Retail & eCommerce group',
      title: 'Creating a single payroll control framework across 12 countries',
      description:
        'A private-equity backed retailer needed to consolidate payroll operations following a series of acquisitions. Icarius mapped the end-to-end payroll lifecycle, stood up a governance model, and embedded a data-driven control framework.',
    },
    overview: {
      client: 'Multi-brand retailer',
      industry: 'Retail & eCommerce',
      geography: '12 countries',
      timeframe: '16-week sprint',
      services: ['Process discovery', 'Integration design', 'Control framework', 'Service transition'],
    },
    challenge: [
      'Disparate payroll providers created inconsistent employee experiences and reporting lag.',
      'Manual reconciliations increased compliance risk and obscured real labour costs for finance partners.',
      'Acquisition integration targets required a repeatable onboarding playbook and clearer KPIs.',
    ],
    approach: [
      {
        heading: 'Mapped the current-state payroll estate',
        description:
          'We ran discovery interviews across HR, Finance, and local operations teams to document provider contracts, integrations, and support models. The result was a heatmap of issues with quantified impact.',
      },
      {
        heading: 'Designed the future-state integration architecture',
        description:
          'Our architects defined a reference integration design that standardised pay element mapping, approvals, and retro handling. We implemented automated reconciliations that fed exception dashboards for each market.',
      },
      {
        heading: 'Embedded a governance and control framework',
        description:
          'Icarius introduced tiered controls, quarterly assurance cycles, and service-level reporting. We trained local leads and transitioned the model to an internal centre of excellence.',
      },
    ],
    outcomes: [
      { label: 'Payroll error rate', value: '↓ 63%' },
      { label: 'Time to onboard new market', value: '4 weeks' },
      { label: 'Finance reporting lag', value: '↓ from 12 to 3 days' },
    ],
    testimonial: {
      quote: 'The audit sprint gave us a pragmatic backlog we actually shipped.',
      person: 'HR Director',
      role: 'Retail group',
    },
  },
  {
    slug: 'hr-ops-ai-assistant',
    title: 'HR Ops AI assistant',
    summary: 'Reduced resolution time by 34%.',
    hero: {
      eyebrow: 'Global professional services firm',
      title: 'Deploying an AI assistant to accelerate HR case resolution',
      description:
        'Facing rising ticket volumes and long handling times, a shared services team partnered with Icarius to design, pilot, and scale an AI assistant. The solution combined knowledge base modernisation with human-in-the-loop guardrails.',
    },
    overview: {
      client: 'Professional services firm',
      industry: 'Business services',
      geography: 'EMEA & North America',
      timeframe: '12-week pilot, 6-month scale-up',
      services: ['Service design', 'AI experiment design', 'Knowledge management', 'Change enablement'],
    },
    challenge: [
      'Ticket volumes were growing 18% year-on-year, stretching an already lean HR operations team.',
      'Agents spent significant time searching for policy answers across outdated knowledge bases.',
      'Leadership needed a safe path to experiment with generative AI without compromising compliance.',
    ],
    approach: [
      {
        heading: 'Built an actionable backlog',
        description:
          'We analysed 18 months of ticket data to identify high-volume themes and automation candidates. The team prioritised scenarios where AI-generated guidance could remove repetitive triage work.',
      },
      {
        heading: 'Launched a controlled AI pilot',
        description:
          'Icarius implemented a retrieval-augmented assistant layered on top of the refreshed knowledge base. Guardrails, auditing, and human-in-the-loop approvals ensured compliant responses.',
      },
      {
        heading: 'Scaled adoption with change support',
        description:
          'We delivered playbooks, training, and communications that built trust with agents and business stakeholders. Feedback loops informed continuous model tuning and knowledge updates.',
      },
    ],
    outcomes: [
      { label: 'Average handle time reduction', value: '34%' },
      { label: 'First-contact resolution', value: '↑ to 61%' },
      { label: 'Employee satisfaction', value: '↑ 18 pts' },
    ],
    testimonial: {
      quote: 'Our HR Ops assistant cut average handle time dramatically.',
      person: 'Shared Services Lead',
      role: 'Global professional services firm',
    },
  },
]
