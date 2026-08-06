import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/layout/PageHero'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Section, SectionHeading } from '@/components/ui/Section'
import { ArrowRight, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Photo } from '@/components/ui/Photo'
import { JsonLd } from '@/components/ui/JsonLd'
import { ContactCta } from '@/components/sections/ContactCta'

import { publishedWorks, workFilters, hasWorks } from '@/data/works'
import { publishedServices } from '@/data/services'
import { images } from '@/data/images'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = buildMetadata({
  title: '広島のエアコン工事施工事例｜3Peace',
  description:
    '3Peaceが広島市で行ったエアコン工事の施工事例です。工事種別・建物種別・エリアごとに、設置前の状況、施工内容、施工時のポイントを掲載しています。',
  path: '/works',
  // 事例が0件のあいだは内容の薄いページになるため検索結果に出さない
  noindex: !hasWorks,
})

const crumbs = [{ name: '施工事例', path: '/works' }]

type SearchParams = Promise<{ category?: string; building?: string; area?: string }>

/** 絞り込みチップ。候補が1つ以下のときは表示しない（空のUIを出さないため） */
function FilterGroup({
  label,
  param,
  options,
  current,
  base,
}: {
  label: string
  param: string
  options: string[]
  current?: string
  base: Record<string, string | undefined>
}) {
  if (options.length < 2) return null

  const buildHref = (value?: string) => {
    const next = { ...base, [param]: value }
    const query = Object.entries(next)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join('&')
    return query ? `/works?${query}` : '/works'
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-line py-4">
      <p className="w-20 shrink-0 text-xs font-bold text-ink-soft">{label}</p>
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href={buildHref(undefined)}
            aria-current={!current ? 'true' : undefined}
            className={`inline-flex min-h-9 items-center border px-3 text-sm transition-colors ${
              !current ? 'border-navy bg-navy text-white' : 'border-line-strong text-ink hover:border-blue hover:text-blue'
            }`}
          >
            すべて
          </Link>
        </li>
        {options.map((option) => (
          <li key={option}>
            <Link
              href={buildHref(option)}
              aria-current={current === option ? 'true' : undefined}
              className={`inline-flex min-h-9 items-center border px-3 text-sm transition-colors ${
                current === option
                  ? 'border-navy bg-navy text-white'
                  : 'border-line-strong text-ink hover:border-blue hover:text-blue'
              }`}
            >
              {option}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function WorksPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, building, area } = await searchParams

  const filtered = publishedWorks.filter(
    (work) =>
      (!category || work.category === category) &&
      (!building || work.buildingType === building) &&
      (!area || work.area === area),
  )

  const base = { category, building, area }

  return (
    <>
      <PageHero
        eyebrow="Works"
        title="広島のエアコン工事 施工事例"
        lead="実際に行った工事の内容を掲載しています。設置場所の条件、施工内容、施工時に確認したポイントをご覧いただけます。"
        image={{ src: images.works.hero.src, alt: '' }}
      />
      <Breadcrumbs items={crumbs} />

      {hasWorks ? (
        <Section aria-labelledby="works-list-heading">
          <SectionHeading
            eyebrow="Case"
            id="works-list-heading"
            title="施工事例一覧"
            lead="工事種別・建物種別・エリアで絞り込めます。"
          />

          <Reveal delay={60} className="mt-10 border-t border-line-strong">
            <FilterGroup
              label="工事種別"
              param="category"
              options={workFilters.categories}
              current={category}
              base={base}
            />
            <FilterGroup
              label="建物種別"
              param="building"
              options={workFilters.buildingTypes}
              current={building}
              base={base}
            />
            <FilterGroup
              label="エリア"
              param="area"
              options={workFilters.areas}
              current={area}
              base={base}
            />
          </Reveal>

          {filtered.length > 0 ? (
            <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((work, index) => (
                <li key={work.slug}>
                  <Reveal delay={index * 50}>
                    <Link href={`/works/${work.slug}`} className="group block">
                      <div className="relative aspect-4/3 overflow-hidden bg-sky-soft">
                        {work.images[0] ? (
                          <Photo
                            src={work.images[0].src}
                            alt={work.images[0].alt}
                            fill
                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                            fallback="hide"
                            className="transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
                        <span className="bg-navy px-2 py-1 font-bold text-white">
                          {work.category}
                        </span>
                        <span>{work.area}</span>
                        {work.buildingType ? <span>{work.buildingType}</span> : null}
                      </p>
                      <h3 className="mt-3 text-base font-bold text-ink group-hover:text-blue">
                        {work.title}
                      </h3>
                      <p className="mt-2 text-[0.875rem] leading-7 text-ink-soft">{work.summary}</p>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-12 border border-line bg-mist px-6 py-10 text-center text-[0.95rem] text-ink-soft">
              選択した条件に一致する施工事例はありませんでした。
              <Link href="/works" className="link-underline ml-1">
                条件を解除する
              </Link>
            </p>
          )}
        </Section>
      ) : (
        // 事例が未登録の状態でも、対応内容が分かるページとして機能させる
        <Section width="narrow" aria-labelledby="works-empty-heading">
          <SectionHeading
            eyebrow="Case"
            id="works-empty-heading"
            title="施工事例は準備中です"
            lead="掲載の許可をいただいた工事から順に、施工内容と写真を掲載していきます。"
          />
          <Reveal delay={60} className="mt-8 space-y-5 text-[0.95rem] leading-8 text-ink-soft">
            <p>
              現場の様子は Instagram でも発信しています。実際にどのような工事を行っているかは、
              そちらもあわせてご覧ください。
            </p>
            <p>対応している工事の内容は、業務案内ページに詳しく掲載しています。</p>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <ul className="border-t border-line">
              {publishedServices.map((service) => (
                <li key={service.slug} className="border-b border-line">
                  <Link
                    href={`/service/${service.slug}`}
                    className="flex min-h-14 items-center justify-between gap-4 py-4 text-[0.95rem] font-bold text-ink transition-colors hover:text-blue"
                  >
                    {service.title}
                    <ArrowRight className="text-blue" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140} className="mt-10">
            <ButtonLink href="/service" variant="outline">
              業務案内を見る
              <ArrowRight />
            </ButtonLink>
          </Reveal>
        </Section>
      )}

      <ContactCta />

      <JsonLd data={breadcrumbSchema([{ name: 'ホーム', path: '/' }, ...crumbs])} />
    </>
  )
}
