import { ArrowRight, ButtonLink, PhoneIcon } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { DevImageHint, Photo } from '@/components/ui/Photo'
import { hasWorks } from '@/data/works'
import { images } from '@/data/images'
import { site } from '@/data/site'

/**
 * トップページのヒーロー。
 * 施工写真を全面に使い、その上に必要最低限のコピーと導線だけを置いています。
 * カードやパネルは重ねません。
 */
export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-white">
      {/* 背景：施工写真（未配置の場合は濃紺の面になります） */}
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
        {/* 文字の可読性を確保するための重ね */}
        <div className="absolute inset-0 bg-linear-to-b from-navy-deep/85 via-navy-deep/60 to-navy-deep/90 sm:bg-linear-to-r sm:from-navy-deep/92 sm:via-navy-deep/70 sm:to-navy-deep/25" />
      </div>

      <Container width="wide">
        <div className="flex min-h-[max(30rem,calc(100svh-5rem))] flex-col justify-end py-16 sm:min-h-[36rem] sm:justify-center sm:py-24 lg:min-h-[40rem]">
          <DevImageHint src={images.hero.src} label="ヒーロー" />

          {/* H1：対策キーワードの一文と、ブランドコピーの二段構成 */}
          <h1>
            <span className="eyebrow text-sky">広島のエアコン工事なら3Peace</span>
            <span className="mt-5 block text-[2rem] leading-[1.25] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              広島の暮らしに、
              <br />
              確かなエアコン工事を。
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-[0.95rem] leading-8 text-white/90 sm:text-base">
            エアコンの新設・交換・移設・取り外し。設置場所と配管経路を一件ずつ確認し、
            試運転と動作確認まで行ったうえで施工を完了します。
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/contact" variant="light" size="lg">
              工事の相談をする
              <ArrowRight />
            </ButtonLink>
            {hasWorks ? (
              <ButtonLink href="/works" variant="lightOutline" size="lg">
                施工事例を見る
                <ArrowRight />
              </ButtonLink>
            ) : (
              <ButtonLink href="/service" variant="lightOutline" size="lg">
                対応している工事を見る
                <ArrowRight />
              </ButtonLink>
            )}
            <ButtonLink href="/recruit" variant="ghost" size="lg" className="text-white hover:text-sky">
              採用情報を見る
              <ArrowRight />
            </ButtonLink>
          </div>

          <a
            href={`tel:${site.tel.href}`}
            className="mt-8 inline-flex min-h-11 w-fit items-center gap-3 border-t border-white/30 pt-5 text-white transition-colors hover:text-sky"
          >
            <PhoneIcon className="h-5 w-5" />
            <span className="text-2xl font-bold tabular-nums sm:text-3xl">{site.tel.display}</span>
            <span className="text-xs leading-tight text-white/75">
              工事のご相談
              <br />
              お電話でも受付
            </span>
          </a>
        </div>
      </Container>
    </section>
  )
}
