/**
 * 求人データ。
 *
 * 【JobPosting 構造化データについて】
 * 給与・雇用形態・勤務時間・休日・福利厚生・試用期間・応募資格のいずれかが
 * 未入力の場合、JobPosting は出力されません（lib/jobPosting.ts の isJobPostingReady）。
 * 不完全な状態で Google しごと検索へ掲載しないための安全装置です。
 *
 * 画面に表示する情報と JSON-LD の情報は同じデータから生成しているため、
 * 常に一致します。
 *
 * 募集を終了する場合は、次のいずれかを行ってください。
 *   1. published: false にする（ページごと非公開／サイトマップからも除外）
 *   2. acceptingApplications: false にする（募集終了表示へ切り替え・応募フォームを閉じる）
 *   3. validThrough を過去日にする（JobPosting は自動的に出力されなくなります）
 */

export type SalaryUnit = 'HOUR' | 'DAY' | 'MONTH' | 'YEAR'

export type JobPostingData = {
  slug: string
  title: string
  shortDescription: string
  /** 詳細ページ本文（段落配列） */
  fullDescription: string[]
  /** 例: ['正社員'] / ['アルバイト'] — 未確定なら空配列 */
  employmentType: string[]
  responsibilities: string[]
  qualifications: string[]
  preferredQualifications: string[]
  salary?: {
    min?: number
    max?: number
    unit?: SalaryUnit
    currency: 'JPY'
    description?: string
  }
  workLocation: {
    postalCode?: string
    region: string
    locality: string
    streetAddress?: string
  }
  workingHours?: string
  holidays?: string
  benefits: string[]
  trialPeriod?: string
  selectionProcess: string[]
  /** ISO 8601（例: '2026-08-01'） */
  datePosted?: string
  validThrough?: string
  acceptingApplications: boolean
  published: boolean
  /** 未入力項目のメモ（画面には出ません） */
  note?: string
}

const workLocation = {
  region: '広島県',
  locality: '広島市',
  streetAddress: '西区己斐上4丁目36-18',
}

export const jobs: JobPostingData[] = [
  {
    slug: 'aircon-installer',
    title: 'エアコン工事スタッフ',
    shortDescription:
      '広島市西区己斐上を拠点に、エアコンの新設・交換・移設・取り外しを担当します。現場で技術を身につけながら、一件を任せられる技術者を目指す仕事です。',
    fullDescription: [
      '広島市西区己斐上を拠点に、エアコン工事を行う仕事です。新設・交換・移設・取り外しが主な内容になります。',
      '現場では、設置位置と配管経路の確認から始まり、室内機の取り付け、冷媒配管とドレンホースの敷設、室外機の設置と接続、真空引き、試運転までを行います。作業後の清掃とお客様へのご説明までが一連の流れです。',
      'はじめは先輩の作業を補助しながら、工具の使い方と作業の順番を覚えていきます。任せられる工程を少しずつ増やし、最終的には現場に一人で入って判断しながら仕上げられる状態を目指します。',
      'お客様のお住まいで作業する仕事のため、技術と同じくらい、養生や挨拶、説明の丁寧さを大切にしています。',
    ],
    employmentType: [],
    responsibilities: [
      'エアコンの新設工事（室内機の取り付け、配管敷設、室外機の設置・接続）',
      'エアコンの交換工事（既存機の撤去と新規機の設置）',
      'エアコンの移設工事（取り外しと移設先での設置）',
      'エアコンの取り外し（ポンプダウン・撤去）',
      '真空引き・試運転・動作確認',
      '養生、作業後の清掃、お客様への作業内容のご説明',
      '工具・部材の準備と積み込み、現場への移動',
    ],
    qualifications: [],
    preferredQualifications: [
      'エアコン工事・空調設備工事の経験がある方',
      '電気工事・設備工事の経験がある方',
      '第二種電気工事士などの関連資格をお持ちの方',
    ],
    salary: undefined,
    workLocation,
    workingHours: undefined,
    holidays: undefined,
    benefits: [],
    trialPeriod: undefined,
    selectionProcess: [],
    datePosted: undefined,
    validThrough: undefined,
    acceptingApplications: false,
    published: true,
    note: '雇用形態・給与・勤務時間・休日・福利厚生・試用期間・応募資格・選考方法がすべて未確認。入力が揃うと JobPosting 構造化データが自動的に出力される。',
  },
  {
    slug: 'aircon-assistant',
    title: 'エアコン工事補助スタッフ',
    shortDescription: 'エアコン工事の補助作業からはじめ、現場の流れと工具の扱いを覚えていく仕事です。',
    fullDescription: [
      '工事担当者に同行し、養生・搬入・部材の受け渡しなどの補助作業を担当します。',
      '作業を近くで見ながら、工具や部材の名前、作業の順番を覚えていきます。',
    ],
    employmentType: [],
    responsibilities: ['現場の養生と片付け', '工具・部材の運搬と受け渡し', '施工担当者の補助'],
    qualifications: [],
    preferredQualifications: [],
    salary: undefined,
    workLocation,
    workingHours: undefined,
    holidays: undefined,
    benefits: [],
    trialPeriod: undefined,
    selectionProcess: [],
    acceptingApplications: false,
    published: false,
    note: '実際に募集するかどうかが未確認のため非公開。',
  },
  {
    slug: 'hvac-engineer',
    title: '空調設備工事スタッフ',
    shortDescription: '空調設備工事の経験を活かして働きたい方向けの職種です。',
    fullDescription: ['空調設備工事に関わる業務を担当します。'],
    employmentType: [],
    responsibilities: [],
    qualifications: [],
    preferredQualifications: [],
    salary: undefined,
    workLocation,
    benefits: [],
    selectionProcess: [],
    acceptingApplications: false,
    published: false,
    note: '業務用・設備工事の受注範囲が未確認のため非公開。',
  },
  {
    slug: 'experienced-installer',
    title: '経験者向けエアコン工事スタッフ',
    shortDescription: 'エアコン工事の経験がある方に、施工から現場判断までをお任せする職種です。',
    fullDescription: ['エアコン工事の経験を活かし、現場を担当していただきます。'],
    employmentType: [],
    responsibilities: [],
    qualifications: [],
    preferredQualifications: [],
    salary: undefined,
    workLocation,
    benefits: [],
    selectionProcess: [],
    acceptingApplications: false,
    published: false,
    note: '経験者募集の実施可否・条件が未確認のため非公開。',
  },
]

export const publishedJobs = jobs.filter((j) => j.published)

export function getJob(slug: string): JobPostingData | undefined {
  return publishedJobs.find((j) => j.slug === slug)
}

/** 応募フォームの「希望職種」選択肢（公開中の求人のみ） */
export const jobChoices = publishedJobs.map((j) => j.title)
