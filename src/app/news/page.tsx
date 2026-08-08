import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { JsonLd } from '@/components/ui/JsonLd'
import { publishedNews, hasNews } from '@/data/news'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: 'お知らせ',
  description: '3Peaceからのお知らせ、施工情報、採用情報を掲載しています。',
  path: '/news',
  // 記事が0件のあいだは検索結果に出さない
  noindex: !hasNews,
})

const crumbs = [{ name: 'お知らせ', path: '/news' }]

export default function NewsPage() {
  return (
    <>
      <PageHero eyebrow="News" title="お知らせ" />
      <Breadcrumbs items={crumbs} />

      <Section width="narrow">
        {hasNews ? (
          <ul className="border-t border-line">
            {publishedNews.map((item, index) => (
              <li key={item.slug} className="border-b border-line">
                <Reveal delay={index * 40}>
                  <Link
                    href={`/news/${item.slug}`}
                    className="group grid gap-2 py-6 sm:grid-cols-[7rem_6rem_1fr] sm:items-baseline sm:gap-4"
                  >
                    <time dateTime={item.publishedAt} className="font-mono text-sm text-ink-soft">
                      {item.publishedAt.replace(/-/g, '.')}
                    </time>
                    <span className="text-xs font-bold text-blue">{item.category}</span>
                    <span>
                      <span className="block text-[1rem] font-bold text-ink group-hover:text-blue">
                        {item.title}
                      </span>
                      <span className="mt-2 block text-[0.9rem] leading-7 text-ink-soft">
                        {item.summary}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center">
            <p className="text-[0.95rem] leading-8 text-ink-soft">
              現在、掲載しているお知らせはありません。
              <br />
              工事の内容や採用情報については、以下のページをご覧ください。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/service" variant="outline">
                業務案内
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href="/recruit" variant="outline">
                採用情報
                <ArrowRight />
              </ButtonLink>
            </div>
          </div>
        )}
      </Section>

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
    </>
  )
}
