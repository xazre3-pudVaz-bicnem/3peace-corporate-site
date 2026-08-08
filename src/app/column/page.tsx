import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'
import { RelatedLinks } from '@/components/sections/RelatedLinks'

import { columnGroups, publishedColumns, columnCategoryLabels } from '@/data/columns'
import { publishedServices } from '@/data/services'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: 'エアコン工事の専門コラム',
  description:
    'エアコンの取り付け・交換・移設を依頼する前に知っておきたいことをまとめた専門コラムです。料金が変わる要素、室外機の設置場所、真空引きの意味、100Vと200Vの違いなど、工事店の視点で解説しています。',
  path: '/column',
})

const crumbs = [{ name: '専門コラム', path: '/column' }]

export default function ColumnIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Column"
        title="エアコン工事の専門コラム"
        lead="エアコン工事を依頼する前に知っておくと役に立つことを、施工する側の視点でまとめています。料金が現場によって変わる理由、室外機を置ける場所の考え方、工事で行っている作業の意味など、カタログには載っていない内容を中心に書いています。"
      />
      <Breadcrumbs items={crumbs} />

      {/* 新着 */}
      <Section aria-labelledby="latest-heading">
        <SectionHeading
          eyebrow="Latest"
          id="latest-heading"
          title="新着の記事"
          lead={`現在 ${publishedColumns.length} 本の記事を公開しています。`}
        />
        <ul className="mt-12 grid gap-px border-t border-line-strong bg-line sm:grid-cols-2">
          {publishedColumns.slice(0, 6).map((column, index) => (
            <li key={column.slug} className="bg-white">
              <Reveal delay={index * 50}>
                <Link
                  href={`/column/${column.slug}`}
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-mist sm:p-7"
                >
                  <span className="text-xs font-bold text-blue">
                    {columnCategoryLabels[column.category]}
                  </span>
                  <span className="mt-3 block text-lg leading-snug font-bold text-ink group-hover:text-blue">
                    {column.title}
                  </span>
                  <span className="mt-3 flex-1 text-[0.9rem] leading-7 text-ink-soft">
                    {column.metaDescription.slice(0, 90)}…
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue">
                    この記事を読む
                    <ArrowRight />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* カテゴリー別 */}
      <Section tone="mist" divided aria-labelledby="category-heading">
        <SectionHeading
          eyebrow="Category"
          id="category-heading"
          title="テーマから記事を探す"
          lead="工事の種類や、知りたいことのテーマごとに記事をまとめています。"
        />
        <div className="mt-12 space-y-10">
          {columnGroups.map((group, index) => (
            <Reveal key={group.category} delay={index * 50}>
              <h3 className="text-base font-bold text-navy">{group.label}</h3>
              <ul className="mt-4 border-t border-line">
                {group.items.map((column) => (
                  <li key={column.slug} className="border-b border-line">
                    <Link
                      href={`/column/${column.slug}`}
                      className="flex min-h-14 items-center justify-between gap-4 py-4 text-[0.95rem] leading-7 font-bold text-ink transition-colors hover:text-blue"
                    >
                      {column.title}
                      <ArrowRight className="shrink-0 text-blue" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* サービスへの導線 */}
      <Section divided width="narrow" aria-labelledby="service-links-heading">
        <RelatedLinks
          id="service-links-heading"
          title="工事のご依頼をお考えの方へ"
          lead="実際の工事内容と、確認するポイントは各ページに掲載しています。"
          links={publishedServices.map((service) => ({
            href: `/service/${service.slug}`,
            label: `${service.title}について詳しく見る`,
            description: service.lead,
          }))}
        />
        <div className="mt-10">
          <ButtonLink href="/service" variant="outline">
            エアコン工事の一覧を見る
            <ArrowRight />
          </ButtonLink>
        </div>
      </Section>

      <ContactCta />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
    </>
  )
}
