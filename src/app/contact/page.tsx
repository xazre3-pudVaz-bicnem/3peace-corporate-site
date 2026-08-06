import type { Metadata } from 'next'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink, PhoneIcon } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactForm } from '@/components/forms/ContactForm'

import { site } from '@/data/site'
import { isMailConfigured } from '@/lib/mail'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: 'お問い合わせ｜広島のエアコン工事 3Peace',
  description:
    'エアコンの新設・交換・移設・取り外しに関するご相談はこちらから。広島市を中心に対応しています。お電話（080-3880-4024）・フォーム・Instagram で受け付けています。',
  path: '/contact',
})

const crumbs = [{ name: 'お問い合わせ', path: '/contact' }]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="エアコン工事のご相談"
        lead="設置場所の状況によって必要な工事が変わります。「取り付けられるか分からない」という段階でも構いません。分かる範囲でお知らせいただければ、確認したうえでご案内します。"
      />
      <Breadcrumbs items={crumbs} />

      {/* 連絡手段 */}
      <Section tone="mist" space="tight" aria-labelledby="contact-methods-heading">
        <h2 id="contact-methods-heading" className="sr-only">
          お問い合わせ方法
        </h2>
        <div className="grid gap-px bg-line sm:grid-cols-3">
          <div className="bg-white p-6">
            <p className="text-xs font-bold tracking-wider text-blue">お電話</p>
            <a
              href={`tel:${site.tel.href}`}
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-xl font-bold tabular-nums text-navy hover:text-blue"
            >
              <PhoneIcon className="h-5 w-5" />
              {site.tel.display}
            </a>
            <p className="mt-2 text-xs leading-6 text-ink-soft">
              工事・採用どちらのご相談も受け付けています。ご用件をお伝えください。
            </p>
          </div>
          <div className="bg-white p-6">
            <p className="text-xs font-bold tracking-wider text-blue">フォーム</p>
            <p className="mt-3 text-[0.95rem] font-bold text-navy">下記のフォームから</p>
            <p className="mt-2 text-xs leading-6 text-ink-soft">
              設置場所の状況を書いていただけると、確認がスムーズです。
            </p>
          </div>
          <div className="bg-white p-6">
            <p className="text-xs font-bold tracking-wider text-blue">Instagram</p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center text-[0.95rem] font-bold text-navy hover:text-blue"
            >
              {site.instagramHandle}
            </a>
            <p className="mt-2 text-xs leading-6 text-ink-soft">
              メッセージからのご相談も受け付けています。
            </p>
          </div>
        </div>
      </Section>

      {/* フォーム */}
      <Section width="narrow" aria-labelledby="contact-form-heading">
        <SectionHeading
          eyebrow="Form"
          id="contact-form-heading"
          title="お問い合わせフォーム"
          lead="必須の項目のみご入力いただければ送信できます。分かる範囲で構いません。"
        />
        <Reveal delay={60} className="mt-10">
          <ContactForm mailEnabled={isMailConfigured} />
        </Reveal>
      </Section>

      {/* 採用の問い合わせ導線を分離 */}
      <Section tone="mist" divided width="narrow" aria-labelledby="contact-recruit-heading">
        <h2 id="contact-recruit-heading" className="text-lg font-bold text-ink">
          採用へのご応募・ご相談をお考えの方へ
        </h2>
        <p className="mt-4 text-[0.925rem] leading-8 text-ink-soft">
          エアコン工事の仕事内容や、募集している職種については採用ページに掲載しています。
          応募前に仕事内容を聞いてみたい、という段階のご相談も受け付けています。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/recruit" variant="outline">
            採用情報を見る
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/recruit#entry" variant="ghost">
            応募・相談について
            <ArrowRight />
          </ButtonLink>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
    </>
  )
}
