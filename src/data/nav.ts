import { hasNews } from '@/data/news'
import { hasWorks } from '@/data/works'
import { hasColumns } from '@/data/columns'
import { publishedServices } from '@/data/services'
import { indexableAreas } from '@/data/areas'

/**
 * ブログ（自動投稿）のリンクを出すかどうか。
 *
 * 記事の有無は content/blog をファイルシステムで読むため（@/lib/blog）、
 * このファイルを読み込むクライアントコンポーネント（Header）では判定できません。
 * 記事は毎日追加されていくので固定で true にしています。
 * ブログを一時的に止めたい場合はここを false にしてください
 *（/blog 自体は記事0件でも「準備中」として表示されます）。
 */
const hasBlog = true

export type NavItem = {
  label: string
  href: string
  /** フッターなどで使う補足（リンク先の内容が分かる説明） */
  description?: string
}

/** ヘッダーのグローバルナビ（データが0件のページは自動的に出さない） */
export const mainNav: NavItem[] = [
  { label: 'エアコン工事', href: '/service' },
  ...(hasWorks ? [{ label: '施工事例', href: '/works' }] : []),
  ...(hasColumns ? [{ label: '専門コラム', href: '/column' }] : []),
  ...(hasBlog ? [{ label: 'ブログ', href: '/blog' }] : []),
  { label: '3Peaceについて', href: '/about' },
  { label: 'よくある質問', href: '/faq' },
  { label: '採用情報', href: '/recruit' },
  { label: 'お問い合わせ', href: '/contact' },
]

/** フッター：エアコン工事（工事の種類ごと） */
export const footerServiceNav: NavItem[] = [
  { label: 'エアコン工事', href: '/service' },
  ...publishedServices.map((service) => ({
    label: service.shortTitle,
    href: `/service/${service.slug}`,
  })),
  ...(hasWorks ? [{ label: '施工事例', href: '/works' }] : []),
]

/** フッター：知りたいことから探す */
export const footerKnowledgeNav: NavItem[] = [
  ...(hasColumns ? [{ label: '専門コラム', href: '/column' }] : []),
  ...(hasBlog ? [{ label: 'ブログ', href: '/blog' }] : []),
  { label: 'よくある質問', href: '/faq' },
  ...indexableAreas.map((area) => ({
    label: `${area.name}のエアコン工事`,
    href: `/area/${area.slug}`,
  })),
  { label: 'お問い合わせ', href: '/contact' },
]

/** フッター：会社情報 */
export const footerCompanyNav: NavItem[] = [
  { label: '3Peaceについて', href: '/about' },
  { label: '代表挨拶', href: '/message' },
  ...(hasNews ? [{ label: 'お知らせ', href: '/news' }] : []),
  { label: '採用情報', href: '/recruit' },
  { label: 'プライバシーポリシー', href: '/privacy' },
]
