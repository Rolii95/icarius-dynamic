'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { bookingUrl } from '@/lib/booking'

function trackPlausible(name:string, props?:Record<string,any>){ if (typeof window!=='undefined' && (window as any).plausible){ (window as any).plausible(name, { props }); } }

// Utility for trapping focus within a modal
function trapFocus(modal: HTMLElement) {
  const focusableSelectors = [
    'a[href]', 'area[href]', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])',
    'button:not([disabled])', 'iframe', 'object', 'embed',
    '[tabindex]:not([tabindex="-1"])', '[contenteditable]'
  ]
  const focusableElements = modal.querySelectorAll(focusableSelectors.join(','))
  const firstElement = focusableElements[0] as HTMLElement | undefined
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement | undefined

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      if (!firstElement || !lastElement) return
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    } else if (e.key === 'Escape') {
      // Hide the modal on Escape
      modal.setAttribute('aria-hidden', 'true')
    }
  }

  modal.addEventListener('keydown', handleKeyDown)
  firstElement?.focus()
  return () => {
    modal.removeEventListener('keydown', handleKeyDown)
  }
}

export function Header(){
  const [solid, setSolid] = useState(false)
  const lastActiveElement = useRef<HTMLElement | null>(null)

  useEffect(()=>{
    const onScroll = () => setSolid(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  useEffect(()=>{
    // Handle dynamic [data-book-call] elements using event delegation
    const handleBookCallClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target && target.closest('[data-book-call]')) {
        if (e instanceof MouseEvent) {
          if (e.metaKey || e.ctrlKey || e.button !== 0) {
            return
          }
        }
        e.preventDefault()
        trackPlausible('BookCallClick')
        const calendly = document.getElementById('calendly')
        if (calendly) {
          lastActiveElement.current = document.activeElement as HTMLElement
          calendly.setAttribute('aria-hidden','false')
          calendly.setAttribute('tabIndex', '-1')
          calendly.focus()
          const removeTrap = trapFocus(calendly)
          const observer = new MutationObserver(() => {
            if (calendly.getAttribute('aria-hidden') === 'true' && lastActiveElement.current) {
              lastActiveElement.current.focus()
              observer.disconnect()
              removeTrap()
            }
          })
          observer.observe(calendly, { attributes: true, attributeFilter: ['aria-hidden'] })
        }
      }
    }
    // Attach event delegation at the document level for dynamic elements
    document.addEventListener('click', handleBookCallClick)
    return () => {
      document.removeEventListener('click', handleBookCallClick)
    }
  },[])

  return (
    <header className={`sticky top-0 z-40 transition-colors border-b ${solid ? 'backdrop-blur bg-[rgba(11,16,32,.7)]' : 'bg-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <a href="#top" className="flex items-center gap-3 font-bold leading-none">
          {/* Bigger logo using Next.js Image */}
          <Image
            src="/icarius-logo.svg"
            alt="Icarius logo"
            width={40}
            height={40}
            className="h-9 w-9 md:h-10 md:w-10"
            priority
          />
          {/* Larger brand name */}
          <span className="text-xl md:text-2xl tracking-tight">Icarius Consulting</span>
        </a>       
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#services" className="hover:underline">Services</a>
          <a href="#work" className="hover:underline">Work</a>
          <a href="#pricing" className="hover:underline">Packages</a>
          <a href="#contact" className="hover:underline">Contact</a>
          <a
            data-book-call
            href={bookingUrl}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
          >
            Book a call
          </a>
        </nav>
      </div>
    </header>
  )
}
