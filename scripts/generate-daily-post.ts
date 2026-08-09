/**
 * Claude API で 3Peace のブログ記事を1本生成し、content/blog へ Markdown として保存します。
 *
 *   npx tsx scripts/generate-daily-post.ts
 *
 * 必要な環境変数:
 *   ANTHROPIC_API_KEY  … 必須
 *   ANTHROPIC_MODEL    … 任意。未設定なら DEFAULT_MODEL（コスト重視で Haiku）
 *
 * 設計のポイント
 * - 構造化出力（output_config.format）でJSONを受け取り、Markdown はこちらで組み立てます。
 *   Haiku でも frontmatter が壊れず、slug やカテゴリーが必ず正しい値になります。
 * - 内部リンクは許可リストからしか選べないようにしています（リンク切れを作らないため）。
 * - 既存の専門コラム（/column）と同じテーマは深掘りせず、コラムへ誘導します。
 */

import fs from 'node:fs'
import path from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import matter from 'gray-matter'
import { allowedInternalLinks, blogTopics, type BlogTopic } from './blog-topics'

// ── 設定 ──────────────────────────────────────────────────────────
/** コスト重視。通常の毎日投稿では Sonnet / Opus を使いません */
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'
const MODEL = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL

const SITE = {
  name: '3Peace',
  baseUrl: 'https://www.3peace-hiroshima.com',
  representative: '面出 洋平',
  telDisplay: '080-3880-4024',
  telHref: '08038804024',
  address: '広島県広島市西区己斐上4丁目36-18',
  instagram: 'https://www.instagram.com/3peace.osr/',
  mainKeyword: '広島 エアコン工事',
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

// ── 既存記事の読み込み（重複回避） ────────────────────────────────
type ExistingPost = {
  slug: string
  title: string
  topicId?: string
  date: string
}

function readExistingPosts(): ExistingPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf8'))
      return {
        slug: typeof data.slug === 'string' ? data.slug : file.replace(/\.md$/, ''),
        title: typeof data.title === 'string' ? data.title : '',
        topicId: typeof data.topicId === 'string' ? data.topicId : undefined,
        date: typeof data.date === 'string' ? data.date : '',
      }
    })
}

/**
 * まだ使っていないトピックを優先し、全部使い切っていたら
 * 「最後に使ってから最も日が経っているもの」を選びます。
 */
function pickTopic(existing: ExistingPost[]): BlogTopic {
  const lastUsed = new Map<string, string>()
  for (const post of existing) {
    if (!post.topicId) continue
    const current = lastUsed.get(post.topicId)
    if (!current || post.date > current) lastUsed.set(post.topicId, post.date)
  }

  const unused = blogTopics.filter((t) => !lastUsed.has(t.id))
  if (unused.length > 0) {
    // 未使用の中から日替わりで選ぶ（毎回先頭に偏らないよう日付で回す）
    const index = Number(jstDateString().replace(/-/g, '')) % unused.length
    return unused[index]
  }

  return [...blogTopics].sort((a, b) => {
    const da = lastUsed.get(a.id) ?? ''
    const db = lastUsed.get(b.id) ?? ''
    return da.localeCompare(db)
  })[0]
}

// ── 日付 ──────────────────────────────────────────────────────────
function jstDateString(date = new Date()): string {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().slice(0, 10)
}

// ── 生成する記事の構造 ────────────────────────────────────────────
type GeneratedArticle = {
  title: string
  description: string
  tags: string[]
  lead: string[]
  sections: {
    heading: string
    paragraphs: string[]
    bullets?: string[]
    subsections?: { heading: string; paragraphs: string[] }[]
  }[]
  faq: { question: string; answer: string }[]
  summary: string[]
  internalLinks: { path: string; anchor: string }[]
}

const ARTICLE_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: '記事タイトル。28〜44文字程度。地域名かキーワードを自然に含める' },
    description: { type: 'string', description: 'meta description。90〜120文字' },
    tags: { type: 'array', items: { type: 'string' }, description: 'タグ。3〜5個' },
    lead: { type: 'array', items: { type: 'string' }, description: '導入文。2〜3段落' },
    sections: {
      type: 'array',
      description: '本文。H2見出しのブロックを4〜6個',
      items: {
        type: 'object',
        properties: {
          heading: { type: 'string', description: 'H2見出し' },
          paragraphs: { type: 'array', items: { type: 'string' }, description: '段落。1〜3個' },
          bullets: { type: 'array', items: { type: 'string' }, description: '箇条書き。不要なら空配列' },
          subsections: {
            type: 'array',
            description: 'H3の小見出し。不要なら空配列',
            items: {
              type: 'object',
              properties: {
                heading: { type: 'string' },
                paragraphs: { type: 'array', items: { type: 'string' } },
              },
              required: ['heading', 'paragraphs'],
              additionalProperties: false,
            },
          },
        },
        required: ['heading', 'paragraphs', 'bullets', 'subsections'],
        additionalProperties: false,
      },
    },
    faq: {
      type: 'array',
      description: 'よくある質問。2〜3個',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
        },
        required: ['question', 'answer'],
        additionalProperties: false,
      },
    },
    summary: { type: 'array', items: { type: 'string' }, description: 'まとめ。1〜2段落' },
    internalLinks: {
      type: 'array',
      description: '関連ページ。2〜4個。path は選択肢から選ぶこと',
      items: {
        type: 'object',
        properties: {
          path: { type: 'string', enum: allowedInternalLinks.map((l) => l.path) },
          anchor: { type: 'string', description: 'リンク先の内容が分かる文言。「詳しくはこちら」は禁止' },
        },
        required: ['path', 'anchor'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'description', 'tags', 'lead', 'sections', 'faq', 'summary', 'internalLinks'],
  additionalProperties: false,
}

// ── プロンプト ────────────────────────────────────────────────────
function buildSystemPrompt(): string {
  return [
    `あなたは広島市西区己斐上を拠点とするエアコン工事店「${SITE.name}」のウェブ担当者です。`,
    'エアコン工事を検討している人が、依頼前の疑問を解消できる専門記事を書きます。',
    '',
    '## 事実として書いてよいこと',
    `- 会社名は ${SITE.name}、代表者は ${SITE.representative}`,
    `- 所在地は ${SITE.address}、電話番号は ${SITE.telDisplay}`,
    '- エアコンの新設・交換・移設・取り外しに対応している',
    '- 設置場所と配管経路を確認し、真空引きと試運転、動作確認まで行って引き渡している',
    '',
    '## 絶対に書いてはいけないこと',
    '- 料金、金額、相場、「〇円から」などの価格表現',
    '- 具体的な工事時間（「〇時間で完了」など）',
    '- 施工件数、創業年、社員数、保有資格、受賞歴、対応メーカー、保証内容、支払い方法',
    '- 対応エリアの断定（「広島県全域対応」など）。拠点が広島市西区己斐上であることは書いてよい',
    '- 「必ず取り付けできます」「最安」「広島で一番」「No.1」などの根拠のない表現',
    '- 「即日対応」「最短〇分」など確認できない約束',
    '- 求人の給与・待遇・勤務時間・休日・福利厚生・未経験歓迎などの条件',
    '- 電気工事や専用回路の増設を自社で対応できると断定すること',
    '',
    '## 書き方',
    '- 日本語。設備工事会社として誠実で、読み手に分かる言葉で書く',
    '- 現場の条件によって工事内容が変わることを、押しつけずに自然に含める',
    '- 断定できないことは「現場の状況を確認したうえでご案内します」という形にする',
    '- AIが書いたような定型句（「いかがでしたでしょうか」「ぜひ〇〇してみてください」）は使わない',
    '- 煽らない。不安をあおる書き方をしない',
    '- 見出しは内容が分かる具体的な言葉にする。「まとめ」以外に抽象的な見出しを使わない',
    '- 一文は短めにし、専門用語は初出で簡単に説明する',
  ].join('\n')
}

function buildUserPrompt(topic: BlogTopic, existing: ExistingPost[]): string {
  const linkOptions = allowedInternalLinks.map((l) => `- ${l.path} … ${l.label}`).join('\n')
  const recentTitles = existing
    .slice(-25)
    .map((p) => `- ${p.title}`)
    .join('\n')

  const relatedColumnNote = topic.relatedColumn
    ? [
        '',
        '## 重複を避ける',
        `このテーマは /column/${topic.relatedColumn} で詳しく解説済みです。`,
        '同じ内容を細かく書き直さず、この記事では概要と判断材料にとどめ、',
        `internalLinks に /column/${topic.relatedColumn} を必ず含めて詳しい解説へ誘導してください。`,
      ].join('\n')
    : null

  return [
    '次の条件で記事を1本書いてください。',
    '',
    '## この記事の主題',
    `${topic.subject}`,
    '',
    '## 切り口（ここを外さないこと）',
    `${topic.angle}`,
    '',
    '## 対策キーワード',
    topic.keywords.map((k) => `- ${k}`).join('\n'),
    'タイトルと本文に、これらのキーワードを不自然にならない範囲で含めてください。',
    '同じ語を機械的に繰り返さないこと。',
    topic.guardrails ? `\n## この記事固有の注意\n${topic.guardrails}` : null,
    relatedColumnNote,
    '',
    '## 分量',
    '- 本文全体で2,000〜3,000文字程度',
    '- H2見出しのセクションを4〜6個',
    '- 各セクションに段落を1〜3個',
    '',
    '## 内部リンク',
    'internalLinks には次の中から2〜4個を選んでください。ここにないURLは使えません。',
    linkOptions,
    'anchor はリンク先の内容が分かる文言にしてください（「詳しくはこちら」は禁止）。',
    '',
    existing.length > 0
      ? [
          '## すでに公開済みの記事タイトル（内容を重複させないこと）',
          recentTitles,
          '同じ切り口・同じ構成にならないよう、上のタイトルとは違う角度で書いてください。',
        ].join('\n')
      : null,
  ]
    .filter((block) => block !== null)
    .join('\n')
}

// ── Markdown 組み立て ─────────────────────────────────────────────
/** frontmatter 用に必ずダブルクォートで囲む（改行はスペースに畳む） */
function escapeYaml(value: string): string {
  const flat = value.replace(/\s+/g, ' ').trim()
  return `"${flat.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function buildMarkdown(
  article: GeneratedArticle,
  topic: BlogTopic,
  slug: string,
  date: string,
): string {
  const frontmatter = [
    '---',
    `title: ${escapeYaml(article.title)}`,
    `slug: ${escapeYaml(slug)}`,
    `description: ${escapeYaml(article.description)}`,
    `date: ${escapeYaml(date)}`,
    `category: ${escapeYaml(topic.category)}`,
    'tags:',
    ...article.tags.slice(0, 5).map((t) => `  - ${escapeYaml(t)}`),
    `topicId: ${escapeYaml(topic.id)}`,
    `model: ${escapeYaml(MODEL)}`,
    'published: true',
    '---',
    '',
  ]

  const body: string[] = []

  for (const paragraph of article.lead) {
    body.push(paragraph, '')
  }

  for (const section of article.sections) {
    body.push(`## ${section.heading}`, '')
    for (const paragraph of section.paragraphs) {
      body.push(paragraph, '')
    }
    if (section.bullets && section.bullets.length > 0) {
      for (const bullet of section.bullets) {
        body.push(`- ${bullet}`)
      }
      body.push('')
    }
    for (const sub of section.subsections ?? []) {
      body.push(`### ${sub.heading}`, '')
      for (const paragraph of sub.paragraphs) {
        body.push(paragraph, '')
      }
    }
  }

  if (article.faq.length > 0) {
    body.push('## よくある質問', '')
    for (const item of article.faq) {
      body.push(`### ${item.question}`, '', item.answer, '')
    }
  }

  if (article.summary.length > 0) {
    body.push('## まとめ', '')
    for (const paragraph of article.summary) {
      body.push(paragraph, '')
    }
  }

  // 内部リンク（許可リストにあるものだけを残す）
  const links = article.internalLinks
    .filter((l) => allowedInternalLinks.some((a) => a.path === l.path))
    .filter((l, i, arr) => arr.findIndex((x) => x.path === l.path) === i)
  if (links.length > 0) {
    body.push('## あわせてご覧ください', '')
    for (const link of links) {
      body.push(`- [${link.anchor}](${link.path})`)
    }
    body.push('')
  }

  // 問い合わせ導線（サイトの実際の導線と揃える）
  body.push(
    '## エアコン工事のご相談',
    '',
    `${SITE.name}は${SITE.address}を拠点に、エアコンの新設・交換・移設・取り外しを行っています。`,
    '設置場所の状況によって必要な工事が変わるため、「取り付けられるか分からない」という段階でもご相談ください。',
    '現場の状況を確認したうえでご案内します。',
    '',
    `- お電話：[${SITE.telDisplay}](tel:${SITE.telHref})`,
    '- [エアコン工事について相談する](/contact)',
    `- [Instagram で施工の様子を見る](${SITE.instagram})`,
    '',
  )

  return frontmatter.join('\n') + body.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

/** 同じ slug があれば連番を付ける */
function resolveSlug(base: string, existing: ExistingPost[]): string {
  const taken = new Set(existing.map((p) => p.slug))
  if (!taken.has(base)) return base
  for (let i = 2; i < 100; i++) {
    const candidate = `${base}-${i}`
    if (!taken.has(candidate)) return candidate
  }
  return `${base}-${Date.now()}`
}

// ── 生成した内容の検証 ────────────────────────────────────────────
const FORBIDDEN_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\d[\d,]*\s*円/, reason: '金額が含まれています' },
  { pattern: /業界\s*(No\.?1|ナンバーワン)|地域\s*最安|広島\s*で\s*一番|日本一/, reason: '根拠のない最上級表現' },
  { pattern: /必ず(取り付け|設置|工事)(でき|可能)/, reason: '断定的な対応可否' },
  { pattern: /即日対応|最短\s*\d+\s*(分|時間)/, reason: '確認できない対応スピードの約束' },
  { pattern: /創業\s*\d+\s*年|施工実績\s*\d|年間\s*\d+\s*件/, reason: '未確認の実績' },
  { pattern: /時給|月給|日給|年収|賞与|各種社会保険/, reason: '未確定の求人条件' },
]

function validate(markdown: string): string[] {
  const problems: string[] = []
  for (const { pattern, reason } of FORBIDDEN_PATTERNS) {
    const match = markdown.match(pattern)
    if (match) problems.push(`${reason}（"${match[0]}"）`)
  }
  // 許可リストにないサイト内リンクが混じっていないか
  const linkPaths = [...markdown.matchAll(/\]\((\/[^)]*)\)/g)].map((m) => m[1])
  for (const p of linkPaths) {
    if (!allowedInternalLinks.some((a) => a.path === p)) {
      problems.push(`存在しない内部リンク（${p}）`)
    }
  }
  return problems
}

/**
 * API を呼ばずに、トピック選択・プロンプト・Markdown 組み立て・検証だけを確認します。
 *   npx tsx scripts/generate-daily-post.ts --dry-run
 * ファイルは書き出しません。
 */
function dryRun() {
  const existing = readExistingPosts()
  const topic = pickTopic(existing)

  console.log(`既存記事: ${existing.length} 件`)
  console.log(`選択したトピック: ${topic.id}（${topic.subject}）`)
  console.log(`カテゴリー: ${topic.category}`)
  console.log(`保存先: content/blog/${jstDateString()}-${resolveSlug(topic.id, existing)}.md`)
  console.log('')
  console.log('--- system prompt ---')
  console.log(buildSystemPrompt())
  console.log('')
  console.log('--- user prompt ---')
  console.log(buildUserPrompt(topic, existing))
}

// ── メイン ────────────────────────────────────────────────────────
async function main() {
  if (process.argv.includes('--dry-run')) {
    dryRun()
    return
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY が設定されていません。')
    process.exit(1)
  }

  console.log(`使用モデル: ${MODEL}`)

  fs.mkdirSync(BLOG_DIR, { recursive: true })
  const existing = readExistingPosts()
  console.log(`既存記事: ${existing.length} 件`)

  const topic = pickTopic(existing)
  console.log(`選択したトピック: ${topic.id}（${topic.subject}）`)

  const client = new Anthropic()

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: buildSystemPrompt(),
    messages: [{ role: 'user', content: buildUserPrompt(topic, existing) }],
    output_config: {
      format: {
        type: 'json_schema',
        schema: ARTICLE_SCHEMA,
      },
    },
  })

  if (response.stop_reason === 'refusal') {
    console.error('モデルが生成を拒否しました。トピックを見直してください。')
    process.exit(1)
  }
  if (response.stop_reason === 'max_tokens') {
    console.error('max_tokens に達したため記事が途中で切れました。')
    process.exit(1)
  }

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    console.error('テキストが返りませんでした。')
    process.exit(1)
  }

  let article: GeneratedArticle
  try {
    article = JSON.parse(textBlock.text) as GeneratedArticle
  } catch (error) {
    console.error('JSON の解析に失敗しました:', error)
    process.exit(1)
  }

  if (!article.title || !article.description || !Array.isArray(article.sections)) {
    console.error('生成結果に必要な項目が足りません。')
    process.exit(1)
  }

  const date = jstDateString()
  const slug = resolveSlug(topic.id, existing)
  const markdown = buildMarkdown(article, topic, slug, date)

  const problems = validate(markdown)
  if (problems.length > 0) {
    console.error('生成された記事に問題が見つかったため保存しませんでした:')
    for (const problem of problems) console.error(`  - ${problem}`)
    process.exit(1)
  }

  const fileName = `${date}-${slug}.md`
  fs.writeFileSync(path.join(BLOG_DIR, fileName), markdown, 'utf8')

  const charCount = markdown.replace(/\s/g, '').length
  console.log('---')
  console.log(`生成ファイル: content/blog/${fileName}`)
  console.log(`タイトル: ${article.title}`)
  console.log(`カテゴリー: ${topic.category}`)
  console.log(`本文の文字数: 約 ${charCount} 文字`)
  console.log(`使用モデル: ${MODEL}`)
  console.log(
    `入力トークン: ${response.usage.input_tokens} / 出力トークン: ${response.usage.output_tokens}`,
  )
  console.log('---')
}

main().catch((error) => {
  console.error('記事の生成に失敗しました:', error)
  process.exit(1)
})
