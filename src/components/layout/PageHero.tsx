import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { DevImageHint, Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'

type Props = {
  /** 英字ラベル（装飾） */
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  /** 背景写真（未配置の場合は濃紺の面のみになります） */
  image?: { src: string; alt: string }
  children?: ReactNode
}

/**
 * 下層ページの見出し。
 * H1 はここに置き、各ページで重複しないようにしています。
 */
export function PageHero({ eyebrow, title, lead, image, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-white">
      {image ? (
        <div className="absolute inset-0 -z-10">
          <Photo
            src={image.src}
            alt=""
            fill
            sizes="100vw"
            priority
            fallback="hide"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-linear-to-r from-navy-deep via-navy-deep/85 to-navy-deep/45" />
        </div>
      ) : null}

      <Container width="wide">
        <div className="py-14 sm:py-20 lg:py-24">
          <Reveal>
            {image ? <DevImageHint src={image.src} label="ページ見出し" /> : null}
            <p className="eyebrow text-sky">{eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-[1.75rem] leading-tight font-bold sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h1>
            {lead ? (
              <div className="mt-6 max-w-2xl text-[0.95rem] leading-8 text-white/85">{lead}</div>
            ) : null}
            {children ? <div className="mt-8">{children}</div> : null}
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
