/**
 * よくある質問。
 * audience で「お客様向け」と「求職者向け」を分けています。
 *
 * 回答が確定していない質問は published: false のままにしてください。
 * published: false の質問は画面にも FAQPage 構造化データにも出力されません。
 */

export type FaqAudience = 'customer' | 'recruit'

export type Faq = {
  id: string
  audience: FaqAudience
  question: string
  /** 回答は1〜3段落。段落ごとに配列要素とする */
  answer: string[]
  published: boolean
  /** 非公開にしている理由（引き継ぎ用メモ。画面には出ません） */
  note?: string
}

export const faqs: Faq[] = [
  // ── お客様向け ────────────────────────────────────────────────
  {
    id: 'estimate',
    audience: 'customer',
    question: '見積もりをお願いできますか。',
    answer: [
      'はい、承ります。電話・お問い合わせフォーム・Instagram のいずれからでもご連絡いただけます。',
      '設置場所の状況によって必要な作業が変わるため、部屋の状況や室外機を置ける場所などをお伺いしたうえでご案内します。写真をお送りいただけると、確認がスムーズです。',
    ],
    published: true,
  },
  {
    id: 'prepare',
    audience: 'customer',
    question: '工事前に準備することはありますか。',
    answer: [
      '室内機を取り付ける壁の前と、室外機を置く場所の周辺を空けておいていただけると作業がスムーズです。',
      '家具の移動が必要な場合は、当日にご相談いただいても対応します。床や家具は養生してから作業します。',
    ],
    published: true,
  },
  {
    id: 'own-unit',
    audience: 'customer',
    question: '自分で購入したエアコンも取り付けできますか。',
    answer: [
      'はい、ご購入済みの本体の取り付けにも対応します。',
      'ご連絡の際に型番をお知らせください。設置場所の条件と機種が合っているか、コンセントの形状や電圧が適合しているかを事前に確認します。',
    ],
    published: true,
  },
  {
    id: 'outdoor-place',
    audience: 'customer',
    question: '室外機の設置場所も相談できますか。',
    answer: [
      'ご相談ください。ベランダ・地面・壁面など、建物の状況に応じて設置方法が変わります。',
      '室外機は空気の吹き出し口がふさがれると効率が落ちるため、周囲のスペースや排水の流れ先も含めて確認したうえでご提案します。',
    ],
    published: true,
  },
  {
    id: 'removal',
    audience: 'customer',
    question: '古いエアコンの取り外しはできますか。',
    answer: [
      '対応します。取り外しの際は、先に冷媒を室外機へ回収する作業（ポンプダウン）を行ってから配管を外します。',
      '取り外した本体を残されるか処分されるかで、その後の扱いが変わります。ご連絡の際にお知らせください。',
    ],
    published: true,
  },
  {
    id: 'duration',
    audience: 'customer',
    question: '工事時間はどれくらいですか。',
    answer: [
      '設置場所の条件、配管の長さ、室外機の設置方法によって変わります。壁の穴あけが必要な場合や、高所での作業がある場合は時間がかかります。',
      '現場の状況を確認したうえで、おおよその所要時間をお伝えします。',
    ],
    published: true,
  },
  {
    id: 'area',
    audience: 'customer',
    question: '対応エリアはどこですか。',
    answer: [
      '広島市を中心に対応しています。エリア外と思われる場所でも、まずはご相談ください。現場の場所と内容を確認したうえでお返事します。',
    ],
    published: true,
  },
  {
    id: 'supply-unit',
    audience: 'customer',
    question: 'エアコン本体を用意してもらえますか。',
    answer: [],
    published: false,
    note: '本体販売の取り扱い有無が未確認。対応可否が確認できたら回答を記入して公開する。',
  },
  {
    id: 'corporate',
    audience: 'customer',
    question: '法人からも依頼できますか。',
    answer: [],
    published: false,
    note: '法人・管理会社からの受注可否が未確認。確認後に回答を記入して公開する。',
  },
  {
    id: 'payment',
    audience: 'customer',
    question: '支払い方法を教えてください。',
    answer: [],
    published: false,
    note: '支払い方法（現金・振込・カード等）が未確認。',
  },
  {
    id: 'warranty',
    audience: 'customer',
    question: '施工後の保証はありますか。',
    answer: [],
    published: false,
    note: '施工保証の有無・内容が未確認。',
  },

  // ── 求職者向け ────────────────────────────────────────────────
  {
    id: 'r-inexperienced',
    audience: 'recruit',
    question: 'エアコン工事の経験がなくても応募できますか。',
    answer: [
      '募集する職種によって応募条件が変わります。現在公開している募集内容は採用情報ページに掲載しています。',
      '経験の有無を含めて相談したい方は、お問い合わせフォームの「採用について」からご連絡ください。',
    ],
    published: true,
  },
  {
    id: 'r-first-work',
    audience: 'recruit',
    question: 'どのような仕事から始めますか。',
    answer: [
      '経験に応じて変わりますが、はじめは現場の流れを把握し、工具や部材の名前と使い方を覚えることから始まります。',
      'その後、養生や搬入、先輩の作業補助を通して、実際の施工手順を身につけていきます。',
    ],
    published: true,
  },
  {
    id: 'r-daily',
    audience: 'recruit',
    question: '一日の仕事の流れを教えてください。',
    answer: [
      '当日の現場と作業内容を確認し、必要な工具や部材を準備して現場へ向かいます。',
      '現場ではお客様への挨拶と設置場所の確認を行い、養生と安全確認をしてから施工に入ります。試運転と動作確認、清掃、お客様へのご説明までが一連の流れです。',
      '詳しい流れは採用情報ページに掲載しています。',
    ],
    published: true,
  },
  {
    id: 'r-area',
    audience: 'recruit',
    question: '現場はどのエリアが中心ですか。',
    answer: ['広島市内を中心とした現場が中心です。'],
    published: true,
  },
  {
    id: 'r-consult',
    audience: 'recruit',
    question: '応募前に相談できますか。',
    answer: [
      '可能です。仕事内容や働き方について聞いてから決めたい、という方もお問い合わせください。',
      'お問い合わせフォームの「採用について」、または電話・Instagram からご連絡いただけます。',
    ],
    published: true,
  },
  {
    id: 'r-license',
    audience: 'recruit',
    question: '必要な資格はありますか。',
    answer: [],
    published: false,
    note: '必要資格・普通自動車運転免許の要否が未確認。募集要項の確定後に回答を記入する。',
  },
  {
    id: 'r-selection',
    audience: 'recruit',
    question: '選考はどのように進みますか。',
    answer: [],
    published: false,
    note: '選考フロー（書類・面接回数など）が未確認。',
  },
  {
    id: 'r-start',
    audience: 'recruit',
    question: '入社時期は相談できますか。',
    answer: [],
    published: false,
    note: '入社時期の調整可否が未確認。',
  },
]

export const customerFaqs = faqs.filter((f) => f.audience === 'customer' && f.published)
export const recruitFaqs = faqs.filter((f) => f.audience === 'recruit' && f.published)

export function getFaqsByIds(ids: string[]): Faq[] {
  return ids
    .map((id) => faqs.find((f) => f.id === id))
    .filter((f): f is Faq => !!f && f.published && f.answer.length > 0)
}
