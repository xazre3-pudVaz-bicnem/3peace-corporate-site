import Image from 'next/image'
import { publicFileExists } from '@/lib/images'

type Props = {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  className?: string
  /** 親要素に position:relative を付けたうえで使用 */
  fill?: boolean
  /** アスペクト比（fill を使わない場合のレイアウト確保に使用） */
  ratio?: string
  /**
   * 画像が未配置のときの挙動
   *  - 'hide'        : 何も表示しない（ギャラリーなど）
   *  - 'placeholder' : 差し替え位置が分かる枠を表示（開発時のみ／本番は控えめな面）
   */
  fallback?: 'hide' | 'placeholder'
}

const isDev = process.env.NODE_ENV !== 'production'

/**
 * public 配下に実ファイルがある場合だけ next/image を描画します。
 * 未配置の場合、壊れた画像や 404 を出さずに fallback へ切り替えます。
 */
export function Photo({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  priority = false,
  className = '',
  fill = false,
  ratio,
  fallback = 'placeholder',
}: Props) {
  const exists = publicFileExists(src)

  if (!exists) {
    if (fallback === 'hide') return null

    // 開発時は差し替えるファイルパスを明示し、本番では控えめな面のみを表示する
    return (
      <div
        aria-hidden="true"
        className={`${fill ? 'absolute inset-0 h-full w-full' : 'w-full'} ${
          isDev
            ? 'flex items-center justify-center border-2 border-dashed border-blue/50 bg-sky-soft p-4'
            : 'bg-linear-to-br from-sky-soft to-sky'
        } ${className}`}
        style={!fill && ratio ? { aspectRatio: ratio } : undefined}
      >
        {isDev ? (
          <span className="text-center text-xs leading-6 break-all text-navy">
            画像を配置してください
            <br />
            <code className="font-mono">public{src}</code>
          </span>
        ) : null}
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 800}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      className={className}
    />
  )
}

/** 画像が1枚でも存在するかどうか（セクションごと非表示にする判定に使用） */
export function anyImageExists(sources: string[]): boolean {
  return sources.some((src) => publicFileExists(src))
}

/**
 * 背景写真が未配置であることを開発時だけ知らせる小さな表示。
 * 本番ビルドでは何も出力しないため、公開後に「画像準備中」の枠が出ることはありません。
 */
export function DevImageHint({ src, label }: { src: string; label: string }) {
  if (!isDev || publicFileExists(src)) return null

  return (
    <p className="mb-6 inline-block border-2 border-dashed border-white/60 px-4 py-2 text-xs leading-6 text-white/90">
      【開発時のみ表示】{label}の画像が未配置です：
      <code className="font-mono break-all">public{src}</code>
    </p>
  )
}
