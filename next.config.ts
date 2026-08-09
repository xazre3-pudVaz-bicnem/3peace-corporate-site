import type { NextConfig } from 'next'

/**
 * 正規ドメインのホスト名を NEXT_PUBLIC_SITE_URL から取り出す。
 * URLをコードへ直接書かないため、環境変数からのみ解決する。
 */
function canonicalHost(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw || !/^https?:\/\//.test(raw)) return undefined
  try {
    return new URL(raw).host
  } catch {
    return undefined
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1600, 1920],
  },

  /**
   * 本番デプロイでは、Vercel が自動で付与する *.vercel.app のURLから
   * 正規ドメインへ 308 リダイレクトする。
   *
   * 同じ内容が2つのURLで見られる状態（重複コンテンツ）を防ぐための処理。
   *
   * 安全のため、次の条件をすべて満たすときだけ有効になる。
   *   - NEXT_PUBLIC_SITE_URL が設定されている
   *   - その値が *.vercel.app ではない（自分自身へのリダイレクトを避ける）
   *   - VERCEL_ENV が production（プレビューは閲覧できる必要があるため対象外）
   *
   * apex（wwwなし）から www へのリダイレクトは Vercel 側のドメイン設定で
   * 行われるため、ここでは扱わない。
   */
  async redirects() {
    const host = canonicalHost()
    if (!host) return []
    if (host.endsWith('.vercel.app')) return []
    if (process.env.VERCEL_ENV !== 'production') return []

    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '.*\\.vercel\\.app' }],
        destination: `https://${host}/:path*`,
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
