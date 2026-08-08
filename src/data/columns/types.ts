/**
 * エアコン工事専門コラムの型定義。
 *
 * 一般的なブログではなく、「エアコン工事を依頼する前に知りたいこと」に答える
 * 専門記事として設計しています。
 *
 * 【書き方のルール】
 * - 検索意図を1記事1つに絞る。複数の意図を混ぜると、どのキーワードでも
 *   評価されにくくなります。
 * - 他の記事やサービスページと同じ文章を使い回さない。
 * - 3Peace の対応可否が確認できていないことを「できます」と書かない。
 *   一般的な仕組みの説明と、「現場を確認したうえでご案内します」を使い分ける。
 * - 監修は「3Peace 代表 面出 洋平」まで。資格・経験年数は確認できていないため書かない。
 */

export type ColumnCategory =
  | 'installation'
  | 'replacement'
  | 'relocation'
  | 'removal'
  | 'outdoor-unit'
  | 'piping'
  | 'preparation'
  | 'choosing'
  | 'hiroshima'

export const columnCategoryLabels: Record<ColumnCategory, string> = {
  installation: 'エアコン取り付け',
  replacement: 'エアコン交換',
  relocation: 'エアコン移設',
  removal: 'エアコン取り外し',
  'outdoor-unit': '室外機',
  piping: '配管',
  preparation: '工事前の準備',
  choosing: 'エアコン選び',
  hiroshima: '広島のエアコン工事',
}

/** 記事内の見出しブロック */
export type ColumnSection = {
  /** H2 見出し。目次に使う */
  heading: string
  /** 目次アンカー用のID（英数字とハイフン） */
  id: string
  /** 本文（段落配列） */
  body?: string[]
  /** 箇条書き */
  list?: string[]
  /** 番号付きの手順 */
  steps?: { title: string; body: string }[]
  /** H3 の小見出しブロック */
  subsections?: { heading: string; body: string[] }[]
  /** 注意点として枠で囲む文章 */
  note?: string
  /** 図解の代わりに使う写真（images.ts に登録済みのパス） */
  image?: { src: string; alt: string; caption?: string }
}

export type Column = {
  slug: string
  category: ColumnCategory
  /** 記事タイトル（H1） */
  title: string
  /** metadata の title（末尾に「｜3Peace」は付けない） */
  metaTitle: string
  /** metadata の description */
  metaDescription: string
  /** 対策キーワード（メモ。画面には出ません） */
  targetKeywords: string[]
  /** 公開日 ISO 8601 */
  publishedAt: string
  /** 更新日 ISO 8601 */
  updatedAt?: string
  /** 導入文（段落配列） */
  lead: string[]
  /** 本文 */
  sections: ColumnSection[]
  /** 記事末尾のまとめ */
  summary?: string[]
  /** 記事内FAQ（faq.ts と重複させず、この記事固有の質問を書く） */
  faq?: { question: string; answer: string[] }[]
  /** 関連するサービスの slug（services.ts） */
  relatedServices: string[]
  /** 関連記事の slug */
  relatedColumns: string[]
  /** アイキャッチ（images.ts に登録済みのパス） */
  image?: { src: string; alt: string }
  published: boolean
}
