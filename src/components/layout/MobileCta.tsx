import Link from 'next/link'
import { site } from '@/data/site'
import { PhoneIcon } from '@/components/ui/Button'

/**
 * スマートフォン専用の画面下部固定CTA。
 *
 * 本文・フッターを隠さないよう、body 側に
 * padding-bottom: var(--mobile-cta-height) を確保しています（layout.tsx）。
 * 工事の相談と採用応募を分けて表示し、電話の用件が分からなくならないようにしています。
 */
export function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/97 backdrop-blur-sm md:hidden">
      {/*
        ラベルは折り返さない（whitespace-nowrap）。
        折り返して高さが増えると、body の padding-bottom を超えてフッターを覆うため。
        用件の区別はラベルと aria-label の両方で示しています。
      */}
      <nav aria-label="お問い合わせ・応募" className="grid grid-cols-3">
        <a
          href={`tel:${site.tel.href}`}
          aria-label={`電話でエアコン工事について相談する ${site.tel.display}`}
          className="flex min-h-17 flex-col items-center justify-center gap-1 border-r border-line px-1 py-2 text-navy"
        >
          <PhoneIcon className="h-5 w-5" />
          <span className="text-[0.7rem] font-bold whitespace-nowrap">電話で相談</span>
        </a>
        <Link
          href="/contact"
          aria-label="エアコン工事についてフォームから問い合わせる"
          className="flex min-h-17 flex-col items-center justify-center gap-1 border-r border-line px-1 py-2 text-navy"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2.5" y="4" width="15" height="12" rx="1" />
            <path d="m3 5.5 7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[0.7rem] font-bold whitespace-nowrap">お問い合わせ</span>
        </Link>
        <Link
          href="/recruit"
          aria-label="エアコン工事スタッフの採用情報を見る"
          className="flex min-h-17 flex-col items-center justify-center gap-1 bg-navy px-1 py-2 text-white"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2.5" y="6" width="15" height="10" rx="1" />
            <path d="M7.5 6V4.5h5V6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[0.7rem] font-bold whitespace-nowrap">採用情報</span>
        </Link>
      </nav>
    </div>
  )
}
