import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

/**
 * robots.txt
 *
 * NEXT_PUBLIC_SITE_URL が未設定のあいだは全ページを Disallow にします。
 * Vercel のプレビューURLや開発環境が検索結果へ出るのを防ぐためです。
 * 公開時は必ず本番ドメインを環境変数へ設定してください。
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_URL) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
