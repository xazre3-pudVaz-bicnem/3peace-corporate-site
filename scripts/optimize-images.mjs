/**
 * 元画像を用途ごとの WebP（OG画像のみ JPEG）へ変換して public/images 配下へ配置します。
 *
 *   1. 元画像（PNG / JPG）を _originals/ に置く
 *   2. 下の MAP に「元ファイル名の一部 → 出力先」を書く
 *   3. node scripts/optimize-images.mjs
 *
 * _originals/ は .gitignore 済みです（元画像はリポジトリに含めません）。
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

/** 変換元（リポジトリには含めない） */
const ORIGIN_DIR = path.join(process.cwd(), '_originals')
/** 出力先 */
const OUT_DIR = path.join(process.cwd(), 'public', 'images')

/** 元ファイル名（部分一致） → 出力先パス */
const MAP = [
  // ヒーロー
  ['20_16_44 (2)', 'hero/hero-indoor-unit-installation.webp'],

  // OG画像（1200×630 にクロップ）
  // SNS・チャットアプリのクローラー互換性を優先して JPEG で出力します
  ['20_16_43 (1)', 'og/3peace-og.jpg', { width: 1200, height: 630 }],

  // 業務案内
  ['20_16_44 (3)', 'services/service-hero.webp'],
  ['20_16_44 (4)', 'services/installation.webp'],
  ['20_16_51 (3)', 'services/replacement.webp'],
  ['20_16_51 (4)', 'services/relocation.webp'],
  ['20_16_53 (7)', 'services/removal.webp'],
  ['20_16_52 (5)', 'services/commercial.webp'], // 業務用（現在は非公開・将来用）

  // 施工事例ページの見出し（事例そのものの写真ではなく、工具・車両のイメージ）
  ['20_16_53 (6)', 'works/works-hero.webp'],

  // 採用
  ['20_16_45 (8)', 'recruit/recruit-hero.webp'],
  ['20_16_46 (9)', 'recruit/recruit-preparation.webp'],
  ['20_16_45 (6)', 'recruit/recruit-teamwork.webp'],
  ['20_16_46 (10)', 'recruit/recruit-staff.webp'],

  // 会社
  ['20_16_50 (1)', 'company/about-hero.webp'],
  ['20_16_53 (8)', 'company/company-living.webp'],
  ['20_16_53 (9)', 'company/company-outdoor-units.webp'],

  // トップページ
  ['20_16_44 (5)', 'home/home-site-check.webp'],
  ['20_16_45 (7)', 'home/home-test-run.webp'],
  ['20_16_51 (2)', 'home/home-living.webp'],
  ['20_16_54 (10)', 'home/home-japanese-room.webp'],
]

if (!fs.existsSync(ORIGIN_DIR)) {
  console.error(`元画像のディレクトリがありません: ${ORIGIN_DIR}`)
  process.exit(1)
}

const sources = fs
  .readdirSync(ORIGIN_DIR)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))

let done = 0
for (const [needle, dest, crop] of MAP) {
  const file = sources.find((f) => f.includes(needle))
  if (!file) {
    console.warn(`× 元画像が見つかりません: ${needle}`)
    continue
  }

  const outPath = path.join(OUT_DIR, dest)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })

  let pipeline = sharp(path.join(ORIGIN_DIR, file))
  pipeline = crop
    ? pipeline.resize(crop.width, crop.height, { fit: 'cover', position: 'attention' })
    : pipeline.resize(1600, null, { withoutEnlargement: true })

  // 拡張子に合わせて形式を切り替える（OG画像のみ JPEG）
  pipeline = dest.endsWith('.jpg')
    ? pipeline.jpeg({ quality: 84, mozjpeg: true })
    : pipeline.webp({ quality: 82, effort: 5 })

  await pipeline.toFile(outPath)

  const kb = Math.round(fs.statSync(outPath).size / 1024)
  console.log(`✓ ${dest}  (${kb} KB)`)
  done++
}

console.log(`\n${done}/${MAP.length} 件を変換しました。`)
