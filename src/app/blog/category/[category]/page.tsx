import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'

import {
  categoryLabel,
  getPostsByCategory,
  getUsedCategories,
  isBlogCategory,
  MIN_POSTS_FOR_INDEXING,
} from '@/lib/blog'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'

type Params = { params: Promise<{ category: string }> }

/** 記事が1件以上あるカテゴリーだけページを生成する */
export function generateStaticParams() {
  return getUsedCategories().map((category) => ({ category: category.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params
  if (!isBlogCategory(category)) return {}

  const posts = getPostsByCategory(category)
  const label = categoryLabel(category)

  return buildMetadata({
    title: `${label}に関する記事`,
    description: `${label}についての記事をまとめています。広島市西区己斐上のエアコン工事店 3Peace が、依頼前に知っておくと役に立つことを解説しています。`,
    path: `/blog/category/${category}`,
    // 記事が少ないうちは内容の薄い一覧ページを検索結果に出さない
    noindex: posts.length < MIN_POSTS_FOR_INDEXING,
  })
}

const formatDate = (iso: string) => iso.replace(/-/g, '.')

export default async function BlogCategoryPage({ params }: Params) {
  const { category } = await params
  if (!isBlogCategory(category)) notFound()

  const posts = getPostsByCategory(category)
  if (posts.length === 0) notFound()

  const label = categoryLabel(category)
  const others = getUsedCategories().filter((c) => c.slug !== category)

  const crumbs = [
    { name: 'ブログ', path: '/blog' },
    { name: label, path: `/blog/category/${category}` },
  ]

  return (
    <>
      <PageHero
        eyebrow="Blog Category"
        title={`${label}に関する記事`}
        lead={`${label}について書いた記事をまとめています。現在 ${posts.length} 本を公開しています。`}
      />
      <Breadcrumbs items={crumbs} />

      <Section aria-labelledby="post-list-heading">
        <h2 id="post-list-heading" className="sr-only">
          {label}の記事一覧
        </h2>
        <ul className="grid gap-px border-t border-line-strong bg-line sm:grid-cols-2">
          {posts.map((post, index) => (
            <li key={post.slug} className="bg-white">
              <Reveal delay={index * 40}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-mist sm:p-7"
                >
                  <time dateTime={post.date} className="font-mono text-xs text-ink-soft">
                    {formatDate(post.date)}
                  </time>
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

        <div className="mt-12">
          <ButtonLink href="/blog" variant="outline">
            ブログの一覧を見る
            <ArrowRight />
          </ButtonLink>
        </div>
      </Section>

      {others.length > 0 ? (
        <Section tone="mist" divided aria-labelledby="other-category-heading">
          <h2 id="other-category-heading" className="text-lg font-bold text-ink">
            ほかのテーマの記事
          </h2>
          <ul className="mt-6 grid gap-px border-t border-line-strong bg-line sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item, index) => (
              <li key={item.slug} className="bg-white">
                <Reveal delay={index * 40}>
                  <Link
                    href={`/blog/category/${item.slug}`}
                    className="group flex min-h-24 flex-col justify-between p-6 transition-colors hover:bg-mist"
                  >
                    <span className="text-[0.95rem] leading-snug font-bold text-ink group-hover:text-blue">
                      {item.label}
                    </span>
                    <span className="mt-3 font-mono text-xs text-ink-soft">{item.count} 記事</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <ContactCta />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
    </>
  )
}
