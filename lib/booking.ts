const FALLBACK_BOOKING_URL = 'https://calendly.com/icarius/intro-call'

const resolvedBookingUrl =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  process.env.NEXT_PUBLIC_CALENDLY_URL ??
  FALLBACK_BOOKING_URL

export const bookingUrl = resolvedBookingUrl

export function buildBookingUrl(plan?: string) {
  if (!plan) {
    return resolvedBookingUrl
  }

  try {
    const url = new URL(resolvedBookingUrl)
    url.searchParams.set('plan', plan)
    return url.toString()
  } catch (error) {
    const separator = resolvedBookingUrl.includes('?') ? '&' : '?'
    return `${resolvedBookingUrl}${separator}plan=${encodeURIComponent(plan)}`
  }
}
