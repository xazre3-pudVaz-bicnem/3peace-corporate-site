type Props = {
  /** undefined を渡した場合は何も出力しません（未確認情報を出さないため） */
  data: unknown
}

/**
 * JSON-LD を出力します。
 * undefined / null のプロパティは JSON.stringify の時点で自動的に除外されます。
 */
export function JsonLd({ data }: Props) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      // JSON.stringify した値のみを出力するため、外部入力は含まれません
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
