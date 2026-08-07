import { Container } from '@/components/ui/Container'
import { DevImageHint, Photo } from '@/components/ui/Photo'
import { images } from '@/data/images'

/**
 * トップページのヒーロー。
 *
 * 施工写真を1枚だけ全面に使い、重ねるのは H1 のみです。
 * 補足文・CTAボタン・電話番号は置かず、写真を主役にしています。
 * （工事・採用への導線はヘッダー、スマホ下部の固定CTA、下のセクションにあります）
 *
 * 高さはヘッダーとスマホ固定CTAの分を差し引いています。差し引かないと、
 * 画面下部に置いた見出しが固定CTAに隠れます（--mobile-cta-height は md 以上で 0）。
 */
export function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[max(26rem,calc(100svh-4.5rem-var(--mobile-cta-height)))] items-end overflow-hidden bg-navy-deep text-white sm:min-h-[34rem] lg:min-h-[calc(100svh-5rem)]">
      {/* 背景：施工写真を全面に表示（未配置の場合は濃紺の面になります） */}
      <div className="absolute inset-0 -z-10">
        <Photo
          src={images.hero.src}
          alt=""
          fill
          sizes="100vw"
          priority
          fallback="hide"
          className="object-cover"
        />
        {/*
          見出しの可読性を確保するための重ね。写真をできるだけそのまま見せるため、
          全面を均一に暗くせず、文字が乗る「下側」と「左側」に集中させている。
          （数値は実測でコントラスト比を確認済み。薄くしすぎると見出しが読めなくなる）
        */}
        <div className="absolute inset-0 bg-linear-to-t from-navy-deep/90 via-navy-deep/46 via-46% to-transparent to-76%" />
        <div className="absolute inset-0 hidden sm:block sm:bg-linear-to-r sm:from-navy-deep/70 sm:via-navy-deep/22 sm:via-45% sm:to-transparent sm:to-68%" />
      </div>

      <Container width="wide">
        <div className="pb-14 sm:pb-20 lg:pb-24">
          <DevImageHint src={images.hero.src} label="ヒーロー" />

          {/* H1：対策キーワードの一文と、ブランドコピーの二段構成 */}
          <h1>
            {/* 写真の上では水色より白のほうがコントラストを確保しやすい */}
            <span className="eyebrow text-white">広島のエアコン工事なら3Peace</span>
            <span className="mt-5 block text-[2rem] leading-[1.25] font-bold tracking-tight drop-shadow-[0_2px_12px_rgba(7,40,74,0.5)] sm:text-5xl lg:text-6xl">
              広島の暮らしに、
              <br />
              確かなエアコン工事を。
            </span>
          </h1>
        </div>
      </Container>
    </section>
  )
}
