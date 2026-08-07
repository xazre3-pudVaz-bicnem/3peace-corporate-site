/**
 * サイトで使うイメージ写真の一元管理。
 *
 * 【重要】ここに登録している写真は、エアコン工事の内容を伝えるための
 * イメージ写真です。3Peaceが実際に施工した現場の写真ではありません。
 * したがって次の用途には使用していません。
 *
 *   - 施工事例（works）      … 実績の裏付けになるため、実際の現場写真のみを使う
 *   - 代表者・スタッフの写真   … 実在の人物の写真としては使えない
 *   - Instagramサムネイル     … 実際の投稿写真ではないため
 *
 * 実際の現場写真が用意できたら、同じパスに差し替えるだけで反映されます。
 * 変換は `node scripts/optimize-images.mjs`（元画像は _originals/ に置く）。
 *
 * alt はキーワードを詰め込まず、何が写っているかを具体的に書いてください。
 * 背景として敷く装飾的な写真は、ページ側で alt="" を指定しています。
 */

export type SiteImage = {
  src: string
  alt: string
}

export const images = {
  /** トップページのヒーロー背景 */
  hero: {
    src: '/images/hero/hero-outdoor-unit.webp',
    alt: '住宅の外壁に架台で取り付けられた室外機と接続配管',
  },

  /** トップページ本文中の写真 */
  home: {
    living: {
      src: '/images/home/home-living.webp',
      alt: 'エアコンを設置したリビングの様子',
    },
    siteCheck: {
      src: '/images/home/home-site-check.webp',
      alt: 'ベランダに設置した室外機の状態を確認している様子',
    },
    testRun: {
      src: '/images/home/home-test-run.webp',
      alt: 'リモコンでエアコンの運転を確認している様子',
    },
    japaneseRoom: {
      src: '/images/home/home-japanese-room.webp',
      alt: '和室の壁に設置した室内機',
    },
  },

  /** 業務案内 */
  service: {
    hero: {
      src: '/images/services/service-hero.webp',
      alt: '室内機の取り付け位置を採寸している様子',
    },
    /** 各工事の詳細ページ（キーは services.ts の slug と対応） */
    detail: {
      installation: {
        src: '/images/services/installation.webp',
        alt: '室内機から壁の穴へ配管を通している様子',
      },
      replacement: {
        src: '/images/services/replacement.webp',
        alt: '壁に取り付けられた室内機',
      },
      relocation: {
        src: '/images/services/relocation.webp',
        alt: 'ベランダに設置された室外機と接続配管',
      },
      removal: {
        src: '/images/services/removal.webp',
        alt: '壁を貫通する配管と化粧カバーの接続部',
      },
      /**
       * 業務用エアコン工事。
       * services.ts で enabled: false のため、現在どのページにも表示されません。
       * 業務用への対応が確認できて enabled: true にすると、自動的に表示されます。
       */
      commercial: {
        src: '/images/services/commercial.webp',
        alt: '事務所の天井に設置された天井カセット形エアコン',
      },
    } as Record<string, SiteImage | undefined>,
  },

  /** 施工事例ページの見出し（事例そのものの写真ではなく、工具・車両のイメージ） */
  works: {
    hero: {
      src: '/images/works/works-hero.webp',
      alt: '現場へ持ち込む配管材と工具、作業車両',
    },
  },

  /** 採用 */
  recruit: {
    hero: {
      src: '/images/recruit/recruit-hero.webp',
      alt: '室外機の前で作業内容を確認し合う2人の作業者',
    },
    preparation: {
      src: '/images/recruit/recruit-preparation.webp',
      alt: '作業車両から配管材を降ろしている様子',
    },
    /**
     * 業務用エアコンの現場を写した写真のため、現在は未使用です。
     * 業務用工事への対応が確認できてから使用してください。
     */
    teamwork: {
      src: '/images/recruit/recruit-teamwork.webp',
      alt: '天井に設置されたエアコンを2人で作業している様子',
    },
    staff: {
      src: '/images/recruit/recruit-staff.webp',
      alt: '住宅の室外機の横に立つ作業着姿の技術者',
    },
  },

  /** 会社案内 */
  company: {
    hero: {
      src: '/images/company/about-hero.webp',
      alt: '戸建て住宅の外壁に設置された室外機',
    },
    living: {
      src: '/images/company/company-living.webp',
      alt: 'エアコンが設置された明るいリビング',
    },
    /**
     * 業務用の室外機を写した写真のため、現在は未使用です。
     * 業務用工事への対応が確認できてから使用してください。
     */
    outdoorUnits: {
      src: '/images/company/company-outdoor-units.webp',
      alt: '建物の外壁沿いに並ぶ業務用の室外機',
    },
  },
} as const

/** 業務案内の詳細ページ用（未登録の slug では undefined を返す） */
export function getServiceImage(slug: string): SiteImage | undefined {
  return images.service.detail[slug]
}
