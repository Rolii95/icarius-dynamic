import type { Metadata } from 'next'

import { AiHrDashboard } from '@/components/AiHrDashboard'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.icarius-consulting.com'
const canonicalUrl = `${baseUrl}/resources/ai-hr-dashboard`

export const metadata: Metadata = {
  title: 'AI HR Readiness Dashboard | Icarius Consulting',
  description:
    'Interactive executive dashboard translating the three-phase AI HR readiness roadmap into actionable deliverables, risk metrics, and ROI checkpoints.',
  alternates: { canonical: '/resources/ai-hr-dashboard' },
  openGraph: {
    title: 'AI HR Readiness Dashboard',
    description:
      'Command-center view of the Icarius three-phase AI HR readiness plan with tasks, KPIs, and governance milestones.',
    url: canonicalUrl,
    images: [{ url: `${baseUrl}/hero.svg`, width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default function AiHrDashboardPage() {
  return <AiHrDashboard />
}
