const SITE_NAME = 'Icarius Consulting'
const SITE_DESCRIPTION =
  'Icarius Consulting helps HR, finance, and operations leaders deliver HR technology programmes that pay back fast—HRIT advisory, programme leadership, audits, and pragmatic AI enablement.'

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
    name: 'HRIT Advisory',
    description: 'Target architecture, roadmap shaping, and sequencing that connect HR strategy to delivery.',
    serviceType: 'HRIT advisory',
  },
  {
    id: 'pmo-delivery',
    name: 'Project Delivery',
    description: 'Embedded programme leadership, cadence, and change enablement that keep rollouts on track.',
    serviceType: 'PMO delivery',
  },
  {
    id: 'hr-systems-audit',
    name: 'System Audits',
    description: 'Config, data, and process diagnostics that prioritise fixes by quantified impact.',
    serviceType: 'HR systems audit',
  },
  {
    id: 'hr-ai',
    name: 'AI Solutions',
    description: 'Guardrailed automation and knowledge AI that remove toil while staying compliant.',
    serviceType: 'HR AI solutions',
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
