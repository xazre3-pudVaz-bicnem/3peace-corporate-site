import { visibleCompanyRows } from '@/data/site'

/**
 * 会社概要テーブル。
 * 値が未入力の行は data/site.ts の時点で除外されているため、
 * 「未定」「準備中」などの空行が画面に出ることはありません。
 */
export function CompanyTable() {
  return (
    <dl className="border-t border-line">
      {visibleCompanyRows.map((row) => (
        <div
          key={row.label}
          className="grid gap-1 border-b border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-6 sm:py-5"
        >
          <dt className="text-sm font-bold text-ink-soft">{row.label}</dt>
          <dd className="text-[0.95rem] leading-7 text-ink">
            {row.href ? (
              <a
                href={row.href}
                className="link-underline inline-flex min-h-6 items-center"
                {...(row.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
