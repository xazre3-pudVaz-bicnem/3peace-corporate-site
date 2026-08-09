import type { ReactNode } from 'react'
import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Reveal } from '@/components/ui/Reveal'

/**
 * Markdown 記事（content/blog）の本文描画。
 *
 * 手書きコラム（ColumnBody）と見た目を揃えています。
 * 見出しには目次から飛べるように id を振ります。
 */

/** 本文中の H2 見出しを上から順に取り出す（コードブロック内は対象外） */
export function extractHeadings(markdown: string): { text: string; id: string }[] {
  const headings: { text: string; id: string }[] = []
  let inFence = false
  let index = 0

  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^##\s+(.+?)\s*$/.exec(line)
    if (!match) continue
    index += 1
    headings.push({ text: match[1].trim(), id: `section-${index}` })
  }

  return headings
}

/**
 * 目次に載せない見出し。
 * 記事末尾の関連リンクや問い合わせ導線は本文ではないため、目次からは外します
 *（見出し自体の id は残るのでアンカーは有効です）。
 */
const TOC_EXCLUDE = /^(あわせて|関連|エアコン工事のご相談|お問い合わせ|ご相談)/

export function tocHeadings(headings: { text: string; id: string }[]) {
  return headings.filter((heading) => !TOC_EXCLUDE.test(heading.text))
}

function toText(children: ReactNode): string {
  if (children === null || children === undefined || typeof children === 'boolean') return ''
  if (typeof children === 'string' || typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(toText).join('')
  if (typeof children === 'object' && 'props' in children) {
    const props = (children as { props?: { children?: ReactNode } }).props
    return toText(props?.children)
  }
  return ''
}

/** 記事の目次 */
export function MarkdownToc({ headings }: { headings: { text: string; id: string }[] }) {
  if (headings.length < 2) return null

  return (
    <nav aria-labelledby="toc-heading" className="border border-line bg-mist p-6 sm:p-7">
      <h2 id="toc-heading" className="text-sm font-bold text-ink">
        この記事の内容
      </h2>
      <ol className="mt-4 space-y-2.5">
        {headings.map((heading, index) => (
          <li key={heading.id} className="flex gap-3 text-[0.9rem] leading-6">
            <span aria-hidden="true" className="font-mono text-xs text-blue tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <a href={`#${heading.id}`} className="link-underline">
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function MarkdownBody({ content }: { content: string }) {
  const headings = extractHeadings(content)

  // 同じ文言の見出しが複数あっても id が重複しないよう、出てきた順に消費する
  const queue = new Map<string, string[]>()
  for (const heading of headings) {
    const list = queue.get(heading.text) ?? []
    list.push(heading.id)
    queue.set(heading.text, list)
  }
  const takeId = (text: string) => queue.get(text)?.shift()

  return (
    <div className="markdown-body">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-14 border-l-4 border-blue pl-4 text-xl leading-snug font-bold text-ink sm:text-2xl">
              {children}
            </h2>
          ),
          h2: ({ children }) => {
            const id = takeId(toText(children))
            return (
              <Reveal>
                <h2
                  id={id}
                  className="mt-14 scroll-mt-24 border-l-4 border-blue pl-4 text-xl leading-snug font-bold text-ink first:mt-0 sm:text-2xl"
                >
                  {children}
                </h2>
              </Reveal>
            )
          },
          h3: ({ children }) => (
            <h3 className="mt-10 text-lg leading-snug font-bold text-ink">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-8 text-base leading-snug font-bold text-ink">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="mt-5 text-[0.975rem] leading-9 text-ink-soft">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mt-5 space-y-2 border-l-2 border-line-strong pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-5 list-decimal space-y-2 pl-6 marker:text-blue">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[0.95rem] leading-8 text-ink-soft">{children}</li>
          ),
          strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-4 border-line-strong bg-mist px-5 py-4 text-[0.925rem] leading-8 text-ink-soft">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="mt-12 border-line" />,
          table: ({ children }) => (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left text-[0.9rem]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-line bg-mist px-4 py-3 font-bold text-ink">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-line px-4 py-3 leading-7 text-ink-soft">{children}</td>
          ),
          a: ({ href, children }) => {
            const url = href ?? '#'
            if (url.startsWith('/')) {
              return (
                <Link href={url} className="link-underline font-bold text-blue">
                  {children}
                </Link>
              )
            }
            if (url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('#')) {
              return (
                <a href={url} className="link-underline font-bold text-blue">
                  {children}
                </a>
              )
            }
            return (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline font-bold text-blue"
              >
                {children}
              </a>
            )
          },
          img: () => null,
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
