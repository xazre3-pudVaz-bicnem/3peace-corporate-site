import type { Metadata } from 'next'
import Link from 'next/link'

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

import { publishedServices, priceNotice, relatedFields } from '@/data/services'
import { getFaqsByIds } from '@/data/faq'
import { indexableAreas } from '@/data/areas'
import { publishedColumns } from '@/data/columns'
import { images } from '@/data/images'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, faqPageSchema, serviceSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: '広島のエアコン工事・取り付け',
  description:
    '広島市西区己斐上を拠点にエアコン工事を行う3Peaceの業務案内です。新設・交換・移設・取り外しの4つの工事について、内容と確認するポイント、料金が決まる要素をご案内しています。',
  path: '/service',
  image: images.service.hero.src,
})

const crumbs = [{ name: 'エアコン工事', path: '/service' }]

/** 工事の選び方（どのページを見ればよいかの案内） */
const chooseGuide = [
  {
    situation: 'エアコンがない部屋に新しく付けたい',
    slug: 'installation',
    label: 'エアコン新設工事',
  },
  {
    situation: '今あるエアコンが古くなった・冷えない',
    slug: 'replacement',
    label: 'エアコン交換工事',
  },
  {
    situation: '引越しや部屋の付け替えで場所を移したい',
    slug: 'relocation',
    label: 'エアコン移設工事',
  },
  {
    situation: '使わなくなったエアコンを外したい',
    slug: 'removal',
    label: 'エアコン取り外し',
  },
]

export default function ServicePage() {
  const faqs = getFaqsByIds(['estimate', 'own-unit', 'work-only', 'duration', 'area'])

  return (
    <>
      <PageHero
        eyebrow="Service"
        title="広島のエアコン工事・取り付け"
        lead="エアコンの新設、交換、移設、取り外しに対応しています。同じ機種を取り付ける工事でも、壁の下地、配管を通せる経路、室外機を置ける場所は建物ごとに違います。現場を確認したうえで、その建物に合った施工方法をご案内します。"
        image={{ src: images.service.hero.src, alt: '' }}
      />
      <Breadcrumbs items={crumbs} />

      {/* 工事の選び方 */}
      <Section width="narrow" aria-labelledby="choose-heading">
        <SectionHeading
          eyebrow="Guide"
          id="choose-heading"
          title="状況から工事を選ぶ"
          lead="ご相談の内容は、おおむね次の4つに分かれます。近いものからご覧ください。"
        />
        <ul className="mt-10 border-t border-line-strong">
          {chooseGuide.map((item, index) => (
            <li key={item.slug}>
              <Reveal delay={index * 50}>
                <Link
                  href={`/service/${item.slug}`}
                  className="group grid gap-2 border-b border-line py-5 transition-colors hover:text-blue sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
                >
                  <span>
                    <span className="block text-[0.9rem] text-ink-soft">{item.situation}</span>
                    <span className="mt-1 block text-[1.05rem] font-bold text-ink group-hover:text-blue">
                      {item.label}のページへ
                    </span>
                  </span>
                  <ArrowRight className="shrink-0 text-blue transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 対応している工事 */}
      <Section tone="mist" divided aria-labelledby="services-heading">
        <SectionHeading
          eyebrow="Menu"
          id="services-heading"
          title="対応しているエアコン工事"
          lead="それぞれの工事について、内容、当日の流れ、確認するポイント、料金が決まる要素を詳しく掲載しています。"
        />

        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {publishedServices.map((service, index) => (
            <li key={service.slug} className="bg-white">
              <Reveal delay={index * 60}>
                <Link
                  href={`/service/${service.slug}`}
                  className="group flex h-full flex-col transition-colors hover:bg-sky-soft"
                >
                  <span className="relative block aspect-16/9 overflow-hidden bg-sky-soft">
                    <Photo
                      src={`/images/services/${service.slug}.webp`}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 45vw, 92vw"
                      fallback="hide"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="flex flex-1 flex-col p-7 sm:p-8">
                    <span
                      aria-hidden="true"
                      className="font-mono text-sm font-bold text-blue tabular-nums"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-3 block text-xl font-bold text-ink group-hover:text-blue">
                      {service.title}
                    </span>
                    <span className="mt-3 flex-1 text-[0.9rem] leading-7 text-ink-soft">
                      {service.lead}
                    </span>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue">
                      {service.shortTitle}の内容と流れを見る
                      <ArrowRight />
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 料金について */}
      <Section divided width="narrow" aria-labelledby="price-heading">
        <SectionHeading eyebrow="Price" id="price-heading" title="料金について" />
        <Reveal delay={60} className="mt-8">
          <p className="rule-left text-[0.975rem] leading-9 text-ink">{priceNotice}</p>
          <div className="mt-8 space-y-5 text-[0.95rem] leading-9 text-ink-soft">
            <p>
              同じ「エアコンの取り付け」でも、配管の長さ、壁の穴あけの有無と壁の材質、室外機の設置方法、
              既存設備の状態によって作業量が変わります。あらかじめ定額でお伝えできる工事ばかりではありません。
            </p>
            <p>
              ご連絡の際に、設置場所の写真やお使いの機種の型番をお知らせいただけると、確認がスムーズに進みます。
              追加の作業が必要になる場合は、作業前に理由と一緒にご説明します。
            </p>
          </div>
          <div className="mt-8">
            <ButtonLink href="/column/aircon-installation-cost-factors" variant="outline">
              料金が変わる7つのポイントを読む
              <ArrowRight />
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      {/* 地域 */}
      {indexableAreas.length > 0 ? (
        <Section tone="mist" divided width="narrow" aria-labelledby="area-heading">
          <SectionHeading
            eyebrow="Area"
            id="area-heading"
            title="地域ごとのご案内"
            lead="拠点のある地域については、その土地の住宅事情をふまえた内容を掲載しています。"
          />
          <Reveal delay={60} className="mt-8">
            <RelatedLinks
              id="area-links-heading"
              links={indexableAreas.map((area) => ({
                href: `/area/${area.slug}`,
                label: `${area.name}のエアコン工事について見る`,
                description: `${area.name}を拠点に、新設・交換・移設・取り外しに対応しています。`,
              }))}
              columns={1}
            />
          </Reveal>
        </Section>
      ) : null}

      {/* エアコン工事以外のご相談 */}
      <Section divided width="narrow" aria-labelledby="other-heading">
        <SectionHeading
          eyebrow="Other"
          id="other-heading"
          title="エアコン工事以外のご相談"
          lead={`3Peaceでは、${relatedFields.join('・')}に関するご相談もお受けしています。`}
        />
        <Reveal delay={60} className="mt-8 space-y-4 text-[0.95rem] leading-9 text-ink-soft">
          <p>
            内容によって対応できる範囲が変わるため、まずはどのようなことでお困りかをお聞かせください。
            対応が難しい場合は、その旨をお伝えします。
          </p>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section tone="mist" divided width="narrow" aria-labelledby="service-faq-heading">
        <SectionHeading eyebrow="FAQ" id="service-faq-heading" title="工事に関するよくある質問" />
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

      {/* 関連記事 */}
      <Section divided width="narrow" aria-labelledby="column-heading">
        <RelatedLinks
          id="column-heading"
          title="工事を依頼する前に読んでおきたい記事"
          lead="設置条件や費用の考え方について、施工する側の視点で解説しています。"
          links={publishedColumns.slice(0, 6).map((column) => ({
            href: `/column/${column.slug}`,
            label: column.title,
          }))}
        />
        <div className="mt-10">
          <ButtonLink href="/column" variant="outline">
            専門コラムの一覧を見る
            <ArrowRight />
          </ButtonLink>
        </div>
      </Section>

      <ContactCta
        examples={[
          'この設置場所でも取り付けられる？',
          '本体は購入済みだけど工事だけ頼みたい',
          '室外機を置ける場所が分からない',
        ]}
      />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
      <JsonLd
        data={serviceSchema({
          name: 'エアコン工事',
          description:
            '広島市西区己斐上を拠点に、エアコンの新設・交換・移設・取り外しを行っています。',
          path: '/service',
          includes: publishedServices.map((s) => s.title),
        })}
      />
      <JsonLd
        data={faqPageSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })))}
      />
    </>
  )
}
