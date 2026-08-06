import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { mainNav } from '@/data/nav'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ページが見つかりません',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <Container width="narrow">
      <div className="py-24 sm:py-32">
        <p className="font-mono text-sm font-bold text-blue">404</p>
        <h1 className="mt-4 text-2xl leading-snug font-bold text-ink sm:text-3xl">
          お探しのページが見つかりませんでした
        </h1>
        <p className="mt-5 text-[0.95rem] leading-8 text-ink-soft">
          ページのURLが変更されたか、削除された可能性があります。
          お手数ですが、下記のリンクからお探しください。
        </p>

        <ul className="mt-10 border-t border-line">
          {mainNav.map((item) => (
            <li key={item.href} className="border-b border-line">
              <Link
                href={item.href}
                className="flex min-h-14 items-center justify-between gap-4 py-4 text-[0.95rem] font-bold text-ink transition-colors hover:text-blue"
              >
                {item.label}
                <ArrowRight className="text-blue" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <ButtonLink href="/">
            トップページへ戻る
            <ArrowRight />
          </ButtonLink>
        </div>
      </div>
    </Container>
  )
}
