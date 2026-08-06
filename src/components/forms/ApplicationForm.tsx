'use client'

import { useActionState } from 'react'
import { submitApplication } from '@/app/actions/contact'
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
  contactMethodOptions,
  contactTimeOptions,
  driverLicenseOptions,
  employmentStatusOptions,
  experienceOptions,
  initialFormState,
} from '@/lib/validation'
import { site } from '@/data/site'

type Props = {
  mailEnabled: boolean
  /** 選択できる職種（公開中の求人から生成） */
  jobOptions: string[]
}

export function ApplicationForm({ mailEnabled, jobOptions }: Props) {
  const [state, formAction] = useActionState(submitApplication, initialFormState)

  if (!mailEnabled) {
    return (
      <MailNotConfiguredNotice>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`tel:${site.tel.href}`}>
            <PhoneIcon />
            {site.tel.display}
          </ButtonLink>
          <ButtonLink href={site.instagram} variant="outline" external>
            Instagram から連絡する
          </ButtonLink>
        </div>
        <p className="mt-4 text-xs leading-6 text-ink-soft">
          お電話の際は「採用について」とお伝えください。
        </p>
      </MailNotConfiguredNotice>
    )
  }

  if (state.status === 'success') {
    return (
      <div className="border border-line-strong bg-sky-soft p-8 text-center">
        <h3 className="text-xl font-bold text-navy">ご応募を受け付けました</h3>
        <p className="mt-4 text-[0.95rem] leading-8 text-ink-soft">
          内容を確認のうえ、ご希望の連絡方法・時間帯に合わせてご連絡します。
        </p>
      </div>
    )
  }

  const errors = state.errors ?? {}
  const options = jobOptions.length > 0 ? [...jobOptions, '相談したい'] : ['相談したい']

  return (
    <form action={formAction} noValidate className="relative space-y-8">
      <FormStatusMessage state={state} />
      <Honeypot />
      <StartedAt />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="name" label="お名前" required autoComplete="name" error={errors.name} />
        <TextField name="kana" label="フリガナ" required error={errors.kana} />
        <TextField
          name="age"
          label="年齢"
          inputMode="numeric"
          placeholder="30"
          hint="労働条件のご案内に使用します。年齢による応募制限は設けていません。"
          error={errors.age}
        />
        <TextField
          name="area"
          label="お住まいの地域"
          required
          placeholder="広島市西区"
          hint="市区町村までで構いません。"
          error={errors.area}
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
          hint="メールでのご連絡をご希望の場合は入力してください。"
          error={errors.email}
        />
      </div>

      <SelectField
        name="desiredJob"
        label="希望職種"
        required
        options={options}
        error={errors.desiredJob}
      />

      <SelectField
        name="employmentStatus"
        label="現在の就業状況"
        options={employmentStatusOptions}
        error={errors.employmentStatus}
      />

      <SelectField
        name="experience"
        label="関連業務の経験"
        options={experienceOptions}
        error={errors.experience}
      />

      <TextField
        name="licenses"
        label="保有資格"
        placeholder="第二種電気工事士 など"
        hint="お持ちの資格があればご記入ください。無い場合は空欄で構いません。"
        error={errors.licenses}
      />

      <SelectField
        name="driverLicense"
        label="普通自動車運転免許"
        options={driverLicenseOptions}
        error={errors.driverLicense}
      />

      <RadioField
        name="contactMethod"
        label="ご希望の連絡方法"
        required
        options={contactMethodOptions}
        error={errors.contactMethod}
      />

      <RadioField
        name="contactTime"
        label="連絡可能な時間帯"
        options={contactTimeOptions}
        error={errors.contactTime}
      />

      <TextAreaField
        name="reason"
        label="応募理由"
        required
        rows={7}
        placeholder="この仕事に興味を持った理由や、これまでの経験などをお書きください。"
        error={errors.reason}
      />

      <TextAreaField
        name="questions"
        label="ご質問・ご相談"
        rows={5}
        placeholder="働き方や仕事内容について、聞いておきたいことがあればお書きください。"
        error={errors.questions}
      />

      <ConsentField name="consent" error={errors.consent}>
        <ConsentText />
      </ConsentField>

      <div className="pt-2">
        <SubmitButton label="この内容で応募する" />
        <p className="mt-4 text-xs leading-6 text-ink-soft">
          いただいた個人情報は、採用選考およびご連絡のみに使用します。
        </p>
      </div>
    </form>
  )
}
