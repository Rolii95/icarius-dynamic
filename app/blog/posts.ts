export type Post = {
  slug: string
  title: string
  summary: string
  date: string
  tags: string[]
}

export const POSTS: Post[] = [
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
]

export const SORTED_POSTS = [...POSTS].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
)
