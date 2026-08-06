import { hasNews } from '@/data/news'
import { hasWorks } from '@/data/works'

export type NavItem = { label: string; href: string }

/** ヘッダーのグローバルナビ（データが0件のページは自動的に出さない） */
export const mainNav: NavItem[] = [
  { label: '3Peaceについて', href: '/about' },
  { label: '業務案内', href: '/service' },
  ...(hasWorks ? [{ label: '施工事例', href: '/works' }] : []),
  { label: '採用情報', href: '/recruit' },
  { label: 'よくある質問', href: '/faq' },
  { label: 'お問い合わせ', href: '/contact' },
]

/** フッター：工事をご検討の方向け */
export const footerServiceNav: NavItem[] = [
  { label: '業務案内', href: '/service' },
  ...(hasWorks ? [{ label: '施工事例', href: '/works' }] : []),
  { label: 'よくある質問', href: '/faq' },
  { label: 'お問い合わせ', href: '/contact' },
]

/** フッター：会社情報 */
export const footerCompanyNav: NavItem[] = [
  { label: '3Peaceについて', href: '/about' },
  { label: '代表挨拶', href: '/message' },
  ...(hasNews ? [{ label: 'お知らせ', href: '/news' }] : []),
  { label: 'プライバシーポリシー', href: '/privacy' },
]

/** フッター：採用情報 */
export const footerRecruitNav: NavItem[] = [
  { label: '採用情報', href: '/recruit' },
  { label: '仕事内容', href: '/recruit#job-nature' },
  { label: '募集職種', href: '/recruit#jobs' },
  { label: '採用FAQ', href: '/faq#recruit' },
]
