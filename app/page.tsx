'use client'
import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Calculator, CheckCircle2, ChevronDown, Phone } from 'lucide-react'

import { AssistantForm } from '@/components/AssistantForm'
import { BookCTA } from '@/components/BookCTA'

export default function Page(){
  return (
    <div className="space-y-12">
      <Hero />
      <Services />
      <Pricing />
      <ROI />
      <Work />
      <Testimonials />
      <FAQ />
      <Suspense fallback={<CTAFallback />}> 
        <CTA />
      </Suspense>
    </div>
  )
}

function CTAFallback(){
  return (
    <section id="contact" className="py-16">
      <div className="card p-8 md:p-10 animate-pulse">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),minmax(0,420px)] lg:items-start">
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-white/10" />
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="h-10 w-40 rounded-full border border-white/10" />
          </div>
          <div className="card p-6 shadow-none space-y-4">
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-5/6 rounded bg-white/10" />
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="h-10 w-full rounded bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Hero(){
  return (
    <section className="py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Transform your <span className="bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-2)] bg-clip-text text-transparent">HR Technology</span>
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            HRIT Advisory • Project Delivery • System Audits • AI Solutions. We de-risk complex change and ship measurable outcomes.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#pricing" className="rounded-full bg-[color:var(--primary)] text-slate-900 px-5 py-3">View Packages</a>
            <BookCTA cta="hero" className="rounded-full border px-5 py-3">
              Book a call
            </BookCTA>
          </div>
        </div>
        <div className="card">
          <p className="font-semibold text-[color:var(--primary)] uppercase text-xs">Delivery cockpit</p>
          <p className="text-slate-300 mt-1">Aligned milestones, RAID, adoption & value tracking. Clear owners. No surprises.</p>
        </div>
      </div>
    </section>
  )
}

function Services(){
  return (
    <section id="services" className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold">What we do</h2>
      <ul className="mt-4 grid md:grid-cols-4 gap-4">
        <li className="card"><h3 className="font-semibold">HRIT Advisory</h3><p className="text-slate-300 text-sm mt-1">Target architecture, integration patterns, and build/buy guidance tailored to HR.</p></li>
        <li className="card"><h3 className="font-semibold">Project Delivery</h3><p className="text-slate-300 text-sm mt-1">PMO without the drag: RAID, burn‑down, change enablement, and crisp cutover plans.</p></li>
        <li className="card"><h3 className="font-semibold">System Audits</h3><p className="text-slate-300 text-sm mt-1">Fact‑based config & data reviews with prioritised fixes.</p></li>
        <li className="card"><h3 className="font-semibold">AI Solutions</h3><p className="text-slate-300 text-sm mt-1">Pragmatic automation for HR Ops and knowledge.</p></li>
      </ul>
    </section>
  )
}

function Pricing(){
  const cards = [
    { name: 'Audit Sprint', price: 6000, plan: 'audit-sprint' },
    { name: 'Delivery Jumpstart', price: 12000, plan: 'delivery-jumpstart' },
    { name: 'AI Readiness', price: 9000, plan: 'ai-readiness' },
  ]
  return (
    <section id="pricing" className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold">Packages</h2>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {cards.map(c => (
          <div key={c.name} className="card">
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-3xl font-bold mt-2">£{c.price}</p>
            <ul className="mt-3 text-sm text-slate-300 space-y-1">
              <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Executive readout</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16}/> Findings & backlog</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16}/> 30-day support</li>
            </ul>
            <BookCTA
              cta="pricing"
              plan={c.plan}
              className="mt-4 inline-block rounded-full bg-[color:var(--primary)] text-slate-900 px-4 py-2"
            >
              Book
            </BookCTA>
          </div>
        ))}
      </div>
    </section>
  )
}

function ROI(){
  const [headcount, setHeadcount] = useState(500)
  const [salary, setSalary] = useState(55000)
  const [hours, setHours] = useState(1.5)
  const savings = useMemo(()=>{
    const hourly = salary / 220 / 7.5
    return Math.round(headcount * hours * hourly * 52)
  }, [headcount, salary, hours])
  return (
    <section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold flex items-center gap-2"><Calculator size={20}/> ROI Calculator</h2>
      <div className="grid md:grid-cols-4 gap-4 mt-4 items-end">
        <label className="block">
          <div className="text-sm text-slate-400 mb-1">Employees</div>
          <input type="range" min={50} max={10000} defaultValue={500} onChange={(e)=>setHeadcount(+e.target.value)} className="w-full"/>
          <div className="text-sm text-slate-400">{headcount}</div>
        </label>
        <label className="block">
          <div className="text-sm text-slate-400 mb-1">Average salary (£)</div>
          <input type="number" defaultValue={55000} onChange={(e)=>setSalary(+e.target.value)} className="w-full border rounded px-3 py-2 bg-transparent"/>
        </label>
        <label className="block">
          <div className="text-sm text-slate-400 mb-1">Hours saved / week</div>
          <input type="number" step="0.1" defaultValue={1.5} onChange={(e)=>setHours(+e.target.value)} className="w-full border rounded px-3 py-2 bg-transparent"/>
        </label>
        <div className="card">
          <div className="text-sm text-slate-400">Estimated annual value</div>
          <div className="text-3xl font-bold">£{savings.toLocaleString()}</div>
        </div>
      </div>
    </section>
  )
}

function Work(){
  return (
    <section id="work" className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold">Selected Work</h2>
      <ul className="mt-4 grid md:grid-cols-3 gap-4">
        <li id="cs-hcm" className="card"><h3 className="font-semibold">Global HCM replacement</h3><p className="text-sm text-slate-300 mt-1">Vendor selection and readiness for 40k employees.</p></li>
        <li id="cs-payroll" className="card"><h3 className="font-semibold">Payroll consolidation</h3><p className="text-sm text-slate-300 mt-1">12‑country integration and control framework.</p></li>
        <li id="cs-ai" className="card"><h3 className="font-semibold">HR Ops AI assistant</h3><p className="text-sm text-slate-300 mt-1">Reduced resolution time by 34%.</p></li>
      </ul>
    </section>
  )
}

function Testimonials(){
  return (
    <section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold">What clients say</h2>
      <ul className="mt-4 grid md:grid-cols-3 gap-4">
        <li className="card grid grid-cols-[auto,1fr] gap-3 items-start">
          <div className="h-14 w-14 rounded-full border" />
          <div>
            <blockquote className="text-base">“Icarius brought clarity and pace to a complex HCM migration.”</blockquote>
            <p className="text-sm text-slate-300">— CIO, FTSE250</p>
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <a className="mini-link" href="/work/global-hris-audit">View full case study →</a>
          </div>
        </li>
        <li className="card grid grid-cols-[auto,1fr] gap-3 items-start">
          <div className="h-14 w-14 rounded-full border" />
          <div>
            <blockquote className="text-base">“The audit sprint gave us a pragmatic backlog we actually shipped.”</blockquote>
            <p className="text-sm text-slate-300">— HR Director, Retail</p>
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <a className="mini-link" href="/work/pmo-reboot">View full case study →</a>
          </div>
        </li>
        <li className="card grid grid-cols-[auto,1fr] gap-3 items-start">
          <div className="h-14 w-14 rounded-full border" />
          <div>
            <blockquote className="text-base">“Our HR Ops assistant cut average handle time dramatically.”</blockquote>
            <p className="text-sm text-slate-300">— Shared Services Lead</p>
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <a className="mini-link" href="/work/ai-readiness">View full case study →</a>
          </div>
        </li>
      </ul>
    </section>
  )
}

function FAQ(){
  const qas = [
    { q: 'How quickly can we start?', a: 'We can kick off within 2 weeks, often faster for audits.' },
    { q: 'Do you work globally?', a: 'Yes, we deliver across EMEA/NA with remote-first governance.' },
    { q: 'What systems do you cover?', a: 'Workday, SuccessFactors, Dayforce, Oracle, plus payroll/ATS/IDM.' },
  ];
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="py-12 border-t border-[rgba(255,255,255,.06)]">
      <h2 className="text-2xl font-semibold">FAQ</h2>
      <ul className="divide-y divide-[rgba(255,255,255,.06)]">
        {qas.map((qa, i)=> (
          <li key={i}>
            <button onClick={()=> setOpen(o => o===i ? null : i)} className="w-full flex items-center justify-between py-3 text-left">
              <span className="font-medium">{qa.q}</span>
              <ChevronDown className={`transition-transform ${open===i?'rotate-180':''}`} />
            </button>
            <AnimatePresence initial={false}>
              {open===i && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="pb-3 text-slate-300">{qa.a}</motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CTA(){
  const params = useSearchParams()
  const defaultPlan = params.get('plan')

  return (
    <section id="contact" className="py-16">
      <div className="card p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),minmax(0,420px)] lg:items-start">
          <div className="space-y-4 text-left">
            <h2 className="text-3xl font-semibold">Ready to reduce delivery risk?</h2>
            <p className="text-slate-300">Tell us about your goals. We’ll respond within one business day.</p>
            <p className="text-sm text-slate-400">
              Prefer to jump straight to a conversation? Use the booking link and we’ll tailor the agenda.
            </p>
            <BookCTA
              cta="contact"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3"
            >
              <Phone size={18}/> Book a call
            </BookCTA>
          </div>
          <AssistantForm
            plan={defaultPlan}
            className="card p-6 shadow-none"
          />
        </div>
      </div>
    </section>
  )
}
