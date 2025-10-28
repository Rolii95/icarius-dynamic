export type Post = {
  slug: string
  title: string
  summary: string
  date: string
  tags: string[]
}

export const POSTS: Post[] = [
  {
    slug: 'essential-hr-skills-2026',
    title: 'The Essential Skills Your HR Team Needs for 2026',
    summary:
      'Discover the critical AI and data literacy skills your HR team needs to bridge the 48-point gap and drive strategic value in 2026.',
    date: '2025-10-28',
    tags: ['AI', 'Skills', 'HR Strategy'],
  },
  {
    slug: 'hris-audit-sprint-playbook',
    title: 'HRIS Diagnostic Sprint Playbook',
    summary:
      'Use a six-week sprint model to surface HRIS risk, quantify impact, and build a remediation roadmap leaders trust.',
    date: '2024-11-05',
    tags: ['HRIS', 'Audit', 'Governance'],
  },
  {
    slug: 'delivery-jumpstart-30-days',
    title: 'HRIS Implementation Jumpstart: 30 Days to Program Momentum',
    summary:
      'Stabilise struggling HR transformations with a 30-day cadence reset that rebuilds trust and accelerates value.',
    date: '2024-10-22',
    tags: ['Delivery', 'PMO', 'Transformation'],
  },
  {
    slug: 'ai-readiness-for-hr',
    title: 'AI HR Readiness',
    summary:
      'Prepare HR data, governance, and teams for responsible AI pilots that balance innovation with compliance.',
    date: '2024-09-18',
    tags: ['AI', 'HR', 'Change'],
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
