import type { Metadata } from 'next'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'
import { FaqList } from '@/components/sections/FaqList'

import { customerFaqs, recruitFaqs } from '@/data/faq'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, faqPageSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: 'よくある質問｜広島のエアコン工事 3Peace',
  description:
    'エアコン工事のご依頼を検討中の方と、採用への応募を検討中の方からよくいただく質問をまとめました。見積もり、工事前の準備、対応エリア、仕事内容、応募前の相談などにお答えします。',
  path: '/faq',
})

const crumbs = [{ name: 'よくある質問', path: '/faq' }]

export default function FaqPage() {
  const allFaqs = [...customerFaqs, ...recruitFaqs]

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="よくある質問"
        lead="工事をご検討の方と、採用への応募をご検討の方それぞれからよくいただく質問をまとめました。ここに無い内容は、お問い合わせフォームからお気軽にご質問ください。"
      />
      <Breadcrumbs items={crumbs} />

      {/* お客様向け */}
      <Section id="customer" width="narrow" aria-labelledby="faq-customer-heading">
        <SectionHeading
          eyebrow="For Customer"
          id="faq-customer-heading"
          title="工事をご検討の方へ"
        />
        <Reveal delay={60} className="mt-10">
          <FaqList faqs={customerFaqs} />
        </Reveal>
        <Reveal delay={100} className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/service" variant="outline">
            業務案内を見る
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            工事について相談する
            <ArrowRight />
          </ButtonLink>
        </Reveal>
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
              採用情報を見る
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/recruit#jobs" variant="ghost">
              募集職種を見る
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
