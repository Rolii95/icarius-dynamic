'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, CheckCircle2, Circle, Clock, Flag, ShieldAlert, Target, TrendingUp } from 'lucide-react'

import { Section } from '@/components/Section'

const phases = [
  {
    id: 'phase-1',
    title: 'Phase 1 · Assess & Align',
    timeline: 'Weeks 0-12',
    objective:
      'Transform fragmented AI efforts into a single, compliant framework that closes the trust deficit and stops wasted spend.',
    summary:
      'Deliver the readiness audit and governance foundation executives need before funding large-scale automation.',
    metrics: {
      riskScore: 68,
      roiConfidence: 22,
      adoptionIndex: 35,
    },
    deliverables: [
      {
        id: 'skills-audit',
        title: 'Skills Gap & Risk Audit',
        timeframe: 'Weeks 0-6',
        why: 'Quantify immediate risk exposure and eliminate disconnected “Random Acts of AI.”',
        summary:
          'Formal 48-point assessment detailing capability gaps, tool readiness, and the cost of underutilised AI licenses.',
        outputs: ['AI HR Capability Audit Scorecard', 'Three Hidden Costs Risk Memo'],
        tasks: [
          {
            id: 'skills-audit-1',
            label: 'Inventory all HR functions and AI tools to surface duplication and underused investments.',
          },
          {
            id: 'skills-audit-2',
            label: 'Run the 48-point AI readiness assessment to quantify critical data literacy and governance gaps.',
          },
          {
            id: 'skills-audit-3',
            label: 'Model the financial exposure created by the gaps to frame the board risk conversation.',
          },
        ],
        metrics: [
          { label: 'Risk exposure baseline', current: '68 / 100', target: '≤ 30 / 100' },
          { label: 'Underutilised AI spend', current: '£480k', target: 'Reinvestment plan signed-off' },
        ],
      },
      {
        id: 'governance-framework',
        title: 'AI Governance Framework',
        timeframe: 'Weeks 7-12',
        why: 'Guarantee compliance, ethical integrity, and employee trust before scaling automation.',
        summary:
          'Cross-functional charter covering ethical standards, privacy controls, and escalation paths for every AI initiative.',
        outputs: ['Governance Charter & RACI', 'Bias Mitigation Standards', 'Data Privacy Protocol Map'],
        tasks: [
          {
            id: 'governance-framework-1',
            label: 'Stand up cross-functional AI council with HR, IT, Legal and Data stakeholders.',
          },
          {
            id: 'governance-framework-2',
            label: 'Draft ethical guidelines and bias testing protocol ready for board ratification.',
          },
          {
            id: 'governance-framework-3',
            label: 'Publish privacy and data retention rules aligned to GDPR/CCPA obligations.',
          },
        ],
        metrics: [
          { label: 'Governance council readiness', current: 'Charter drafted', target: 'Board sign-off' },
          { label: 'Regulatory compliance', current: 'GDPR gaps identified', target: 'Remediation plan approved' },
        ],
      },
    ],
  },
  {
    id: 'phase-2',
    title: 'Phase 2 · Build & Empower',
    timeline: 'Weeks 0-20',
    objective:
      'Close the human bottleneck, enable dual fluency, and prove ROI with controlled AI pilots before scaling.',
    summary: 'Convert the strategic plan into capability through role-specific training and co-created pilots.',
    metrics: {
      riskScore: 44,
      roiConfidence: 58,
      adoptionIndex: 62,
    },
    deliverables: [
      {
        id: 'literacy-programmes',
        title: 'Role-Specific AI Literacy Programmes',
        timeframe: 'Weeks 0-12',
        why: 'Unlock ROI by equipping every HR function to validate, optimise, and challenge AI outputs.',
        summary:
          'Hands-on, role-based curriculum covering technical fluency and human-centred judgement for HR teams.',
        outputs: ['Dual Fluency Training & Impact Report', 'Function-Specific Learning Paths'],
        tasks: [
          {
            id: 'literacy-programmes-1',
            label: 'Co-design learning journeys with HR leaders tied to live processes and datasets.',
          },
          {
            id: 'literacy-programmes-2',
            label: 'Deliver blended sessions on prompt design, data validation, and bias escalation.',
          },
          {
            id: 'literacy-programmes-3',
            label: 'Track competency gains with pre/post assessments linked to productivity metrics.',
          },
        ],
        metrics: [
          { label: 'Training completion', current: '64%', target: '≥ 90% by week 12' },
          { label: 'Competency uplift', current: '+18 pts', target: '+30 pts target' },
        ],
      },
      {
        id: 'pilot-co-creation',
        title: 'High-Impact Pilot Deployment',
        timeframe: 'Weeks 13-20',
        why: 'De-risk scaling by demonstrating measurable business impact and adoption confidence.',
        summary:
          'Frontline HR teams co-create an AI pilot in a high-value workflow with clear ROI thresholds and friction tracking.',
        outputs: ['Pilot Project Validation Deck', 'Internal AI Champion Playbook'],
        tasks: [
          {
            id: 'pilot-co-creation-1',
            label: 'Select pilot scope with high-value KPIs (e.g. time-to-hire) and data quality readiness.',
          },
          {
            id: 'pilot-co-creation-2',
            label: 'Embed HR champions in build, testing, and feedback loops to drive ownership.',
          },
          {
            id: 'pilot-co-creation-3',
            label: 'Validate success metrics and document friction points before recommending scale.',
          },
        ],
        metrics: [
          { label: 'Pilot KPI attainment', current: '82% of target', target: '≥ 100% before scale' },
          { label: 'Champion coverage', current: '6 functions engaged', target: 'All priority HR teams' },
        ],
      },
    ],
  },
  {
    id: 'phase-3',
    title: 'Phase 3 · Scale & Adapt',
    timeline: 'Weeks 0-24',
    objective:
      'Embed AI readiness in culture, communicate the human-first narrative, and hand over sustainable governance.',
    summary:
      'Shift from project to operating model with transparent communications and continuous capability refresh.',
    metrics: {
      riskScore: 32,
      roiConfidence: 74,
      adoptionIndex: 78,
    },
    deliverables: [
      {
        id: 'communications',
        title: 'Enterprise AI Communications',
        timeframe: 'Weeks 0-12',
        why: 'Manage change and retention by positioning AI as an augmenter and proving early wins.',
        summary:
          'Transformation narrative, stakeholder FAQs, and success-story cadence that reinforce trust in human-machine teaming.',
        outputs: ['AI HR Communication Toolkit', 'Executive Talking Points & FAQ Library'],
        tasks: [
          {
            id: 'communications-1',
            label: 'Publish the transformation narrative explaining how AI frees HR for strategic work.',
          },
          {
            id: 'communications-2',
            label: 'Showcase pilot quick wins across internal channels with human impact metrics.',
          },
          {
            id: 'communications-3',
            label: 'Stand up a transparent Q&A loop addressing ethics, privacy, and job-security concerns.',
          },
        ],
        metrics: [
          { label: 'Communication cadence', current: '6 / 10 assets live', target: 'All assets deployed' },
          { label: 'Employee confidence', current: '72% positive sentiment', target: '≥ 85% confidence' },
        ],
      },
      {
        id: 'sustainability',
        title: 'Adaptability & Sustainability Mechanisms',
        timeframe: 'Weeks 13-24',
        why: 'Future-proof the organisation by institutionalising continuous learning and governance ownership.',
        summary:
          'Reverse mentoring network, quarterly capability reviews, and formal governance handover to internal leaders.',
        outputs: ['Final Governance Handover & Sustainability Plan', 'Next-Generation Competency Matrix'],
        tasks: [
          {
            id: 'sustainability-1',
            label: 'Launch reverse mentoring pairs and quarterly AI capability forums.',
          },
          {
            id: 'sustainability-2',
            label: 'Integrate AI competencies and ethics compliance into performance reviews.',
          },
          {
            id: 'sustainability-3',
            label: 'Secure CHRO / CIO sign-off on the long-term governance and learning roadmap.',
          },
        ],
        metrics: [
          { label: 'Governance transfer', current: '80% responsibilities accepted', target: '100% signed-off' },
          { label: 'Learning loop adherence', current: 'Quarterly forums scheduled', target: 'Execution proof at handover' },
        ],
      },
    ],
  },
] as const

type TaskStatus = Record<string, boolean>

type Phase = (typeof phases)[number]
type Deliverable = Phase['deliverables'][number]

function buildInitialTaskStatus(): TaskStatus {
  const initial: TaskStatus = {}
  for (const phase of phases) {
    for (const deliverable of phase.deliverables) {
      for (const task of deliverable.tasks) {
        initial[task.id] = false
      }
    }
  }
  return initial
}

function getPhaseProgress(phase: Phase, taskStatus: TaskStatus) {
  const totalTasks = phase.deliverables.reduce((total, deliverable) => total + deliverable.tasks.length, 0)
  const completedTasks = phase.deliverables.reduce(
    (total, deliverable) => total + deliverable.tasks.filter((task) => taskStatus[task.id]).length,
    0,
  )

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return { totalTasks, completedTasks, progress }
}

export function AiHrDashboard() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<Phase['id']>(phases[0].id)
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<Deliverable['id']>(phases[0].deliverables[0].id)
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(() => buildInitialTaskStatus())

  useEffect(() => {
    const selectedPhase = phases.find((phase) => phase.id === selectedPhaseId)
    if (!selectedPhase) {
      return
    }
    const hasDeliverable = selectedPhase.deliverables.some((deliverable) => deliverable.id === selectedDeliverableId)
    if (!hasDeliverable) {
      setSelectedDeliverableId(selectedPhase.deliverables[0]?.id ?? selectedDeliverableId)
    }
  }, [selectedDeliverableId, selectedPhaseId])

  const selectedPhase = phases.find((phase) => phase.id === selectedPhaseId) ?? phases[0]
  const selectedDeliverable =
    selectedPhase.deliverables.find((deliverable) => deliverable.id === selectedDeliverableId) ?? selectedPhase.deliverables[0]

  const overallStats = useMemo(() => {
    const totalTasks = phases.reduce((total, phase) => total + getPhaseProgress(phase, taskStatus).totalTasks, 0)
    const completedTasks = phases.reduce((total, phase) => total + getPhaseProgress(phase, taskStatus).completedTasks, 0)
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)
    const averageRisk = Math.round(phases.reduce((total, phase) => total + phase.metrics.riskScore, 0) / phases.length)
    const averageRoiConfidence = Math.round(
      phases.reduce((total, phase) => total + phase.metrics.roiConfidence, 0) / phases.length,
    )
    const averageAdoption = Math.round(
      phases.reduce((total, phase) => total + phase.metrics.adoptionIndex, 0) / phases.length,
    )

    return { totalTasks, completedTasks, progress, averageRisk, averageRoiConfidence, averageAdoption }
  }, [taskStatus])

  const phaseProgress = useMemo(
    () =>
      phases.map((phase) => ({
        id: phase.id,
        progress: getPhaseProgress(phase, taskStatus).progress,
        completed: getPhaseProgress(phase, taskStatus).completedTasks,
        total: getPhaseProgress(phase, taskStatus).totalTasks,
      })),
    [taskStatus],
  )

  return (
    <div className="space-y-12">
      <Section className="py-12 border-t border-[rgba(255,255,255,.06)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Executive dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">AI HR Readiness Command Center</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Track the governance, capability, and adoption milestones that turn the three-phase plan into measurable business
              impact. Update task completion live in leadership reviews to show progress toward the strategic AI roadmap.
            </p>
          </div>
          <div className="card md:max-w-xs">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Overall completion</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-semibold">{overallStats.progress}%</span>
              <span className="text-sm text-slate-400">{overallStats.completedTasks} of {overallStats.totalTasks} tasks</span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)]"
                style={{ width: `${overallStats.progress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              <ShieldAlert size={16} /> Risk posture
            </div>
            <div className="mt-3 text-3xl font-semibold">{overallStats.averageRisk}/100</div>
            <p className="mt-2 text-sm text-slate-300">
              Average score across readiness audit and governance sign-offs. Lower scores indicate reduced exposure to bias and
              compliance failure.
            </p>
          </div>
          <div className="card">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              <TrendingUp size={16} /> ROI confidence
            </div>
            <div className="mt-3 text-3xl font-semibold">{overallStats.averageRoiConfidence}%</div>
            <p className="mt-2 text-sm text-slate-300">
              Derived from pilot validation and productivity deltas. Use this as the anchor for future automation investment
              decisions.
            </p>
          </div>
          <div className="card">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              <Activity size={16} /> Adoption momentum
            </div>
            <div className="mt-3 text-3xl font-semibold">{overallStats.averageAdoption}%</div>
            <p className="mt-2 text-sm text-slate-300">
              Composite of training completion, champion coverage, and communication reach. Demonstrates cultural readiness to
              scale.
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-12 border-t border-[rgba(255,255,255,.06)]">
        <div className="grid gap-8 lg:grid-cols-[300px,1fr]">
          <aside className="space-y-4">
            <div>
              <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400">Phase progress</h2>
              <p className="mt-2 text-sm text-slate-300">
                Select a phase to view deliverables, KPIs, and board-ready talking points.
              </p>
            </div>
            <div className="space-y-3">
              {phases.map((phase) => {
                const stats = phaseProgress.find((item) => item.id === phase.id)
                const isActive = phase.id === selectedPhaseId
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setSelectedPhaseId(phase.id)}
                    className={`card w-full text-left transition ${
                      isActive
                        ? 'border-[color:var(--primary)]/80 bg-gradient-to-r from-[color:var(--surface)] to-[color:var(--surface-2)]'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{phase.timeline}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-100">{phase.title}</p>
                      </div>
                      <Flag size={16} className="text-[color:var(--primary)]" />
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{phase.objective}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Progress</span>
                        <span>{stats?.progress ?? 0}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[color:var(--primary)]"
                          style={{ width: `${stats?.progress ?? 0}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {stats?.completed ?? 0} of {stats?.total ?? 0} tasks complete
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>

          <div className="space-y-8">
            <div className="card">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Strategic goal</p>
                  <h2 className="mt-2 text-2xl font-semibold">{selectedPhase.title}</h2>
                  <p className="mt-2 text-slate-300">{selectedPhase.summary}</p>
                </div>
                <div className="grid gap-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-[color:var(--primary)]" />
                    Risk score: <span className="font-semibold text-slate-100">{selectedPhase.metrics.riskScore}/100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-[color:var(--primary)]" />
                    ROI confidence: <span className="font-semibold text-slate-100">{selectedPhase.metrics.roiConfidence}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[color:var(--primary)]" />
                    Adoption index: <span className="font-semibold text-slate-100">{selectedPhase.metrics.adoptionIndex}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
              <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-[0.2em] text-slate-400">Key deliverables</h3>
                {selectedPhase.deliverables.map((deliverable) => {
                  const totalTasks = deliverable.tasks.length
                  const completedTasks = deliverable.tasks.filter((task) => taskStatus[task.id]).length
                  const progress = Math.round(
                    (completedTasks / Math.max(1, deliverable.tasks.length)) * 100
                  )
                  const isActive = deliverable.id === selectedDeliverable.id

                  return (
                    <button
                      key={deliverable.id}
                      type="button"
                      onClick={() => setSelectedDeliverableId(deliverable.id)}
                      className={`card w-full text-left transition ${
                        isActive
                          ? 'border-[color:var(--primary)]/80 bg-gradient-to-r from-[color:var(--surface)] to-[color:var(--surface-2)]'
                          : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{deliverable.timeframe}</p>
                          <p className="mt-1 text-sm font-semibold text-slate-100">{deliverable.title}</p>
                        </div>
                        <Clock size={16} className="text-[color:var(--primary)]" />
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{deliverable.why}</p>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[color:var(--primary)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {completedTasks} of {totalTasks} tasks complete
                      </p>
                    </button>
                  )
                })}
              </div>

              <div className="card space-y-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Delivery focus</p>
                    <h3 className="mt-2 text-xl font-semibold">{selectedDeliverable.title}</h3>
                    <p className="mt-2 text-slate-300">{selectedDeliverable.summary}</p>
                  </div>
                  <div className="text-sm text-slate-300">
                    <p className="flex items-center gap-2">
                      <Target size={16} className="text-[color:var(--primary)]" /> {selectedDeliverable.timeframe}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Primary outputs</p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-300">
                      {selectedDeliverable.outputs.map((output) => (
                        <li key={output} className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[color:var(--primary)]" /> {output}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-slate-400">Actionable tasks</h4>
                  <ul className="mt-3 space-y-3">
                    {selectedDeliverable.tasks.map((task) => {
                      const isComplete = taskStatus[task.id]
                      return (
                        <li key={task.id} className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setTaskStatus((previous) => ({
                                ...previous,
                                [task.id]: !previous[task.id],
                              }))
                            }
                            className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border transition ${
                              isComplete
                                ? 'border-[color:var(--primary)] bg-[color:var(--primary)] text-slate-900'
                                : 'border-white/30 text-white'
                            }`}
                            aria-pressed={isComplete}
                            aria-label={isComplete ? 'Mark task incomplete' : 'Mark task complete'}
                          >
                            {isComplete ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          </button>
                          <span className={`text-sm ${isComplete ? 'text-slate-200 line-through decoration-[color:var(--primary)]/80' : 'text-slate-200'}`}>
                            {task.label}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-slate-400">KPI checkpoints</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {selectedDeliverable.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                        <p className="mt-2 text-sm font-semibold text-slate-100">Current: {metric.current}</p>
                        <p className="mt-1 text-xs text-slate-400">Target: {metric.target}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default AiHrDashboard
