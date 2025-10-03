'use client'

import { useMemo, useState } from 'react'

export type InlineROIProps = {
  className?: string
}

const RANGE_MIN = 50
const RANGE_MAX = 10000

export function InlineROI({ className }: InlineROIProps) {
  const [headcount, setHeadcount] = useState(500)
  const [salary, setSalary] = useState(55000)
  const [hours, setHours] = useState(1.5)

  const { weeklySavings, annualSavings } = useMemo(() => {
    const hourlyCost = salary / 220 / 7.5
    const weekly = headcount * hours * hourlyCost
    const annual = weekly * 52

    return {
      weeklySavings: Math.round(weekly),
      annualSavings: Math.round(annual),
    }
  }, [headcount, salary, hours])

  const containerClasses = [
    'rounded-2xl border border-white/10 bg-[rgba(8,15,34,0.75)] p-6 text-left shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)] backdrop-blur',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClasses}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">ROI Snapshot</p>
          <h3 className="mt-1 text-3xl font-semibold text-white">£{annualSavings.toLocaleString()}</h3>
          <p className="text-sm text-slate-300/90">Estimated annual value created with Icarius.</p>
        </div>
        <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-3 text-right text-sm text-cyan-100">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Weekly impact</div>
          <div className="text-lg font-semibold text-white">£{weeklySavings.toLocaleString()}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium text-slate-100">Team size</span>
          <div className="rounded-xl bg-white/5 px-3 py-2">
            <input
              type="range"
              min={RANGE_MIN}
              max={RANGE_MAX}
              value={headcount}
              onChange={(event) => setHeadcount(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700/40 accent-cyan-400"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>{RANGE_MIN.toLocaleString()}</span>
              <span className="font-semibold text-slate-200">{headcount.toLocaleString()}</span>
              <span>{RANGE_MAX.toLocaleString()}</span>
            </div>
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium text-slate-100">Average salary (£)</span>
          <input
            type="number"
            min={20000}
            step={500}
            value={salary}
            onChange={(event) => setSalary(Number(event.target.value))}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium text-slate-100">Hours saved / employee</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={hours}
            onChange={(event) => setHours(Number(event.target.value))}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </label>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Calculation assumes 220 working days and 7.5 hour work day per employee. Adjust the inputs to see how Icarius can drive
        meaningful efficiency gains for your team.
      </p>
    </div>
  )
}
