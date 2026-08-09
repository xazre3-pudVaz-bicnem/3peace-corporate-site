/**
 * 自動投稿ブログのトピックプール（3Peace 専用）。
 *
 * generate-daily-post.ts が、まだ使っていないトピックを1つ選んで記事を生成します。
 * すべて使い切ったあとは「最後に使ってから最も日が経っているもの」を選び、
 * 過去記事の見出しをプロンプトへ渡して別の切り口で書かせます。
 *
 * ── 重複を避けるための設計 ─────────────────────────────────────
 * 既存の専門コラム（/column）と同じテーマは、深掘りをコラム側に任せて
 * relatedColumn へリンクします。同じキーワードで2ページが競合しないようにするためです。
 *
 * トピックを追加するときは id を必ず一意にしてください（slug のもとになります）。
 */

export type BlogTopic = {
  /** 一意なID。slug のもとになるため英数字とハイフンのみ */
  id: string
  /** 記事の主題（そのままタイトルにはならない。方向づけ用） */
  subject: string
  /** この記事ならではの切り口。同じ主題でも切り口が違えば別記事になる */
  angle: string
  /** blogCategories の slug */
  category: string
  /** 対策キーワード */
  keywords: string[]
  /**
   * 同じテーマを詳しく解説している既存コラムの slug。
   * ある場合、記事は概要にとどめてそちらへ誘導します（重複回避）。
   */
  relatedColumn?: string
  /** 関連づけたいサービスページのパス */
  relatedServices: string[]
  /** 書くときの注意（プロンプトへそのまま渡します） */
  guardrails?: string
}

/** 内部リンクとして使ってよいページ（実在するURLのみ） */
export const allowedInternalLinks: { path: string; label: string }[] = [
  { path: '/service', label: 'エアコン工事の一覧' },
  { path: '/service/installation', label: '広島市のエアコン取り付け・新設工事' },
  { path: '/service/replacement', label: '広島市のエアコン交換・買い替え工事' },
  { path: '/service/relocation', label: '広島市のエアコン移設・引越し工事' },
  { path: '/service/removal', label: '広島市のエアコン取り外し工事' },
  { path: '/area/hiroshima-nishi', label: '広島市西区のエアコン工事' },
  { path: '/column', label: 'エアコン工事の専門コラム' },
  { path: '/column/aircon-installation-check', label: '広島でエアコン取り付けを依頼する前に確認しておきたいこと' },
  { path: '/column/aircon-installation-cost-factors', label: 'エアコン取り付け工事の料金が変わる7つのポイント' },
  { path: '/column/online-aircon-installation', label: 'ネット通販で購入したエアコンを取り付けてもらう前に確認すること' },
  { path: '/column/outdoor-unit-location', label: 'エアコンの室外機はどこに置く？設置場所ごとの注意点' },
  { path: '/column/vacuum-pump', label: 'エアコン工事の「真空引き」とは？なぜ必要なのか' },
  { path: '/column/relocation-or-replacement', label: 'エアコン移設と買い替え、どちらを選ぶべき？' },
  { path: '/column/moving-aircon', label: '引越しでエアコンを移設するときに確認するポイント' },
  { path: '/column/aircon-replacement-timing', label: 'エアコンを交換するタイミングは？' },
  { path: '/column/drain-pipe', label: 'エアコンの配管・ドレンホースはなぜ重要？' },
  { path: '/column/aircon-100v-200v', label: '100V・200Vの違いとは？エアコン設置前の電源確認' },
  { path: '/faq', label: 'エアコン工事のよくある質問' },
  { path: '/about', label: '3Peaceについて' },
  { path: '/recruit', label: 'エアコン工事スタッフの採用情報' },
  { path: '/contact', label: 'エアコン工事のご相談・お問い合わせ' },
]

export const blogTopics: BlogTopic[] = [
  // ── 広島・地域 ────────────────────────────────────────────────
  {
    id: 'hiroshima-aircon-koji-business-choice',
    subject: '広島でエアコン工事業者を選ぶときに見ておきたいこと',
    angle: '見積書のどこを見るか、標準工事の範囲の確認の仕方など、依頼側の判断材料に絞る',
    category: 'hiroshima',
    keywords: ['広島 エアコン工事', '広島 エアコン工事業者', 'エアコン工事 業者選び'],
    relatedColumn: 'aircon-installation-cost-factors',
    relatedServices: ['/service'],
    guardrails: '他社との比較や優劣の断定はしない。「確認するとよい項目」という形で書く。',
  },
  {
    id: 'hiroshima-city-aircon-koji-flow',
    subject: '広島市でエアコン工事を依頼するときの流れ',
    angle: '問い合わせから施工完了までを、依頼者が何を準備すればよいかの視点で追う',
    category: 'hiroshima',
    keywords: ['広島市 エアコン工事', '広島 エアコン取り付け 依頼'],
    relatedServices: ['/service', '/contact'],
  },
  {
    id: 'nishiku-koiue-aircon-koji',
    subject: '広島市西区・己斐上周辺の住宅事情とエアコン工事',
    angle: '高低差のある住宅地で室外機の設置場所をどう決めるか',
    category: 'hiroshima',
    keywords: ['広島市西区 エアコン工事', '己斐上 エアコン工事'],
    relatedServices: ['/area/hiroshima-nishi', '/service/installation'],
    guardrails: '対応エリアを断定しない。所在地が西区己斐上であることは事実として書いてよい。',
  },
  {
    id: 'hiroshima-housing-and-aircon',
    subject: '広島の住宅とエアコン工事で気をつけたいこと',
    angle: '戸建てとマンションで確認する項目がどう変わるか',
    category: 'hiroshima',
    keywords: ['広島 エアコン工事', '広島 エアコン取り付け'],
    relatedServices: ['/service/installation'],
  },

  // ── 取り付け・新設 ─────────────────────────────────────────────
  {
    id: 'aircon-installation-basic-flow',
    subject: 'エアコン取り付け工事は当日どう進むのか',
    angle: '当日の作業手順を、立ち会う側が何を見ておけばよいかという視点で説明する',
    category: 'installation',
    keywords: ['広島 エアコン取り付け', 'エアコン取り付け 当日', 'エアコン工事 流れ'],
    relatedServices: ['/service/installation'],
  },
  {
    id: 'aircon-installation-preparation',
    subject: 'エアコン取り付けの前に家の中で準備しておくこと',
    angle: '家具の移動、養生、当日の立ち会いなど、生活側の準備に絞る',
    category: 'preparation',
    keywords: ['エアコン取り付け 準備', '広島 エアコン工事'],
    relatedColumn: 'aircon-installation-check',
    relatedServices: ['/service/installation'],
  },
  {
    id: 'detached-house-aircon-installation',
    subject: '戸建て住宅のエアコン取り付けで確認するポイント',
    angle: '外壁の材質、室外機の据え方、配管経路など戸建て特有の条件',
    category: 'installation',
    keywords: ['戸建て エアコン取り付け', '広島 エアコン工事'],
    relatedServices: ['/service/installation'],
  },
  {
    id: 'apartment-aircon-installation',
    subject: 'マンション・アパートのエアコン取り付けで気をつけること',
    angle: '管理規約の確認、共用部分の扱い、ベランダの排水口や避難経路',
    category: 'installation',
    keywords: ['マンション エアコン取り付け', '広島市 エアコン工事'],
    relatedServices: ['/service/installation'],
    guardrails: '管理規約は物件ごとに違うため、必ず確認が必要という書き方にする。',
  },
  {
    id: 'aircon-hole-check',
    subject: '配管穴があるかどうかで工事はどう変わるか',
    angle: '既存穴の位置と勾配の見方、使えない場合に何が起きるか',
    category: 'equipment',
    keywords: ['エアコン 配管穴', 'エアコン 穴あけ', '広島 エアコン取り付け'],
    relatedColumn: 'drain-pipe',
    relatedServices: ['/service/installation'],
  },
  {
    id: 'indoor-unit-position',
    subject: '室内機の取り付け位置はどうやって決まるのか',
    angle: '下地、天井までの距離、カーテンレールとの干渉、風の当たり方',
    category: 'installation',
    keywords: ['エアコン 室内機 取り付け位置', '広島 エアコン取り付け'],
    relatedServices: ['/service/installation'],
  },
  {
    id: 'online-purchase-installation-flow',
    subject: 'ネットで買ったエアコンの取り付けを頼むときの流れ',
    angle: '購入から工事日までの段取りと、届いた箱の確認',
    category: 'preparation',
    keywords: ['ネットで買ったエアコン 取り付け', 'エアコン 工事のみ 依頼'],
    relatedColumn: 'online-aircon-installation',
    relatedServices: ['/service/installation'],
  },

  // ── 交換・買い替え ─────────────────────────────────────────────
  {
    id: 'aircon-replacement-day-flow',
    subject: 'エアコンの入れ替え工事は1日でどこまで進むのか',
    angle: '取り外しと設置を同じ日に行うときの段取りと、生活への影響',
    category: 'replacement',
    keywords: ['広島 エアコン交換', 'エアコン 入れ替え 工事'],
    relatedServices: ['/service/replacement'],
  },
  {
    id: 'existing-pipe-reuse',
    subject: '古いエアコンの配管はそのまま使えるのか',
    angle: '再利用の可否を分ける条件と、引き直しになる場合の理由',
    category: 'equipment',
    keywords: ['エアコン 配管 再利用', '広島 エアコン交換'],
    relatedColumn: 'drain-pipe',
    relatedServices: ['/service/replacement'],
  },
  {
    id: 'aircon-not-cooling-check',
    subject: 'エアコンが冷えないときにまず確認したいこと',
    angle: '自分で確認できる範囲と、業者に見てもらう範囲の線引き',
    category: 'replacement',
    keywords: ['エアコン 冷えない', '広島 エアコン交換', 'エアコン 買い替え'],
    relatedColumn: 'aircon-replacement-timing',
    relatedServices: ['/service/replacement'],
    guardrails: '故障の原因を断定しない。修理か交換かは状態を確認したうえで判断する旨を書く。',
  },
  {
    id: 'old-aircon-replacement',
    subject: '長く使ったエアコンを交換するときに確認すること',
    angle: '年数が経った機種特有の確認点（電圧の変化、配管の劣化、処分）',
    category: 'replacement',
    keywords: ['古いエアコン 交換', '広島市 エアコン交換'],
    relatedColumn: 'aircon-replacement-timing',
    relatedServices: ['/service/replacement', '/service/removal'],
  },

  // ── 移設 ──────────────────────────────────────────────────────
  {
    id: 'moving-aircon-schedule',
    subject: '引っ越しに合わせたエアコン移設の段取り',
    angle: '取り外し日と設置日をどう組むか、機器の保管',
    category: 'relocation',
    keywords: ['引っ越し エアコン 移設', '広島 エアコン移設'],
    relatedColumn: 'moving-aircon',
    relatedServices: ['/service/relocation'],
  },
  {
    id: 'relocation-conditions',
    subject: '移設先でエアコンが使えるかどうかを分ける条件',
    angle: '配管の長さ、電源、配管経路、室外機の置き場所の4点に絞る',
    category: 'relocation',
    keywords: ['広島市 エアコン移設', 'エアコン 移設 条件'],
    relatedColumn: 'relocation-or-replacement',
    relatedServices: ['/service/relocation'],
  },
  {
    id: 'room-change-relocation',
    subject: '同じ家の中でエアコンを別の部屋へ移すとき',
    angle: '引っ越しではない室内移設ならではの確認点',
    category: 'relocation',
    keywords: ['エアコン 移設 別の部屋', '広島 エアコン移設'],
    relatedServices: ['/service/relocation'],
  },

  // ── 取り外し ───────────────────────────────────────────────────
  {
    id: 'aircon-removal-cases',
    subject: 'エアコンの取り外しが必要になる場面',
    angle: '退去、解体、内装工事など場面ごとに何が変わるか',
    category: 'removal',
    keywords: ['広島 エアコン取り外し', 'エアコン 撤去'],
    relatedServices: ['/service/removal'],
  },
  {
    id: 'pump-down-basics',
    subject: '取り外し前に行う「ポンプダウン」とは',
    angle: '冷媒を回収する意味と、動かない機器はどうなるか',
    category: 'removal',
    keywords: ['エアコン ポンプダウン', '広島市 エアコン取り外し'],
    relatedServices: ['/service/removal'],
  },
  {
    id: 'removal-wall-hole',
    subject: 'エアコンを外したあとの壁の穴はどうするか',
    angle: '賃貸の原状回復と、処理方法の選択肢',
    category: 'removal',
    keywords: ['エアコン 取り外し 壁 穴', '広島 エアコン取り外し'],
    relatedServices: ['/service/removal'],
    guardrails: '原状回復の範囲は契約によって違うため、管理会社への確認を促す。',
  },

  // ── 室外機・配管・電源 ─────────────────────────────────────────
  {
    id: 'outdoor-unit-placement-basics',
    subject: '室外機を置く場所で効きが変わる理由',
    angle: '吹き出し口の前の空間と水平の話に絞る',
    category: 'equipment',
    keywords: ['エアコン 室外機 設置場所', '広島 エアコン工事'],
    relatedColumn: 'outdoor-unit-location',
    relatedServices: ['/service/installation'],
  },
  {
    id: 'outdoor-unit-wall-mount',
    subject: '室外機を壁掛けや屋根置きにする場合',
    angle: '床に置けない現場で選ぶ方法と、取り付け面の強度',
    category: 'equipment',
    keywords: ['室外機 壁掛け', '室外機 屋根置き', '広島 エアコン工事'],
    relatedColumn: 'outdoor-unit-location',
    relatedServices: ['/service/installation'],
  },
  {
    id: 'drain-hose-slope',
    subject: 'ドレンホースの勾配が水漏れを左右する',
    angle: '室内機から水が垂れる仕組みと、出口の詰まりの見方',
    category: 'equipment',
    keywords: ['エアコン ドレンホース', 'エアコン 水漏れ 原因'],
    relatedColumn: 'drain-pipe',
    relatedServices: ['/service/installation', '/service/replacement'],
  },
  {
    id: 'aircon-dedicated-outlet',
    subject: 'エアコン専用コンセントがない場合',
    angle: '専用回路が必要な理由と、延長コードを使ってはいけない理由',
    category: 'equipment',
    keywords: ['エアコン 専用コンセント', 'エアコン 専用回路', '広島 エアコン取り付け'],
    relatedColumn: 'aircon-100v-200v',
    relatedServices: ['/service/installation'],
    guardrails: '電気工事の自社対応可否は未確認のため断定しない。一般的な説明にとどめる。',
  },
  {
    id: 'voltage-100v-200v-check',
    subject: '100Vと200Vの見分け方',
    angle: 'コンセントの形と分電盤から確認する手順に絞る',
    category: 'equipment',
    keywords: ['エアコン 100V 200V', 'エアコン コンセント 形'],
    relatedColumn: 'aircon-100v-200v',
    relatedServices: ['/service/installation', '/service/replacement'],
  },
  {
    id: 'vacuum-pump-why',
    subject: '真空引きを省くと何が起きるのか',
    angle: '数年後に現れる不具合という時間軸で説明する',
    category: 'equipment',
    keywords: ['エアコン 真空引き', 'エアコン工事 真空引き 必要'],
    relatedColumn: 'vacuum-pump',
    relatedServices: ['/service/installation'],
  },
  {
    id: 'decorative-cover',
    subject: '化粧カバーは付けたほうがよいのか',
    angle: '配管の劣化と見た目、費用が変わる要素',
    category: 'equipment',
    keywords: ['エアコン 化粧カバー', 'エアコン 配管カバー'],
    relatedColumn: 'drain-pipe',
    relatedServices: ['/service/installation'],
  },

  // ── 料金・時期 ─────────────────────────────────────────────────
  {
    id: 'cost-factors-overview',
    subject: 'エアコン工事の料金が現場によって変わる理由',
    angle: '配管長・穴あけ・室外機の設置方法という3点に絞って説明する',
    category: 'preparation',
    keywords: ['エアコン工事 料金', 'エアコン取り付け 費用', '広島 エアコン工事'],
    relatedColumn: 'aircon-installation-cost-factors',
    relatedServices: ['/service'],
    guardrails: '金額は一切書かない。「決まる要素」の説明に徹する。',
  },
  {
    id: 'additional-work-cases',
    subject: '追加工事が必要になるのはどんなときか',
    angle: '壁を開けてから分かることと、事前に分かること',
    category: 'preparation',
    keywords: ['エアコン工事 追加料金', 'エアコン 追加工事'],
    relatedColumn: 'aircon-installation-cost-factors',
    relatedServices: ['/service/installation'],
    guardrails: '3Peaceの対応可否を断定しない。一般的な説明と現場確認の案内にする。',
  },
  {
    id: 'before-summer-aircon',
    subject: '夏前にエアコン工事を依頼しておくと何が違うか',
    angle: '繁忙期の日程調整と、故障してからでは間に合わない話',
    category: 'preparation',
    keywords: ['夏前 エアコン工事', '広島 エアコン工事 時期'],
    relatedServices: ['/service/replacement', '/contact'],
  },
  {
    id: 'before-winter-aircon-check',
    subject: '冬前にエアコンを確認しておきたい理由',
    angle: '暖房で初めて分かる不具合と、室外機まわりの確認',
    category: 'preparation',
    keywords: ['冬 エアコン 確認', '広島 エアコン交換'],
    relatedServices: ['/service/replacement'],
  },
  {
    id: 'photo-before-contact',
    subject: '問い合わせ前に撮っておくと話が早い写真',
    angle: 'どこを撮ればよいかを具体的に挙げる',
    category: 'preparation',
    keywords: ['エアコン工事 見積もり', '広島 エアコン工事 相談'],
    relatedColumn: 'aircon-installation-check',
    relatedServices: ['/contact', '/service'],
  },

  // ── 採用 ──────────────────────────────────────────────────────
  {
    id: 'aircon-installer-job-content',
    subject: 'エアコン工事の仕事は実際に何をしているのか',
    angle: '一日の流れと、覚えることの順番',
    category: 'recruit',
    keywords: ['エアコン工事 求人', '広島 エアコン工事 求人', 'エアコン工事 仕事内容'],
    relatedServices: ['/recruit'],
    guardrails: '給与・待遇・勤務時間・休日・未経験歓迎などの条件は未確定のため一切書かない。',
  },
  {
    id: 'aircon-installer-skills',
    subject: 'エアコン工事で身につく技術',
    angle: '工具の扱い、建物を見る目、段取り、安全判断',
    category: 'recruit',
    keywords: ['エアコン工事 未経験', '広島 空調工事 求人'],
    relatedServices: ['/recruit'],
    guardrails: '応募条件や研修制度を断定しない。募集内容は採用ページを見るよう案内する。',
  },
  {
    id: 'aircon-installer-appeal',
    subject: '技術職としてのエアコン工事の面白さ',
    angle: '現場ごとに条件が違うため、判断する力が身につくという点',
    category: 'recruit',
    keywords: ['エアコン工事 やりがい', '広島市 エアコン取付 求人'],
    relatedServices: ['/recruit'],
    guardrails: '待遇や将来の収入について書かない。',
  },
]
