import type { Metadata } from 'next'
import { site } from '@/data/site'
import { publicFileExists } from '@/lib/images'

/**
 * 本番URL。未設定の場合は canonical / OG / sitemap を出力しません。
 * （Vercel のプレビューURLや localhost が canonical に出力されるのを防ぐため）
 */
const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
export const SITE_URL: string | undefined =
  raw && /^https?:\/\//.test(raw) ? raw.replace(/\/+$/, '') : undefined

export const hasSiteUrl = Boolean(SITE_URL)

if (!SITE_URL && process.env.NODE_ENV === 'production') {
  // 本番ビルド時に気づけるよう警告を出す
  console.warn(
    '\n[3Peace] NEXT_PUBLIC_SITE_URL が未設定です。canonical / OG / sitemap を出力せず、robots.txt は全ページ Disallow になります。公開前に必ず設定してください。\n',
  )
}

export function absoluteUrl(path = '/'): string | undefined {
  if (!SITE_URL) return undefined
  return `${SITE_URL}${path === '/' ? '' : path}`
}

export const SITE_NAME = `${site.name}｜広島のエアコン工事`

type BuildMetadataInput = {
  title: string
  description: string
  /** サイトルートからのパス（例: '/service'） */
  path: string
  /** OG画像のパス（public 配下。省略時はサイト共通のOG画像） */
  image?: string
  /** 検索結果に出したくないページで true */
  noindex?: boolean
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  noindex,
  type = 'website',
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(path)
  // 指定された画像が未配置ならサイト共通のOG画像へ。それも無ければ画像を出力しない
  const ogImage = image && publicFileExists(image) ? image : site.ogImagePath
  const ogImageUrl = publicFileExists(ogImage) ? absoluteUrl(ogImage) : undefined

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale: 'ja_JP',
      type,
      ...(canonical ? { url: canonical } : {}),
      ...(ogImageUrl
        ? { images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] }
        : {}),
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  }

  if (canonical) {
    metadata.alternates = { canonical }
  }

  if (noindex || !SITE_URL) {
    metadata.robots = { index: false, follow: true }
  }

  return metadata
}

/** ページタイトルの組み立て（layout の template と併用しないよう absolute 指定で使う） */
export function pageTitle(main: string): string {
  return `${main}｜${site.name}`
}
