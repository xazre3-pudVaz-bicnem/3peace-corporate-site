import type { Metadata } from 'next'
import { site } from '@/data/site'
import { publicFileExists } from '@/lib/images'

/**
 * 本番URLの解決。
 *
 * 優先順位
 *   1. NEXT_PUBLIC_SITE_URL         … 独自ドメインを使う場合はここに設定する
 *   2. VERCEL_PROJECT_PRODUCTION_URL … Vercel が本番デプロイに自動で渡すドメイン
 *   3. なし                          … canonical / sitemap を出さず robots は Disallow
 *
 * 2 のフォールバックがあるため、Vercel では環境変数を設定しなくても
 * 本番デプロイはインデックス可能な状態になる。プレビュー環境（VERCEL_ENV=preview）は
 * 常に 3 として扱い、プレビューURLが検索結果に出ないようにしている。
 *
 * 独自ドメインへ移行するときは NEXT_PUBLIC_SITE_URL を設定するだけで、
 * canonical・OG・sitemap・robots・JSON-LD・RSS のURLがすべて切り替わる。
 */
function resolveSiteUrl(): string | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit && /^https?:\/\//.test(explicit)) {
    return explicit.replace(/\/+$/, '')
  }

  const vercelEnv = process.env.VERCEL_ENV
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercelEnv === 'production' && productionHost) {
    return `https://${productionHost.replace(/\/+$/, '')}`
  }

  return undefined
}

export const SITE_URL: string | undefined = resolveSiteUrl()
export const hasSiteUrl = Boolean(SITE_URL)

if (!SITE_URL && process.env.NODE_ENV === 'production') {
  console.warn(
    '\n[3Peace] サイトURLを解決できませんでした。canonical / OG / sitemap を出力せず、robots.txt は全ページ Disallow になります。\n' +
      '独自ドメインを使う場合は NEXT_PUBLIC_SITE_URL を設定してください。\n',
  )
}

export function absoluteUrl(path = '/'): string | undefined {
  if (!SITE_URL) return undefined
  return `${SITE_URL}${path === '/' ? '' : path}`
}

/** ブランド名。title のテンプレートとサイト名表記で共用する */
export const BRAND = site.name

/** トップページの title（テンプレートは適用されないため完全形で持つ） */
export const HOME_TITLE = '広島のエアコン工事・取り付けなら3Peace｜広島市西区'

/** OG の siteName / WebSite スキーマの name に使う */
export const SITE_NAME = site.name

type BuildMetadataInput = {
  /**
   * ページ固有の見出し。末尾に「｜3Peace」を自分で付けないこと
   * （layout の title.template が自動で付与する）。
   */
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
  /**
   * true にすると title.template を適用せず、title をそのまま出力する。
   * トップページのように完全形のタイトルを使う場合に指定する。
   */
  absoluteTitle?: boolean
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
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(path)
  // 指定された画像が未配置ならサイト共通のOG画像へ。それも無ければ画像を出力しない
  const ogImage = image && publicFileExists(image) ? image : site.ogImagePath
  const ogImageUrl = publicFileExists(ogImage) ? absoluteUrl(ogImage) : undefined

  // OG / X 用のタイトルは、テンプレート適用後の見え方に合わせる
  const socialTitle = absoluteTitle ? title : `${title}｜${BRAND}`

  const metadata: Metadata = {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    openGraph: {
      title: socialTitle,
      description,
      siteName: SITE_NAME,
      locale: 'ja_JP',
      type,
      ...(canonical ? { url: canonical } : {}),
      ...(ogImageUrl
        ? { images: [{ url: ogImageUrl, width: 1200, height: 630, alt: socialTitle }] }
        : {}),
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
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
