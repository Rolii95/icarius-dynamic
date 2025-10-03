const FALLBACK_SITE_URL = 'https://www.icarius-consulting.com'

const sanitizeUrl = (value: string | undefined): string => {
  if (!value) return FALLBACK_SITE_URL

  const trimmed = value.trim()
  if (!trimmed) return FALLBACK_SITE_URL

  let candidate = trimmed
  while (candidate.endsWith('/')) {
    candidate = candidate.slice(0, -1)
  }

  const tryParse = (input: string): string | null => {
    try {
      return new URL(input).origin
    } catch {
      return null
    }
  }

  const origin = tryParse(candidate)
  if (origin) {
    return origin
  }

  if (!/^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(candidate)) {
    const prefixedOrigin = tryParse(`https://${candidate}`)
    if (prefixedOrigin) {
      return prefixedOrigin
    }
  }

  return FALLBACK_SITE_URL
}

export const resolveSiteOrigin = (
  rawValue: string | undefined = process.env.NEXT_PUBLIC_SITE_URL,
): string => sanitizeUrl(rawValue)

export const siteOrigin = resolveSiteOrigin()

export { FALLBACK_SITE_URL as defaultSiteUrl }
