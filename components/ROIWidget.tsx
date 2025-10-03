'use client'

import { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'

export function ROIWidget() {
  const [headcount, setHeadcount] = useState(500)
  const [salary, setSalary] = useState(55000)
  const [hours, setHours] = useState(1.5)

  const savings = useMemo(() => {
    const hourly = salary / 220 / 7.5
    return Math.round(headcount * hours * hourly * 52)
  }, [headcount, salary, hours])

  return (
    <section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Calculator size={20} /> ROI Calculator
      </h2>
      <div className="grid md:grid-cols-4 gap-4 mt-4 items-end">
        <label className="block">
          <div className="text-sm text-slate-400 mb-1">Employees</div>
          <input
            type="range"
            min={50}
            max={10000}
            value={headcount}
            onChange={(event) => setHeadcount(Number(event.target.value))}
            className="w-full"
          />
          <div className="text-sm text-slate-400">{headcount.toLocaleString()}</div>
        </label>
        <label className="block">
          <div className="text-sm text-slate-400 mb-1">Average salary (£)</div>
          <input
            type="number"
            value={salary}
            onChange={(event) => setSalary(Number(event.target.value))}
            className="w-full border rounded px-3 py-2 bg-transparent"
          />
        </label>
        <label className="block">
          <div className="text-sm text-slate-400 mb-1">Hours saved / week</div>
          <input
            type="number"
            step="0.1"
            value={hours}
            onChange={(event) => setHours(Number(event.target.value))}
            className="w-full border rounded px-3 py-2 bg-transparent"
          />
        </label>
        <div className="card">
          <div className="text-sm text-slate-400">Estimated annual value</div>
          <div className="text-3xl font-bold">£{savings.toLocaleString()}</div>
        </div>
      </div>
    </section>
  )
}
