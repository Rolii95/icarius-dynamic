'use client'

import {
  type MouseEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

type AccessibleModalProps = {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
  initialFocusRef?: RefObject<HTMLElement>
}

export function AccessibleModal({
  open,
  onClose,
  labelledBy,
  children,
  initialFocusRef,
}: AccessibleModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    lastFocusedElementRef.current = document.activeElement as HTMLElement | null

    const container = contentRef.current
    const focusTarget = initialFocusRef?.current ?? container

    const id = window.requestAnimationFrame(() => {
      focusTarget?.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(id)
  }, [open, initialFocusRef])

  useEffect(() => {
    if (!open) {
      const lastFocused = lastFocusedElementRef.current
      if (lastFocused) {
        lastFocused.focus({ preventScroll: true })
      }
      lastFocusedElementRef.current = null
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS) ?? [],
      ).filter((element) => !element.hasAttribute('data-modal-ignore'))

      if (focusableElements.length === 0) {
        event.preventDefault()
        contentRef.current?.focus({ preventScroll: true })
        return
      }

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      const current = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (current === first || !focusableElements.includes(current as HTMLElement)) {
          event.preventDefault()
          last.focus({ preventScroll: true })
        }
        return
      }

      if (current === last) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === overlayRef.current) {
        onClose()
      }
    },
    [onClose],
  )

  if (!mounted) {
    return null
  }

  return createPortal(
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 transition-opacity ${
        open ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'
      }`}
      aria-hidden={open ? 'false' : 'true'}
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[color:var(--surface)] p-6 shadow-xl outline-none"
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
