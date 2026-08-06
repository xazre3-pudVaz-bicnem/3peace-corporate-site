import { z } from 'zod'
import { publishedServices } from '@/data/services'
import { jobChoices } from '@/data/jobs'

/**
 * フォームのバリデーション定義。
 * クライアント表示とサーバー処理の両方でこのスキーマを使うため、
 * クライアント側の検証をすり抜けても必ずサーバー側で弾かれます。
 */

const TEL_RE = /^0\d{1,4}-?\d{1,4}-?\d{3,4}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const KANA_RE = /^[぀-ゟ゠-ヿー\s　]+$/

/**
 * 未選択のラジオボタンや未チェックのチェックボックスは FormData にキー自体が入りません。
 * そのまま検証すると zod の既定メッセージ（英語）が出てしまうため、
 * 文字列以外は空文字として扱い、各項目の日本語メッセージが出るようにします。
 */
const asString = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => (typeof value === 'string' ? value : ''), schema)

const requiredText = (label: string, max = 100) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください。`)
    .max(max, `${label}は${max}文字以内で入力してください。`)

const optionalText = (max = 200) =>
  z
    .string()
    .trim()
    .max(max, `${max}文字以内で入力してください。`)
    .optional()
    .or(z.literal(''))

const telSchema = z
  .string()
  .trim()
  .min(1, '電話番号を入力してください。')
  .refine((v) => TEL_RE.test(v.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))), {
    message: '電話番号の形式が正しくありません。（例：080-3880-4024）',
  })

const optionalEmailSchema = z
  .string()
  .trim()
  .refine((v) => v === '' || EMAIL_RE.test(v), {
    message: 'メールアドレスの形式が正しくありません。',
  })

const kanaSchema = z
  .string()
  .trim()
  .min(1, 'フリガナを入力してください。')
  .max(100, 'フリガナは100文字以内で入力してください。')
  .refine((v) => KANA_RE.test(v), { message: 'フリガナはひらがな・カタカナで入力してください。' })

const consentSchema = z
  .string()
  .refine((v) => v === 'on' || v === 'true', {
    message: 'プライバシーポリシーへの同意が必要です。',
  })

/** スパム対策の hidden 項目（人間には見えない。入力があれば送信を無視する） */
const honeypotSchema = z
  .string()
  .max(0, '送信できませんでした。')
  .optional()
  .or(z.literal(''))

const contactMethods = ['電話', 'メール', 'どちらでも'] as const
const contactTimes = ['指定なし', '午前中', '午後', '夕方以降'] as const

export const contactMethodOptions = [...contactMethods]
export const contactTimeOptions = [...contactTimes]

/** 問い合わせ種別（対応が確認できていない工事は選択肢に出さない） */
export const inquiryTypeOptions: string[] = [
  ...publishedServices.map((s) => {
    switch (s.slug) {
      case 'installation':
        return '新しくエアコンを取り付けたい'
      case 'replacement':
        return 'エアコンを交換したい'
      case 'relocation':
        return 'エアコンを移設したい'
      case 'removal':
        return 'エアコンを取り外したい'
      default:
        return s.title
    }
  }),
  '工事について相談したい',
  '法人・管理会社からの相談',
  '採用について',
  'その他',
]

export const acStatusOptions = [
  '現在エアコンが設置されていない',
  '設置済みだが調子が悪い',
  '設置済みで問題なく使えている',
  '本体を購入済み・これから設置したい',
  'わからない',
]

export const installLocationOptions = [
  '戸建て',
  'マンション・アパート',
  '店舗',
  '事務所',
  'その他',
]

// ── お問い合わせフォーム ────────────────────────────────────────
export const contactSchema = z
  .object({
    name: asString(requiredText('お名前')),
    kana: asString(kanaSchema),
    tel: asString(telSchema),
    email: asString(optionalEmailSchema),
    area: asString(optionalText(100)),
    inquiryType: asString(
      z
        .string()
        .trim()
        .min(1, 'お問い合わせ種別を選択してください。')
        .refine((v) => inquiryTypeOptions.includes(v), { message: '選択内容が正しくありません。' }),
    ),
    acStatus: asString(optionalText(100)),
    installLocation: asString(optionalText(100)),
    contactMethod: asString(
      z
        .string()
        .trim()
        .min(1, 'ご希望の連絡方法を選択してください。')
        .refine((v) => contactMethods.includes(v as (typeof contactMethods)[number]), {
          message: '選択内容が正しくありません。',
        }),
    ),
    contactTime: asString(optionalText(50)),
    message: asString(requiredText('お問い合わせ内容', 2000)),
    consent: asString(consentSchema),
    company: asString(honeypotSchema),
  })
  .superRefine((data, ctx) => {
    if (data.contactMethod === 'メール' && !data.email) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'メールでの連絡をご希望の場合は、メールアドレスを入力してください。',
      })
    }
  })

export type ContactInput = z.infer<typeof contactSchema>

// ── 応募フォーム ──────────────────────────────────────────────
export const employmentStatusOptions = [
  '在職中',
  '離職中',
  '学生',
  'その他',
]

export const experienceOptions = [
  'エアコン工事の経験がある',
  '電気工事の経験がある',
  '設備・配管工事の経験がある',
  'その他の建設・現場作業の経験がある',
  '関連する業務の経験はない',
]

export const driverLicenseOptions = ['あり（AT限定なし）', 'あり（AT限定）', 'なし', '取得予定']

export const applicationSchema = z
  .object({
    name: asString(requiredText('お名前')),
    kana: asString(kanaSchema),
    age: asString(
      z
        .string()
        .trim()
        .refine((v) => v === '' || (/^\d{1,3}$/.test(v) && Number(v) >= 15 && Number(v) <= 99), {
          message: '年齢は半角数字で入力してください。',
        }),
    ),
    tel: asString(telSchema),
    email: asString(optionalEmailSchema),
    area: asString(requiredText('お住まいの地域', 100)),
    desiredJob: asString(z.string().trim().min(1, '希望職種を選択してください。')),
    employmentStatus: asString(optionalText(50)),
    experience: asString(optionalText(200)),
    licenses: asString(optionalText(200)),
    driverLicense: asString(optionalText(50)),
    contactMethod: asString(
      z
        .string()
        .trim()
        .min(1, 'ご希望の連絡方法を選択してください。')
        .refine((v) => contactMethods.includes(v as (typeof contactMethods)[number]), {
          message: '選択内容が正しくありません。',
        }),
    ),
    contactTime: asString(optionalText(50)),
    reason: asString(requiredText('応募理由', 2000)),
    questions: asString(optionalText(2000)),
    consent: asString(consentSchema),
    company: asString(honeypotSchema),
  })
  .superRefine((data, ctx) => {
    if (data.contactMethod === 'メール' && !data.email) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'メールでの連絡をご希望の場合は、メールアドレスを入力してください。',
      })
    }
    if (jobChoices.length > 0 && !jobChoices.includes(data.desiredJob) && data.desiredJob !== '相談したい') {
      ctx.addIssue({
        code: 'custom',
        path: ['desiredJob'],
        message: '選択内容が正しくありません。',
      })
    }
  })

export type ApplicationInput = z.infer<typeof applicationSchema>

/** Server Action の戻り値（useActionState で使用） */
export type FormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  /** フィールド名 -> エラーメッセージ */
  errors?: Record<string, string>
}

export const initialFormState: FormState = { status: 'idle' }

/** ZodError を { field: message } 形式へ変換 */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!result[key]) result[key] = issue.message
  }
  return result
}
