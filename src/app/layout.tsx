import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileCta } from '@/components/layout/MobileCta'
import { JsonLd } from '@/components/ui/JsonLd'
import { hvacBusinessSchema, organizationSchema, websiteSchema } from '@/lib/schema'
import { BRAND, HOME_TITLE, SITE_URL } from '@/lib/seo'
import { site } from '@/data/site'

/**
 * 欧文のみ next/font で読み込み、和文は端末内蔵フォントを使用します。
 * 和文Webフォントは容量が大きく LCP に影響するため、意図的に読み込んでいません。
 */
const latin = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-latin',
  weight: ['400', '700'],
})

const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim()
const siteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: {
    // 各ページは「｜3Peace」を自分で付けず、このテンプレートに任せる
    default: HOME_TITLE,
    template: `%s｜${BRAND}`,
  },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: true, address: false, email: false },
  ...(siteVerification ? { verification: { google: siteVerification } } : {}),
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={latin.variable}>
      <head>
        {/*
          スクロール表示アニメーション（.reveal）は JavaScript で表示状態にしている。
          JavaScript が無効な環境で本文が非表示のままにならないよう、
          その場合はアニメーションを無効化して最初から表示する。
        */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="pb-[var(--mobile-cta-height)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:bg-navy focus:px-4 focus:py-3 focus:text-white"
        >
          本文へスキップ
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileCta />

        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={hvacBusinessSchema()} />

        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  )
}
