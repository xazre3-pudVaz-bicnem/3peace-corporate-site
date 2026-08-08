import Link from 'next/link'
import { ArrowRight } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

export type RelatedLink = {
  href: string
  /** リンク先の内容が分かるアンカーテキスト。「詳しくはこちら」は使わない */
  label: string
  /** 補足説明（1行） */
  description?: string
}

type Props = {
  /** 省略すると見出しを描画しない（親側で見出しを付けている場合に使う） */
  title?: string
  /** 見出しのid（aria-labelledby用） */
  id: string
  links: RelatedLink[]
  lead?: string
  columns?: 1 | 2
}

/**
 * 関連リンクのブロック。
 *
 * アンカーテキストにはリンク先の内容が分かる文言を使います
 *（「詳しくはこちら」のような、リンク先が分からない文言は使いません）。
 */
export function RelatedLinks({ title, id, links, lead, columns = 2 }: Props) {
  if (links.length === 0) return null

  return (
    <div>
      {title ? (
        <h2 id={id} className="text-lg font-bold text-ink">
          {title}
        </h2>
      ) : null}
      {lead ? <p className="mt-3 text-[0.9rem] leading-7 text-ink-soft">{lead}</p> : null}
      <ul
        className={`grid gap-px border-t border-line-strong bg-line ${title || lead ? 'mt-6' : ''} ${
          columns === 2 ? 'sm:grid-cols-2' : ''
        }`}
      >
        {links.map((link, index) => (
          <li key={link.href + link.label} className="bg-white">
            <Reveal delay={index * 40}>
              <Link
                href={link.href}
                className="group flex h-full min-h-14 items-start justify-between gap-4 border-b border-line py-4 transition-colors hover:text-blue sm:px-2"
              >
                <span>
                  <span className="block text-[0.95rem] font-bold text-ink group-hover:text-blue">
                    {link.label}
                  </span>
                  {link.description ? (
                    <span className="mt-1 block text-[0.85rem] leading-6 text-ink-soft">
                      {link.description}
                    </span>
                  ) : null}
                </span>
                <ArrowRight className="mt-1 shrink-0 text-blue transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}
