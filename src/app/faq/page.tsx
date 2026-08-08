import type { Metadata } from 'next'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'
import { FaqList } from '@/components/sections/FaqList'
import { RelatedLinks } from '@/components/sections/RelatedLinks'

import { customerFaqGroups, customerFaqs, recruitFaqs } from '@/data/faq'
import { publishedServices } from '@/data/services'
import { publishedColumns } from '@/data/columns'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, faqPageSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: 'エアコン工事のよくある質問',
  description:
    'エアコン工事のご依頼を検討中の方からよくいただく質問をまとめました。ネットで買った本体の取り付け、室外機の置き場所、既存配管の再利用、コンセントの電圧、真空引き、工事時間など。採用に関する質問もあわせて掲載しています。',
  path: '/faq',
})

const crumbs = [{ name: 'よくある質問', path: '/faq' }]

export default function FaqPage() {
  const allFaqs = [...customerFaqs, ...recruitFaqs]

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="エアコン工事のよくある質問"
        lead="工事をご検討の方と、採用への応募をご検討の方それぞれからよくいただく質問をまとめました。ここに無い内容は、お問い合わせフォームからお気軽にご質問ください。"
      />
      <Breadcrumbs items={crumbs} />

      {/* お客様向け（検索意図ごとにグループ化） */}
      <Section id="customer" width="narrow" aria-labelledby="faq-customer-heading">
        <SectionHeading
          eyebrow="For Customer"
          id="faq-customer-heading"
          title="工事をご検討の方へ"
          lead="ご相談の前に確認しておきたいこと、設置場所や機器について、工事の内容と時間、移設や取り外しについて、の4つに分けています。"
        />

        <div className="mt-12 space-y-14">
          {customerFaqGroups.map((group, index) => (
            <Reveal key={group.category} delay={index * 50}>
              <h3 className="border-l-4 border-blue pl-4 text-lg font-bold text-ink">
                {group.label}
              </h3>
              <div className="mt-6">
                <FaqList faqs={group.items} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100} className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/service" variant="outline">
            対応しているエアコン工事を見る
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            エアコン工事について相談する
            <ArrowRight />
          </ButtonLink>
        </Reveal>
      </Section>

      {/* もっと詳しく知りたい方向けの導線 */}
      <Section tone="mist" divided width="narrow" aria-labelledby="faq-column-heading">
        <RelatedLinks
          id="faq-column-heading"
          title="もっと詳しく知りたい方へ"
          lead="質問の背景にある仕組みを、記事で詳しく解説しています。"
          links={publishedColumns.slice(0, 6).map((column) => ({
            href: `/column/${column.slug}`,
            label: column.title,
          }))}
        />
      </Section>

      {/* 工事別のページへ */}
      <Section divided width="narrow" aria-labelledby="faq-service-heading">
        <RelatedLinks
          id="faq-service-heading"
          title="工事の種類から探す"
          links={publishedServices.map((service) => ({
            href: `/service/${service.slug}`,
            label: `${service.title}の内容と流れを見る`,
            description: service.lead,
          }))}
        />
      </Section>

      {/* 求職者向け */}
      {recruitFaqs.length > 0 ? (
        <Section
          id="recruit"
          tone="mist"
          divided
          width="narrow"
          aria-labelledby="faq-recruit-heading"
        >
          <SectionHeading
            eyebrow="For Applicant"
            id="faq-recruit-heading"
            title="採用への応募をご検討の方へ"
          />
          <Reveal delay={60} className="mt-10">
            <FaqList faqs={recruitFaqs} />
          </Reveal>
          <Reveal delay={100} className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/recruit" variant="outline">
              エアコン工事の仕事内容を見る
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/recruit#jobs" variant="ghost">
              募集職種と応募方法を見る
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </Section>
      ) : null}

      <ContactCta />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
      <JsonLd
        data={faqPageSchema(allFaqs.map((f) => ({ question: f.question, answer: f.answer })))}
      />
    </>
  )
}
