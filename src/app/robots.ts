import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

/**
 * robots.txt
 *
 * サイトURLが解決できた場合（＝本番デプロイ）のみクロールを許可します。
 * プレビュー環境やURLが未解決の環境では全ページ Disallow になり、
 * プレビューURLが検索結果へ出るのを防ぎます。
 *
 * サイトURLの解決規則は src/lib/seo.ts を参照してください。
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_URL) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Next.js の内部エンドポイントはクロールさせない
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
