import fs from 'node:fs'
import path from 'node:path'

/**
 * public 配下に実ファイルが存在するかどうかを判定します。
 *
 * 画像が未配置の状態でも 404 画像やレイアウト崩れを起こさないよう、
 * Server Component 側で存在チェックを行い、無い場合は代替表示に切り替えます。
 * 静的生成時（ビルド時）に評価されるため、実行時のコストはありません。
 */
const cache = new Map<string, boolean>()

export function publicFileExists(src?: string): boolean {
  if (!src || !src.startsWith('/')) return false
  const cached = cache.get(src)
  if (cached !== undefined) return cached

  const clean = src.split('?')[0].split('#')[0]
  const filePath = path.join(process.cwd(), 'public', clean)
  let exists = false
  try {
    exists = fs.existsSync(filePath) && fs.statSync(filePath).isFile()
  } catch {
    exists = false
  }
  cache.set(src, exists)
  return exists
}

/** 存在する画像だけを返す（ギャラリーなどで壊れた画像を出さないため） */
export function filterExistingImages<T extends { src: string }>(images: T[]): T[] {
  return images.filter((image) => publicFileExists(image.src))
}
