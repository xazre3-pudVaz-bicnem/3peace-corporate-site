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

import { getAllPosts, getUsedCategories, categoryLabel } from '@/lib/blog'
import { publishedServices } from '@/data/services'
import { hasColumns } from '@/data/columns'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'

const posts = getAllPosts()

export const metadata: Metadata = buildMetadata({
  title: 'エアコン工事ブログ',
  description:
    '広島市西区己斐上のエアコン工事店 3Peace のブログです。エアコンの取り付け・交換・移設・取り外しについて、依頼前に知っておくと役に立つことを日々更新しています。',
  path: '/blog',
  // 記事が0件のうちは検索結果に出さない
  noindex: posts.length === 0,
})

const crumbs = [{ name: 'ブログ', path: '/blog' }]

const formatDate = (iso: string) => iso.replace(/-/g, '.')

export default function BlogIndexPage() {
  const categories = getUsedCategories()
  const [latest, ...rest] = posts

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="エアコン工事ブログ"
        lead="エアコンの取り付け・交換・移設について、工事をする側から見て「先に知っておくと判断しやすい」と思うことを書いています。設置場所の条件、工事前に確認しておきたいこと、現場でよくある相談などが中心です。"
      />
      <Breadcrumbs items={crumbs} />

      {posts.length === 0 ? (
        <Section width="narrow">
          <p className="text-[0.975rem] leading-9 text-ink-soft">
            記事を準備しています。エアコン工事について先に知りたいことがある方は、
            <Link href="/faq" className="link-underline font-bold text-blue">
              よくある質問
            </Link>
            もあわせてご覧ください。
          </p>
        </Section>
      ) : (
        <>
          {/* 最新記事 */}
          <Section aria-labelledby="latest-heading">
            <SectionHeading
              eyebrow="Latest"
              id="latest-heading"
              title="新着の記事"
              lead={`現在 ${posts.length} 本の記事を公開しています。`}
            />

            <Reveal className="mt-12">
              <Link
                href={`/blog/${latest.slug}`}
                className="group block border border-line-strong bg-mist p-7 transition-colors hover:bg-sky-soft sm:p-10"
              >
                <p className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="bg-navy-deep px-2 py-1 font-bold text-white">
                    {categoryLabel(latest.category)}
                  </span>
                  <time dateTime={latest.date} className="font-mono text-ink-soft">
                    {formatDate(latest.date)}
                  </time>
                </p>
                <h3 className="mt-4 text-xl leading-snug font-bold text-ink group-hover:text-blue sm:text-2xl">
                  {latest.title}
                </h3>
                <p className="mt-4 text-[0.95rem] leading-8 text-ink-soft">{latest.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue">
                  この記事を読む
                  <ArrowRight />
                </span>
              </Link>
            </Reveal>

            {rest.length > 0 ? (
              <ul className="mt-10 grid gap-px border-t border-line-strong bg-line sm:grid-cols-2">
                {rest.slice(0, 20).map((post, index) => (
                  <li key={post.slug} className="bg-white">
                    <Reveal delay={index * 40}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex h-full flex-col p-6 transition-colors hover:bg-mist sm:p-7"
                      >
                        <span className="flex flex-wrap items-center gap-3 text-xs">
                          <span className="font-bold text-blue">{categoryLabel(post.category)}</span>
                          <time dateTime={post.date} className="font-mono text-ink-soft">
                            {formatDate(post.date)}
                          </time>
                        </span>
                        <span className="mt-3 block text-lg leading-snug font-bold text-ink group-hover:text-blue">
                          {post.title}
                        </span>
                        <span className="mt-3 flex-1 text-[0.9rem] leading-7 text-ink-soft">
                          {post.description}
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
            ) : null}
          </Section>

          {/* カテゴリー */}
          {categories.length > 0 ? (
            <Section tone="mist" divided aria-labelledby="category-heading">
              <SectionHeading
                eyebrow="Category"
                id="category-heading"
                title="テーマから記事を探す"
                lead="工事の種類や、知りたいことのテーマごとに記事をまとめています。"
              />
              <ul className="mt-10 grid gap-px border-t border-line-strong bg-line sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category, index) => (
                  <li key={category.slug} className="bg-white">
                    <Reveal delay={index * 40}>
                      <Link
                        href={`/blog/category/${category.slug}`}
                        className="group flex min-h-24 flex-col justify-between p-6 transition-colors hover:bg-mist"
                      >
                        <span className="text-[0.95rem] leading-snug font-bold text-ink group-hover:text-blue">
                          {category.label}
                        </span>
                        <span className="mt-3 font-mono text-xs text-ink-soft">
                          {category.count} 記事
                        </span>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </>
      )}

      {/* 工事ページ・コラムへの導線 */}
      <Section divided width="narrow" aria-labelledby="blog-links-heading">
        <RelatedLinks
          id="blog-links-heading"
          title="工事のご依頼をお考えの方へ"
          lead="実際の工事内容と、事前に確認するポイントは各ページに掲載しています。"
          links={[
            ...publishedServices.map((service) => ({
              href: `/service/${service.slug}`,
              label: `${service.title}について詳しく見る`,
              description: service.lead,
            })),
            ...(hasColumns
              ? [
                  {
                    href: '/column',
                    label: 'エアコン工事の専門コラムを読む',
                    description:
                      '料金が変わる要素や室外機の設置場所など、テーマごとに詳しく解説しています。',
                  },
                ]
              : []),
          ]}
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
