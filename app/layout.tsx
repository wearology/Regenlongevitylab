import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo, IBM_Plex_Sans } from 'next/font/google'
import { LoadingScreen } from '@/components/loading-screen'
import { SmoothScroll } from '@/components/smooth-scroll'
import { ConsultationProvider } from '@/components/consultation-modal'
import './globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Regen — Regenerative Science. Clearly Delivered.',
  description:
    'Regen develops and delivers advanced peptide therapies with uncompromising quality, traceability, and clinical precision.',
  generator: 'v0.app',
  keywords: [
    'Regen',
    'peptide',
    'research peptides',
    'retatrutide',
    'tirzepatide',
    'semaglutide',
    'European Pharmacopoeia',
  ],
  openGraph: {
    title: 'Regen — Regenerative Science. Clearly Delivered.',
    description:
      'Laboratory-grade research peptides with independent European lab testing and cold-chain shipping.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#003f35',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light bg-background ${ibmPlexSans.variable} ${archivo.variable}`}
    >
      <body className="font-sans antialiased">
        <LoadingScreen />
        <SmoothScroll />
        <ConsultationProvider>{children}</ConsultationProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
