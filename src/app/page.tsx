import type { Metadata } from 'next'
import Link from 'next/link'

import { HomeHero } from '@/components/sections/HomeHero'
import { ContactCta } from '@/components/sections/ContactCta'
import { InstagramSection } from '@/components/sections/InstagramSection'
import { CompanyTable } from '@/components/sections/CompanyTable'
import { FaqList } from '@/components/sections/FaqList'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Photo } from '@/components/ui/Photo'
import { JsonLd } from '@/components/ui/JsonLd'

import { publishedServices, relatedFields } from '@/data/services'
import { publishedWorks, hasWorks } from '@/data/works'
import { customerFaqs } from '@/data/faq'
import { publishedNews, hasNews } from '@/data/news'
import { publishedAreas, site } from '@/data/site'
import { images } from '@/data/images'
import { aboutValues } from '@/data/about'
import { recruitMessage } from '@/data/recruit'
import { buildMetadata } from '@/lib/seo'
import { faqPageSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: '広島のエアコン工事なら3Peace｜取り付け・交換のご相談',
  description:
    '広島市を拠点にエアコンの新設・交換・移設・取り外しを行う3Peaceです。設置場所と配管経路を確認し、試運転と動作確認まで行ったうえで施工します。工事のご相談・エアコン工事スタッフの採用情報はこちら。',
  path: '/',
})

/** トップページで表示するFAQは、代表的な5件に絞る */
const topFaqs = customerFaqs.slice(0, 5)

const flowSteps = [
  { no: '01', title: 'お問い合わせ', body: '電話・フォーム・Instagram からご連絡ください。設置場所やご希望をお伺いします。' },
  { no: '02', title: '現場の確認', body: '取り付け位置、配管経路、室外機の置き場所、電源の状況を確認します。' },
  { no: '03', title: '工事内容のご案内', body: '必要な作業と費用をお伝えします。判断が分かれる点は理由も含めてご説明します。' },
  { no: '04', title: '日程の調整', body: 'ご都合に合わせて施工日を決めます。' },
  { no: '05', title: '施工', body: '養生を行い、室内機・配管・室外機の順に施工します。' },
  { no: '06', title: '試運転・お引き渡し', body: '真空引きと試運転で動作を確認し、清掃と使い方のご説明をして完了です。' },
]

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* 02 3Peaceの短い紹介 */}
      <Section space="normal" aria-labelledby="intro-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="About"
              id="intro-heading"
              title="広島市を拠点に、エアコン工事を行っています"
            />
            <Reveal delay={80} className="mt-8 space-y-6 text-[0.975rem] leading-8 text-ink-soft">
              <p>
                3Peaceは、広島市を拠点にエアコン工事を行っています。室内機の設置から配管、室外機の設置まで、
                建物や設置場所の状況を確認しながら、一件一件丁寧に施工します。
              </p>
              <p>
                同じ機種を取り付ける工事でも、壁の下地、配管を通せる経路、室外機を置ける場所は建物ごとに違います。
                現場を見てから施工方法を決め、真空引きと試運転、動作確認まで行ってから引き渡します。
              </p>
              <p>
                エアコンのほかに、{relatedFields.join('・')}
                に関するご相談もお受けしています。内容によって対応できる範囲が変わるため、まずはご相談ください。
              </p>
            </Reveal>
            <Reveal delay={120} className="mt-8">
              <ButtonLink href="/about" variant="ghost">
                3Peaceについて詳しく見る
                <ArrowRight />
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal delay={160} className="relative aspect-4/3 overflow-hidden bg-sky-soft">
            <Photo
              src={images.home.living.src}
              alt={images.home.living.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 92vw"
              fallback="hide"
            />
          </Reveal>
        </div>
      </Section>

      {/* 03 対応しているエアコン工事 */}
      <Section tone="mist" divided aria-labelledby="service-heading">
        <SectionHeading
          eyebrow="Service"
          id="service-heading"
          title="対応しているエアコン工事"
          lead="広島市を中心に、住まいのエアコン工事に対応しています。設置環境によって工事内容が変わるため、現場の状況を確認したうえでご案内します。"
        />

        <ul className="mt-12 border-t border-line-strong">
          {publishedServices.map((service, index) => (
            <li key={service.slug}>
              <Reveal delay={index * 60}>
                <Link
                  href={`/service/${service.slug}`}
                  className="group grid gap-3 border-b border-line py-7 transition-colors hover:bg-white sm:grid-cols-[3rem_1fr_auto] sm:items-baseline sm:gap-6 sm:px-2"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm font-bold text-blue tabular-nums"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-ink group-hover:text-blue sm:text-xl">
                      {service.title}
                    </span>
                    <span className="mt-2 block text-[0.9rem] leading-7 text-ink-soft">
                      {service.lead}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-blue transition-transform group-hover:translate-x-1"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={120} className="mt-10">
          <ButtonLink href="/service" variant="outline">
            業務案内をすべて見る
            <ArrowRight />
          </ButtonLink>
        </Reveal>
      </Section>

      {/* 04 3Peaceが大切にしていること */}
      <Section divided aria-labelledby="values-heading">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Our Standard"
            id="values-heading"
            title="3Peaceが大切にしていること"
            lead="仕上がりの差が出るのは、工事の直後ではなく数年後です。その場で確認できることは、その場で確認してから次の工程へ進みます。"
          />

          <div className="grid gap-px bg-line sm:grid-cols-2">
            {aboutValues.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="bg-white p-6 sm:p-7">
                <h3 className="text-base font-bold text-navy">{item.title}</h3>
                <p className="mt-3 text-[0.9rem] leading-7 text-ink-soft">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* 05 最新の施工事例（0件の場合はセクションごと非表示） */}
      {hasWorks ? (
        <Section tone="mist" divided aria-labelledby="works-heading">
          <SectionHeading
            eyebrow="Works"
            id="works-heading"
            title="最新の施工事例"
            lead="実際に行った工事の内容を掲載しています。設置場所の条件と、どのように施工したかをご覧いただけます。"
          />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {publishedWorks.slice(0, 3).map((work, index) => (
              <li key={work.slug}>
                <Reveal delay={index * 70}>
                  <Link href={`/works/${work.slug}`} className="group block">
                    <div className="relative aspect-4/3 overflow-hidden bg-sky-soft">
                      {work.images[0] ? (
                        <Photo
                          src={work.images[0].src}
                          alt={work.images[0].alt}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                          fallback="hide"
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
                      <span className="bg-navy px-2 py-1 font-bold text-white">{work.category}</span>
                      <span>{work.area}</span>
                      {work.completedAt ? <span>{work.completedAt.replace('-', '年')}月</span> : null}
                    </p>
                    <h3 className="mt-3 text-base font-bold text-ink group-hover:text-blue">
                      {work.title}
                    </h3>
                    <p className="mt-2 text-[0.875rem] leading-7 text-ink-soft">{work.summary}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal delay={140} className="mt-10">
            <ButtonLink href="/works" variant="outline">
              施工事例をすべて見る
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </Section>
      ) : null}

      {/* 現場確認の様子（全幅の帯） */}
      <Reveal className="relative aspect-16/9 w-full overflow-hidden bg-sky-soft sm:aspect-21/9">
        <Photo
          src={images.home.siteCheck.src}
          alt={images.home.siteCheck.alt}
          fill
          sizes="100vw"
          fallback="hide"
        />
      </Reveal>

      {/* 06 施工の流れ */}
      <Section aria-labelledby="flow-heading">
        <SectionHeading
          eyebrow="Flow"
          id="flow-heading"
          title="お問い合わせから施工までの流れ"
          lead="ご相談から工事完了までの進み方です。現場を確認したうえで工事内容をお伝えしてから、施工日を決めます。"
        />
        <ol className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {flowSteps.map((step, index) => (
            <li key={step.no}>
              <Reveal delay={index * 60} className="h-full bg-white p-6 sm:p-7">
                <p aria-hidden="true" className="font-mono text-sm font-bold text-blue tabular-nums">
                  {step.no}
                </p>
                <h3 className="mt-3 text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-7 text-ink-soft">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* 07 対応エリア */}
      <Section tone="mist" divided width="narrow" aria-labelledby="area-heading">
        <SectionHeading
          eyebrow="Area"
          id="area-heading"
          title="対応エリア"
          lead={`${publishedAreas.map((a) => a.name).join('・')}を中心に対応しています。エリア外と思われる場所でも、まずはご相談ください。現場の場所と工事内容を確認したうえでお返事します。`}
        />
        <Reveal delay={80} className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {publishedAreas.map((area) => (
              <li
                key={area.name}
                className="border border-line-strong bg-white px-4 py-2 text-sm font-bold text-navy"
              >
                {area.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* 08 よくある質問 */}
      <Section divided width="narrow" aria-labelledby="faq-heading">
        <SectionHeading
          eyebrow="FAQ"
          id="faq-heading"
          title="よくある質問"
          lead="工事のご依頼を検討されている方から、よくいただく質問をまとめました。"
        />
        <Reveal delay={80} className="mt-10">
          <FaqList faqs={topFaqs} />
        </Reveal>
        <Reveal delay={120} className="mt-8">
          <ButtonLink href="/faq" variant="ghost">
            よくある質問をすべて見る
            <ArrowRight />
          </ButtonLink>
        </Reveal>
      </Section>

      {/* 09 採用メッセージ */}
      <section
        aria-labelledby="recruit-heading"
        className="relative isolate overflow-hidden bg-navy-deep py-16 text-white sm:py-24"
      >
        <div className="absolute inset-0 -z-10">
          <Photo
            src={images.recruit.staff.src}
            alt=""
            fill
            sizes="100vw"
            fallback="hide"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy-deep via-navy-deep/90 to-navy-deep/55" />
        </div>
        <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-end lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Recruit"
              id="recruit-heading"
              tone="light"
              title="技術を身につけ、必要とされる仕事を。"
              lead={recruitMessage.paragraphs[0]}
            />
            <Reveal delay={80} className="mt-6 max-w-2xl text-[0.95rem] leading-8 text-white/80">
              <p>
                エアコン工事は、暮らしの快適さを支える仕事です。3Peaceでは、一つひとつの現場に向き合いながら、
                技術者として成長したい仲間を募集します。
              </p>
            </Reveal>
          </div>
          <Reveal delay={140} className="flex flex-col gap-3">
            <ButtonLink href="/recruit" variant="light" size="lg">
              仕事内容を詳しく見る
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/recruit#jobs" variant="lightOutline" size="lg">
              募集要項を見る
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </div>
        </Container>
      </section>

      {/* 10 Instagram */}
      <InstagramSection />

      {/* お知らせ（0件のあいだは非表示） */}
      {hasNews ? (
        <Section divided width="narrow" aria-labelledby="news-heading">
          <SectionHeading eyebrow="News" id="news-heading" title="お知らせ" />
          <ul className="mt-10 border-t border-line">
            {publishedNews.slice(0, 5).map((item) => (
              <li key={item.slug} className="border-b border-line">
                <Link
                  href={`/news/${item.slug}`}
                  className="grid gap-1 py-5 transition-colors hover:text-blue sm:grid-cols-[7rem_6rem_1fr] sm:items-baseline sm:gap-4"
                >
                  <time dateTime={item.publishedAt} className="font-mono text-sm text-ink-soft">
                    {item.publishedAt.replace(/-/g, '.')}
                  </time>
                  <span className="text-xs font-bold text-blue">{item.category}</span>
                  <span className="text-[0.95rem] font-bold text-ink">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Reveal delay={80} className="mt-8">
            <ButtonLink href="/news" variant="ghost">
              お知らせをすべて見る
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </Section>
      ) : null}

      {/* 11 お問い合わせCTA */}
      <ContactCta />

      {/* 12 会社概要 */}
      <Section width="narrow" aria-labelledby="company-heading">
        <SectionHeading eyebrow="Company" id="company-heading" title="会社概要" />
        <Reveal delay={80} className="mt-10">
          <CompanyTable />
        </Reveal>
        <Reveal delay={120} className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/about" variant="outline">
            3Peaceについて
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/message" variant="ghost">
            代表挨拶
            <ArrowRight />
          </ButtonLink>
        </Reveal>
        <p className="mt-8 text-xs leading-6 text-ink-soft">
          Instagram：
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            {site.instagramHandle}
          </a>
        </p>
      </Section>

      <JsonLd
        data={faqPageSchema(topFaqs.map((f) => ({ question: f.question, answer: f.answer })))}
      />
    </>
  )
}
