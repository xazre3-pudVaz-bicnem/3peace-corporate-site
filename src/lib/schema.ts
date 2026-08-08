import { site, hasValue } from '@/data/site'
import { indexableAreas } from '@/data/areas'
import { publicFileExists } from '@/lib/images'
import { absoluteUrl } from '@/lib/seo'

/**
 * JSON-LD 生成。
 *
 * 【原則】画面に表示していない情報、確認できていない情報は出力しないこと。
 * 具体的には、営業時間（openingHours）・価格帯（priceRange）・評価
 * （aggregateRating）・口コミ件数（review）・緯度経度（geo）・設立日
 * （foundingDate）・従業員数（numberOfEmployees）・資格（hasCredential）は
 * いずれも確認できていないため出力していません。
 *
 * 定休日が「不定休」で曜日を特定できないため、営業時間は画面表示のみに留めています。
 */

const address = {
  '@type': 'PostalAddress',
  addressCountry: 'JP',
  addressRegion: site.address.region,
  addressLocality: site.address.locality,
  streetAddress: site.address.streetAddress,
  ...(hasValue(site.address.postalCode) ? { postalCode: site.address.postalCode } : {}),
}

function logo() {
  const url = absoluteUrl(site.logoPath)
  return url && publicFileExists(site.logoPath) ? url : undefined
}

/**
 * areaServed には、所在地から確認できる地域（＝地域ページを公開している地域）だけを出す。
 * 出張範囲が未確認の地域は areas.ts で enabled: false にしているため出力されない。
 */
function areaServed() {
  if (indexableAreas.length === 0) return {}
  return {
    areaServed: indexableAreas.map((a) => ({ '@type': 'AdministrativeArea', name: a.name })),
  }
}

export function organizationSchema() {
  const url = absoluteUrl('/')
  const logoUrl = logo()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': url ? `${url}/#organization` : undefined,
    name: site.name,
    alternateName: '3Peace エアコン工事',
    ...(url ? { url } : {}),
    ...(logoUrl ? { logo: logoUrl, image: logoUrl } : {}),
    telephone: site.tel.href,
    address,
    sameAs: [site.instagram],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: site.tel.href,
      areaServed: 'JP',
      availableLanguage: ['Japanese'],
    },
  }
}

/** Google に「サイト名」を正しく理解させるための WebSite */
export function websiteSchema() {
  const url = absoluteUrl('/')
  if (!url) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    url,
    name: site.name,
    alternateName: '3Peace エアコン工事',
    inLanguage: 'ja',
    publisher: { '@id': `${url}/#organization` },
  }
}

/** HVACBusiness（空調工事業）。確認できている情報のみ設定する。 */
export function hvacBusinessSchema() {
  const url = absoluteUrl('/')
  const logoUrl = logo()
  return {
    '@context': 'https://schema.org',
    '@type': 'HVACBusiness',
    '@id': url ? `${url}/#hvacbusiness` : undefined,
    name: site.name,
    alternateName: '3Peace エアコン工事',
    description: site.description,
    ...(url ? { url } : {}),
    telephone: site.tel.href,
    address,
    ...(logoUrl ? { image: logoUrl, logo: logoUrl } : {}),
    sameAs: [site.instagram],
    ...areaServed(),
    knowsAbout: [
      'エアコン新設工事',
      'エアコン交換工事',
      'エアコン移設工事',
      'エアコン取り外し',
      '冷媒配管',
      'ドレン配管',
      '真空引き',
      '室外機設置',
    ],
    // 代表者は founder として明示（従業員数の主張にはならないプロパティを使う）
    founder: {
      '@type': 'Person',
      name: site.representative,
      jobTitle: site.representativeRole,
    },
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbSchema(crumbs: Crumb[]) {
  const items = crumbs.map((c, i) => {
    const url = absoluteUrl(c.path)
    return {
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(url ? { item: url } : {}),
    }
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

export function serviceSchema(input: {
  name: string
  description: string
  path: string
  /** 工事に含まれる作業（Service の hasOfferCatalog として出力） */
  includes?: string[]
}) {
  const url = absoluteUrl(input.path)
  const orgId = absoluteUrl('/')
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.name,
    category: 'エアコン工事',
    provider: orgId
      ? { '@id': `${orgId}/#hvacbusiness` }
      : {
          '@type': 'HVACBusiness',
          name: site.name,
          telephone: site.tel.href,
          address,
        },
    ...areaServed(),
    ...(url ? { url } : {}),
    ...(input.includes && input.includes.length > 0
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${input.name}に含まれる作業`,
            itemListElement: input.includes.map((name) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name },
            })),
          },
        }
      : {}),
  }
}

export function faqPageSchema(faqs: { question: string; answer: string[] }[]) {
  if (faqs.length === 0) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer.join('\n'),
      },
    })),
  }
}

export function creativeWorkSchema(input: {
  name: string
  description: string
  path: string
  datePublished?: string
  image?: string
}) {
  const url = absoluteUrl(input.path)
  const imageUrl = input.image ? absoluteUrl(input.image) : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.name,
    description: input.description,
    ...(url ? { url, mainEntityOfPage: url } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(imageUrl && input.image && publicFileExists(input.image) ? { image: imageUrl } : {}),
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
  }
}

export function articleSchema(input: {
  headline: string
  description: string
  path: string
  datePublished: string
  dateModified?: string
  image?: string
  /** 監修者（確認できる範囲＝代表者名のみ） */
  reviewedByRepresentative?: boolean
}) {
  const url = absoluteUrl(input.path)
  const imageUrl = input.image ? absoluteUrl(input.image) : undefined
  const orgId = absoluteUrl('/')

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    ...(url ? { url, mainEntityOfPage: { '@type': 'WebPage', '@id': url } } : {}),
    ...(imageUrl && input.image && publicFileExists(input.image) ? { image: imageUrl } : {}),
    author: {
      '@type': 'Organization',
      name: site.name,
      ...(orgId ? { '@id': `${orgId}/#organization` } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      ...(orgId ? { '@id': `${orgId}/#organization` } : {}),
    },
    inLanguage: 'ja',
    ...(input.reviewedByRepresentative
      ? {
          reviewedBy: {
            '@type': 'Person',
            name: site.representative,
            jobTitle: site.representativeRole,
            worksFor: { '@type': 'Organization', name: site.name },
          },
        }
      : {}),
  }
}
