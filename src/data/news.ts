/**
 * お知らせデータ。
 *
 * 記事が0件のあいだは、トップページのお知らせセクションとヘッダーのリンクが
 * 自動的に非表示になり、/news はサイトマップから除外され noindex になります。
 *
 * 記事を追加するとすべて自動的に有効になります。
 */

export type NewsCategory = 'お知らせ' | '施工情報' | '採用情報'

export type News = {
  slug: string
  title: string
  category: NewsCategory
  /** 公開日 ISO 8601（例: '2026-08-01'） */
  publishedAt: string
  /** 更新日（任意） */
  updatedAt?: string
  /** 一覧・meta description に使う要約 */
  summary: string
  /** 本文（段落配列。空行は不要） */
  body: string[]
  /** アイキャッチ（public/images/news/ に配置。無い場合は省略） */
  image?: { src: string; alt: string }
  published: boolean
}

export const news: News[] = []

export const publishedNews = news
  .filter((n) => n.published)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export const hasNews = publishedNews.length > 0

export function getNews(slug: string): News | undefined {
  return publishedNews.find((n) => n.slug === slug)
}
