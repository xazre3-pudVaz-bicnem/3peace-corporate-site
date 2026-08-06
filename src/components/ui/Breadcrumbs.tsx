import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import type { Crumb } from '@/lib/schema'

type Props = {
  /** ホームを除いた階層（ホームは自動で先頭に付きます） */
  items: Crumb[]
}

export function Breadcrumbs({ items }: Props) {
  const crumbs: Crumb[] = [{ name: 'ホーム', path: '/' }, ...items]

  return (
    <nav aria-label="パンくずリスト" className="border-b border-line bg-white">
      <Container width="wide">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 py-3 text-xs text-ink-soft">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-ink">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className="hover:text-blue hover:underline">
                      {crumb.name}
                    </Link>
                    <span aria-hidden="true" className="text-line-strong">
                      /
                    </span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </Container>
    </nav>
  )
}
