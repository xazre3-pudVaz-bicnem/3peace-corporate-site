import Link from 'next/link'
import { ArrowRight, ButtonLink, PhoneIcon } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/data/site'

type Props = {
  /** 見出しを差し替えたい場合 */
  heading?: string
  lead?: string
  className?: string
}

/**
 * 工事のご依頼向けCTA。
 * 採用の導線とは文言を明確に分けています。
 */
export function ContactCta({
  heading = 'エアコン工事のご相談を受け付けています',
  lead = '設置場所の状況によって必要な工事が変わります。「取り付けられるか分からない」という段階でもご相談ください。現場の状況を確認したうえでご案内します。',
  className = '',
}: Props) {
  return (
    <section aria-labelledby="contact-cta-heading" className={`bg-navy-deep text-white ${className}`}>
      <Container>
        <div className="py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow text-sky">Contact</p>
            <h2 id="contact-cta-heading" className="mt-4 text-2xl leading-snug sm:text-3xl">
              {heading}
            </h2>
            <p className="mt-5 max-w-2xl text-[0.95rem] leading-8 text-white/85">{lead}</p>
          </Reveal>

          <Reveal delay={80} className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
              <ButtonLink href="/contact" variant="light" size="lg" className="sm:flex-1">
                エアコン工事について相談する
                <ArrowRight />
              </ButtonLink>
              <a
                href={`tel:${site.tel.href}`}
                className="flex min-h-13 flex-col items-center justify-center border border-white/60 px-6 py-3 text-white transition-colors hover:bg-white hover:text-navy sm:flex-1"
              >
                <span className="flex items-center gap-2 text-xl font-bold tabular-nums">
                  <PhoneIcon className="h-5 w-5" />
                  {site.tel.display}
                </span>
                <span className="mt-0.5 text-xs opacity-85">工事のご相談はこちらへ</span>
              </a>
            </div>
            <p className="mt-5 text-xs leading-6 text-white/70">
              採用に関するお問い合わせも同じ番号で受け付けています。お電話の際に「採用について」とお伝えください。
              採用情報は
              <Link href="/recruit" className="mx-1 underline underline-offset-4 hover:text-white">
                採用ページ
              </Link>
              をご覧ください。
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
