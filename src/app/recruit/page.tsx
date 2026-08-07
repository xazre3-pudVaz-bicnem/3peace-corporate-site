import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink, PhoneIcon } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { DevImageHint, Photo } from '@/components/ui/Photo'
import { JsonLd } from '@/components/ui/JsonLd'
import { FaqList } from '@/components/sections/FaqList'
import { ApplicationForm } from '@/components/forms/ApplicationForm'

import {
  applicationFlow,
  careerImage,
  dailyFlow,
  growthSteps,
  idealCandidate,
  jobNature,
  publishedInterviews,
  recruitCta,
  recruitHero,
  recruitMessage,
  recruitNumbers,
  recruitWorkOverview,
  recruitmentSettings,
  skillsGained,
  workEnvironment,
  workValues,
} from '@/data/recruit'
import { jobChoices, publishedJobs } from '@/data/jobs'
import { images } from '@/data/images'
import { recruitFaqs } from '@/data/faq'
import { site } from '@/data/site'
import { isMailConfigured } from '@/lib/mail'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema, faqPageSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: '広島のエアコン工事スタッフ求人・採用情報｜3Peace',
  description:
    '広島市のエアコン工事会社3Peaceの採用情報です。エアコン工事の仕事内容、一日の流れ、入社後に身につく技術、求める人物像、募集職種、応募の流れを掲載しています。応募前のご相談も受け付けています。',
  path: '/recruit',
})

const crumbs = [{ name: '採用情報', path: '/recruit' }]

/** 値が入力されている項目だけを表示する（ダミーの数値は出さない） */
const filledNumbers = recruitNumbers.filter((n) => n.value && n.value.trim().length > 0)

export default function RecruitPage() {
  const acceptingApplications = recruitmentSettings.acceptingApplications
  const openJobs = publishedJobs.filter((j) => j.acceptingApplications)

  return (
    <>
      {/* 01 採用ヒーロー */}
      <section className="relative isolate overflow-hidden bg-navy-deep text-white">
        <div className="absolute inset-0 -z-10">
          <Photo
            src={images.recruit.hero.src}
            alt=""
            fill
            sizes="100vw"
            priority
            fallback="hide"
            className="object-cover"
          />
          {/*
            見出しの可読性を確保するための重ね。
            タブレット幅では見出しが右まで伸びるため、右端も暗さを残している
            （実測でコントラスト比を確認済み）。
          */}
          <div className="absolute inset-0 bg-linear-to-b from-navy-deep/85 via-navy-deep/65 to-navy-deep/90 sm:bg-linear-to-r sm:from-navy-deep/92 sm:via-navy-deep/72 sm:to-navy-deep/55 lg:to-navy-deep/35" />
        </div>

        <Container width="wide">
          <div className="flex min-h-[26rem] flex-col justify-end py-16 sm:min-h-[32rem] sm:justify-center sm:py-24">
            <DevImageHint src={images.recruit.hero.src} label="採用ヒーロー" />
            <h1>
              {/* 写真の上では水色より白のほうがコントラストを確保しやすい */}
              <span className="eyebrow text-white">広島のエアコン工事スタッフ 採用情報</span>
              <span className="mt-5 block max-w-4xl text-[1.875rem] leading-[1.3] font-bold tracking-tight sm:text-5xl">
                {recruitHero.title}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-[0.95rem] leading-8 text-white/90">
              {recruitHero.lead}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="#jobs" variant="light" size="lg">
                募集要項を見る
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href="#job-nature" variant="lightOutline" size="lg">
                仕事内容を詳しく見る
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href="#entry" variant="ghost" size="lg" className="text-white hover:text-sky">
                応募前に相談する
                <ArrowRight />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
      <Breadcrumbs items={crumbs} />

      {/* 02 採用メッセージ */}
      <Section width="narrow" aria-labelledby="recruit-message-heading">
        <SectionHeading
          eyebrow="Message"
          id="recruit-message-heading"
          title={recruitMessage.heading}
        />
        <Reveal delay={60} className="mt-8 space-y-5 text-[0.975rem] leading-8 text-ink-soft">
          {recruitMessage.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Reveal>
      </Section>

      {/* 03 3Peaceの仕事 */}
      <Section tone="mist" divided width="narrow" aria-labelledby="recruit-work-heading">
        <SectionHeading
          eyebrow="Our Work"
          id="recruit-work-heading"
          title={recruitWorkOverview.heading}
        />
        <Reveal delay={60} className="mt-8 space-y-5 text-[0.975rem] leading-8 text-ink-soft">
          {recruitWorkOverview.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Reveal>
        <Reveal delay={100} className="mt-8">
          <ButtonLink href="/service" variant="ghost">
            対応している工事を見る
            <ArrowRight />
          </ButtonLink>
        </Reveal>
      </Section>

      {/* 04 エアコン工事の仕事とは */}
      <Section id="job-nature" divided aria-labelledby="job-nature-heading">
        <SectionHeading
          eyebrow="Job"
          id="job-nature-heading"
          title={jobNature.heading}
          lead={jobNature.intro}
        />
        <ol className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {jobNature.items.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={index * 50} className="h-full bg-white p-6 sm:p-7">
                <p aria-hidden="true" className="font-mono text-sm font-bold text-blue tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-7 text-ink-soft">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* 05 この仕事で身につくこと */}
      <Section tone="sky" divided aria-labelledby="skills-heading">
        <SectionHeading eyebrow="Skills" id="skills-heading" title={skillsGained.heading} />
        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {skillsGained.items.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={index * 50} className="h-full bg-white p-6 sm:p-7">
                <h3 className="text-base font-bold text-navy">{item.title}</h3>
                <p className="mt-3 text-[0.9rem] leading-7 text-ink-soft">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 06 一日の流れ */}
      <Section divided width="narrow" aria-labelledby="daily-heading">
        <SectionHeading
          eyebrow="One Day"
          id="daily-heading"
          title="一日の流れ"
          lead="現場や工事の内容によって変わりますが、おおよそ次のような流れで進みます。"
        />
        <ol className="mt-12 border-l border-line">
          {dailyFlow.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 40} className="relative pb-8 pl-8 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-[0.3125rem] h-2.5 w-2.5 rounded-full bg-blue"
                />
                {step.time ? (
                  <p className="font-mono text-xs font-bold text-blue">{step.time}</p>
                ) : null}
                <h3 className="text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-7 text-ink-soft">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* 07 入社後のステップ */}
      <Section tone="mist" divided aria-labelledby="growth-heading">
        <SectionHeading
          eyebrow="Step"
          id="growth-heading"
          title="入社後のステップ"
          lead="一人ひとりの経験や覚え方に合わせて進めます。期間を区切って進めるものではありません。"
        />
        <ol className="mt-12 grid gap-px bg-line lg:grid-cols-5">
          {growthSteps.map((step, index) => (
            <li key={step.step}>
              <Reveal delay={index * 60} className="h-full bg-white p-6">
                <p aria-hidden="true" className="font-mono text-xs font-bold text-blue">
                  {step.step}
                </p>
                <h3 className="mt-3 text-[0.95rem] font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-[0.85rem] leading-7 text-ink-soft">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* 08 キャリアイメージ */}
      <Section divided width="narrow" aria-labelledby="career-heading">
        <SectionHeading
          eyebrow="Career"
          id="career-heading"
          title={careerImage.heading}
          lead={careerImage.intro}
        />
        <Reveal delay={60} className="mt-8 space-y-5 text-[0.975rem] leading-8 text-ink-soft">
          {careerImage.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Reveal>
      </Section>

      {/* 09 仕事で大切にすること */}
      <Section tone="mist" divided aria-labelledby="values-heading">
        <SectionHeading eyebrow="Values" id="values-heading" title={workValues.heading} />
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {workValues.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 60} className="h-full bg-white p-7">
              <h3 className="text-base font-bold text-navy">{item.title}</h3>
              <p className="mt-3 text-[0.9rem] leading-7 text-ink-soft">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 10 働く環境 */}
      <Section divided width="narrow" aria-labelledby="environment-heading">
        <SectionHeading
          eyebrow="Environment"
          id="environment-heading"
          title={workEnvironment.heading}
        />
        <Reveal delay={60} className="mt-8 space-y-5 text-[0.975rem] leading-8 text-ink-soft">
          {workEnvironment.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Reveal>
        <Reveal delay={100} className="relative mt-10 aspect-16/9 overflow-hidden bg-sky-soft">
          <Photo
            src={images.recruit.preparation.src}
            alt={images.recruit.preparation.alt}
            fill
            sizes="(min-width: 768px) 48rem, 92vw"
            fallback="hide"
          />
        </Reveal>
        {workEnvironment.items.length > 0 ? (
          <Reveal delay={100} className="mt-10 grid gap-px bg-line sm:grid-cols-2">
            {workEnvironment.items.map((item) => (
              <div key={item.title} className="bg-white p-6">
                <h3 className="text-base font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-7 text-ink-soft">{item.body}</p>
              </div>
            ))}
          </Reveal>
        ) : null}
      </Section>

      {/* 11 数字で見る3Peace（値が入力された項目が無い場合は非表示） */}
      {filledNumbers.length > 0 ? (
        <Section tone="navy" divided aria-labelledby="numbers-heading">
          <SectionHeading eyebrow="Data" id="numbers-heading" tone="light" title="数字で見る3Peace" />
          <dl className="mt-12 grid gap-px bg-white/20 sm:grid-cols-2 lg:grid-cols-4">
            {filledNumbers.map((item) => (
              <div key={item.label} className="bg-navy-deep p-6">
                <dt className="text-xs font-bold text-sky">{item.label}</dt>
                <dd className="mt-3 text-3xl font-bold tabular-nums">
                  {item.value}
                  {item.unit ? <span className="ml-1 text-base font-bold">{item.unit}</span> : null}
                </dd>
                {item.note ? <p className="mt-2 text-xs text-white/70">{item.note}</p> : null}
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {/* 12 スタッフインタビュー（取材前は非表示） */}
      {publishedInterviews.length > 0 ? (
        <Section divided aria-labelledby="interview-heading">
          <SectionHeading eyebrow="Interview" id="interview-heading" title="スタッフインタビュー" />
          <div className="mt-12 space-y-12">
            {publishedInterviews.map((person) => (
              <Reveal key={person.id} className="grid gap-8 lg:grid-cols-[minmax(0,16rem)_1fr]">
                {person.image ? (
                  <div className="relative aspect-3/4 overflow-hidden bg-sky-soft">
                    <Photo
                      src={person.image.src}
                      alt={person.image.alt}
                      fill
                      sizes="(min-width: 1024px) 16rem, 90vw"
                      fallback="hide"
                    />
                  </div>
                ) : null}
                <div>
                  <p className="text-sm text-ink-soft">
                    {[person.role, person.joinedYear ? `${person.joinedYear}入社` : undefined]
                      .filter(Boolean)
                      .join('／')}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-ink">{person.name}</h3>
                  <div className="mt-6 space-y-6">
                    {(
                      [
                        ['入社した理由', person.reasonToJoin],
                        ['担当している仕事', person.work],
                        ['成長したと感じること', person.growth],
                        ['仕事のやりがい', person.reward],
                        ['大変なこと', person.difficulty],
                        ['応募を考えている方へ', person.messageToApplicants],
                      ] as const
                    )
                      .filter(([, body]) => body && body.length > 0)
                      .map(([label, body]) => (
                        <div key={label}>
                          <h4 className="text-sm font-bold text-navy">{label}</h4>
                          <div className="mt-2 space-y-3 text-[0.9rem] leading-8 text-ink-soft">
                            {body!.map((text, index) => (
                              <p key={index}>{text}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* 13 求める人物像 */}
      <Section tone="mist" divided width="narrow" aria-labelledby="ideal-heading">
        <SectionHeading
          eyebrow="Person"
          id="ideal-heading"
          title={idealCandidate.heading}
          lead={idealCandidate.intro}
        />
        <Reveal delay={60} className="mt-8">
          <ul className="border-t border-line-strong">
            {idealCandidate.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-line py-4 text-[0.95rem] leading-7 text-ink"
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
          <p className="mt-6 text-xs leading-6 text-ink-soft">{idealCandidate.note}</p>
        </Reveal>
      </Section>

      {/* 14 募集職種一覧（※このページには JobPosting 構造化データを出力しない） */}
      <Section id="jobs" divided aria-labelledby="jobs-heading">
        <SectionHeading
          eyebrow="Jobs"
          id="jobs-heading"
          title="募集職種"
          lead={
            acceptingApplications
              ? '現在募集している職種です。詳しい仕事内容と募集内容は各ページをご覧ください。'
              : '現在、募集内容を準備中です。仕事内容は下記のページに掲載しています。応募前のご相談は受け付けています。'
          }
        />

        {publishedJobs.length > 0 ? (
          <ul className="mt-12 border-t border-line-strong">
            {publishedJobs.map((job, index) => (
              <li key={job.slug}>
                <Reveal delay={index * 60}>
                  <Link
                    href={`/recruit/jobs/${job.slug}`}
                    className="group grid gap-3 border-b border-line py-7 transition-colors hover:bg-mist sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:px-2"
                  >
                    <span>
                      <span className="flex flex-wrap items-center gap-3">
                        <span className="text-lg font-bold text-ink group-hover:text-blue sm:text-xl">
                          {job.title}
                        </span>
                        <span
                          className={`px-2 py-1 text-[0.7rem] font-bold ${
                            job.acceptingApplications
                              ? 'bg-blue text-white'
                              : 'border border-line-strong text-ink-soft'
                          }`}
                        >
                          {job.acceptingApplications ? '募集中' : '募集内容 準備中'}
                        </span>
                      </span>
                      <span className="mt-2 block text-[0.9rem] leading-7 text-ink-soft">
                        {job.shortDescription}
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
        ) : (
          <p className="mt-10 border border-line bg-mist px-6 py-10 text-center text-[0.95rem] leading-8 text-ink-soft">
            現在、募集中の職種はありません。
            <br />
            エアコン工事の仕事に興味がある方は、お問い合わせフォームからご相談ください。
          </p>
        )}
      </Section>

      {/* 15 採用FAQ */}
      {recruitFaqs.length > 0 ? (
        <Section tone="mist" divided width="narrow" aria-labelledby="recruit-faq-heading">
          <SectionHeading eyebrow="FAQ" id="recruit-faq-heading" title="採用に関するよくある質問" />
          <Reveal delay={60} className="mt-10">
            <FaqList faqs={recruitFaqs} />
          </Reveal>
        </Section>
      ) : null}

      {/* 16 応募の流れ */}
      <Section divided aria-labelledby="flow-heading">
        <SectionHeading
          eyebrow="Flow"
          id="flow-heading"
          title="応募の流れ"
          lead="応募前に仕事内容を聞いてみたい、という段階のご相談も受け付けています。"
        />
        <ol className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {applicationFlow.map((step, index) => (
            <li key={step.step}>
              <Reveal delay={index * 60} className="h-full bg-white p-6 sm:p-7">
                <p aria-hidden="true" className="font-mono text-sm font-bold text-blue tabular-nums">
                  {step.step}
                </p>
                <h3 className="mt-3 text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-7 text-ink-soft">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* 17 エントリーCTA */}
      <Section id="entry" tone="navy" divided width="narrow" aria-labelledby="entry-heading">
        <SectionHeading
          eyebrow="Entry"
          id="entry-heading"
          tone="light"
          title={acceptingApplications ? recruitCta.headingOpen : recruitCta.headingClosed}
          lead={acceptingApplications ? recruitCta.bodyOpen : recruitCta.bodyClosed}
        />

        <Reveal delay={80} className="mt-10">
          {acceptingApplications ? (
            <div className="bg-white p-6 text-ink sm:p-10">
              <ApplicationForm
                mailEnabled={isMailConfigured}
                jobOptions={openJobs.length > 0 ? openJobs.map((j) => j.title) : jobChoices}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/contact" variant="light" size="lg" className="sm:flex-1">
                採用について問い合わせる
                <ArrowRight />
              </ButtonLink>
              <a
                href={`tel:${site.tel.href}`}
                className="flex min-h-13 flex-col items-center justify-center border border-white/60 px-6 py-3 text-white transition-colors hover:bg-white hover:text-navy sm:flex-1"
              >
                <span className="flex items-center gap-2 text-xl font-bold tabular-nums">
                  <PhoneIcon className="h-5 w-5" />
                  {site.tel.display}
                </span>
                <span className="mt-0.5 text-xs opacity-85">{recruitCta.telNote}</span>
              </a>
            </div>
          )}
        </Reveal>
      </Section>

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
      {recruitFaqs.length > 0 ? (
        <JsonLd
          data={faqPageSchema(recruitFaqs.map((f) => ({ question: f.question, answer: f.answer })))}
        />
      ) : null}
    </>
  )
}
