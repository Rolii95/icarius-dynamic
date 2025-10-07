import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import '@/styles/globals.css'
import { SiteProviders } from '@/components/consent-provider'
import { Header } from '@/components/header'
import { inter } from '@/app/fonts'
import { ViewObserver } from '@/app/providers'
import { siteOrigin } from '@/lib/config/site'
import {
  buildCoreServiceSchemas,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  ORGANIZATION_DESCRIPTION,
  stringifyJsonLd,
} from '@/lib/structured-data'

// Lazy load components below the fold for better initial page load
const Footer = dynamic(() => import('@/components/footer').then((mod) => ({ default: mod.Footer })), {
  ssr: true,
})
const ChatWidget = dynamic(() => import('@/components/ChatWidget').then((mod) => ({ default: mod.ChatWidget })), {
  ssr: false,
})
const BackToTop = dynamic(() => import('@/components/BackToTop').then((mod) => ({ default: mod.BackToTop })), {
  ssr: false,
})
const ConditionalGoBackButton = dynamic(() => import('@/components/ConditionalGoBackButton').then((mod) => ({ default: mod.ConditionalGoBackButton })), {
  ssr: false,
})

const fallbackTitle = 'HRIT advisory HR systems audit HR AI PMO experts guide'
const fallbackDescription = ORGANIZATION_DESCRIPTION

const metadataBaseUrl = new URL(siteOrigin)

export const metadata: Metadata = {
  title: fallbackTitle,
  description: fallbackDescription,
  metadataBase: metadataBaseUrl,
  openGraph: {
    type: 'website',
    title: fallbackTitle,
    description: fallbackDescription,
    url: '/',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: fallbackTitle,
    description: fallbackDescription,
    images: [{ url: '/twitter-image', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', shortcut: '/favicon.svg', apple: '/apple-touch-icon.png' },
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const metadataBase =
    metadata.metadataBase instanceof URL
      ? metadata.metadataBase
      : new URL((metadata.metadataBase as string | undefined) ?? siteOrigin)
  const structuredData = stringifyJsonLd([
    buildOrganizationSchema(metadataBase),
    buildLocalBusinessSchema(metadataBase),
    ...buildCoreServiceSchemas(metadataBase),
  ])

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                functionality_storage: 'denied',
                security_storage: 'granted'
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} text-slate-100`}>
        <ViewObserver />
        <a href="#main" className="skip-link">Skip to content</a>
        <SiteProviders>
          <Header />
          <ConditionalGoBackButton />
          <main id="main" tabIndex={-1} className="container mx-auto px-4 pb-32">
            {children}
          </main>
          <Footer />
          <ChatWidget />
          <BackToTop />
        </SiteProviders>
      </body>
    </html>
  )
}
