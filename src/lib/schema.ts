import { site, publishedAreas, hasValue } from '@/data/site'
import { publicFileExists } from '@/lib/images'
import { absoluteUrl } from '@/lib/seo'

/**
 * JSON-LD 生成。
 *
 * 【原則】画面に表示していない情報、確認できていない情報は出力しないこと。
 * 営業時間・価格帯・評価・口コミ件数・緯度経度・設立日・従業員数・資格などは
 * 確認が取れるまで追加しないでください。
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

export function organizationSchema() {
  const url = absoluteUrl('/')
  const logoUrl = logo()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': url ? `${url}/#organization` : undefined,
    name: site.name,
    ...(url ? { url } : {}),
    ...(logoUrl ? { logo: logoUrl, image: logoUrl } : {}),
    telephone: site.tel.href,
    address,
    sameAs: [site.instagram],
  }
}

export function websiteSchema() {
  const url = absoluteUrl('/')
  if (!url) return undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    url,
    name: `${site.name}｜広島のエアコン工事`,
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
    description: site.description,
    ...(url ? { url } : {}),
    telephone: site.tel.href,
    address,
    ...(logoUrl ? { image: logoUrl, logo: logoUrl } : {}),
    sameAs: [site.instagram],
    ...(publishedAreas.length > 0
      ? {
          areaServed: publishedAreas.map((a) => ({ '@type': 'City', name: a.name })),
        }
      : {}),
    // 代表者は employee ではなく従業員数の推測にならないプロパティを使う
    employee: {
      '@type': 'Person',
      name: site.representative,
      jobTitle: site.representativeRole,
    },
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbSchema(crumbs: Crumb[]) {
  const items = crumbs
    .map((c, i) => {
      const url = absoluteUrl(c.path)
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        ...(url ? { item: url } : {}),
      }
    })
    .filter(Boolean)

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
}) {
  const url = absoluteUrl(input.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.name,
    provider: {
      '@type': 'HVACBusiness',
      name: site.name,
      telephone: site.tel.href,
      address,
    },
    ...(publishedAreas.length > 0
      ? { areaServed: publishedAreas.map((a) => ({ '@type': 'City', name: a.name })) }
      : {}),
    ...(url ? { url } : {}),
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
    '@type': 'CreativeWork',
    name: input.name,
    description: input.description,
    ...(url ? { url, '@id': url } : {}),
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
}) {
  const url = absoluteUrl(input.path)
  const imageUrl = input.image ? absoluteUrl(input.image) : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    ...(url ? { url, mainEntityOfPage: url } : {}),
    ...(imageUrl && input.image && publicFileExists(input.image) ? { image: imageUrl } : {}),
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
  }
}
