import type { Metadata } from 'next'
import './globals.css'
import { ConsentProvider } from '@/components/consent-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Icarius Consulting — HRIT Advisory & Delivery',
  description: 'HRIT advisory, project delivery, system audits, and AI solutions.',
  metadataBase: new URL('https://www.icarius-consulting.com'),
  openGraph: { type: 'website', title: 'Icarius Consulting', description: 'HRIT advisory, project delivery, system audits, and AI solutions.', images: ['/og-image-brand.png'] },
  twitter: { card: 'summary_large_image', images: ['/og-image-brand.png'] },
  icons: { icon: '/favicon.ico', shortcut: '/favicon.svg', apple: '/apple-touch-icon.png' },
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-transparent text-slate-100">
        <ConsentProvider>
          <Header />
          <main id="content" className="container mx-auto px-4">
            {children}
          </main>
          <Footer />
        </ConsentProvider>
      </body>
    </html>
  )
}
