import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink, PhoneIcon } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { JsonLd } from '@/components/ui/JsonLd'
import { ApplicationForm } from '@/components/forms/ApplicationForm'

import { getJob, publishedJobs } from '@/data/jobs'
import { recruitmentSettings } from '@/data/recruit'
import { site } from '@/data/site'
import { isMailConfigured } from '@/lib/mail'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { buildJobPostingSchema, formatSalary, isJobPostingReady } from '@/lib/jobPosting'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return publishedJobs.map((job) => ({ slug: job.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const job = getJob(slug)
  if (!job) return {}

  return buildMetadata({
    title: `${job.title}の求人｜広島市西区`,
    description: job.shortDescription,
    path: `/recruit/jobs/${job.slug}`,
  })
}

/** 募集要項テーブルの行（未入力の項目は行ごと非表示） */
function RequirementRow({
  label,
  value,
  list,
}: {
  label: string
  value?: string
  list?: string[]
}) {
  const hasList = list && list.length > 0
  if (!value && !hasList) return null

  return (
    <div className="grid gap-2 border-b border-line py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <dt className="text-sm font-bold text-ink-soft">{label}</dt>
      <dd className="text-[0.95rem] leading-8 text-ink">
        {hasList ? (
          <ul className="space-y-2">
            {list.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-3.5 h-1.5 w-1.5 shrink-0 bg-blue" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

export default async function JobDetailPage({ params }: Params) {
  const { slug } = await params
  const job = getJob(slug)
  if (!job) notFound()

  // 画面に表示する内容と JSON-LD は同じデータから生成しているため、常に一致します
  const schemaReady = isJobPostingReady(job)
  const salary = formatSalary(job.salary)
  const canApply = recruitmentSettings.acceptingApplications && job.acceptingApplications
  const others = publishedJobs.filter((j) => j.slug !== job.slug)

  const workLocationText = [
    job.workLocation.region,
    job.workLocation.locality,
    job.workLocation.streetAddress,
  ]
    .filter(Boolean)
    .join('')

  const crumbs = [
    { name: '採用情報', path: '/recruit' },
    { name: job.title, path: `/recruit/jobs/${job.slug}` },
  ]

  const hasAnyRequirement =
    !!salary ||
    job.employmentType.length > 0 ||
    !!job.workingHours ||
    !!job.holidays ||
    job.benefits.length > 0 ||
    !!job.trialPeriod ||
    job.qualifications.length > 0 ||
    job.selectionProcess.length > 0

  return (
    <>
      <div className="bg-navy-deep py-14 text-white sm:py-20">
        <Container width="wide">
          <p className="flex flex-wrap items-center gap-3 text-xs">
            <span
              className={`px-2 py-1 font-bold ${
                canApply ? 'bg-white text-navy' : 'border border-white/50 text-white/80'
              }`}
            >
              {canApply ? '募集中' : '募集内容 準備中'}
            </span>
            <span className="text-white/80">広島市</span>
          </p>
          <h1 className="mt-5 max-w-4xl text-[1.75rem] leading-tight font-bold sm:text-4xl">
            {job.title}の求人
          </h1>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-8 text-white/85">
            {job.shortDescription}
          </p>
        </Container>
      </div>
      <Breadcrumbs items={crumbs} />

      {/* 仕事内容 */}
      <Section width="narrow" aria-labelledby="job-description-heading">
        <SectionHeading eyebrow="Description" id="job-description-heading" title="仕事内容" />
        <Reveal delay={60} className="mt-8 space-y-5 text-[0.975rem] leading-8 text-ink-soft">
          {job.fullDescription.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Reveal>

        {job.responsibilities.length > 0 ? (
          <Reveal delay={100} className="mt-10">
            <h3 className="text-base font-bold text-navy">担当していただく作業</h3>
            <ul className="mt-4 border-t border-line">
              {job.responsibilities.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-line py-3.5 text-[0.95rem] leading-7 text-ink"
                >
                  <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 bg-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </Section>

      {/* 募集要項 */}
      <Section tone="mist" divided width="narrow" aria-labelledby="requirements-heading">
        <SectionHeading eyebrow="Requirements" id="requirements-heading" title="募集要項" />

        <Reveal delay={60} className="mt-10">
          <dl className="border-t border-line-strong">
            <RequirementRow label="職種" value={job.title} />
            <RequirementRow label="雇用形態" list={job.employmentType} />
            <RequirementRow label="給与" value={salary} />
            <RequirementRow label="給与補足" value={job.salary?.description} />
            <RequirementRow label="勤務地" value={workLocationText} />
            <RequirementRow label="勤務時間" value={job.workingHours} />
            <RequirementRow label="休日・休暇" value={job.holidays} />
            <RequirementRow label="試用期間" value={job.trialPeriod} />
            <RequirementRow label="待遇・福利厚生" list={job.benefits} />
            <RequirementRow label="応募資格" list={job.qualifications} />
            <RequirementRow
              label="歓迎する経験"
              list={job.preferredQualifications}
            />
            <RequirementRow label="選考の流れ" list={job.selectionProcess} />
          </dl>

          {!hasAnyRequirement ? (
            <p className="mt-8 border-l-4 border-blue bg-white p-6 text-[0.95rem] leading-8 text-ink">
              現在、募集条件（雇用形態・給与・勤務時間・休日・待遇など）を準備しています。
              内容が決まり次第、このページに掲載します。
              仕事内容について聞いてみたい、という段階のご相談は受け付けていますので、
              お気軽にお問い合わせください。
            </p>
          ) : null}

          {job.validThrough ? (
            <p className="mt-6 text-xs text-ink-soft">
              募集期限：{job.validThrough.replace(/-/g, '/')}
            </p>
          ) : null}
        </Reveal>
      </Section>

      {/* 応募・相談 */}
      <Section divided width="narrow" aria-labelledby="job-entry-heading">
        <SectionHeading
          eyebrow="Entry"
          id="job-entry-heading"
          title={canApply ? 'この職種に応募する' : '応募前のご相談を受け付けています'}
          lead={
            canApply
              ? '下記のフォームからご応募ください。ご希望の連絡方法・時間帯に合わせてご連絡します。'
              : '募集内容が確定するまでのあいだも、仕事内容や働き方についてのご相談は受け付けています。'
          }
        />

        <Reveal delay={60} className="mt-10">
          {canApply ? (
            <ApplicationForm mailEnabled={isMailConfigured} jobOptions={[job.title]} />
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/contact" size="lg" className="sm:flex-1">
                採用について問い合わせる
                <ArrowRight />
              </ButtonLink>
              <a
                href={`tel:${site.tel.href}`}
                className="flex min-h-13 flex-col items-center justify-center border border-navy px-6 py-3 text-navy transition-colors hover:bg-navy hover:text-white sm:flex-1"
              >
                <span className="flex items-center gap-2 text-xl font-bold tabular-nums">
                  <PhoneIcon className="h-5 w-5" />
                  {site.tel.display}
                </span>
                <span className="mt-0.5 text-xs">採用のお電話はその旨をお伝えください</span>
              </a>
            </div>
          )}
        </Reveal>
      </Section>

      {/* 関連ページ */}
      <Section tone="mist" divided width="narrow" aria-labelledby="job-links-heading">
        <h2 id="job-links-heading" className="text-lg font-bold text-ink">
          あわせてご覧ください
        </h2>
        {others.length > 0 ? (
          <ul className="mt-6 border-t border-line">
            {others.map((other) => (
              <li key={other.slug} className="border-b border-line">
                <Link
                  href={`/recruit/jobs/${other.slug}`}
                  className="flex min-h-14 items-center justify-between gap-4 py-4 text-[0.95rem] font-bold text-ink transition-colors hover:text-blue"
                >
                  {other.title}
                  <ArrowRight className="text-blue" />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/recruit" variant="outline">
            採用情報トップへ戻る
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/faq#recruit" variant="ghost">
            採用に関するよくある質問
            <ArrowRight />
          </ButtonLink>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
      {/* 必須項目がすべて揃っている求人のみ JobPosting を出力する（1ページ1件） */}
      {schemaReady ? <JsonLd data={buildJobPostingSchema(job)} /> : null}
    </>
  )
}
