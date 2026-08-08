import { publishedColumns, columnLastModified } from '@/data/columns'
import { site } from '@/data/site'
import { SITE_URL, absoluteUrl } from '@/lib/seo'

/**
 * 専門コラムの RSS フィード。
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

export function GET() {
  const feedUrl = absoluteUrl('/feed.xml')
  const columnUrl = absoluteUrl('/column')

  const items = SITE_URL
    ? publishedColumns
        .map((column) => {
          const url = absoluteUrl(`/column/${column.slug}`)
          if (!url) return ''
          return [
            '    <item>',
            `      <title>${escapeXml(column.title)}</title>`,
            `      <link>${escapeXml(url)}</link>`,
            `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
            `      <description>${escapeXml(column.metaDescription)}</description>`,
            `      <pubDate>${columnLastModified(column).toUTCString()}</pubDate>`,
            '    </item>',
          ].join('\n')
        })
        .filter(Boolean)
        .join('\n')
    : ''

  const lastBuild = publishedColumns.length > 0 ? columnLastModified(publishedColumns[0]) : new Date(0)

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(`${site.name} エアコン工事の専門コラム`)}</title>`,
    ...(columnUrl ? [`    <link>${escapeXml(columnUrl)}</link>`] : []),
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
