/**
 * 施工事例データ。
 *
 * 【重要】実在しないお客様情報・施工実績を登録しないでください。
 * 実際に行った工事の内容だけを、お客様の許可を得たうえで掲載します。
 *
 * 画像は public/images/works/ 配下に配置し、src に絶対パスで指定します。
 * Instagram の文章・画像を無断で転載しないでください。
 *
 * published: true のものだけが一覧・詳細ページ・サイトマップに出力されます。
 * 配列が空の場合、トップページの施工事例セクションと絞り込みUIは自動的に非表示になります。
 */

export type WorkCategory =
  | 'エアコン新設'
  | 'エアコン交換'
  | 'エアコン移設'
  | 'エアコン取り外し'
  | 'その他'

export type WorkBuildingType = '戸建て' | 'マンション・アパート' | '店舗' | '事務所' | 'その他'

export type Work = {
  slug: string
  title: string
  /** 施工エリア（例: 広島市西区） */
  area: string
  category: WorkCategory
  buildingType?: WorkBuildingType
  /** 施工年月（例: 2026-07） */
  completedAt?: string
  /** 一覧・meta description に使う要約 */
  summary: string
  /** 施工前の状況 */
  before?: string
  /** ご依頼内容 */
  request?: string
  /** 施工内容 */
  workDetails: string[]
  /** 施工時のポイント */
  points: string[]
  /** 施工後の状態 */
  after?: string
  /** 担当者コメント */
  comment?: string
  images: {
    src: string
    alt: string
    /** 写真の説明（施工前／施工後など） */
    caption?: string
  }[]
  /** 関連するサービスの slug（services.ts） */
  relatedServices: string[]
  published: boolean
}

/**
 * 初期状態では登録なし。
 * 実際の施工写真とお客様の許可が揃った時点で、下記フォーマットで追加してください。
 *
 * 例:
 * {
 *   slug: 'nishiku-living-installation',
 *   title: '戸建てリビングへのエアコン新設',
 *   area: '広島市西区',
 *   category: 'エアコン新設',
 *   buildingType: '戸建て',
 *   completedAt: '2026-07',
 *   summary: 'エアコンのなかったリビングへ、配管経路を新設して壁掛けエアコンを設置しました。',
 *   before: 'エアコン用の穴がなく、コンセントも未設置の状態でした。',
 *   request: '夏までにリビングへエアコンを付けたい、とのご相談でした。',
 *   workDetails: ['配管を通す穴あけ', '室内機の取り付け', '冷媒配管・ドレンホースの敷設', '室外機の設置と接続'],
 *   points: ['ドレン水が室内側へ戻らない勾配を確保しました。'],
 *   after: '試運転で冷房・暖房の動作とドレン排水を確認しました。',
 *   comment: '配管を最短経路で通し、室内側の見た目を整えました。',
 *   images: [{ src: '/images/works/nishiku-living-01.jpg', alt: 'リビングの壁に設置した室内機', caption: '施工後' }],
 *   relatedServices: ['installation'],
 *   published: true,
 * }
 */
export const works: Work[] = []

export const publishedWorks = works
  .filter((w) => w.published)
  .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))

export function getWork(slug: string): Work | undefined {
  return publishedWorks.find((w) => w.slug === slug)
}

export function getRelatedWorks(serviceSlug: string, limit = 3): Work[] {
  return publishedWorks.filter((w) => w.relatedServices.includes(serviceSlug)).slice(0, limit)
}

/** 絞り込み候補は「実際に登録されている値」からのみ作る（空のUIを出さないため） */
export const workFilters = {
  categories: Array.from(new Set(publishedWorks.map((w) => w.category))),
  buildingTypes: Array.from(
    new Set(publishedWorks.map((w) => w.buildingType).filter((v): v is WorkBuildingType => !!v)),
  ),
  areas: Array.from(new Set(publishedWorks.map((w) => w.area))),
}

export const hasWorks = publishedWorks.length > 0
