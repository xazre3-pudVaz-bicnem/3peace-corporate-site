import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'
import { RelatedLinks } from '@/components/sections/RelatedLinks'
import {
  MarkdownBody,
  MarkdownToc,
  extractHeadings,
  tocHeadings,
} from '@/components/sections/MarkdownBody'

import {
  categoryLabel,
  extractFaq,
  getAllPosts,
  getPost,
  getRelatedPosts,
} from '@/lib/blog'
import { publishedServices } from '@/data/services'
import { site } from '@/data/site'
import { buildMetadata } from '@/lib/seo'
import { articleSchema, breadcrumbSchema, faqPageSchema } from '@/lib/schema'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.updated,
  })
}

const formatDate = (iso: string) => iso.replace(/-/g, '.')

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const headings = tocHeadings(extractHeadings(post.content))
  const faq = extractFaq(post.content)
  const related = getRelatedPosts(post, 4)
  const relatedServices = publishedServices.slice(0, 2)

  const crumbs = [
    { name: 'ブログ', path: '/blog' },
    { name: categoryLabel(post.category), path: `/blog/category/${post.category}` },
    { name: post.title, path: `/blog/${post.slug}` },
  ]

  return (
    <>
      <div className="bg-navy-deep py-12 text-white sm:py-16">
        <Container width="narrow">
          <p className="flex flex-wrap items-center gap-3 text-xs">
            <Link
              href={`/blog/category/${post.category}`}
              className="bg-white px-2 py-1 font-bold text-navy transition-colors hover:bg-sky"
            >
              {categoryLabel(post.category)}
            </Link>
            <time dateTime={post.date} className="font-mono text-white/80">
              {formatDate(post.date)} 公開
            </time>
            {post.updated ? (
              <time dateTime={post.updated} className="font-mono text-white/70">
                {formatDate(post.updated)} 更新
              </time>
            ) : null}
          </p>
          <h1 className="mt-5 text-[1.6rem] leading-snug font-bold sm:text-[2.125rem]">
            {post.title}
          </h1>
        </Container>
      </div>
      <Breadcrumbs items={crumbs} />

      <Section width="narrow">
        {headings.length >= 2 ? (
          <div className="mb-14">
            <MarkdownToc headings={headings} />
          </div>
        ) : null}

        <MarkdownBody content={post.content} />

        {post.tags.length > 0 ? (
          <Reveal className="mt-14">
            <h2 className="text-sm font-bold text-ink">この記事のタグ</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-line bg-mist px-3 py-1.5 text-xs text-ink-soft"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {/* 監修情報（E-E-A-T） */}
        <Reveal className="mt-10 border border-line bg-mist p-6 sm:p-7">
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
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.updated ? (
                  <>
                    {' / 更新日 '}
                    <time dateTime={post.updated}>{formatDate(post.updated)}</time>
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
      <Section tone="mist" divided width="narrow" aria-labelledby="blog-related-heading">
        <h2 id="blog-related-heading" className="sr-only">
          関連する情報
        </h2>
        <div className="space-y-12">
          {related.length > 0 ? (
            <RelatedLinks
              id="related-post-heading"
              title="あわせて読みたい記事"
              links={related.map((item) => ({
                href: `/blog/${item.slug}`,
                label: item.title,
                description: categoryLabel(item.category),
              }))}
            />
          ) : null}

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
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href="/blog" variant="ghost">
            ブログの一覧へ戻る
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href={`/blog/category/${post.category}`} variant="ghost">
            {categoryLabel(post.category)}の記事を見る
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
          headline: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          datePublished: post.date,
          dateModified: post.updated,
          reviewedByRepresentative: true,
        })}
      />
      {faq.length > 0 ? <JsonLd data={faqPageSchema(faq)} /> : null}
    </>
  )
}
