import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { PhoneIcon } from '@/components/ui/Button'
import { footerCompanyNav, footerKnowledgeNav, footerServiceNav, type NavItem } from '@/data/nav'
import { site } from '@/data/site'

function FooterNav({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      {/* フッター内の見出し。本文が h2 までのページでも見出し階層が飛ばないよう h2 にしている */}
      <h2 className="text-xs font-bold tracking-[0.18em] text-sky">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-6 items-center text-sm text-white/85 transition-colors hover:text-white hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-deep text-white">
      <Container width="wide">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.1fr_2fr] lg:gap-16 lg:py-20">
          {/* NAP情報：サイト内で表記を統一 */}
          <div>
            <p className="text-2xl font-bold tracking-tight">{site.name}</p>
            <address className="mt-5 space-y-2 text-sm leading-7 text-white/85 not-italic">
              <span className="block">{site.representativeRole} {site.representative}</span>
              <span className="block">{site.address.full}</span>
              <a
                href={`tel:${site.tel.href}`}
                className="inline-flex min-h-11 items-center gap-2 text-lg font-bold tabular-nums text-white hover:text-sky"
              >
                <PhoneIcon />
                {site.tel.display}
              </a>
            </address>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-white/85 hover:text-white hover:underline"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.9-11.1a1.5 1.5 0 1 1-1.5-1.6 1.5 1.5 0 0 1 1.5 1.6Z" />
              </svg>
              Instagram {site.instagramHandle}
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <FooterNav title="エアコン工事" items={footerServiceNav} />
            <FooterNav title="知りたいことから探す" items={footerKnowledgeNav} />
            <FooterNav title="会社情報・採用" items={footerCompanyNav} />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>広島市西区己斐上を拠点に、エアコンの新設・交換・移設・取り外しを行っています。</p>
          <p>&copy; {year} {site.name}</p>
        </div>
      </Container>
    </footer>
  )
}
