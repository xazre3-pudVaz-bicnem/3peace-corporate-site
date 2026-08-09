import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

/**
 * Markdown ブログ（自動投稿）の読み込み。
 *
 * 記事は content/blog/*.md に置きます。frontmatter は
 * scripts/generate-daily-post.ts が生成しますが、手書きで追加しても構いません。
 *
 * ── 既存の「専門コラム」(/column) との違い ─────────────────────────
 * /column … 手作業で作り込んだ体系的な解説記事（src/data/columns/ の TypeScript）
 * /blog   … Claude API で毎日1本追加していくトピック記事（この Markdown）
 *
 * 役割を分けているのは、同じキーワードを2つのページで奪い合わせないためです。
 * 生成時のプロンプトでも、既存コラムと同じテーマを重複させず、
 * 該当するコラムへ内部リンクするよう指示しています。
 */

/** カテゴリー。slug は URL に使うため英数字とハイフンのみ */
export const blogCategories = [
  { slug: 'installation', label: 'エアコン取り付け' },
  { slug: 'replacement', label: 'エアコン交換' },
  { slug: 'relocation', label: 'エアコン移設' },
  { slug: 'removal', label: 'エアコン取り外し' },
  { slug: 'equipment', label: '室外機・配管・電源' },
  { slug: 'preparation', label: '工事前の準備' },
  { slug: 'hiroshima', label: '広島のエアコン工事' },
  { slug: 'recruit', label: 'エアコン工事の仕事' },
] as const

export type BlogCategorySlug = (typeof blogCategories)[number]['slug']

export function categoryLabel(slug: string): string {
  return blogCategories.find((c) => c.slug === slug)?.label ?? slug
}

export function isBlogCategory(slug: string): slug is BlogCategorySlug {
  return blogCategories.some((c) => c.slug === slug)
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  /** 公開日 YYYY-MM-DD */
  date: string
  /** 更新日 YYYY-MM-DD（任意） */
  updated?: string
  category: BlogCategorySlug
  tags: string[]
  /** 本文（Markdown） */
  content: string
  /** 生成元のトピックID（重複生成を避けるための管理用。画面には出しません） */
  topicId?: string
  /** 生成に使用したモデル（管理用） */
  model?: string
  /** false にすると一覧・詳細・サイトマップから外れます */
  published: boolean
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
  }
  return []
}

/** frontmatter が不正なファイルは読み飛ばす（ビルドを止めない） */
function parseFile(fileName: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, fileName)
  let raw: string
  try {
    raw = fs.readFileSync(filePath, 'utf8')
  } catch {
    return null
  }

  const { data, content } = matter(raw)
  if (!isRecord(data)) return null

  const slug =
    typeof data.slug === 'string' && data.slug.trim().length > 0
      ? data.slug.trim()
      : fileName.replace(/\.md$/, '')

  const title = typeof data.title === 'string' ? data.title.trim() : ''
  const description = typeof data.description === 'string' ? data.description.trim() : ''
  const date = typeof data.date === 'string' ? data.date.trim() : ''
  const category = typeof data.category === 'string' ? data.category.trim() : ''

  // 必須項目が欠けている、または slug が英数字とハイフン以外を含む記事は公開しない
  if (!title || !description || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  if (!/^[a-z0-9-]+$/.test(slug)) return null
  if (!isBlogCategory(category)) return null
  if (content.trim().length === 0) return null

  return {
    slug,
    title,
    description,
    date,
    updated: typeof data.updated === 'string' ? data.updated.trim() : undefined,
    category,
    tags: toStringArray(data.tags),
    content,
    topicId: typeof data.topicId === 'string' ? data.topicId : undefined,
    model: typeof data.model === 'string' ? data.model : undefined,
    published: data.published !== false,
  }
}

let cache: BlogPost[] | null = null

/** 公開中の記事を新しい順に返す */
export function getAllPosts(): BlogPost[] {
  if (cache) return cache

  let files: string[] = []
  try {
    files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
  } catch {
    files = []
  }

  cache = files
    .map(parseFile)
    .filter((p): p is BlogPost => p !== null && p.published)
    .sort((a, b) => {
      const diff = b.date.localeCompare(a.date)
      return diff !== 0 ? diff : b.slug.localeCompare(a.slug)
    })

  return cache
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category)
}

/** 記事が1件以上あるカテゴリーだけを返す（空のカテゴリーページを作らない） */
export function getUsedCategories(): { slug: BlogCategorySlug; label: string; count: number }[] {
  const posts = getAllPosts()
  return blogCategories
    .map((c) => ({
      slug: c.slug,
      label: c.label,
      count: posts.filter((p) => p.category === c.slug).length,
    }))
    .filter((c) => c.count > 0)
}

/** 同じカテゴリーを優先した関連記事 */
export function getRelatedPosts(post: BlogPost, limit = 4): BlogPost[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug)
  const sameCategory = others.filter((p) => p.category === post.category)
  const rest = others.filter((p) => p.category !== post.category)
  return [...sameCategory, ...rest].slice(0, limit)
}

export const hasPosts = () => getAllPosts().length > 0

/**
 * カテゴリー一覧をインデックス対象にする最低記事数。
 * 記事が1〜2本しかない一覧ページは内容が薄いため noindex にし、
 * サイトマップにも載せません。
 */
export const MIN_POSTS_FOR_INDEXING = 3

/** サイトマップに載せるカテゴリー（記事が十分にあるものだけ） */
export function getIndexableCategories(): { slug: BlogCategorySlug; count: number }[] {
  return getUsedCategories().filter((c) => c.count >= MIN_POSTS_FOR_INDEXING)
}

/** カテゴリー内で最も新しい記事の更新日 */
export function categoryLastModified(category: string): Date {
  const posts = getPostsByCategory(category)
  if (posts.length === 0) return new Date()
  return postLastModified(posts[0])
}

/** 記事の最終更新日（sitemap / RSS 用） */
export function postLastModified(post: BlogPost): Date {
  return new Date(post.updated ?? post.date)
}

/**
 * 本文中の「よくある質問」セクション（## よくある質問 → ### 質問 → 本文）を取り出します。
 * FAQPage の構造化データに使います。見つからなければ空配列を返すだけなので、
 * 記事の書式が変わっても壊れません。
 */
export function extractFaq(content: string): { question: string; answer: string[] }[] {
  const lines = content.split('\n')
  const faq: { question: string; answer: string[] }[] = []

  let inFaqSection = false
  let current: { question: string; answer: string[] } | null = null

  const flush = () => {
    if (current && current.question && current.answer.length > 0) faq.push(current)
    current = null
  }

  for (const line of lines) {
    const h2 = /^##\s+(.+?)\s*$/.exec(line)
    if (h2) {
      flush()
      inFaqSection = /よくある(ご)?質問|Q&A|QA/.test(h2[1])
      continue
    }
    if (!inFaqSection) continue

    const h3 = /^###\s+(.+?)\s*$/.exec(line)
    if (h3) {
      flush()
      current = { question: h3[1].trim(), answer: [] }
      continue
    }

    const text = line.trim()
    if (!current || text.length === 0) continue
    // 箇条書きの記号や強調記号は構造化データに残さない
    current.answer.push(text.replace(/^[-*]\s+/, '').replace(/\*\*/g, ''))
  }
  flush()

  return faq
}
