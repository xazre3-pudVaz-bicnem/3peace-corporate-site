import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'

import { getNews, publishedNews } from '@/data/news'
import { buildMetadata } from '@/lib/seo'
import { articleSchema, breadcrumbSchema } from '@/lib/schema'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return publishedNews.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const item = getNews(slug)
  if (!item) return {}

  return buildMetadata({
    title: `${item.title}｜お知らせ｜3Peace`,
    description: item.summary,
    path: `/news/${item.slug}`,
    image: item.image?.src,
    type: 'article',
    publishedTime: item.publishedAt,
    modifiedTime: item.updatedAt,
  })
}

export default async function NewsDetailPage({ params }: Params) {
  const { slug } = await params
  const item = getNews(slug)
  if (!item) notFound()

  const crumbs = [
    { name: 'お知らせ', path: '/news' },
    { name: item.title, path: `/news/${item.slug}` },
  ]

  return (
    <>
      <div className="bg-navy-deep py-12 text-white sm:py-16">
        <Container width="narrow">
          <p className="flex items-center gap-3 text-xs">
            <span className="bg-white px-2 py-1 font-bold text-navy">{item.category}</span>
            <time dateTime={item.publishedAt} className="font-mono text-white/80">
              {item.publishedAt.replace(/-/g, '.')}
            </time>
            {item.updatedAt ? (
              <span className="text-white/60">（{item.updatedAt.replace(/-/g, '.')} 更新）</span>
            ) : null}
          </p>
          <h1 className="mt-5 text-[1.6rem] leading-tight font-bold sm:text-3xl">{item.title}</h1>
        </Container>
      </div>
      <Breadcrumbs items={crumbs} />

      <Section width="narrow">
        {item.image ? (
          <div className="relative mb-10 aspect-16/9 overflow-hidden bg-sky-soft">
            <Photo
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(min-width: 768px) 48rem, 95vw"
              priority
              fallback="hide"
            />
          </div>
        ) : null}

        <div className="space-y-5 text-[0.975rem] leading-9 text-ink-soft">
          {item.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <ButtonLink href="/news" variant="ghost">
            お知らせ一覧へ戻る
            <ArrowRight />
          </ButtonLink>
        </div>
      </Section>

      <ContactCta />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
      <JsonLd
        data={articleSchema({
          headline: item.title,
          description: item.summary,
          path: `/news/${item.slug}`,
          datePublished: item.publishedAt,
          dateModified: item.updatedAt,
          image: item.image?.src,
        })}
      />
    </>
  )
}
