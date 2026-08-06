import type { Metadata } from 'next'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Photo } from '@/components/ui/Photo'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'
import { CompanyTable } from '@/components/sections/CompanyTable'

import {
  aboutCommunication,
  aboutFuture,
  aboutLocal,
  aboutQuality,
  aboutSafety,
  aboutValues,
  aboutWork,
} from '@/data/about'
import { site } from '@/data/site'
import { images } from '@/data/images'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: '3Peaceについて｜広島市西区のエアコン工事会社',
  description:
    '広島市西区己斐上を拠点にエアコン工事を行う3Peaceの会社案内です。仕事で大切にしていること、安全と施工品質への考え方、お客様とのやりとり、会社概要とアクセスを掲載しています。',
  path: '/about',
})

const crumbs = [{ name: '3Peaceについて', path: '/about' }]

/** 文章ブロック（見出し＋段落） */
function Prose({
  eyebrow,
  heading,
  paragraphs,
  id,
}: {
  eyebrow: string
  heading: string
  paragraphs: string[]
  id: string
}) {
  return (
    <>
      <SectionHeading eyebrow={eyebrow} id={id} title={heading} />
      <Reveal delay={60} className="mt-8 space-y-5 text-[0.975rem] leading-8 text-ink-soft">
        {paragraphs.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </Reveal>
    </>
  )
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="広島の街と暮らしを、確かなエアコン工事で。"
        lead="3Peaceは広島市西区を拠点に、住まいのエアコン工事を行っています。工事の内容と、私たちが仕事で大切にしていることをご紹介します。"
        image={{ src: images.company.hero.src, alt: '' }}
      />
      <Breadcrumbs items={crumbs} />

      <Section width="narrow" aria-labelledby="about-work-heading">
        <Prose
          eyebrow="Business"
          id="about-work-heading"
          heading={aboutWork.heading}
          paragraphs={aboutWork.paragraphs}
        />
      </Section>

      {/* 仕事で大切にしていること */}
      <Section tone="mist" divided aria-labelledby="about-values-heading">
        <SectionHeading
          eyebrow="Standard"
          id="about-values-heading"
          title={aboutValues.heading}
          lead="言葉ではなく、現場で行っていることとして書いています。"
        />
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {aboutValues.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 60} className="h-full bg-white p-7 sm:p-8">
              <h3 className="text-base font-bold text-navy">{item.title}</h3>
              <p className="mt-3 text-[0.9rem] leading-7 text-ink-soft">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section divided width="narrow" aria-labelledby="about-safety-heading">
        <Prose
          eyebrow="Safety"
          id="about-safety-heading"
          heading={aboutSafety.heading}
          paragraphs={aboutSafety.paragraphs}
        />
      </Section>

      <Section tone="sky" divided width="narrow" aria-labelledby="about-quality-heading">
        <Prose
          eyebrow="Quality"
          id="about-quality-heading"
          heading={aboutQuality.heading}
          paragraphs={aboutQuality.paragraphs}
        />
        <Reveal delay={100} className="relative mt-10 aspect-16/9 overflow-hidden bg-white">
          <Photo
            src={images.home.testRun.src}
            alt={images.home.testRun.alt}
            fill
            sizes="(min-width: 768px) 48rem, 92vw"
            fallback="hide"
          />
        </Reveal>
      </Section>

      <Section divided width="narrow" aria-labelledby="about-communication-heading">
        <Prose
          eyebrow="Communication"
          id="about-communication-heading"
          heading={aboutCommunication.heading}
          paragraphs={aboutCommunication.paragraphs}
        />
      </Section>

      <Section tone="mist" divided width="narrow" aria-labelledby="about-local-heading">
        <Prose
          eyebrow="Local"
          id="about-local-heading"
          heading={aboutLocal.heading}
          paragraphs={aboutLocal.paragraphs}
        />
        <Reveal delay={100} className="relative mt-10 aspect-16/9 overflow-hidden bg-white">
          <Photo
            src={images.company.living.src}
            alt={images.company.living.alt}
            fill
            sizes="(min-width: 768px) 48rem, 92vw"
            fallback="hide"
          />
        </Reveal>
      </Section>

      <Section divided width="narrow" aria-labelledby="about-future-heading">
        <Prose
          eyebrow="Vision"
          id="about-future-heading"
          heading={aboutFuture.heading}
          paragraphs={aboutFuture.paragraphs}
        />
        <Reveal delay={100} className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/message" variant="outline">
            代表挨拶を読む
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/recruit" variant="ghost">
            採用情報を見る
            <ArrowRight />
          </ButtonLink>
        </Reveal>
      </Section>

      {/* 会社概要 */}
      <Section tone="mist" divided width="narrow" aria-labelledby="company-heading">
        <SectionHeading eyebrow="Company" id="company-heading" title="会社概要" />
        <Reveal delay={60} className="mt-10">
          <CompanyTable />
        </Reveal>
      </Section>

      {/* アクセス */}
      <Section divided width="narrow" aria-labelledby="access-heading">
        <SectionHeading
          eyebrow="Access"
          id="access-heading"
          title="アクセス"
          lead={site.address.full}
        />
        <Reveal delay={60} className="mt-8">
          <div className="relative aspect-4/3 w-full border border-line sm:aspect-16/9">
            <iframe
              title={`${site.name}の所在地の地図`}
              src={site.map.embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <p className="mt-4 text-xs leading-6 text-ink-soft">
            ご相談・お見積もりは、お電話・お問い合わせフォーム・Instagram から承っています。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={site.map.linkUrl} variant="outline" external>
              Googleマップで開く
              <ArrowRight />
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <ContactCta />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
    </>
  )
}
