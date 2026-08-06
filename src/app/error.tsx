'use client'

import { useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { ArrowRight, ButtonLink, PhoneIcon } from '@/components/ui/Button'
import { site } from '@/data/site'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 入力内容などが混入しないよう、識別子のみを記録する
    console.error(`[error] ${error.digest ?? 'unknown'}`)
  }, [error])

  return (
    <Container width="narrow">
      <div className="py-24 sm:py-32">
        <p className="font-mono text-sm font-bold text-blue">Error</p>
        <h1 className="mt-4 text-2xl leading-snug font-bold text-ink sm:text-3xl">
          ページの表示中に問題が発生しました
        </h1>
        <p className="mt-5 text-[0.95rem] leading-8 text-ink-soft">
          お手数ですが、しばらく時間をおいてから再度お試しください。
          お急ぎの場合は、お電話でもご相談を受け付けています。
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-navy px-6 py-3 text-[0.95rem] font-bold text-white transition-colors hover:bg-blue"
          >
            もう一度読み込む
          </button>
          <ButtonLink href="/" variant="outline">
            トップページへ戻る
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href={`tel:${site.tel.href}`} variant="ghost">
            <PhoneIcon />
            {site.tel.display}
          </ButtonLink>
        </div>
      </div>
    </Container>
  )
}
