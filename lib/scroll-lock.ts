// Shared body scroll lock utility
// Uses iOS-friendly fixed-position technique and supports nested locks via a counter.

let lockCount = 0
let previousScrollY = 0

export function lockBodyScroll(): void {
  if (typeof window === 'undefined') return

  lockCount += 1
  if (lockCount > 1) {
    // Already locked by another overlay
    return
  }

  previousScrollY = window.scrollY
  const body = document.body
  body.style.position = 'fixed'
  body.style.top = `-${previousScrollY}px`
  body.style.width = '100%'
}

export function unlockBodyScroll(): void {
  if (typeof window === 'undefined') return

  if (lockCount === 0) {
    return
  }

  lockCount -= 1
  if (lockCount > 0) {
    // Other overlays still active
    return
  }

  const body = document.body
  const top = body.style.top
  body.style.position = ''
  body.style.top = ''
  body.style.width = ''

  const y = Math.abs(parseInt(top || '0', 10)) || 0
  window.scrollTo(0, y)
}
