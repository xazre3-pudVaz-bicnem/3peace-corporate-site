import type { Metadata } from 'next'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Photo } from '@/components/ui/Photo'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'

import { message } from '@/data/about'
import { site } from '@/data/site'
import { publicFileExists } from '@/lib/images'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: '代表挨拶｜広島のエアコン工事 3Peace',
  description:
    '3Peace代表 面出洋平からのご挨拶です。一件の工事を確かなものにするという考え方と、一緒に働く仲間が成長できる会社を目指す姿勢についてお伝えします。',
  path: '/message',
})

const crumbs = [{ name: '代表挨拶', path: '/message' }]

export default function MessagePage() {
  const hasPortrait = publicFileExists(message.image.src)

  return (
    <>
      <PageHero
        eyebrow="Message"
        title={message.heading}
        lead="代表 面出洋平からのご挨拶です。"
      />
      <Breadcrumbs items={crumbs} />

      <Section width={hasPortrait ? 'default' : 'narrow'} aria-labelledby="message-heading">
        <h2 id="message-heading" className="sr-only">
          代表挨拶
        </h2>
        <div
          className={
            hasPortrait ? 'grid gap-12 lg:grid-cols-[1fr_minmax(0,20rem)] lg:gap-16' : ''
          }
        >
          <Reveal className="space-y-6 text-[0.975rem] leading-9 text-ink-soft">
            {message.paragraphs.map((paragraph, index) => (
              <p key={index} className={index === 0 ? 'text-lg leading-9 text-ink' : undefined}>
                {paragraph}
              </p>
            ))}

            <div className="border-t border-line pt-8">
              <p className="text-sm text-ink-soft">{message.signatureRole}</p>
              <p className="mt-1 text-xl font-bold text-ink">{message.signatureName}</p>
            </div>
          </Reveal>

          {hasPortrait ? (
            <Reveal delay={100} className="lg:sticky lg:top-28 lg:self-start">
              <div className="relative aspect-3/4 overflow-hidden bg-sky-soft">
                <Photo
                  src={message.image.src}
                  alt={message.image.alt}
                  fill
                  sizes="(min-width: 1024px) 20rem, 90vw"
                  fallback="hide"
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </Section>

      <Section tone="mist" divided width="narrow" aria-labelledby="message-links-heading">
        <h2 id="message-links-heading" className="text-lg font-bold text-ink">
          あわせてご覧ください
        </h2>
        <Reveal delay={60} className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/about" variant="outline">
            3Peaceについて
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/recruit" variant="outline">
            採用情報
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href={site.instagram} variant="ghost" external>
            Instagram
            <ArrowRight />
          </ButtonLink>
        </Reveal>
      </Section>

      <ContactCta />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
    </>
  )
}
