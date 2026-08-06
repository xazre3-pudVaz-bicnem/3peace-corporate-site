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

import { publishedServices, priceNotice, relatedFields } from '@/data/services'
import { customerFaqs } from '@/data/faq'
import { publishedAreas } from '@/data/site'
import { images } from '@/data/images'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: '広島のエアコン工事・取り付け｜3Peaceの業務案内',
  description:
    '3Peaceが広島市で対応しているエアコン工事の内容です。新設・交換・移設・取り外しについて、工事の内容、確認するポイント、施工の流れをご案内します。料金は現場状況を確認したうえでお伝えします。',
  path: '/service',
})

const crumbs = [{ name: '業務案内', path: '/service' }]

export default function ServicePage() {
  const faqs = customerFaqs.filter((f) => ['estimate', 'own-unit', 'duration', 'area'].includes(f.id))

  return (
    <>
      <PageHero
        eyebrow="Service"
        title="広島のエアコン工事・取り付け"
        lead="エアコンの新設、交換、移設、取り外しに対応しています。建物や設置場所の条件によって必要な作業が変わるため、現場を確認したうえで工事内容をお伝えします。"
        image={{ src: images.service.hero.src, alt: '' }}
      />
      <Breadcrumbs items={crumbs} />

      {/* 対応している工事 */}
      <Section aria-labelledby="services-heading">
        <SectionHeading
          eyebrow="Menu"
          id="services-heading"
          title="対応している工事"
          lead={`${publishedAreas.map((a) => a.name).join('・')}を中心に、住まいのエアコン工事に対応しています。それぞれの工事について、確認するポイントと施工の流れを詳しくご案内しています。`}
        />

        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {publishedServices.map((service, index) => (
            <li key={service.slug}>
              <Reveal delay={index * 60} className="h-full bg-white">
                <Link
                  href={`/service/${service.slug}`}
                  className="group flex h-full flex-col p-7 transition-colors hover:bg-sky-soft sm:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm font-bold text-blue tabular-nums"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-ink group-hover:text-blue">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.9rem] leading-7 text-ink-soft">{service.lead}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue">
                    詳しく見る
                    <ArrowRight />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 住まいに合わせた施工（イメージ写真） */}
      <Reveal className="relative aspect-16/9 w-full overflow-hidden bg-sky-soft sm:aspect-21/9">
        <Photo
          src={images.home.japaneseRoom.src}
          alt={images.home.japaneseRoom.alt}
          fill
          sizes="100vw"
          fallback="hide"
        />
      </Reveal>

      {/* 料金について */}
      <Section tone="mist" width="narrow" aria-labelledby="price-heading">
        <SectionHeading eyebrow="Price" id="price-heading" title="料金について" />
        <Reveal delay={80} className="mt-8">
          <p className="rule-left text-[0.975rem] leading-8 text-ink">{priceNotice}</p>
          <div className="mt-8 space-y-4 text-[0.925rem] leading-8 text-ink-soft">
            <p>
              同じ「エアコンの取り付け」でも、配管の長さ、壁の穴あけの有無、室外機の設置方法、
              既存設備の状態によって作業量が変わります。あらかじめ定額でお伝えできる工事ばかりではありません。
            </p>
            <p>
              ご連絡の際に、設置場所の写真や、お使いの機種の型番をお知らせいただけると、
              確認がスムーズに進みます。追加の作業が必要になる場合は、作業前に理由と一緒にご説明します。
            </p>
          </div>
        </Reveal>
      </Section>

      {/* エアコン工事以外のご相談 */}
      <Section divided width="narrow" aria-labelledby="other-heading">
        <SectionHeading
          eyebrow="Other"
          id="other-heading"
          title="エアコン工事以外のご相談"
          lead={`3Peaceでは、${relatedFields.join('・')}に関するご相談もお受けしています。`}
        />
        <Reveal delay={80} className="mt-8 space-y-4 text-[0.925rem] leading-8 text-ink-soft">
          <p>
            内容によって対応できる範囲が変わるため、まずはどのようなことでお困りかをお聞かせください。
            対応が難しい場合は、その旨をお伝えします。
          </p>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section tone="mist" divided width="narrow" aria-labelledby="service-faq-heading">
        <SectionHeading eyebrow="FAQ" id="service-faq-heading" title="工事に関するよくある質問" />
        <Reveal delay={80} className="mt-10">
          <FaqList faqs={faqs} />
        </Reveal>
        <Reveal delay={120} className="mt-8">
          <ButtonLink href="/faq" variant="ghost">
            よくある質問をすべて見る
            <ArrowRight />
          </ButtonLink>
        </Reveal>
      </Section>

      <ContactCta />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
    </>
  )
}
