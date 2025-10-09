
// Default/fallback Calendly event URL
const FALLBACK_BOOKING_URL = 'https://calendly.com/icarius/intro-call'

// Plan mapping: map plan keys to specific Calendly event URLs
// You can set these via env (comma-separated) or edit here for static mapping
// Example env: NEXT_PUBLIC_BOOKING_PLAN_MAP="audit-sprint:https://calendly.com/icarius-consulting/audit,delivery-jumpstart:https://calendly.com/icarius-consulting/delivery,ai-readiness:https://calendly.com/icarius-consulting/ai"
const planMap: Record<string, string> = (() => {
  const env = process.env.NEXT_PUBLIC_BOOKING_PLAN_MAP
  if (!env) return {}
  return env.split(',').reduce((acc, pair) => {
    const [key, url] = pair.split(':')
    if (key && url) acc[key.trim()] = url.trim()
    return acc
  }, {} as Record<string, string>)
})()

// Default booking URL (account-level)
const resolvedBookingUrl =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  process.env.NEXT_PUBLIC_CALENDLY_URL ??
  FALLBACK_BOOKING_URL

export const bookingUrl = resolvedBookingUrl

/**
 * Returns the correct Calendly event URL for a given plan, or the default if not mapped.
 * If a plan is mapped in planMap, use that URL. Otherwise, use resolvedBookingUrl.
 * If a plan is present, append ?plan=... for tracking.
 */
export function buildBookingUrl(plan?: string): string {
  let baseUrl = resolvedBookingUrl
  if (plan && planMap[plan]) {
    baseUrl = planMap[plan]
  }

  if (!plan) {
    return baseUrl
  }

  try {
    const url = new URL(baseUrl)
    url.searchParams.set('plan', plan)
    return url.toString()
  } catch (error) {
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}plan=${encodeURIComponent(plan)}`
  }
}
