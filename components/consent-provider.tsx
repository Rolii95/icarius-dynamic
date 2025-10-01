'use client'
import { useEffect, useState } from 'react'
import Script from 'next/script'

export function ConsentProvider({ children }: { children: React.ReactNode }){
  const [consent, setConsent] = useState<'unknown'|'all'|'essential'>(()=> (typeof window !== 'undefined' ? (localStorage.getItem('icarius_consent') as any) || 'unknown' : 'unknown'))
  useEffect(()=>{ if (consent !== 'unknown') localStorage.setItem('icarius_consent', consent) }, [consent])
  return (
    <>
      {consent==='all' && (
        <Script id="plausible" strategy="afterInteractive" data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'icarius-consulting.com'} src="https://plausible.io/js/plausible.js" />
      )}
      {children}
      {consent==='unknown' && (
        <div className="fixed inset-0 flex items-end justify-center p-4 z-50">
          <div className="bg-[linear-gradient(160deg,var(--surface),var(--surface-2))] border border-[rgba(255,255,255,.12)] rounded-2xl p-4 w-full max-w-xl shadow-lg">
            <p className="text-sm"><strong>Cookies & analytics</strong><br/><span className="text-slate-300">We use privacy‑friendly analytics to improve this site. No marketing cookies.</span></p>
            <div className="flex gap-2 mt-2">
              <button onClick={()=>setConsent('all')} className="rounded-full bg-[color:var(--primary)] text-slate-900 px-4 py-2">Allow analytics</button>
              <button onClick={()=>setConsent('essential')} className="rounded-full border px-4 py-2">Essential only</button>
            </div>
          </div>
        </div>
      )}
      <div className="modal" id="calendly" aria-hidden="true" role="dialog" aria-modal="true">
        <div className="modal-box" role="document">
          <h3 className="text-xl font-semibold">Book an intro call</h3>
          <div id="calendlyInline" className="calendly-inline-widget" data-url={process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/icarius/intro-call'} style={{minWidth:320, height:660}}></div>
          <button className="rounded-full border px-4 py-2 mt-2" onClick={()=>document.getElementById('calendly')?.setAttribute('aria-hidden','true')}>Close</button>
        </div>
      </div>
    </>
  )
}
