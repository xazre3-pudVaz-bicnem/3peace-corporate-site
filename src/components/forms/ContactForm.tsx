'use client'

import { useActionState } from 'react'
import { submitContact } from '@/app/actions/contact'
import {
  ConsentField,
  Honeypot,
  RadioField,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/forms/Field'
import {
  ConsentText,
  FormStatusMessage,
  MailNotConfiguredNotice,
  StartedAt,
  SubmitButton,
} from '@/components/forms/FormShell'
import { ButtonLink, PhoneIcon } from '@/components/ui/Button'
import {
  acStatusOptions,
  contactMethodOptions,
  contactTimeOptions,
  initialFormState,
  inquiryTypeOptions,
  installLocationOptions,
} from '@/lib/validation'
import { site } from '@/data/site'

type Props = {
  /** メール送信の設定が有効かどうか（サーバー側で判定した値を渡す） */
  mailEnabled: boolean
}

export function ContactForm({ mailEnabled }: Props) {
  const [state, formAction] = useActionState(submitContact, initialFormState)

  if (!mailEnabled) {
    return (
      <MailNotConfiguredNotice>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`tel:${site.tel.href}`}>
            <PhoneIcon />
            {site.tel.display}
          </ButtonLink>
          <ButtonLink href={site.instagram} variant="outline" external>
            Instagram で相談する
          </ButtonLink>
        </div>
      </MailNotConfiguredNotice>
    )
  }

  if (state.status === 'success') {
    return (
      <div className="border border-line-strong bg-sky-soft p-8 text-center">
        <h3 className="text-xl font-bold text-navy">お問い合わせを受け付けました</h3>
        <p className="mt-4 text-[0.95rem] leading-8 text-ink-soft">
          内容を確認のうえ、ご希望の連絡方法でご連絡します。
          <br />
          お急ぎの場合は、お電話でもご相談を受け付けています。
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href={`tel:${site.tel.href}`} variant="outline">
            <PhoneIcon />
            {site.tel.display}
          </ButtonLink>
        </div>
      </div>
    )
  }

  const errors = state.errors ?? {}

  return (
    <form action={formAction} noValidate className="relative space-y-8">
      <FormStatusMessage state={state} />
      <Honeypot />
      <StartedAt />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="name"
          label="お名前"
          required
          autoComplete="name"
          placeholder="広島 太郎"
          error={errors.name}
        />
        <TextField
          name="kana"
          label="フリガナ"
          required
          placeholder="ヒロシマ タロウ"
          error={errors.kana}
        />
        <TextField
          name="tel"
          label="電話番号"
          type="tel"
          inputMode="tel"
          required
          autoComplete="tel"
          placeholder="080-1234-5678"
          error={errors.tel}
        />
        <TextField
          name="email"
          label="メールアドレス"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="example@example.com"
          hint="メールでのご連絡をご希望の場合は入力してください。"
          error={errors.email}
        />
      </div>

      <TextField
        name="area"
        label="お住まいの地域"
        placeholder="広島市西区"
        hint="市区町村までで構いません。対応可否の確認に使用します。"
        error={errors.area}
      />

      <SelectField
        name="inquiryType"
        label="お問い合わせ種別"
        required
        options={inquiryTypeOptions}
        error={errors.inquiryType}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          name="acStatus"
          label="エアコンの状況"
          options={acStatusOptions}
          error={errors.acStatus}
        />
        <SelectField
          name="installLocation"
          label="設置場所"
          options={installLocationOptions}
          error={errors.installLocation}
        />
      </div>

      <RadioField
        name="contactMethod"
        label="ご希望の連絡方法"
        required
        options={contactMethodOptions}
        error={errors.contactMethod}
      />

      <RadioField
        name="contactTime"
        label="ご希望の連絡時間帯"
        options={contactTimeOptions}
        error={errors.contactTime}
      />

      <TextAreaField
        name="message"
        label="お問い合わせ内容"
        required
        rows={8}
        placeholder="設置したい部屋の状況、お使いの機種の型番、ご希望の時期など、分かる範囲でお書きください。"
        error={errors.message}
      />

      <ConsentField name="consent" error={errors.consent}>
        <ConsentText />
      </ConsentField>

      <div className="pt-2">
        <SubmitButton label="この内容で送信する" />
        <p className="mt-4 text-xs leading-6 text-ink-soft">
          送信後、内容を確認してご連絡します。数日たっても連絡がない場合は、
          お手数ですがお電話（
          <a href={`tel:${site.tel.href}`} className="link-underline tabular-nums">
            {site.tel.display}
          </a>
          ）でご確認ください。
        </p>
      </div>
    </form>
  )
}
