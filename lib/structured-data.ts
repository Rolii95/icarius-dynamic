const SITE_NAME = 'Icarius Consulting'
const SITE_DESCRIPTION =
  'Icarius Consulting helps HR leaders de-risk HRIS change, enable AI in HR, and modernise payroll, integrations, and people analytics.'

export const ORGANIZATION_NAME = SITE_NAME
export const ORGANIZATION_DESCRIPTION = SITE_DESCRIPTION
export const CONTACT_EMAIL = 'hello@icarius-consulting.com'
export const CONTACT_PHONE = '+44 20 4526 6210'
export const CONTACT_PHONE_URI = '+442045266210'

export const BUSINESS_ADDRESS = {
  addressLocality: 'London',
  addressRegion: 'England',
  postalCode: 'WC2N',
  addressCountry: 'GB',
} as const

export type CoreService = {
  id: string
  name: string
  description: string
  serviceType: string
}

export const coreServices = [
  {
    id: 'hrit-advisory',
    name: 'HRIS Strategy & Roadmap',
    description: 'Right-size your HR stack and sequence change for Workday, SAP, Oracle, and more.',
    serviceType: 'HRIS advisory',
  },
  {
    id: 'pmo-delivery',
    name: 'AI Enablement for HR',
    description: 'Identify use-cases, pilots, and guardrails so HR teams deploy safe AI copilots.',
    serviceType: 'HR AI enablement',
  },
  {
    id: 'hr-systems-audit',
    name: 'Payroll & Time Stabilisation',
    description: 'Reduce errors and rework with resilient payroll, time, and absence integrations.',
    serviceType: 'Payroll stabilisation',
  },
  {
    id: 'hr-ai',
    name: 'People Analytics & Reporting',
    description: 'Automate metrics, compliance, and dashboards so HR owns trusted insights.',
    serviceType: 'People analytics',
  },
] as const satisfies readonly CoreService[]

const AREA_SERVED = ['United Kingdom', 'EMEA', 'North America'] as const

const ORGANIZATION_ID_FRAGMENT = '#organization'
const LOCAL_BUSINESS_ID_FRAGMENT = '#local-business'

function resolveWithBase(path: string, baseUrl: URL) {
  return new URL(path, baseUrl).href
}

export function buildOrganizationSchema(baseUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': resolveWithBase(ORGANIZATION_ID_FRAGMENT, baseUrl),
    name: SITE_NAME,
    url: baseUrl.href,
    description: SITE_DESCRIPTION,
    logo: resolveWithBase('/favicon.svg', baseUrl),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        areaServed: AREA_SERVED,
        availableLanguage: ['English'],
      },
    ],
  }
}

export function buildLocalBusinessSchema(baseUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': resolveWithBase(LOCAL_BUSINESS_ID_FRAGMENT, baseUrl),
    name: SITE_NAME,
    url: baseUrl.href,
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    areaServed: AREA_SERVED,
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_ADDRESS,
    },
    parentOrganization: {
      '@id': resolveWithBase(ORGANIZATION_ID_FRAGMENT, baseUrl),
    },
    makesOffer: coreServices.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@id': resolveWithBase(`#service-${service.id}`, baseUrl),
      },
    })),
  }
}

export function buildCoreServiceSchemas(baseUrl: URL) {
  const organizationId = resolveWithBase(ORGANIZATION_ID_FRAGMENT, baseUrl)

  return coreServices.map((service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': resolveWithBase(`#service-${service.id}`, baseUrl),
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    provider: {
      '@id': organizationId,
    },
    areaServed: AREA_SERVED,
    offers: [
      {
        '@type': 'Offer',
        url: resolveWithBase('#services', baseUrl),
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
    ],
  }))
}

export type FAQItem = {
  question: string
  answer: string
}

export function buildFaqPageSchema({
  baseUrl,
  path = '/',
  items,
}: {
  baseUrl: URL
  path?: string
  items: readonly FAQItem[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': resolveWithBase(`${path}#faq`, baseUrl),
    url: resolveWithBase(path, baseUrl),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function stringifyJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
