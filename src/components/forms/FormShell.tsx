'use client'

import Link from 'next/link'
import { useEffect, useRef, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import type { FormState } from '@/lib/validation'

/** 送信ボタン。送信中は無効化して二重送信を防ぎます。 */
export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex min-h-13 w-full items-center justify-center gap-3 bg-navy px-8 py-4 text-base font-bold text-white transition-colors hover:bg-blue disabled:cursor-not-allowed disabled:bg-ink-soft sm:w-auto"
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
          送信中…
        </>
      ) : (
        label
      )}
    </button>
  )
}

/** フォーム表示から送信までの経過時間を記録する（スパム対策） */
export function StartedAt() {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.value = String(Date.now())
  }, [])

  return <input ref={ref} type="hidden" name="startedAt" defaultValue="" />
}

/** 送信結果の表示。エラー時はフォーム先頭へフォーカスを移します。 */
export function FormStatusMessage({ state }: { state: FormState }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.status !== 'idle') {
      ref.current?.focus()
    }
  }, [state])

  if (state.status === 'idle' || !state.message) return null

  const isSuccess = state.status === 'success'

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className={`border-l-4 p-5 text-[0.95rem] leading-7 ${
        isSuccess
          ? 'border-blue bg-sky-soft text-ink'
          : 'border-[#b3261e] bg-[#fdf2f1] text-[#7a1d17]'
      }`}
    >
      {state.message}
    </div>
  )
}

/** メール未設定時の代替案内 */
export function MailNotConfiguredNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="border border-line-strong bg-mist p-6 sm:p-8">
      <h3 className="text-base font-bold text-ink">
        現在、フォームからの送信を停止しています
      </h3>
      <p className="mt-3 text-[0.925rem] leading-8 text-ink-soft">
        お手数ですが、お電話または Instagram のメッセージからご連絡ください。
        いただいたご連絡には順次お返事します。
      </p>
      {children}
    </div>
  )
}

/** プライバシーポリシーへの同意文 */
export function ConsentText() {
  return (
    <>
      <Link href="/privacy" className="link-underline" target="_blank" rel="noopener noreferrer">
        プライバシーポリシー
      </Link>
      に同意のうえ送信します。
    </>
  )
}
