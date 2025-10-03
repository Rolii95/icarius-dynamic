export type Post = {
  slug: string
  title: string
  summary: string
  date: string
  tags: string[]
}

export const POSTS: Post[] = [
  {
    slug: 'hris-audit-sprint-playbook',
    title: 'HRIS Audit Sprint Playbook',
    summary:
      'Use a six-week sprint model to surface HRIS risk, quantify impact, and build a remediation roadmap leaders trust.',
    date: '2024-11-05',
    tags: ['HRIS', 'Audit', 'Governance'],
  },
  {
    slug: 'delivery-jumpstart-30-days',
    title: 'Delivery Jumpstart: 30 Days to Program Momentum',
    summary:
      'Stabilise struggling HR transformations with a 30-day cadence reset that rebuilds trust and accelerates value.',
    date: '2024-10-22',
    tags: ['Delivery', 'PMO', 'Transformation'],
  },
  {
    slug: 'modernizing-hr-service-delivery-analytics',
    title: 'Modernizing HR Service Delivery with Analytics',
    summary:
      'Analytics-led operating reviews surface backlog root causes and clear the path to better employee experience.',
    date: '2024-10-24',
    tags: ['Analytics', 'Service Delivery'],
  },
  {
    slug: 'pmo-sprints-for-global-hr-transformations',
    title: 'PMO Sprints for Global HR Transformations',
    summary:
      'Break large HR programs into accountable sprints to accelerate delivery without losing executive trust.',
    date: '2024-10-03',
    tags: ['PMO', 'Transformation'],
  },
  {
    slug: 'ai-readiness-for-hr',
    title: 'AI Readiness for HR',
    summary:
      'Prepare HR data, governance, and teams for responsible AI pilots that balance innovation with compliance.',
    date: '2024-09-18',
    tags: ['AI', 'HR', 'Change'],
  },
  {
    slug: 'ai-change-management-playbook-for-people-teams',
    title: 'An AI Change Management Playbook for People Teams',
    summary:
      'Tactics to de-risk AI pilots with cross-functional governance, data readiness, and workforce enablement.',
    date: '2024-09-12',
    tags: ['AI', 'Change Management'],
  },
  {
    slug: 'aligning-hrit-roadmaps-with-business-outcomes',
    title: 'Aligning HRIT Roadmaps with Business Outcomes',
    summary:
      'Use value-stream prioritization to focus HR technology roadmaps on measurable enterprise OKRs.',
    date: '2024-08-20',
    tags: ['HRIT', 'Strategy'],
  },
  {
    slug: 'roi-of-hr-automation',
    title: 'Calculating the ROI of HR Automation',
    summary:
      'Build a data-backed business case for automating HR operations by combining cost, experience, and risk insights.',
    date: '2024-08-28',
    tags: ['Automation', 'ROI', 'HR Operations'],
  },
]

export const SORTED_POSTS = [...POSTS].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
)
