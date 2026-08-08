import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'
import { FaqList } from '@/components/sections/FaqList'
import { RelatedLinks } from '@/components/sections/RelatedLinks'
import { CompanyTable } from '@/components/sections/CompanyTable'

import { getArea, publishedAreas } from '@/data/areas'
import { publishedServices } from '@/data/services'
import { publishedWorks } from '@/data/works'
import { getFaqsByIds } from '@/data/faq'
import { publishedColumns } from '@/data/columns'
import { site } from '@/data/site'
import { images } from '@/data/images'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, faqPageSchema, serviceSchema } from '@/lib/schema'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return publishedAreas.map((area) => ({ slug: area.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const area = getArea(slug)
  if (!area?.content) return {}

  return buildMetadata({
    title: `${area.name}のエアコン工事・取り付け`,
    description: area.content.description,
    path: `/area/${area.slug}`,
    noindex: !area.index,
  })
}

export default async function AreaPage({ params }: Params) {
  const { slug } = await params
  const area = getArea(slug)
  if (!area?.content) notFound()

  const content = area.content
  const faqs = getFaqsByIds(content.faqIds)
  const areaWorks = publishedWorks.filter((w) => w.area.includes(area.shortName)).slice(0, 3)
  const relatedColumns = publishedColumns.slice(0, 4)

  const crumbs = [
    { name: 'エアコン工事', path: '/service' },
    { name: `${area.name}のエアコン工事`, path: `/area/${area.slug}` },
  ]

  return (
    <>
      <PageHero
        eyebrow="Area"
        title={`${area.name}のエアコン工事なら3Peace`}
        lead={content.intro[0]}
        image={{ src: images.company.hero.src, alt: '' }}
      />
      <Breadcrumbs items={crumbs} />

      {/* 導入 */}
      <Section width="narrow" aria-labelledby="area-intro-heading">
        <SectionHeading
          eyebrow="About"
          id="area-intro-heading"
          title={`${area.name}を拠点にエアコン工事を行っています`}
        />
        <Reveal delay={60} className="mt-8 space-y-5 text-[0.975rem] leading-9 text-ink-soft">
          {content.intro.slice(1).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Reveal>
      </Section>

      {/* 対応している工事 */}
      <Section tone="mist" divided aria-labelledby="area-service-heading">
        <SectionHeading
          eyebrow="Service"
          id="area-service-heading"
          title="対応しているエアコン工事"
          lead="新設・交換・移設・取り外しに対応しています。工事ごとの内容と確認するポイントは、それぞれのページに掲載しています。"
        />
        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {publishedServices.map((service, index) => (
            <li key={service.slug} className="bg-white">
              <Reveal delay={index * 50}>
                <Link
                  href={`/service/${service.slug}`}
                  className="group flex h-full flex-col p-7 transition-colors hover:bg-sky-soft"
                >
                  <span className="text-lg font-bold text-ink group-hover:text-blue">
                    {service.title}
                  </span>
                  <span className="mt-3 flex-1 text-[0.9rem] leading-7 text-ink-soft">
                    {service.lead}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue">
                    {service.shortTitle}の内容を見る
                    <ArrowRight />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 地域特有の確認ポイント */}
      <Section divided aria-labelledby="area-points-heading">
        <SectionHeading
          eyebrow="Check Points"
          id="area-points-heading"
          title={`${area.shortName}の住宅で確認しているポイント`}
          lead="同じ機種を取り付ける場合でも、建物の条件によって施工方法は変わります。現場で見ている点を挙げます。"
        />
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {content.points.map((point, index) => (
            <Reveal key={point.title} delay={index * 60} className="h-full bg-white p-7">
              <h3 className="text-base font-bold text-navy">{point.title}</h3>
              <p className="mt-3 text-[0.9rem] leading-7 text-ink-soft">{point.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 依頼の流れ */}
      <Section tone="mist" divided width="narrow" aria-labelledby="area-flow-heading">
        <SectionHeading
          eyebrow="Flow"
          id="area-flow-heading"
          title="お問い合わせから施工までの流れ"
        />
        <ol className="mt-12 border-l border-line">
          {content.flow.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 50} className="relative pb-8 pl-8 last:pb-0">
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

      {/* 施工事例（0件のときは非表示） */}
      {areaWorks.length > 0 ? (
        <Section divided width="narrow" aria-labelledby="area-works-heading">
          <RelatedLinks
            id="area-works-heading"
            title={`${area.name}での施工事例`}
            links={areaWorks.map((work) => ({
              href: `/works/${work.slug}`,
              label: `${work.title}の施工内容を見る`,
              description: `${work.area}／${work.category}`,
            }))}
          />
        </Section>
      ) : null}

      {/* FAQ */}
      {faqs.length > 0 ? (
        <Section divided width="narrow" aria-labelledby="area-faq-heading">
          <SectionHeading eyebrow="FAQ" id="area-faq-heading" title="よくある質問" />
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

      {/* 関連記事 */}
      <Section tone="mist" divided width="narrow" aria-labelledby="area-column-heading">
        <RelatedLinks
          id="area-column-heading"
          title="工事を依頼する前に読んでおきたい記事"
          lead="設置場所や電源の条件など、ご相談の前に確認しておくと役に立つ内容をまとめています。"
          links={relatedColumns.map((column) => ({
            href: `/column/${column.slug}`,
            label: column.title,
          }))}
        />
      </Section>

      {/* 所在地とアクセス */}
      <Section divided width="narrow" aria-labelledby="area-access-heading">
        <SectionHeading
          eyebrow="Access"
          id="area-access-heading"
          title="事業所の所在地"
          lead={site.address.full}
        />
        <Reveal delay={60} className="mt-10">
          <CompanyTable />
        </Reveal>
        <Reveal delay={100} className="mt-10">
          <div className="relative aspect-4/3 w-full border border-line sm:aspect-16/9">
            <iframe
              title={`${site.name}の所在地の地図`}
              src={site.map.embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div className="mt-5">
            <ButtonLink href={site.map.linkUrl} variant="outline" external>
              Googleマップで所在地を開く
              <ArrowRight />
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <ContactCta
        heading={`${area.name}でのエアコン工事のご相談`}
        lead="設置場所の状況によって必要な工事が変わります。「この場所に取り付けられるか分からない」という段階でも構いません。分かる範囲でお知らせいただければ、確認したうえでご案内します。"
      />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
      <JsonLd
        data={serviceSchema({
          name: `${area.name}のエアコン工事`,
          description: content.description,
          path: `/area/${area.slug}`,
          includes: publishedServices.map((s) => s.title),
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
