import type { Metadata } from 'next'
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
import { RelatedLinks } from '@/components/sections/RelatedLinks'

import {
  additionalWorkNotice,
  getService,
  priceNotice,
  publishedServices,
} from '@/data/services'
import { getFaqsByIds } from '@/data/faq'
import { getRelatedWorks } from '@/data/works'
import { getColumnsBySlugs } from '@/data/columns'
import { getServiceImage } from '@/data/images'
import { indexableAreas } from '@/data/areas'
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
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/service/${service.slug}`,
    image: getServiceImage(service.slug)?.src,
  })
}

/** 見出し＋説明の2カラムブロック（カードの連続にしないための共通レイアウト） */
function DefinitionGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="mt-10 grid gap-px bg-line sm:grid-cols-2">
      {items.map((item, index) => (
        <Reveal key={item.title} delay={index * 50} className="h-full bg-white p-6 sm:p-7">
          <h3 className="text-base font-bold text-navy">{item.title}</h3>
          <p className="mt-3 text-[0.9rem] leading-7 text-ink-soft">{item.body}</p>
        </Reveal>
      ))}
    </div>
  )
}

/** 罫線で区切った箇条書き */
function RuledList({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 border-t border-line-strong">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 border-b border-line py-4 text-[0.95rem] leading-7 text-ink"
        >
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-blue" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const faqs = getFaqsByIds(service.faqIds)
  const serviceImage = getServiceImage(service.slug)
  const relatedWorks = getRelatedWorks(service.slug)
  const relatedColumns = getColumnsBySlugs(service.relatedColumns)
  const otherServices = publishedServices.filter((s) => s.slug !== service.slug)

  const crumbs = [
    { name: 'エアコン工事', path: '/service' },
    { name: service.title, path: `/service/${service.slug}` },
  ]

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.h1}
        lead={service.intro[0]}
        image={serviceImage ? { src: serviceImage.src, alt: '' } : undefined}
      />
      <Breadcrumbs items={crumbs} />

      {/* 導入 */}
      <Section width="narrow" aria-labelledby="overview-heading">
        <SectionHeading eyebrow="Overview" id="overview-heading" title="どのような工事か" />
        <Reveal delay={60} className="mt-8 space-y-5 text-[0.975rem] leading-9 text-ink-soft">
          {service.intro.slice(1).map((text, i) => (
            <p key={i}>{text}</p>
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

      {/* 1. この工事が必要になるケース */}
      <Section divided aria-labelledby="when-heading">
        <SectionHeading
          eyebrow="Cases"
          id="when-heading"
          title="この工事が必要になるケース"
          lead="どのような状況でご依頼をいただくことが多いかをまとめました。ご自身の状況に近いものがあれば、その内容をお知らせください。"
        />
        <DefinitionGrid items={service.whenNeeded} />
        <Reveal delay={120} className="mt-10">
          <h3 className="text-base font-bold text-ink">このような方におすすめです</h3>
          <RuledList items={service.recommendedFor} />
        </Reveal>
      </Section>

      {/* 2. 工事前に確認するポイント */}
      <Section tone="mist" divided aria-labelledby="check-heading">
        <SectionHeading
          eyebrow="Check Points"
          id="check-heading"
          title="工事前に確認するポイント"
          lead="現場で必ず確認している内容です。ここでの判断が、仕上がりと数年後の状態に影響します。"
        />
        <DefinitionGrid items={service.checkPoints} />
      </Section>

      {/* 3. 施工当日の流れ */}
      <Section divided width="narrow" aria-labelledby="onsite-heading">
        <SectionHeading
          eyebrow="On-site"
          id="onsite-heading"
          title="施工当日の流れ"
          lead="現場に到着してから引き渡しまで、どの順番で作業を進めるかをご説明します。"
        />
        <ol className="mt-12 border-l border-line">
          {service.onSiteFlow.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 40} className="relative pb-8 pl-8 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue font-mono text-[0.65rem] font-bold text-white tabular-nums"
                >
                  {index + 1}
                </span>
                <h3 className="text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-[0.925rem] leading-8 text-ink-soft">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4. 工事内容 */}
      <Section tone="sky" divided aria-labelledby="scope-heading">
        <SectionHeading
          eyebrow="Scope"
          id="scope-heading"
          title="工事内容"
          lead="この工事に含まれる作業です。現場の条件によって、これ以外の作業が必要になる場合があります。"
        />
        <div className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {service.workScope.map((item, index) => (
            <Reveal key={item.title} delay={index * 50} className="h-full bg-white p-6">
              <h3 className="text-[0.95rem] font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-[0.875rem] leading-7 text-ink-soft">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 8〜14. 部位ごとの技術解説 */}
      <Section divided width="narrow" aria-labelledby="technical-heading">
        <SectionHeading
          eyebrow="Details"
          id="technical-heading"
          title="部位ごとに確認していること"
          lead="室内機、室外機、配管、ドレン排水、電源、そして仕上げの確認まで。工事のどこで何を見ているのかを説明します。"
        />
        <div className="mt-12 space-y-12">
          {service.technicalPoints.map((point, index) => (
            <Reveal key={point.title} delay={index * 40}>
              <h3 className="border-l-4 border-blue pl-4 text-lg font-bold text-ink">
                {point.title}
              </h3>
              <p className="mt-4 text-[0.95rem] leading-9 text-ink-soft">{point.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5. 追加工事が発生する可能性があるケース */}
      <Section tone="mist" divided aria-labelledby="additional-heading">
        <SectionHeading
          eyebrow="Additional"
          id="additional-heading"
          title="追加工事が必要になる可能性があるケース"
          lead={additionalWorkNotice}
        />
        <DefinitionGrid items={service.additionalWork} />
      </Section>

      {/* 6. 料金が変わる要素 / 7. 工事時間が変わる要素 */}
      <Section divided aria-labelledby="price-heading">
        <SectionHeading eyebrow="Price & Time" id="price-heading" title="料金と工事時間について" />
        <Reveal delay={60} className="mt-8">
          <p className="rule-left text-[0.975rem] leading-9 text-ink">{priceNotice}</p>
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <Reveal delay={80}>
            <h3 className="text-base font-bold text-navy">料金が変わる要素</h3>
            <RuledList items={service.priceFactors} />
          </Reveal>
          <Reveal delay={120}>
            <h3 className="text-base font-bold text-navy">工事時間が変わる要素</h3>
            <RuledList items={service.durationFactors} />
          </Reveal>
        </div>
      </Section>

      {/* 15. 事前に準備しておくこと */}
      <Section tone="sky" divided width="narrow" aria-labelledby="before-heading">
        <SectionHeading
          eyebrow="Before"
          id="before-heading"
          title="ご連絡の前に確認していただきたいこと"
          lead="次の内容が分かっていると、工事内容のご案内がスムーズです。分からない項目があっても構いません。写真を添えていただくだけでも確認できます。"
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

      {/* 依頼から完了までの流れ */}
      <Section divided aria-labelledby="steps-heading">
        <SectionHeading eyebrow="Flow" id="steps-heading" title="ご依頼から完了までの流れ" />
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

      {/* 18. 関連施工事例（0件のときは非表示） */}
      {relatedWorks.length > 0 ? (
        <Section tone="mist" divided width="narrow" aria-labelledby="related-works-heading">
          <RelatedLinks
            id="related-works-heading"
            title={`${service.shortTitle}の施工事例`}
            lead="実際にどのように施工しているかをご覧いただけます。"
            links={relatedWorks.map((work) => ({
              href: `/works/${work.slug}`,
              label: `${work.title}の施工内容を見る`,
              description: `${work.area}／${work.category}`,
            }))}
          />
        </Section>
      ) : null}

      {/* 16. よくある質問 */}
      {faqs.length > 0 ? (
        <Section divided width="narrow" aria-labelledby="service-faq-heading">
          <SectionHeading
            eyebrow="FAQ"
            id="service-faq-heading"
            title={`${service.shortTitle}についてよくある質問`}
          />
          <Reveal delay={60} className="mt-10">
            <FaqList faqs={faqs} />
          </Reveal>
          <div className="mt-8">
            <ButtonLink href="/faq" variant="ghost">
              エアコン工事のよくある質問をすべて見る
              <ArrowRight />
            </ButtonLink>
          </div>
        </Section>
      ) : null}

      {/* 17. 関連する専門記事 */}
      {relatedColumns.length > 0 ? (
        <Section tone="mist" divided width="narrow" aria-labelledby="related-column-heading">
          <RelatedLinks
            id="related-column-heading"
            title={`${service.shortTitle}に関する詳しい解説`}
            lead="工事の内容や判断の理由を、記事で詳しく説明しています。ご依頼前の確認にお使いください。"
            links={relatedColumns.map((column) => ({
              href: `/column/${column.slug}`,
              label: column.title,
            }))}
          />
        </Section>
      ) : null}

      {/* 関連ページ */}
      <Section divided width="narrow" aria-labelledby="other-services-heading">
        <RelatedLinks
          id="other-services-heading"
          title="ほかのエアコン工事"
          links={[
            ...otherServices.map((other) => ({
              href: `/service/${other.slug}`,
              label: `${other.title}の内容と流れを見る`,
              description: other.lead,
            })),
            ...indexableAreas.map((area) => ({
              href: `/area/${area.slug}`,
              label: `${area.name}のエアコン工事について見る`,
            })),
          ]}
        />
        <div className="mt-10">
          <ButtonLink href="/service" variant="ghost">
            エアコン工事の一覧へ戻る
            <ArrowRight />
          </ButtonLink>
        </div>
      </Section>

      {/* 19. お問い合わせCTA */}
      <ContactCta
        heading={`${service.title}のご相談を受け付けています`}
        lead="次のようなご相談を多くいただきます。現場の状況を確認したうえで、必要な作業と費用をご案内します。"
        examples={service.ctaExamples}
      />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
      <JsonLd
        data={serviceSchema({
          name: service.title,
          description: service.metaDescription,
          path: `/service/${service.slug}`,
          includes: service.workScope.map((w) => w.title),
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
