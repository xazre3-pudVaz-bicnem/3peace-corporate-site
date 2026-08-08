/**
 * 地域ページのデータ。
 *
 * 【重要】薄い地域ページを大量生成しないこと。
 * 対応範囲が確認できるまでは enabled: false のままにしてください。
 * enabled: false の地域はページが生成されず、サイトマップにも出ません。
 *
 * 現在 enabled にしているのは、所在地が確認できている広島市西区のみです。
 * （広島県広島市西区己斐上4丁目36-18 が事業所所在地）
 *
 * 他の区・周辺市について「対応しています」と書くには、実際にその地域へ
 * 出張しているという確認が必要です。確認できたら enabled と index を true にし、
 * intro / points / faqIds をその地域固有の内容で埋めてください。
 * 他の地域ページと同じ文章を使い回すと、Google から自動生成ページとみなされます。
 */

export type Area = {
  slug: string
  /** 正式な地域名（例: 広島市西区） */
  name: string
  /** 見出しなどで使う短い表記（例: 西区） */
  shortName: string
  /** ページを生成するか */
  enabled: boolean
  /** 検索結果に出すか（enabled かつ index が true のときだけインデックス対象） */
  index: boolean
  /** ページ本文（enabled のときは必須。地域ごとに書き分けること） */
  content?: {
    /** metadata の description */
    description: string
    /** 導入文（段落配列） */
    intro: string[]
    /** その地域ならではの確認ポイント */
    points: { title: string; body: string }[]
    /** 依頼の流れ */
    flow: { title: string; body: string }[]
    /** 表示するFAQ（faq.ts の id） */
    faqIds: string[]
  }
  /** 非公開にしている理由のメモ（画面には出ません） */
  note?: string
}

export const areas: Area[] = [
  {
    slug: 'hiroshima-nishi',
    name: '広島市西区',
    shortName: '西区',
    enabled: true,
    index: true,
    content: {
      description:
        '広島市西区己斐上を拠点にエアコン工事を行う3Peaceです。エアコンの新設・交換・移設・取り外しについて、住宅ごとに違う配管経路や室外機の設置条件を確認したうえでご案内します。',
      intro: [
        '3Peaceは広島市西区己斐上に事業所を置き、エアコン工事を行っています。室内機の取り付けから配管の敷設、室外機の設置、真空引き、試運転までを一貫して担当します。',
        '西区は己斐や高須のように高低差のある住宅地と、庚午や観音のように区画の整った市街地が混在しています。同じ機種を取り付ける場合でも、外壁の材質、室外機を据えられる場所、配管を通せる経路は建物ごとに変わります。現場を見てから施工方法を決めるのは、そのためです。',
        'エアコン工事をご検討中で、取り付けられるかどうか分からないという段階でも構いません。設置場所の状況をお伺いしたうえで、必要な作業をご案内します。',
      ],
      points: [
        {
          title: '高低差のある敷地では室外機の置き場所から考える',
          body: '傾斜地に建つ住宅では、室外機を平らに据えられる場所が限られます。地面が斜めの場合は基礎ブロックの追加や壁掛け・屋根置きへの変更を検討します。室外機は水平に据えないと振動と運転音が出やすくなるため、最初に確認します。',
        },
        {
          title: '外壁の材質で穴あけの方法が変わる',
          body: 'サイディング、モルタル、ALCなど、外壁の材質によって穴あけに使う道具と作業時間が変わります。壁の中の柱や筋交いの位置も避ける必要があるため、室内側と室外側の両方から位置を確認します。',
        },
        {
          title: '隣家との距離が近い場合の排水と吹き出し',
          body: '室外機の吹き出し口が隣家の窓や通路に向いていると、風と運転音が問題になることがあります。ドレン水の流れる先も含めて、据え付ける向きを決めます。',
        },
        {
          title: 'マンション・アパートは共用部分の扱いを確認する',
          body: '集合住宅では、外壁への穴あけや室外機の設置方法が管理規約で決まっている場合があります。工事前に管理会社やオーナーへの確認が必要かどうかをご相談ください。',
        },
      ],
      flow: [
        {
          title: 'お問い合わせ',
          body: 'お電話・お問い合わせフォーム・Instagram のいずれからでもご連絡いただけます。設置したい部屋の状況、お使いの機種の型番、室外機を置ける場所などを、分かる範囲でお知らせください。写真を添えていただけると確認がスムーズです。',
        },
        {
          title: '現場の確認',
          body: '取り付け位置、配管を通す経路、室外機の設置場所、コンセントの形状と電圧を確認します。判断が分かれる点は、その理由と一緒にご説明します。',
        },
        {
          title: '工事内容のご案内',
          body: '確認した内容をもとに、必要な作業と費用をお伝えします。追加の作業が必要になる場合は、作業前に理由と一緒にご説明します。',
        },
        {
          title: '日程の調整と施工',
          body: 'ご都合に合わせて施工日を決めます。当日は床や家具を養生してから作業に入り、真空引きと試運転で動作を確認したうえで、清掃と使い方のご説明をして完了です。',
        },
      ],
      faqIds: ['estimate', 'prepare', 'own-unit', 'outdoor-place', 'duration'],
    },
  },

  // ── 以下は対応範囲が未確認のため非公開 ───────────────────────────
  // 実際に対応していることが確認できたら enabled / index を true にし、
  // content をその地域固有の内容で記入してください。
  { slug: 'hiroshima-naka', name: '広島市中区', shortName: '中区', enabled: false, index: false, note: '対応範囲が未確認' },
  { slug: 'hiroshima-higashi', name: '広島市東区', shortName: '東区', enabled: false, index: false, note: '対応範囲が未確認' },
  { slug: 'hiroshima-minami', name: '広島市南区', shortName: '南区', enabled: false, index: false, note: '対応範囲が未確認' },
  { slug: 'hiroshima-asaminami', name: '広島市安佐南区', shortName: '安佐南区', enabled: false, index: false, note: '対応範囲が未確認' },
  { slug: 'hiroshima-asakita', name: '広島市安佐北区', shortName: '安佐北区', enabled: false, index: false, note: '対応範囲が未確認' },
  { slug: 'hiroshima-aki', name: '広島市安芸区', shortName: '安芸区', enabled: false, index: false, note: '対応範囲が未確認' },
  { slug: 'hiroshima-saeki', name: '広島市佐伯区', shortName: '佐伯区', enabled: false, index: false, note: '対応範囲が未確認' },
]

/** ページを生成する地域 */
export const publishedAreas = areas.filter((a) => a.enabled && a.content)

/** サイトマップに含める地域（noindex は除外） */
export const indexableAreas = publishedAreas.filter((a) => a.index)

export function getArea(slug: string): Area | undefined {
  return publishedAreas.find((a) => a.slug === slug)
}

/** 拠点となる地域（所在地から確認できる事実） */
export const baseArea = areas[0]
