'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { mainNav } from '@/data/nav'
import { site } from '@/data/site'
import { PhoneIcon } from '@/components/ui/Button'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // スクロール量に応じて境界線と影を付ける
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // メニュー展開中は背景スクロールを停止し、Escape とフォーカストラップを有効にする
  useEffect(() => {
    if (!open) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    // パネル内の最初の要素へフォーカスを移す
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a[href], button')?.focus()
    }, 20)

    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(timer)
    }
  }, [open])

  const isCurrent = useCallback(
    (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)),
    [pathname],
  )

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow ${
        scrolled ? 'border-b border-line shadow-[0_1px_12px_rgba(16,28,40,0.06)]' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:h-20 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2"
          aria-label="3Peace ホームへ"
        >
          <span className="text-xl font-bold tracking-tight text-navy-deep lg:text-2xl">
            3Peace
          </span>
          <span className="hidden text-[0.65rem] leading-tight tracking-widest text-ink-soft sm:inline">
            広島のエアコン工事
          </span>
        </Link>

        {/* PC ナビ */}
        <nav aria-label="メインメニュー" className="hidden lg:block">
          <ul className="flex items-center gap-6 xl:gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className={`text-sm font-bold transition-colors hover:text-blue ${
                    isCurrent(item.href) ? 'text-blue' : 'text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* 電話：工事の相談窓口であることを明示する */}
          <a
            href={`tel:${site.tel.href}`}
            className="hidden items-center gap-2 border border-navy px-4 py-2.5 text-navy transition-colors hover:bg-navy hover:text-white lg:inline-flex"
          >
            <PhoneIcon />
            <span className="text-left leading-tight">
              <span className="block text-[0.6rem] tracking-wider">工事のご相談</span>
              <span className="block text-base font-bold tabular-nums">{site.tel.display}</span>
            </span>
          </a>

          {/* スマホ：電話アイコン */}
          <a
            href={`tel:${site.tel.href}`}
            className="inline-flex h-11 w-11 items-center justify-center border border-line text-navy lg:hidden"
            aria-label={`電話で相談する ${site.tel.display}`}
          >
            <PhoneIcon className="h-5 w-5" />
          </a>

          {/* スマホ：ハンバーガー */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center border border-line text-navy lg:hidden"
          >
            <span className="sr-only">{open ? 'メニューを閉じる' : 'メニューを開く'}</span>
            <span aria-hidden="true" className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform duration-200 ${
                  open ? 'top-1.75 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute top-1.75 left-0 block h-0.5 w-5 bg-current transition-opacity duration-200 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform duration-200 ${
                  open ? 'top-1.75 -rotate-45' : 'top-3.5'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* スマホメニュー */}
      {open ? (
        <div className="fixed inset-0 top-18 z-40 lg:hidden">
          <button
            type="button"
            aria-label="メニューを閉じる"
            className="absolute inset-0 bg-ink/30"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            id="mobile-menu"
            className="relative max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-white pb-10"
          >
            <nav aria-label="メインメニュー（モバイル）">
              <ul className="divide-y divide-line border-b border-line">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className="flex min-h-14 items-center justify-between px-5 text-base font-bold text-ink"
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-blue">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="px-5 pt-6">
              <a
                href={`tel:${site.tel.href}`}
                onClick={() => setOpen(false)}
                className="flex min-h-14 items-center justify-center gap-2 bg-navy px-4 text-white"
              >
                <PhoneIcon className="h-5 w-5" />
                <span className="text-lg font-bold tabular-nums">{site.tel.display}</span>
              </a>
              <p className="mt-2 text-xs text-ink-soft">
                工事のご相談・採用のご相談どちらも、この番号で受け付けています。お電話の際にご用件をお伝えください。
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
