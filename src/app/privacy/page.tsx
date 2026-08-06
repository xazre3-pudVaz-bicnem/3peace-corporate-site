import type { Metadata } from 'next'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section } from '@/components/ui/Section'
import { JsonLd } from '@/components/ui/JsonLd'
import { site } from '@/data/site'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: 'プライバシーポリシー｜3Peace',
  description:
    '3Peaceにおける個人情報の取り扱いについて定めたプライバシーポリシーです。取得する情報、利用目的、第三者提供、開示請求などについて記載しています。',
  path: '/privacy',
})

const crumbs = [{ name: 'プライバシーポリシー', path: '/privacy' }]

const sections: { title: string; body: string[]; list?: string[] }[] = [
  {
    title: '1. 個人情報の定義',
    body: [
      '本プライバシーポリシーにおける個人情報とは、個人情報の保護に関する法律に定める個人情報を指します。',
    ],
  },
  {
    title: '2. 取得する情報',
    body: ['3Peace（以下「当社」）は、次の場合に個人情報を取得します。'],
    list: [
      'お問い合わせフォームからのご連絡',
      '採用応募フォームからのご応募',
      'お電話・SNSのメッセージによるお問い合わせ',
      '工事のご依頼・お見積もりのご依頼',
    ],
  },
  {
    title: '3. 利用目的',
    body: ['取得した個人情報は、次の目的の範囲内で利用します。'],
    list: [
      'お問い合わせ・ご依頼への回答およびご連絡',
      'お見積もりの作成、工事の実施および工事後のご連絡',
      '採用選考および採用に関するご連絡',
      '当社サービスの改善のための分析',
      '法令に基づく対応',
    ],
  },
  {
    title: '4. 第三者への提供',
    body: [
      '当社は、次の場合を除き、ご本人の同意なく第三者へ個人情報を提供しません。',
    ],
    list: [
      '法令に基づく場合',
      '人の生命、身体または財産の保護のために必要があり、ご本人の同意を得ることが困難な場合',
      '工事の実施に必要な範囲で、業務委託先へ必要最小限の情報を提供する場合',
    ],
  },
  {
    title: '5. 安全管理',
    body: [
      '当社は、取得した個人情報の漏えい、滅失またはき損を防止するため、必要かつ適切な安全管理措置を講じます。',
      'お問い合わせフォームおよび応募フォームから送信された内容は、暗号化された通信により送信されます。',
    ],
  },
  {
    title: '6. 保存期間',
    body: [
      '取得した個人情報は、利用目的の達成に必要な期間に限り保存し、不要となった場合は適切な方法で削除します。',
    ],
  },
  {
    title: '7. アクセス解析',
    body: [
      '当社のウェブサイトでは、サイトの利用状況を把握するためにアクセス解析ツールを使用する場合があります。',
      'アクセス解析ツールはCookieを利用して情報を収集しますが、個人を特定する情報は含まれません。ブラウザの設定によりCookieの使用を無効にすることができます。',
    ],
  },
  {
    title: '8. 開示・訂正・削除のご請求',
    body: [
      'ご本人から個人情報の開示、訂正、利用停止、削除のご請求があった場合は、ご本人であることを確認したうえで、法令に従い速やかに対応します。',
      'ご請求は、下記の連絡先までお問い合わせください。',
    ],
  },
  {
    title: '9. 本ポリシーの変更',
    body: [
      '当社は、必要に応じて本プライバシーポリシーを変更することがあります。変更後の内容は、本ページに掲載した時点から適用されます。',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy Policy" title="プライバシーポリシー" />
      <Breadcrumbs items={crumbs} />

      <Section width="narrow">
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold text-navy">{section.title}</h2>
              <div className="mt-4 space-y-3 text-[0.95rem] leading-8 text-ink-soft">
                {section.body.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}
                {section.list ? (
                  <ul className="mt-3 space-y-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 bg-blue" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}

          <section className="border-t border-line pt-10">
            <h2 className="text-lg font-bold text-navy">10. お問い合わせ窓口</h2>
            <address className="mt-4 space-y-1 text-[0.95rem] leading-8 text-ink-soft not-italic">
              <span className="block">{site.name}</span>
              <span className="block">{site.representativeRole} {site.representative}</span>
              <span className="block">{site.address.full}</span>
              <a
                href={`tel:${site.tel.href}`}
                className="link-underline inline-flex min-h-11 items-center tabular-nums"
              >
                {site.tel.display}
              </a>
            </address>
          </section>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
    </>
  )
}
