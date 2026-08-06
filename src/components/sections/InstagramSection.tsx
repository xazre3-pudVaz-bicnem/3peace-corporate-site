import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import { instagramThumbs } from '@/data/instagram'
import { filterExistingImages } from '@/lib/images'
import { site } from '@/data/site'

/**
 * Instagram 導線。
 * 埋め込みスクリプトは使わず、配置済みの静的画像のみを最大6枚表示します。
 * 画像が1枚も無い場合はリンクだけを表示します。
 */
export function InstagramSection() {
  const thumbs = filterExistingImages(instagramThumbs).slice(0, 6)

  return (
    <Section tone="mist" space="normal" divided>
      <SectionHeading
        eyebrow="Instagram"
        title="現場の様子を発信しています"
        lead="施工中の様子や、実際に手を動かしている現場の写真を Instagram に掲載しています。どんな会社が来るのかを知りたい方、仕事の内容を見てみたい方はご覧ください。"
      />

      {thumbs.length > 0 ? (
        <Reveal delay={80} className="mt-10">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {thumbs.map((thumb) => (
              <li key={thumb.src} className="relative aspect-square overflow-hidden bg-sky-soft">
                <Photo
                  src={thumb.src}
                  alt={thumb.alt}
                  fill
                  sizes="(min-width: 640px) 30vw, 45vw"
                  fallback="hide"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}

      <Reveal delay={120} className="mt-10">
        <ButtonLink href={site.instagram} variant="outline" external>
          Instagram を見る（{site.instagramHandle}）
          <ArrowRight />
        </ButtonLink>
      </Reveal>
    </Section>
  )
}
