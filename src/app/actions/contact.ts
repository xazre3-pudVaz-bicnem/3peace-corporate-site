'use server'

import { site } from '@/data/site'
import { buildMailBody, isMailConfigured, sendMail } from '@/lib/mail'
import { applicationSchema, contactSchema, toFieldErrors, type FormState } from '@/lib/validation'

/**
 * Server Action によるフォーム送信。
 *
 * - CSRF：Next.js の Server Action は同一オリジンからの呼び出しのみを受け付けます
 *   （Origin / Host の検証が組み込まれています）。
 * - スパム対策：honeypot と、フォーム表示から送信までの経過時間で判定します。
 * - 入力値はログに出力しません（メール本文としてのみ使用）。
 */

const MIN_ELAPSED_MS = 3000

function isTooFast(formData: FormData): boolean {
  const started = Number(formData.get('startedAt'))
  if (!Number.isFinite(started) || started <= 0) return false
  return Date.now() - started < MIN_ELAPSED_MS
}

function notConfiguredState(): FormState {
  return {
    status: 'error',
    message:
      '現在フォームからの送信を受け付けられません。お手数ですが、お電話または Instagram からご連絡ください。',
  }
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    return {
      status: 'error',
      message: '入力内容をご確認ください。',
      errors: toFieldErrors(parsed.error),
    }
  }

  // honeypot に入力があれば、正常応答を返しつつ送信しない
  if (parsed.data.company) return { status: 'success' }
  if (isTooFast(formData)) {
    return {
      status: 'error',
      message: '送信に失敗しました。お手数ですが、もう一度送信してください。',
    }
  }

  if (!isMailConfigured) return notConfiguredState()

  const d = parsed.data
  const text = buildMailBody([
    { label: 'お名前', value: d.name },
    { label: 'フリガナ', value: d.kana },
    { label: '電話番号', value: d.tel },
    { label: 'メールアドレス', value: d.email },
    { label: 'お住まいの地域', value: d.area },
    { label: 'お問い合わせ種別', value: d.inquiryType },
    { label: 'エアコンの状況', value: d.acStatus },
    { label: '設置場所', value: d.installLocation },
    { label: 'ご希望の連絡方法', value: d.contactMethod },
    { label: 'ご希望の連絡時間帯', value: d.contactTime },
    { label: 'お問い合わせ内容', value: d.message },
  ])

  const result = await sendMail({
    subject: `【${site.name} お問い合わせ】${d.inquiryType}／${d.name} 様`,
    text,
    replyTo: d.email || undefined,
  })

  if (!result.ok) {
    return {
      status: 'error',
      message:
        '送信中にエラーが発生しました。お手数ですが、時間をおいてお試しいただくか、お電話でご連絡ください。',
    }
  }

  return {
    status: 'success',
    message: 'お問い合わせを受け付けました。内容を確認のうえ、ご希望の方法でご連絡します。',
  }
}

export async function submitApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = applicationSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    return {
      status: 'error',
      message: '入力内容をご確認ください。',
      errors: toFieldErrors(parsed.error),
    }
  }

  if (parsed.data.company) return { status: 'success' }
  if (isTooFast(formData)) {
    return {
      status: 'error',
      message: '送信に失敗しました。お手数ですが、もう一度送信してください。',
    }
  }

  if (!isMailConfigured) return notConfiguredState()

  const d = parsed.data
  const text = buildMailBody([
    { label: 'お名前', value: d.name },
    { label: 'フリガナ', value: d.kana },
    { label: '年齢', value: d.age },
    { label: '電話番号', value: d.tel },
    { label: 'メールアドレス', value: d.email },
    { label: 'お住まいの地域', value: d.area },
    { label: '希望職種', value: d.desiredJob },
    { label: '現在の就業状況', value: d.employmentStatus },
    { label: '関連業務の経験', value: d.experience },
    { label: '保有資格', value: d.licenses },
    { label: '普通自動車運転免許', value: d.driverLicense },
    { label: 'ご希望の連絡方法', value: d.contactMethod },
    { label: 'ご希望の連絡時間帯', value: d.contactTime },
    { label: '応募理由', value: d.reason },
    { label: 'ご質問・ご相談', value: d.questions },
  ])

  const result = await sendMail({
    subject: `【${site.name} 応募】${d.desiredJob}／${d.name} 様`,
    text,
    replyTo: d.email || undefined,
  })

  if (!result.ok) {
    return {
      status: 'error',
      message:
        '送信中にエラーが発生しました。お手数ですが、時間をおいてお試しいただくか、お電話でご連絡ください。',
    }
  }

  return {
    status: 'success',
    message: 'ご応募を受け付けました。内容を確認のうえ、ご希望の方法でご連絡します。',
  }
}
