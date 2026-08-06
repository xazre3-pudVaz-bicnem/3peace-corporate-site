/**
 * サイト全体で使う会社情報の単一ソース。
 * ここに書かれていない情報を各ページへ直接書かないこと。
 *
 * 値が空文字 / undefined の項目は、画面・構造化データの双方から
 * 自動的に除外されます（`hasValue()` / `compact()` を利用）。
 * 未確認の情報は空のままにし、README の「未入力情報一覧」で管理します。
 */

export type OptionalText = string | undefined

/** 曜日・時間などの営業情報（未確認のため初期値は undefined） */
export type BusinessHours = {
  /** 例: '8:00〜18:00' */
  weekday?: string
  /** 例: '土曜は9:00〜17:00' などの補足 */
  note?: string
}

export type ServiceArea = {
  name: string
  /** 実際に対応していることが確認できた地域のみ true */
  published: boolean
  /** 補足（README 用のメモも兼ねる） */
  note?: string
}

/**
 * 対応エリア。
 * Instagram プロフィールに「広島県・福岡県・山口県」と記載があるが、
 * エアコン工事としてどこまで出張対応しているかは未確認のため、
 * 拠点のある広島市のみを公開状態としている。
 * 実際の対応範囲が確定したら published を true にすること。
 */
export const serviceAreas: ServiceArea[] = [
  { name: '広島市', published: true },
  { name: '広島市西区', published: false, note: '区単位ページを作る場合に公開' },
  { name: '広島県内', published: false, note: '出張範囲の確定後に公開' },
  { name: '山口県', published: false, note: 'Instagram プロフィールに記載あり／範囲未確認' },
  { name: '福岡県', published: false, note: 'Instagram プロフィールに記載あり／範囲未確認' },
]

export const site = {
  /** 会社名 */
  name: '3Peace',
  /** 読み仮名（未確認のため空） */
  nameKana: undefined as OptionalText,
  /** 代表者名 */
  representative: '面出 洋平',
  representativeRole: '代表',

  /** サイトのキャッチ */
  tagline: '広島の暮らしに、確かなエアコン工事を。',
  description:
    '3Peace は広島市を拠点に、エアコンの新設・交換・移設・取り外しを行っています。設置場所や配管経路を一件ずつ確認し、試運転と動作確認まで行ったうえで施工を完了します。',

  /** 住所（表記はサイト内でこの1箇所に統一） */
  address: {
    postalCode: undefined as OptionalText, // 未確認
    region: '広島県',
    locality: '広島市西区',
    streetAddress: '己斐上4丁目36-18',
    /** 表示用のフル住所 */
    full: '広島県広島市西区己斐上4丁目36-18',
  },

  /** 電話番号（表示用とtel:用を分離） */
  tel: {
    display: '080-3880-4024',
    href: '08038804024',
  },

  /** 問い合わせ先メール（未設定の場合フォームは停止し、電話・Instagram導線のみ表示） */
  email: undefined as OptionalText,

  /** 営業時間・定休日 */
  businessHours: { weekday: '9:00〜18:00' } as BusinessHours,
  closedDays: '不定休',

  /** 事業内容（Instagram プロフィールで確認できた範囲のみ） */
  businessSummary: 'エアコン工事（新設・交換・移設・取り外し）',

  /** SNS */
  instagram: 'https://www.instagram.com/3peace.osr/',
  instagramHandle: '@3peace.osr',

  /** Googleマップ（住所検索ベースの埋め込み。APIキー不要） */
  map: {
    query: '広島県広島市西区己斐上4丁目36-18',
    get embedSrc() {
      return `https://maps.google.com/maps?q=${encodeURIComponent(this.query)}&hl=ja&z=16&output=embed`
    },
    get linkUrl() {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.query)}`
    },
  },

  /** 問い合わせ受付状態（false にすると問い合わせフォームを閉じる） */
  acceptingInquiries: true,

  /** ロゴ・OG画像（public 配下に実ファイルがある場合のみ構造化データへ出力される） */
  logoPath: '/logo/3peace-logo.png',
  ogImagePath: '/images/og/3peace-og.jpg',
} as const

/** 空文字・空白のみ・undefined を除外するユーティリティ */
export function hasValue(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

/** 公開中の対応エリア名 */
export const publishedAreas = serviceAreas.filter((a) => a.published)

/** 会社概要テーブル（値が無い行は自動で非表示） */
export type CompanyRow = { label: string; value?: string; href?: string }

export const companyRows: CompanyRow[] = [
  { label: '会社名', value: site.name },
  { label: '代表者', value: site.representative },
  { label: '所在地', value: site.address.full },
  { label: '電話番号', value: site.tel.display, href: `tel:${site.tel.href}` },
  { label: '事業内容', value: site.businessSummary },
  { label: '営業時間', value: site.businessHours.weekday },
  { label: '定休日', value: site.closedDays },
  {
    label: '対応エリア',
    value: publishedAreas.length > 0 ? publishedAreas.map((a) => a.name).join('・') : undefined,
  },
  { label: 'Instagram', value: site.instagramHandle, href: site.instagram },
]

export const visibleCompanyRows = companyRows.filter((r) => hasValue(r.value))
