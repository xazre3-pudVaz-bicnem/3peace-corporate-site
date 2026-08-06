/**
 * メール送信（Resend REST API）。
 * ※ Server Action からのみ呼び出すこと（環境変数を参照します）。
 *
 * 環境変数が未設定でもビルド・実行は成功します。
 * その場合 isMailConfigured が false になり、フォームは送信不可状態として
 * 電話・Instagram での問い合わせ導線のみを表示します。
 *
 * 必要な環境変数:
 *   RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL
 */

const apiKey = process.env.RESEND_API_KEY?.trim()
const to = process.env.CONTACT_TO_EMAIL?.trim()
const from = process.env.CONTACT_FROM_EMAIL?.trim()

export const isMailConfigured = Boolean(apiKey && to && from)

type SendResult = { ok: true } | { ok: false; reason: string }

export async function sendMail(input: {
  subject: string
  text: string
  replyTo?: string
}): Promise<SendResult> {
  if (!isMailConfigured) {
    return { ok: false, reason: 'not-configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: input.subject,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      // 入力内容はログに残さず、ステータスのみ記録する
      console.error(`[mail] Resend API responded with status ${response.status}`)
      return { ok: false, reason: 'api-error' }
    }
    return { ok: true }
  } catch {
    console.error('[mail] Failed to reach the mail API.')
    return { ok: false, reason: 'network-error' }
  }
}

/** ラベルと値の組から、メール本文のプレーンテキストを組み立てる */
export function buildMailBody(rows: { label: string; value?: string }[]): string {
  return rows
    .filter((r) => r.value && r.value.trim().length > 0)
    .map((r) => `【${r.label}】\n${r.value!.trim()}`)
    .join('\n\n')
}
