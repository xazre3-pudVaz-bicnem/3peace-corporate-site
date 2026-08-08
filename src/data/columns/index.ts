/**
 * エアコン工事専門コラムの一覧。
 *
 * 記事を追加するときは、このディレクトリに1ファイル作成し、
 * 下の allColumns へ追加してください。published: true にすると
 * ページ・一覧・サイトマップ・RSS へ自動的に反映されます。
 */

import type { Column, ColumnCategory } from './types'
import { columnCategoryLabels } from './types'

import { airconInstallationCheck } from './aircon-installation-check'
import { airconInstallationCostFactors } from './aircon-installation-cost-factors'
import { onlineAirconInstallation } from './online-aircon-installation'
import { outdoorUnitLocation } from './outdoor-unit-location'
import { vacuumPump } from './vacuum-pump'
import { relocationOrReplacement } from './relocation-or-replacement'
import { movingAircon } from './moving-aircon'
import { airconReplacementTiming } from './aircon-replacement-timing'
import { drainPipe } from './drain-pipe'
import { aircon100v200v } from './aircon-100v-200v'

export type { Column, ColumnCategory, ColumnSection } from './types'
export { columnCategoryLabels } from './types'

/** 登録順。一覧では公開日の新しい順に並び替えて表示します */
const allColumns: Column[] = [
  airconInstallationCheck,
  airconInstallationCostFactors,
  onlineAirconInstallation,
  outdoorUnitLocation,
  vacuumPump,
  relocationOrReplacement,
  movingAircon,
  airconReplacementTiming,
  drainPipe,
  aircon100v200v,
]

export const columns = allColumns

/** 公開中の記事（新しい順） */
export const publishedColumns = allColumns
  .filter((c) => c.published)
  .sort((a, b) => {
    const diff = b.publishedAt.localeCompare(a.publishedAt)
    // 同日公開の記事は登録順を保つ
    return diff !== 0 ? diff : allColumns.indexOf(a) - allColumns.indexOf(b)
  })

export const hasColumns = publishedColumns.length > 0

export function getColumn(slug: string): Column | undefined {
  return publishedColumns.find((c) => c.slug === slug)
}

/** 指定した slug の記事だけを、渡した順序で取得する（関連記事の表示用） */
export function getColumnsBySlugs(slugs: string[]): Column[] {
  return slugs
    .map((slug) => publishedColumns.find((c) => c.slug === slug))
    .filter((c): c is Column => !!c)
}

/** サービスに関連づけられた記事（services.ts の relatedColumns から引く） */
export function getColumnsForService(serviceSlug: string): Column[] {
  return publishedColumns.filter((c) => c.relatedServices.includes(serviceSlug))
}

/** カテゴリーごとの記事一覧（記事が0件のカテゴリーは返さない） */
export const columnGroups = (Object.keys(columnCategoryLabels) as ColumnCategory[])
  .map((category) => ({
    category,
    label: columnCategoryLabels[category],
    items: publishedColumns.filter((c) => c.category === category),
  }))
  .filter((group) => group.items.length > 0)

/** 記事の最終更新日（sitemap / RSS 用） */
export function columnLastModified(column: Column): Date {
  return new Date(column.updatedAt ?? column.publishedAt)
}

/** サイト全体でのコラムの最終更新日 */
export const columnsLastModified = publishedColumns.reduce<Date | undefined>((latest, column) => {
  const date = columnLastModified(column)
  return !latest || date > latest ? date : latest
}, undefined)
