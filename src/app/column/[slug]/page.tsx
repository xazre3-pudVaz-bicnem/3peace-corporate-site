import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'
import { ColumnBody, TableOfContents } from '@/components/sections/ColumnBody'
import { RelatedLinks } from '@/components/sections/RelatedLinks'

import {
  columnCategoryLabels,
  getColumn,
  getColumnsBySlugs,
  publishedColumns,
} from '@/data/columns'
import { publishedServices } from '@/data/services'
import { publishedWorks } from '@/data/works'
import { site } from '@/data/site'
import { buildMetadata } from '@/lib/seo'
import { articleSchema, breadcrumbSchema, faqPageSchema } from '@/lib/schema'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return publishedColumns.map((column) => ({ slug: column.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const column = getColumn(slug)
  if (!column) return {}

  return buildMetadata({
    title: column.metaTitle,
    description: column.metaDescription,
    path: `/column/${column.slug}`,
    image: column.image?.src,
    type: 'article',
    publishedTime: column.publishedAt,
    modifiedTime: column.updatedAt,
  })
}

const formatDate = (iso: string) => iso.replace(/-/g, '.')

export default async function ColumnDetailPage({ params }: Params) {
  const { slug } = await params
  const column = getColumn(slug)
  if (!column) notFound()

  const relatedColumns = getColumnsBySlugs(column.relatedColumns)
  const relatedServices = publishedServices.filter((s) => column.relatedServices.includes(s.slug))
  const relatedWorks = publishedWorks
    .filter((w) => w.relatedServices.some((s) => column.relatedServices.includes(s)))
    .slice(0, 3)

  const crumbs = [
    { name: '専門コラム', path: '/column' },
    { name: column.title, path: `/column/${column.slug}` },
  ]

  return (
    <>
      <div className="bg-navy-deep py-12 text-white sm:py-16">
        <Container width="narrow">
          <p className="flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-white px-2 py-1 font-bold text-navy">
              {columnCategoryLabels[column.category]}
            </span>
            <time dateTime={column.publishedAt} className="font-mono text-white/80">
              {formatDate(column.publishedAt)} 公開
            </time>
            {column.updatedAt ? (
              <time dateTime={column.updatedAt} className="font-mono text-white/70">
                {formatDate(column.updatedAt)} 更新
              </time>
            ) : null}
          </p>
          <h1 className="mt-5 text-[1.6rem] leading-snug font-bold sm:text-[2.125rem]">
            {column.title}
          </h1>
        </Container>
      </div>
      <Breadcrumbs items={crumbs} />

      <Section width="narrow">
        {column.image ? (
          <div className="relative mb-10 aspect-16/9 overflow-hidden bg-sky-soft">
            <Photo
              src={column.image.src}
              alt={column.image.alt}
              fill
              sizes="(min-width: 768px) 48rem, 95vw"
              priority
              fallback="hide"
            />
          </div>
        ) : null}

        {/* 導入文 */}
        <div className="space-y-5 text-[1rem] leading-9 text-ink">
          {column.lead.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* 目次 */}
        <div className="mt-10">
          <TableOfContents sections={column.sections} />
        </div>

        {/* 本文 */}
        <div className="mt-14">
          <ColumnBody sections={column.sections} />
        </div>

        {/* まとめ */}
        {column.summary && column.summary.length > 0 ? (
          <Reveal className="mt-14 border-t border-line-strong pt-10">
            <h2 className="text-xl font-bold text-ink">まとめ</h2>
            <div className="mt-5 space-y-4 text-[0.975rem] leading-9 text-ink-soft">
              {column.summary.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        ) : null}

        {/* 記事内FAQ */}
        {column.faq && column.faq.length > 0 ? (
          <Reveal className="mt-14">
            <h2 className="text-xl font-bold text-ink">この記事に関するよくある質問</h2>
            <div className="mt-6 border-t border-line">
              {column.faq.map((item) => (
                <details key={item.question} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden">
                    <span aria-hidden="true" className="mt-0.5 text-sm font-bold text-blue">
                      Q
                    </span>
                    <span className="flex-1 text-[1rem] font-bold text-ink">{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-blue transition-transform duration-200 group-open:rotate-45"
                    >
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M8 2v12M2 8h12" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <div className="flex gap-4 pb-6">
                    <span aria-hidden="true" className="text-sm font-bold text-ink-soft">
                      A
                    </span>
                    <div className="flex-1 space-y-3 text-[0.95rem] leading-8 text-ink-soft">
                      {item.answer.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </Reveal>
        ) : null}

        {/* 監修情報（E-E-A-T） */}
        <Reveal className="mt-14 border border-line bg-mist p-6 sm:p-7">
          <h2 className="text-sm font-bold text-ink">この記事について</h2>
          <dl className="mt-4 space-y-3 text-[0.9rem] leading-7 text-ink-soft">
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-bold text-ink">監修</dt>
              <dd>
                {site.name}　{site.representativeRole} {site.representative}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-bold text-ink">所在地</dt>
              <dd>{site.address.full}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-bold text-ink">公開日</dt>
              <dd>
                <time dateTime={column.publishedAt}>{formatDate(column.publishedAt)}</time>
                {column.updatedAt ? (
                  <>
                    {' / 更新日 '}
                    <time dateTime={column.updatedAt}>{formatDate(column.updatedAt)}</time>
                  </>
                ) : null}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-6 text-ink-soft">
            この記事は、広島市西区己斐上でエアコン工事を行う3Peaceが、実際の施工で確認している内容をもとに作成しています。
            現場の条件によって適切な方法は変わるため、個別の判断は状況を確認したうえでご案内します。
          </p>
        </Reveal>
      </Section>

      {/* 関連リンク */}
      <Section tone="mist" divided width="narrow" aria-labelledby="related-heading">
        <h2 id="related-heading" className="sr-only">
          関連する情報
        </h2>
        <div className="space-y-12">
          {relatedServices.length > 0 ? (
            <RelatedLinks
              id="related-service-heading"
              title="この記事に関連するエアコン工事"
              links={relatedServices.map((service) => ({
                href: `/service/${service.slug}`,
                label: `${service.title}の内容と流れを見る`,
                description: service.lead,
              }))}
            />
          ) : null}

          {relatedColumns.length > 0 ? (
            <RelatedLinks
              id="related-column-heading"
              title="あわせて読みたい記事"
              links={relatedColumns.map((related) => ({
                href: `/column/${related.slug}`,
                label: related.title,
                description: columnCategoryLabels[related.category],
              }))}
            />
          ) : null}

          {relatedWorks.length > 0 ? (
            <RelatedLinks
              id="related-works-heading"
              title="関連する施工事例"
              links={relatedWorks.map((work) => ({
                href: `/works/${work.slug}`,
                label: `${work.title}の施工内容を見る`,
                description: `${work.area}／${work.category}`,
              }))}
            />
          ) : null}
        </div>

        <div className="mt-12">
          <ButtonLink href="/column" variant="ghost">
            専門コラムの一覧へ戻る
            <ArrowRight />
          </ButtonLink>
        </div>
      </Section>

      <ContactCta
        heading="記事を読んで気になった点は、そのままご相談ください"
        lead="設置場所の条件は建物ごとに違います。「うちの場合はどうなるのか」という段階のご質問でも構いません。現場の状況を確認したうえでご案内します。"
      />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
      <JsonLd
        data={articleSchema({
          headline: column.title,
          description: column.metaDescription,
          path: `/column/${column.slug}`,
          datePublished: column.publishedAt,
          dateModified: column.updatedAt,
          image: column.image?.src,
          reviewedByRepresentative: true,
        })}
      />
      {column.faq && column.faq.length > 0 ? <JsonLd data={faqPageSchema(column.faq)} /> : null}
    </>
  )
}
