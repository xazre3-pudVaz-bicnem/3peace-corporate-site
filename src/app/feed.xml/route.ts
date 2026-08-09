import { publishedColumns, columnLastModified } from '@/data/columns'
import { getAllPosts, postLastModified } from '@/lib/blog'
import { site } from '@/data/site'
import { SITE_URL, absoluteUrl } from '@/lib/seo'

/**
 * 記事の RSS フィード（専門コラム + ブログ）。
 *
 * URL はすべて SITE_URL から生成しているため、独自ドメインへ移行しても
 * NEXT_PUBLIC_SITE_URL を変えるだけで切り替わります。
 * サイトURLが解決できない環境では空のフィードを返します。
 */

export const dynamic = 'force-static'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

type FeedEntry = { title: string; path: string; description: string; date: Date }

export function GET() {
  const feedUrl = absoluteUrl('/feed.xml')
  const homeUrl = absoluteUrl('/')

  const entries: FeedEntry[] = [
    ...publishedColumns.map((column) => ({
      title: column.title,
      path: `/column/${column.slug}`,
      description: column.metaDescription,
      date: columnLastModified(column),
    })),
    ...getAllPosts().map((post) => ({
      title: post.title,
      path: `/blog/${post.slug}`,
      description: post.description,
      date: postLastModified(post),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const items = SITE_URL
    ? entries
        .slice(0, 50)
        .map((entry) => {
          const url = absoluteUrl(entry.path)
          if (!url) return ''
          return [
            '    <item>',
            `      <title>${escapeXml(entry.title)}</title>`,
            `      <link>${escapeXml(url)}</link>`,
            `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
            `      <description>${escapeXml(entry.description)}</description>`,
            `      <pubDate>${entry.date.toUTCString()}</pubDate>`,
            '    </item>',
          ].join('\n')
        })
        .filter(Boolean)
        .join('\n')
    : ''

  const lastBuild = entries.length > 0 ? entries[0].date : new Date(0)

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(`${site.name} エアコン工事の記事`)}</title>`,
    ...(homeUrl ? [`    <link>${escapeXml(homeUrl)}</link>`] : []),
    `    <description>${escapeXml('広島市西区己斐上のエアコン工事店 3Peace が、工事を依頼する前に知っておきたいことを解説しています。')}</description>`,
    '    <language>ja</language>',
    `    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>`,
    ...(feedUrl
      ? [`    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`]
      : []),
    items,
    '  </channel>',
    '</rss>',
  ]
    .filter((line) => line !== '')
    .join('\n')

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
