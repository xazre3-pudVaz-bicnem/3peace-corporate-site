import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Photo } from '@/components/ui/Photo'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'

import { getWork, publishedWorks } from '@/data/works'
import { publishedServices } from '@/data/services'
import { filterExistingImages } from '@/lib/images'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, creativeWorkSchema } from '@/lib/schema'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return publishedWorks.map((work) => ({ slug: work.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const work = getWork(slug)
  if (!work) return {}

  return buildMetadata({
    title: `${work.title}｜${work.area}のエアコン工事事例｜3Peace`,
    description: work.summary,
    path: `/works/${work.slug}`,
    image: work.images[0]?.src,
    type: 'article',
  })
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="grid gap-1 border-b border-line py-3 sm:grid-cols-[7rem_1fr] sm:gap-4">
      <dt className="text-xs font-bold text-ink-soft">{label}</dt>
      <dd className="text-[0.9rem] text-ink">{value}</dd>
    </div>
  )
}

function TextBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-8">
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      <div className="mt-4 space-y-3 text-[0.95rem] leading-8 text-ink-soft">{children}</div>
    </div>
  )
}

export default async function WorkDetailPage({ params }: Params) {
  const { slug } = await params
  const work = getWork(slug)
  if (!work) notFound()

  const images = filterExistingImages(work.images)
  const relatedServices = publishedServices.filter((s) => work.relatedServices.includes(s.slug))
  const others = publishedWorks.filter((w) => w.slug !== work.slug).slice(0, 3)

  const crumbs = [
    { name: '施工事例', path: '/works' },
    { name: work.title, path: `/works/${work.slug}` },
  ]

  return (
    <>
      <div className="bg-navy-deep py-12 text-white sm:py-16">
        <Container width="wide">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            <span className="bg-white px-2 py-1 font-bold text-navy">{work.category}</span>
            <span className="text-white/80">{work.area}</span>
            {work.buildingType ? <span className="text-white/80">{work.buildingType}</span> : null}
            {work.completedAt ? (
              <time dateTime={work.completedAt} className="text-white/80">
                {work.completedAt.replace('-', '年')}月施工
              </time>
            ) : null}
          </p>
          <h1 className="mt-5 max-w-4xl text-[1.6rem] leading-tight font-bold sm:text-4xl">
            {work.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-8 text-white/85">{work.summary}</p>
        </Container>
      </div>
      <Breadcrumbs items={crumbs} />

      {/* 施工写真 */}
      {images.length > 0 ? (
        <Section space="tight" width="wide" aria-label="施工写真">
          <ul className="grid gap-4 sm:grid-cols-2">
            {images.map((image, index) => (
              <li key={image.src} className={index === 0 ? 'sm:col-span-2' : ''}>
                <Reveal delay={index * 60}>
                  <figure>
                    <div
                      className={`relative overflow-hidden bg-sky-soft ${
                        index === 0 ? 'aspect-16/9' : 'aspect-4/3'
                      }`}
                    >
                      <Photo
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes={index === 0 ? '(min-width: 640px) 90vw, 95vw' : '(min-width: 640px) 45vw, 95vw'}
                        priority={index === 0}
                        fallback="hide"
                      />
                    </div>
                    {image.caption ? (
                      <figcaption className="mt-2 text-xs text-ink-soft">{image.caption}</figcaption>
                    ) : null}
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section space="normal" aria-labelledby="work-detail-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,18rem)] lg:gap-16">
          <div className="space-y-10">
            <h2 id="work-detail-heading" className="sr-only">
              施工内容の詳細
            </h2>

            {work.before ? (
              <TextBlock title="施工前の状況">
                <p>{work.before}</p>
              </TextBlock>
            ) : null}

            {work.request ? (
              <TextBlock title="ご依頼内容">
                <p>{work.request}</p>
              </TextBlock>
            ) : null}

            {work.workDetails.length > 0 ? (
              <TextBlock title="施工内容">
                <ul className="space-y-2">
                  {work.workDetails.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 bg-blue" />
                      {item}
                    </li>
                  ))}
                </ul>
              </TextBlock>
            ) : null}

            {work.points.length > 0 ? (
              <TextBlock title="施工時のポイント">
                {work.points.map((point) => (
                  <p key={point}>{point}</p>
                ))}
              </TextBlock>
            ) : null}

            {work.after ? (
              <TextBlock title="施工後の状態">
                <p>{work.after}</p>
              </TextBlock>
            ) : null}

            {work.comment ? (
              <TextBlock title="担当者コメント">
                <p className="rule-left text-ink">{work.comment}</p>
              </TextBlock>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-sm font-bold text-ink-soft">工事の概要</h2>
            <dl className="mt-4 border-t border-line">
              <DetailRow label="施工エリア" value={work.area} />
              <DetailRow label="工事種別" value={work.category} />
              <DetailRow label="建物種別" value={work.buildingType} />
              <DetailRow
                label="施工年月"
                value={work.completedAt ? `${work.completedAt.replace('-', '年')}月` : undefined}
              />
            </dl>

            {relatedServices.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-sm font-bold text-ink-soft">関連するサービス</h2>
                <ul className="mt-4 border-t border-line">
                  {relatedServices.map((service) => (
                    <li key={service.slug} className="border-b border-line">
                      <Link
                        href={`/service/${service.slug}`}
                        className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm font-bold text-ink hover:text-blue"
                      >
                        {service.title}
                        <ArrowRight className="text-blue" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-8">
              <ButtonLink href="/contact" className="w-full">
                同じような工事を相談する
                <ArrowRight />
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Section>

      {others.length > 0 ? (
        <Section tone="mist" divided aria-labelledby="other-works-heading">
          <SectionHeading eyebrow="Works" id="other-works-heading" title="ほかの施工事例" />
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {others.map((other, index) => (
              <li key={other.slug}>
                <Reveal delay={index * 60}>
                  <Link href={`/works/${other.slug}`} className="group block">
                    <div className="relative aspect-4/3 overflow-hidden bg-white">
                      {other.images[0] ? (
                        <Photo
                          src={other.images[0].src}
                          alt={other.images[0].alt}
                          fill
                          sizes="(min-width: 640px) 30vw, 90vw"
                          fallback="hide"
                        />
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-base font-bold text-ink group-hover:text-blue">
                      {other.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-soft">{other.area}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="/works" variant="outline">
              施工事例一覧へ戻る
              <ArrowRight />
            </ButtonLink>
          </div>
        </Section>
      ) : null}

      <ContactCta />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
      <JsonLd
        data={creativeWorkSchema({
          name: work.title,
          description: work.summary,
          path: `/works/${work.slug}`,
          datePublished: work.completedAt ? `${work.completedAt}-01` : undefined,
          image: images[0]?.src,
        })}
      />
    </>
  )
}
