'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

function trackPlausible(name:string, props?:Record<string,any>){ if (typeof window!=='undefined' && (window as any).plausible){ (window as any).plausible(name, { props }); } }

export function Header(){
  const [solid, setSolid] = useState(false)
  useEffect(()=>{
    const onScroll = () => setSolid(window.scrollY > 8)
    onScroll(); window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])
  useEffect(()=>{
    const on = (e: Event) => { e.preventDefault(); trackPlausible('BookCallClick'); document.getElementById('calendly')?.setAttribute('aria-hidden','false') }
    const els = document.querySelectorAll('[data-book-call]')
    els.forEach(el => el.addEventListener('click', on))
    return ()=> els.forEach(el => el.removeEventListener('click', on))
  },[])
  return (
    <header className={`sticky top-0 z-40 transition-colors border-b ${solid ? 'backdrop-blur bg-[rgba(11,16,32,.7)]' : 'bg-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <a href="#top" className="flex items-center gap-3 font-bold leading-none">
  {/* Bigger logo */}
  <img src="/icarius-logo.svg" alt="Icarius logo" className="h-9 w-9 md:h-10 md:w-10" />
  {/* Larger brand name */}
  <span className="text-xl md:text-2xl tracking-tight">Icarius Consulting</span>
   </a>       
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#services" className="hover:underline">Services</a>
          <a href="#work" className="hover:underline">Work</a>
          <a href="#pricing" className="hover:underline">Packages</a>
          <a href="#contact" className="hover:underline">Contact</a>
          <a data-book-call href="#" className="inline-flex items-center gap-2 rounded-full border px-4 py-2">Book a call</a>
        </nav>
      </div>
    </header>
  )
}
