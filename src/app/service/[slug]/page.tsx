import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Photo } from '@/components/ui/Photo'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'
import { FaqList } from '@/components/sections/FaqList'

import { getService, priceNotice, publishedServices } from '@/data/services'
import { getFaqsByIds } from '@/data/faq'
import { getRelatedWorks } from '@/data/works'
import { getServiceImage } from '@/data/images'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, faqPageSchema, serviceSchema } from '@/lib/schema'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return publishedServices.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}

  return buildMetadata({
    title: `${service.title}｜広島市のエアコン工事 3Peace`,
    description: `${service.lead} 広島市を中心に対応しています。工事の内容、確認するポイント、施工の流れをご案内します。`,
    path: `/service/${service.slug}`,
  })
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const faqs = getFaqsByIds(service.faqIds)
  const serviceImage = getServiceImage(service.slug)
  const relatedWorks = getRelatedWorks(service.slug)
  const otherServices = publishedServices.filter((s) => s.slug !== service.slug)

  const crumbs = [
    { name: '業務案内', path: '/service' },
    { name: service.title, path: `/service/${service.slug}` },
  ]

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={`${service.title}｜広島市`}
        lead={service.intro[0]}
        image={serviceImage ? { src: serviceImage.src, alt: '' } : undefined}
      />
      <Breadcrumbs items={crumbs} />

      {/* どのような工事か */}
      <Section width="narrow" aria-labelledby="overview-heading">
        <SectionHeading eyebrow="Overview" id="overview-heading" title="どのような工事か" />
        <Reveal delay={60} className="mt-8 space-y-5 text-[0.975rem] leading-8 text-ink-soft">
          {service.intro.slice(1).map((text, i) => (
            <p key={`intro-${i}`}>{text}</p>
          ))}
          {service.overview.map((text, i) => (
            <p key={`overview-${i}`}>{text}</p>
          ))}
        </Reveal>
      </Section>

      {/* 工事の様子（イメージ写真） */}
      {serviceImage ? (
        <div className="mx-auto w-full max-w-7xl px-5 pb-4 sm:px-6 lg:px-8">
          <Reveal>
            <figure className="relative aspect-16/9 overflow-hidden bg-sky-soft sm:aspect-21/9">
              <Photo
                src={serviceImage.src}
                alt={serviceImage.alt}
                fill
                sizes="(min-width: 1280px) 76rem, 95vw"
                fallback="hide"
              />
            </figure>
          </Reveal>
        </div>
      ) : null}

      {/* このような方におすすめ */}
      <Section tone="mist" divided width="narrow" aria-labelledby="for-heading">
        <SectionHeading eyebrow="For" id="for-heading" title="このような方におすすめです" />
        <Reveal delay={60} className="mt-8">
          <ul className="border-t border-line-strong">
            {service.recommendedFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-line py-4 text-[0.95rem] leading-7 text-ink"
              >
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-blue" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* 施工時に確認するポイント */}
      <Section divided aria-labelledby="check-heading">
        <SectionHeading
          eyebrow="Check Points"
          id="check-heading"
          title="施工時に確認するポイント"
          lead="現場で必ず確認している内容です。ここでの判断が、数年後の状態に影響します。"
        />
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {service.checkPoints.map((point, index) => (
            <Reveal key={point.title} delay={index * 60} className="h-full bg-white p-6 sm:p-7">
              <h3 className="text-base font-bold text-navy">{point.title}</h3>
              <p className="mt-3 text-[0.9rem] leading-7 text-ink-soft">{point.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 工事前に確認してほしいこと */}
      <Section tone="sky" divided width="narrow" aria-labelledby="before-heading">
        <SectionHeading
          eyebrow="Before"
          id="before-heading"
          title="ご連絡の前に確認していただきたいこと"
          lead="次の内容が分かっていると、工事内容のご案内がスムーズです。分からない項目があっても構いません。"
        />
        <Reveal delay={60} className="mt-8">
          <ul className="space-y-3">
            {service.beforeRequest.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 bg-white px-5 py-4 text-[0.95rem] leading-7 text-ink"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="mt-1.5 h-4 w-4 shrink-0 text-blue"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* 施工の流れ */}
      <Section divided aria-labelledby="steps-heading">
        <SectionHeading eyebrow="Flow" id="steps-heading" title="施工の流れ" />
        <ol className="mt-12 border-t border-line-strong">
          {service.steps.map((step, index) => (
            <li key={step.title}>
              <Reveal
                delay={index * 40}
                className="grid gap-2 border-b border-line py-6 sm:grid-cols-[4rem_14rem_1fr] sm:items-baseline sm:gap-6"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-sm font-bold text-blue tabular-nums"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-bold text-ink">{step.title}</h3>
                <p className="text-[0.9rem] leading-7 text-ink-soft">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* 料金について */}
      <Section tone="mist" divided width="narrow" aria-labelledby="price-heading">
        <SectionHeading eyebrow="Price" id="price-heading" title="料金について" />
        <Reveal delay={60} className="mt-8">
          <p className="rule-left text-[0.975rem] leading-8 text-ink">{priceNotice}</p>
        </Reveal>
      </Section>

      {/* 関連する施工事例（0件のときは非表示） */}
      {relatedWorks.length > 0 ? (
        <Section divided aria-labelledby="related-works-heading">
          <SectionHeading eyebrow="Works" id="related-works-heading" title="関連する施工事例" />
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedWorks.map((work, index) => (
              <li key={work.slug}>
                <Reveal delay={index * 60}>
                  <Link href={`/works/${work.slug}`} className="group block">
                    <div className="relative aspect-4/3 overflow-hidden bg-sky-soft">
                      {work.images[0] ? (
                        <Photo
                          src={work.images[0].src}
                          alt={work.images[0].alt}
                          fill
                          sizes="(min-width: 1024px) 30vw, 90vw"
                          fallback="hide"
                        />
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-base font-bold text-ink group-hover:text-blue">
                      {work.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-soft">{work.area}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* FAQ */}
      {faqs.length > 0 ? (
        <Section tone="mist" divided width="narrow" aria-labelledby="service-faq-heading">
          <SectionHeading eyebrow="FAQ" id="service-faq-heading" title="この工事についてよくある質問" />
          <Reveal delay={60} className="mt-10">
            <FaqList faqs={faqs} />
          </Reveal>
        </Section>
      ) : null}

      {/* 他の工事 */}
      <Section divided width="narrow" aria-labelledby="other-services-heading">
        <SectionHeading eyebrow="Other" id="other-services-heading" title="ほかの工事を見る" />
        <ul className="mt-8 border-t border-line">
          {otherServices.map((other) => (
            <li key={other.slug} className="border-b border-line">
              <Link
                href={`/service/${other.slug}`}
                className="flex min-h-14 items-center justify-between gap-4 py-4 text-[0.95rem] font-bold text-ink transition-colors hover:text-blue"
              >
                {other.title}
                <ArrowRight className="text-blue" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ButtonLink href="/service" variant="ghost">
            業務案内トップへ戻る
            <ArrowRight />
          </ButtonLink>
        </div>
      </Section>

      <ContactCta
        heading={`${service.title}のご相談を受け付けています`}
        lead={`${service.lead} 現場の状況を確認したうえで、必要な作業と費用をご案内します。`}
      />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
      <JsonLd
        data={serviceSchema({
          name: service.title,
          description: service.lead,
          path: `/service/${service.slug}`,
        })}
      />
      {faqs.length > 0 ? (
        <JsonLd
          data={faqPageSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })))}
        />
      ) : null}
    </>
  )
}
