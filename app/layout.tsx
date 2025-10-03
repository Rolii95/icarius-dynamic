import type { Metadata } from 'next'
import '@/styles/globals.css'
import { SiteProviders } from '@/components/consent-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { inter } from '@/app/fonts'

export const metadata: Metadata = {
  title: 'Icarius Consulting — HRIT Advisory & Delivery',
  description: 'HRIT advisory, project delivery, system audits, and AI solutions.',
  metadataBase: new URL('https://www.icarius-consulting.com'),
  openGraph: {
    type: 'website',
    title: 'Icarius Consulting',
    description: 'HRIT advisory, project delivery, system audits, and AI solutions.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/twitter-image', width: 1200, height: 630 }],
  },
  icons: { icon: '/favicon.ico', shortcut: '/favicon.svg', apple: '/apple-touch-icon.png' },
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
      <body className={`${inter.className} bg-transparent text-slate-100`}>
        <a href="#main" className="skip-link">Skip to content</a>
        <SiteProviders>
          <Header />
          <main id="main" className="container mx-auto px-4">
            {children}
          </main>
          <Footer />
        </SiteProviders>
      </body>
    </html>
  )
}
