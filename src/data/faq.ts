/**
 * よくある質問。
 *
 * audience で「お客様向け」と「求職者向け」を分け、
 * category でお客様向けをさらに検索意図ごとにまとめています。
 *
 * 【書き方のルール】
 * 3Peace が対応していることが確認できていない作業について「できます」と
 * 断言しないこと。一般的な仕組みの説明と「現場状況を確認してご案内します」を
 * 使い分けてください。
 *
 * 回答が確定していない質問は published: false のままにしてください。
 * published: false の質問は画面にも FAQPage 構造化データにも出力されません。
 */

export type FaqAudience = 'customer' | 'recruit'

/** お客様向けFAQのグループ（検索意図ごと） */
export type FaqCategory =
  | 'before-request' // 依頼する前に知りたいこと
  | 'equipment' // 本体・設置場所について
  | 'construction' // 工事の内容・時間について
  | 'move-removal' // 移設・取り外しについて

export const faqCategoryLabels: Record<FaqCategory, string> = {
  'before-request': 'ご依頼の前に',
  equipment: '本体・設置場所について',
  construction: '工事の内容と時間',
  'move-removal': '移設・取り外しについて',
}

export type Faq = {
  id: string
  audience: FaqAudience
  category?: FaqCategory
  question: string
  /** 回答は1〜3段落。段落ごとに配列要素とする */
  answer: string[]
  published: boolean
  /** 非公開にしている理由（引き継ぎ用メモ。画面には出ません） */
  note?: string
}

export const faqs: Faq[] = [
  // ── ご依頼の前に ──────────────────────────────────────────────
  {
    id: 'estimate',
    audience: 'customer',
    category: 'before-request',
    question: '見積もりをお願いできますか。',
    answer: [
      'はい、承ります。お電話・お問い合わせフォーム・Instagram のいずれからでもご連絡いただけます。',
      'エアコン工事は、同じ機種を取り付ける場合でも、配管の長さ、壁の穴あけの有無、室外機を据える場所によって作業量が変わります。そのため設置場所の状況をお伺いしたうえでご案内しています。',
      '室内機を付けたい壁、室外機を置ける場所、コンセントの周辺を撮った写真をお送りいただけると、確認がスムーズです。',
    ],
    published: true,
  },
  {
    id: 'own-unit',
    audience: 'customer',
    category: 'before-request',
    question: 'ネット通販で購入したエアコンも取り付けてもらえますか。',
    answer: [
      'ご購入済みの本体の取り付けについてもご相談ください。ご連絡の際に型番をお知らせいただけると、設置場所の条件と機種が合っているかを事前に確認できます。',
      '確認したいのは主に3点です。1つ目は本体のサイズが取り付けたい壁に収まるか。2つ目は必要な電圧（100Vか200Vか）とコンセントの形状が合っているか。3つ目は付属している配管の長さが室外機までの距離に足りるかどうかです。',
      '通販で購入した場合、配管や取り付け部材が同梱されていないことがあります。届いた箱の中身が分かる写真があれば、あわせてお送りください。',
    ],
    published: true,
  },
  {
    id: 'work-only',
    audience: 'customer',
    category: 'before-request',
    question: '本体は購入済みですが、工事だけ頼めますか。',
    answer: [
      '工事のみのご依頼についてもご相談ください。本体をお持ちの場合は、型番と購入時期をお知らせください。',
      '本体の販売を含めた対応が可能かどうかは、機種やご希望によって変わります。ご希望をお伺いしたうえでご案内します。',
    ],
    published: true,
  },
  {
    id: 'prepare',
    audience: 'customer',
    category: 'before-request',
    question: '工事前に準備しておくことはありますか。',
    answer: [
      '室内機を取り付ける壁の前と、室外機を置く場所の周辺を空けておいていただけると作業がスムーズです。脚立を立てるため、壁の前に1メートルほどのスペースがあると安全に作業できます。',
      '家具の移動が必要な場合は、当日にご相談いただいても構いません。床や家具は養生してから作業します。',
      'あわせて、エアコン用のコンセントの位置と形状、室外機を置ける場所を事前に見ておいていただけると、当日の確認が早く済みます。',
    ],
    published: true,
  },
  {
    id: 'furniture',
    audience: 'customer',
    category: 'before-request',
    question: '工事前に家具を移動しておく必要がありますか。',
    answer: [
      '取り付ける壁の前と、室外機を据える場所の周辺が空いていれば、それ以外を大きく動かしていただく必要はありません。',
      '壁の穴あけを行う場合は細かい粉が出るため、周辺の家具には養生をします。動かせない大型家具がある場合は、当日にお知らせください。養生の方法を調整します。',
    ],
    published: true,
  },
  {
    id: 'rain',
    audience: 'customer',
    category: 'before-request',
    question: '雨の日でも工事できますか。',
    answer: [
      '小雨であれば作業できる場合がありますが、室外機の設置や配管の接続は屋外での作業になるため、天候によっては安全のため日程を変更させていただくことがあります。',
      '特に高所での作業や、脚立を使う作業は、風が強い日や足元が滑る状況では危険が増します。無理に進めるより、日程を調整したほうが安全で仕上がりも安定します。',
      '当日の天候で判断が必要な場合は、事前にご連絡します。',
    ],
    published: true,
  },

  // ── 本体・設置場所について ──────────────────────────────────────
  {
    id: 'outdoor-place',
    audience: 'customer',
    category: 'equipment',
    question: '室外機をベランダ以外の場所に置けますか。',
    answer: [
      '設置方法はベランダ床置きだけではありません。地面へのブロック置き、外壁への壁掛け、屋根置き、二段置きなど、建物の状況に応じた方法があります。どの方法が取れるかは現場を確認したうえでご案内します。',
      '判断で見ているのは主に、平らに据えられるか、空気の吹き出し口がふさがれないか、点検や掃除ができる位置か、ドレン水の流れる先に問題がないか、という点です。',
      '室外機は水平に据えないと振動と運転音が出やすくなります。傾斜地や柔らかい地面では、設置台の追加が必要になることがあります。',
    ],
    published: true,
  },
  {
    id: 'existing-pipe',
    audience: 'customer',
    category: 'equipment',
    question: '既存の配管はそのまま使えますか。',
    answer: [
      'そのまま使える場合もありますが、使えないこともあります。現場で状態を見たうえで判断します。',
      '確認するのは、配管の太さが新しい機種に合っているか、折れやつぶれがないか、断熱材が劣化していないか、必要な長さが足りているかです。特に配管径は機種によって異なるため、合わない場合は引き直しになります。',
      '古い配管には以前の冷媒や油が残っていることがあります。新しい機種の冷媒と相性が悪いと、性能の低下や故障の原因になるため、状態によっては交換をご提案します。',
    ],
    published: true,
  },
  {
    id: 'no-outlet',
    audience: 'customer',
    category: 'equipment',
    question: 'エアコン用のコンセントがない場合はどうなりますか。',
    answer: [
      'エアコンは消費電力が大きいため、専用のコンセント（専用回路）から電源を取るのが基本です。近くのコンセントから延長コードで使うことは、発熱の危険があるため避けるべきです。',
      '専用コンセントがない場合は、分電盤から新しく配線を引く電気工事が必要になります。分電盤に空きがあるか、配線を通せる経路があるかによって作業内容が変わります。',
      'まずは分電盤とコンセント周辺の写真をお送りいただき、状況を確認させてください。そのうえで必要な作業をご案内します。',
    ],
    published: true,
  },
  {
    id: 'voltage',
    audience: 'customer',
    category: 'equipment',
    question: '100Vと200Vはどうやって確認すればよいですか。',
    answer: [
      'いちばん分かりやすいのはコンセントの形です。100Vは縦に細長い穴が2つ（またはアース付きで3つ）並んだ形、200Vは横向きの穴やT字型など、100Vとは差し込み口の形が違います。',
      '既存のエアコンをお使いの場合は、室内機の側面や前面パネルの内側にある銘板シールに定格電圧が書かれています。分電盤のブレーカーに「エアコン」と表示があり、そのブレーカーが2つ並んで連結されている場合は200Vのことが多いです。',
      '判断が難しい場合は、コンセントと分電盤の写真をお送りください。機種の必要電圧と合っているかを確認します。電圧が合わない場合は切り替え工事が必要になります。',
    ],
    published: true,
  },
  {
    id: 'no-hole',
    audience: 'customer',
    category: 'equipment',
    question: '壁に配管用の穴がない場合でも取り付けできますか。',
    answer: [
      '穴がない場合は、新しく開けて配管を通すのが一般的な方法です。壁の材質と、壁の中を通っている柱・筋交い・配線の位置を確認したうえで、開ける位置を決めます。',
      '構造上どうしても開けられない位置もあります。その場合は、室内機の取り付け位置を変える、配管の経路を変えるなど、別の方法をご提案します。',
      '集合住宅では、外壁への穴あけが管理規約で制限されていることがあります。管理会社やオーナーへの確認が必要かどうか、事前にご相談ください。',
    ],
    published: true,
  },
  {
    id: 'existing-hole',
    audience: 'customer',
    category: 'equipment',
    question: 'すでに配管穴がある場合はそのまま使えますか。',
    answer: [
      '使えることが多いですが、位置と勾配を確認してから判断します。',
      '見ているのは、新しい室内機の背面に穴が隠れる位置関係になるか、室内側から室外側へ向かって下がる勾配が取れているか、穴の径が必要な配管を通せる大きさか、という点です。',
      '穴が室内側へ向かって上がっている（逆勾配）と、ドレン水が室内へ戻る原因になります。その場合は穴の開け直しや、ドレンホースの経路変更が必要になることがあります。',
    ],
    published: true,
  },
  {
    id: 'cover',
    audience: 'customer',
    category: 'equipment',
    question: '化粧カバーとは何ですか。',
    answer: [
      '屋外に出た配管を覆う、プラスチック製のカバーのことです。「スリムダクト」とも呼ばれます。',
      '配管は本来テープを巻いた状態で外に出ますが、そのままだと紫外線と雨風で断熱材が劣化していきます。化粧カバーを付けると配管が直接日光に当たらなくなり、見た目も整います。',
      '必須の部材ではありませんが、外壁の目立つ位置を通る場合や、長い距離を配管する場合には検討する価値があります。取り付けるかどうかはご相談ください。',
    ],
    published: true,
  },

  // ── 工事の内容と時間 ──────────────────────────────────────────
  {
    id: 'vacuum',
    audience: 'customer',
    category: 'construction',
    question: '真空引きとは何ですか。なぜ必要なのですか。',
    answer: [
      '配管の中に残った空気と水分を、真空ポンプで抜き取る作業です。冷媒を流す前に必ず行います。',
      '配管をつないだ直後、その中には空気が入っています。空気に含まれる水分が冷媒と混ざると、機器の内部で酸をつくって部品を傷めたり、細い部分で凍って詰まりを起こしたりします。また空気が混ざると圧力が上がり、冷えや暖まりが悪くなります。',
      '真空引きは目に見える作業ではなく、省いてもその日は問題なく動いてしまいます。差が出るのは数年後です。3Peaceでは、真空引きを行い、漏れがないことを確認してから冷媒を開放しています。',
    ],
    published: true,
  },
  {
    id: 'duration',
    audience: 'customer',
    category: 'construction',
    question: '工事時間はどれくらいかかりますか。',
    answer: [
      '設置場所の条件によって変わります。既存の穴と専用コンセントがあり、室外機をすぐ下に置ける標準的な取り付けであれば短時間で終わりますが、条件が増えるとその分長くなります。',
      '時間が延びるのは、壁の穴あけが必要な場合、配管を長く引く場合、室外機を壁掛けや屋根置きにする場合、電圧の切り替えや専用回路の追加が必要な場合、高所での作業がある場合です。既存機の取り外しを同じ日に行う場合も、その分の時間がかかります。',
      '現場の状況を確認したうえで、おおよその所要時間をお伝えします。',
    ],
    published: true,
  },
  {
    id: 'removal',
    audience: 'customer',
    category: 'move-removal',
    question: '古いエアコンの取り外しはできますか。',
    answer: [
      '取り外しについてもご相談ください。作業では、先に冷媒を室外機へ回収する「ポンプダウン」を行ってから配管を外します。この手順を踏まずに配管を外すと、冷媒が大気に放出されてしまいます。',
      'ポンプダウンは、エアコンが動く状態でないと行えません。すでに動かない場合は、専用の機械で冷媒を回収する必要があるため、状態をお知らせください。',
      '取り外した本体を再利用されるか処分されるかで、その後の扱いが変わります。ご連絡の際にお知らせください。',
    ],
    published: true,
  },
  {
    id: 'relocation-possible',
    audience: 'customer',
    category: 'move-removal',
    question: '引越し先へエアコンを移設できますか。',
    answer: [
      '移設についてもご相談ください。ただし、今お使いのエアコンが移設先で同じように使えるかどうかは、移設先の条件によって変わります。',
      '確認するのは、移設先に配管を通せる経路があるか、室外機を据えられる場所があるか、必要な電圧のコンセントがあるか、既存の配管が新しい距離に足りるかです。室内機から室外機までの距離が延びる場合は、配管の追加や引き直しが必要になります。',
      '年数の経った機種では、取り外しと再設置の費用が新しい機種の購入と工事に近づくことがあります。判断の材料として、機種の型番と使用年数をお知らせください。',
    ],
    published: true,
  },
  {
    id: 'area',
    audience: 'customer',
    category: 'before-request',
    question: '対応している地域はどこですか。',
    answer: [
      '広島市西区己斐上に事業所を置いています。ご依頼をお考えの地域については、場所と工事内容をお伺いしたうえでお返事しますので、まずはご相談ください。',
    ],
    published: true,
  },

  // ── 回答が未確定のため非公開 ────────────────────────────────────
  {
    id: 'supply-unit',
    audience: 'customer',
    category: 'before-request',
    question: 'エアコン本体を用意してもらえますか。',
    answer: [],
    published: false,
    note: '本体販売の取り扱い有無・対応メーカーが未確認。確認後に回答を記入して公開する。',
  },
  {
    id: 'corporate',
    audience: 'customer',
    category: 'before-request',
    question: '法人や管理会社からも依頼できますか。',
    answer: [],
    published: false,
    note: '法人・管理会社からの受注可否が未確認。',
  },
  {
    id: 'payment',
    audience: 'customer',
    category: 'before-request',
    question: '支払い方法を教えてください。',
    answer: [],
    published: false,
    note: '支払い方法（現金・振込・カード等）が未確認。',
  },
  {
    id: 'warranty',
    audience: 'customer',
    category: 'construction',
    question: '施工後の保証はありますか。',
    answer: [],
    published: false,
    note: '施工保証の有無・期間・内容が未確認。',
  },
  {
    id: 'electric-work',
    audience: 'customer',
    category: 'equipment',
    question: '専用回路の増設もお願いできますか。',
    answer: [],
    published: false,
    note: '電気工事（専用回路増設・分電盤作業）の自社対応可否が未確認。FAQ no-outlet では一般的な説明のみに留めている。',
  },
  {
    id: 'commercial-faq',
    audience: 'customer',
    category: 'before-request',
    question: '店舗や事務所の業務用エアコンにも対応していますか。',
    answer: [],
    published: false,
    note: '業務用エアコン工事の対応可否が未確認。',
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
    question: '勤務地はどこになりますか。',
    answer: ['広島市西区己斐上の事業所を拠点として、現場へ向かう働き方になります。'],
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

/** お客様向けFAQをカテゴリー順にまとめる（空のカテゴリーは返さない） */
export const customerFaqGroups = (
  Object.keys(faqCategoryLabels) as FaqCategory[]
)
  .map((category) => ({
    category,
    label: faqCategoryLabels[category],
    items: customerFaqs.filter((f) => f.category === category),
  }))
  .filter((group) => group.items.length > 0)

export function getFaqsByIds(ids: string[]): Faq[] {
  return ids
    .map((id) => faqs.find((f) => f.id === id))
    .filter((f): f is Faq => !!f && f.published && f.answer.length > 0)
}
