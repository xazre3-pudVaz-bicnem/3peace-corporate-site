import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { publishedServices } from '@/data/services'
import { publishedWorks, hasWorks } from '@/data/works'
import { publishedJobs } from '@/data/jobs'
import { publishedNews, hasNews } from '@/data/news'
import { publishedColumns, hasColumns, columnLastModified } from '@/data/columns'
import { indexableAreas } from '@/data/areas'
import {
  getAllPosts,
  getIndexableCategories,
  categoryLastModified,
  postLastModified,
} from '@/lib/blog'

/**
 * サイトマップ。
 *
 * 含めるのは「公開中かつインデックス対象」のページだけです。
 * enabled: false の地域、published: false のデータ、記事が0件のときの一覧ページ、
 * noindex を設定しているページは出力しません。
 *
 * URL は SITE_URL から生成しているため、独自ドメインへ移行しても
 * NEXT_PUBLIC_SITE_URL を変えるだけで切り替わります。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return []

  const now = new Date()
  const url = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`

  const staticEntries: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: url('/service'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/recruit'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/about'), lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: url('/message'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: url('/faq'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/contact'), lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
    { url: url('/privacy'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const serviceEntries: MetadataRoute.Sitemap = publishedServices.map((service) => ({
    url: url(`/service/${service.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  // 地域ページは enabled かつ index のものだけ
  const areaEntries: MetadataRoute.Sitemap = indexableAreas.map((area) => ({
    url: url(`/area/${area.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // 専門コラムは記事がある場合のみ一覧・詳細を含める
  const columnEntries: MetadataRoute.Sitemap = hasColumns
    ? [
        { url: url('/column'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        ...publishedColumns.map((column) => ({
          url: url(`/column/${column.slug}`),
          lastModified: columnLastModified(column),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        })),
      ]
    : []

  // ブログ（自動投稿）は記事がある場合のみ一覧・詳細を含める。
  // カテゴリー一覧は記事が一定数たまってから（薄い一覧ページを載せない）
  const blogPosts = getAllPosts()
  const blogEntries: MetadataRoute.Sitemap =
    blogPosts.length > 0
      ? [
          { url: url('/blog'), lastModified: now, changeFrequency: 'daily', priority: 0.8 },
          ...blogPosts.map((post) => ({
            url: url(`/blog/${post.slug}`),
            lastModified: postLastModified(post),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
          })),
          ...getIndexableCategories().map((category) => ({
            url: url(`/blog/category/${category.slug}`),
            lastModified: categoryLastModified(category.slug),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
          })),
        ]
      : []

  // 施工事例は1件以上ある場合のみ一覧・詳細を含める
  const workEntries: MetadataRoute.Sitemap = hasWorks
    ? [
        { url: url('/works'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        ...publishedWorks.map((work) => ({
          url: url(`/works/${work.slug}`),
          lastModified: work.completedAt ? new Date(`${work.completedAt}-01`) : now,
          changeFrequency: 'yearly' as const,
          priority: 0.7,
        })),
      ]
    : []

  const jobEntries: MetadataRoute.Sitemap = publishedJobs.map((job) => ({
    url: url(`/recruit/jobs/${job.slug}`),
    lastModified: job.datePosted ? new Date(job.datePosted) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // お知らせは記事がある場合のみ含める
  const newsEntries: MetadataRoute.Sitemap = hasNews
    ? [
        { url: url('/news'), lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
        ...publishedNews.map((item) => ({
          url: url(`/news/${item.slug}`),
          lastModified: new Date(item.updatedAt ?? item.publishedAt),
          changeFrequency: 'yearly' as const,
          priority: 0.4,
        })),
      ]
    : []

  return [
    ...staticEntries,
    ...serviceEntries,
    ...areaEntries,
    ...columnEntries,
    ...blogEntries,
    ...workEntries,
    ...jobEntries,
    ...newsEntries,
  ]
}
