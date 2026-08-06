import type { JobPostingData } from '@/data/jobs'
import { recruitmentSettings } from '@/data/recruit'
import { site } from '@/data/site'
import { absoluteUrl } from '@/lib/seo'

/**
 * JobPosting 構造化データを出力してよい状態かを判定します。
 *
 * 給与・雇用形態・勤務時間・休日・福利厚生・試用期間・応募資格のいずれかが
 * 欠けている求人は、Google しごと検索の要件を満たさないため出力しません。
 * 画面には「準備中」と表示され、JSON-LD は生成されません。
 */
export function isJobPostingReady(job: JobPostingData): boolean {
  if (!recruitmentSettings.showJobPostingSchema) return false
  if (!job.published || !job.acceptingApplications) return false

  const hasSalary =
    !!job.salary &&
    !!job.salary.unit &&
    (typeof job.salary.min === 'number' || typeof job.salary.max === 'number')

  const requirements = [
    hasSalary,
    job.employmentType.length > 0,
    !!job.workingHours?.trim(),
    !!job.holidays?.trim(),
    job.benefits.length > 0,
    !!job.trialPeriod?.trim(),
    job.qualifications.length > 0,
    !!job.datePosted?.trim(),
    job.responsibilities.length > 0,
  ]

  if (!requirements.every(Boolean)) return false

  // validThrough が過去日なら募集終了として扱い、出力しない
  if (job.validThrough) {
    const through = Date.parse(`${job.validThrough}T23:59:59+09:00`)
    if (!Number.isNaN(through) && through < Date.now()) return false
  }

  return true
}

/** 求人が「不足している項目」を返す（README / 開発時の確認用） */
export function missingJobFields(job: JobPostingData): string[] {
  const missing: string[] = []
  if (!job.salary?.unit || (job.salary.min === undefined && job.salary.max === undefined))
    missing.push('給与')
  if (job.employmentType.length === 0) missing.push('雇用形態')
  if (!job.workingHours) missing.push('勤務時間')
  if (!job.holidays) missing.push('休日')
  if (job.benefits.length === 0) missing.push('福利厚生')
  if (!job.trialPeriod) missing.push('試用期間')
  if (job.qualifications.length === 0) missing.push('応募資格')
  if (job.selectionProcess.length === 0) missing.push('選考方法')
  if (!job.datePosted) missing.push('求人公開日')
  return missing
}

const UNIT_LABEL: Record<NonNullable<NonNullable<JobPostingData['salary']>['unit']>, string> = {
  HOUR: '時給',
  DAY: '日給',
  MONTH: '月給',
  YEAR: '年収',
}

/** 画面表示用の給与文字列（JSON-LD と同じデータから生成するため常に一致します） */
export function formatSalary(salary: JobPostingData['salary']): string | undefined {
  if (!salary?.unit) return undefined
  const { min, max, unit } = salary
  if (min === undefined && max === undefined) return undefined
  const label = UNIT_LABEL[unit]
  const yen = (n: number) => `${n.toLocaleString('ja-JP')}円`
  if (min !== undefined && max !== undefined && min !== max) return `${label} ${yen(min)}〜${yen(max)}`
  const value = (min ?? max) as number
  return `${label} ${yen(value)}〜`
}

/** JobPosting JSON-LD を生成（isJobPostingReady が true の求人のみ呼び出すこと） */
export function buildJobPostingSchema(job: JobPostingData) {
  const salary = job.salary!
  const url = absoluteUrl(`/recruit/jobs/${job.slug}`)

  const description = [
    ...job.fullDescription,
    '',
    '【業務内容】',
    ...job.responsibilities.map((r) => `・${r}`),
    '',
    '【応募資格】',
    ...job.qualifications.map((q) => `・${q}`),
    ...(job.preferredQualifications.length > 0
      ? ['', '【歓迎する経験・資格】', ...job.preferredQualifications.map((q) => `・${q}`)]
      : []),
    '',
    `【勤務時間】${job.workingHours}`,
    `【休日】${job.holidays}`,
    `【試用期間】${job.trialPeriod}`,
    '',
    '【待遇・福利厚生】',
    ...job.benefits.map((b) => `・${b}`),
  ].join('\n')

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description,
    datePosted: job.datePosted,
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    employmentType: job.employmentType.map(toSchemaEmploymentType),
    hiringOrganization: {
      '@type': 'Organization',
      name: site.name,
      ...(absoluteUrl('/') ? { sameAs: absoluteUrl('/') } : {}),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'JP',
        addressRegion: job.workLocation.region,
        addressLocality: job.workLocation.locality,
        ...(job.workLocation.streetAddress
          ? { streetAddress: job.workLocation.streetAddress }
          : {}),
        ...(job.workLocation.postalCode ? { postalCode: job.workLocation.postalCode } : {}),
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        ...(salary.min !== undefined ? { minValue: salary.min } : {}),
        ...(salary.max !== undefined ? { maxValue: salary.max } : {}),
        unitText: salary.unit,
      },
    },
    ...(url ? { url } : {}),
    ...(url ? { directApply: true } : {}),
  }
}

/** 日本語の雇用形態表記を schema.org の値へ変換 */
function toSchemaEmploymentType(label: string): string {
  const map: Record<string, string> = {
    正社員: 'FULL_TIME',
    契約社員: 'CONTRACTOR',
    パート: 'PART_TIME',
    アルバイト: 'PART_TIME',
    'パート・アルバイト': 'PART_TIME',
    業務委託: 'CONTRACTOR',
    インターン: 'INTERN',
    臨時: 'TEMPORARY',
  }
  return map[label] ?? 'OTHER'
}
