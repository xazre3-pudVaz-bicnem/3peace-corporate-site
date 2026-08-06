import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { publishedServices } from '@/data/services'
import { publishedWorks, hasWorks } from '@/data/works'
import { publishedJobs } from '@/data/jobs'
import { publishedNews, hasNews } from '@/data/news'

/**
 * サイトマップ。
 * published: true のデータだけを含めます。
 * NEXT_PUBLIC_SITE_URL が未設定の場合は、誤ったURLを出力しないため空を返します。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) return []

  const now = new Date()
  const url = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`

  const staticEntries: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: url('/service'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/recruit'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/about'), lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: url('/message'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: url('/faq'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: url('/contact'), lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
    { url: url('/privacy'), lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const serviceEntries: MetadataRoute.Sitemap = publishedServices.map((service) => ({
    url: url(`/service/${service.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // 施工事例は1件以上ある場合のみ一覧・詳細を含める
  const workEntries: MetadataRoute.Sitemap = hasWorks
    ? [
        { url: url('/works'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        ...publishedWorks.map((work) => ({
          url: url(`/works/${work.slug}`),
          lastModified: now,
          changeFrequency: 'yearly' as const,
          priority: 0.6,
        })),
      ]
    : []

  const jobEntries: MetadataRoute.Sitemap = publishedJobs.map((job) => ({
    url: url(`/recruit/jobs/${job.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
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

  return [...staticEntries, ...serviceEntries, ...workEntries, ...jobEntries, ...newsEntries]
}
