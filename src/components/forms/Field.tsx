'use client'

import type { ReactNode } from 'react'

/**
 * フォーム部品。
 * ラベルと入力欄、エラー文を aria-describedby / aria-invalid で関連付けています。
 */

type BaseProps = {
  name: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  className?: string
}

function Label({
  name,
  label,
  required,
}: {
  name: string
  label: string
  required?: boolean
}) {
  return (
    <label htmlFor={name} className="flex items-center gap-2 text-sm font-bold text-ink">
      {label}
      {required ? (
        <span className="bg-blue px-1.5 py-0.5 text-[0.65rem] font-bold text-white">必須</span>
      ) : (
        <span className="border border-line-strong px-1.5 py-0.5 text-[0.65rem] text-ink-soft">
          任意
        </span>
      )}
    </label>
  )
}

function Messages({
  name,
  error,
  hint,
}: {
  name: string
  error?: string
  hint?: string
}) {
  return (
    <>
      {hint ? (
        <p id={`${name}-hint`} className="mt-1.5 text-xs leading-6 text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-xs leading-6 font-bold text-[#b3261e]">
          {error}
        </p>
      ) : null}
    </>
  )
}

function describedBy(name: string, error?: string, hint?: string) {
  const ids = [hint ? `${name}-hint` : '', error ? `${name}-error` : ''].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}

const controlClass =
  'mt-2 block w-full border bg-white px-4 py-3 text-[0.95rem] text-ink transition-colors placeholder:text-ink-soft/60 focus:border-blue'

export function TextField({
  name,
  label,
  required,
  error,
  hint,
  type = 'text',
  autoComplete,
  inputMode,
  placeholder,
  defaultValue,
  className = '',
}: BaseProps & {
  type?: 'text' | 'tel' | 'email' | 'number'
  autoComplete?: string
  inputMode?: 'text' | 'tel' | 'email' | 'numeric'
  placeholder?: string
  defaultValue?: string
}) {
  return (
    <div className={className}>
      <Label name={name} label={label} required={required} />
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={`${controlClass} ${error ? 'border-[#b3261e]' : 'border-line-strong'}`}
      />
      <Messages name={name} error={error} hint={hint} />
    </div>
  )
}

export function TextAreaField({
  name,
  label,
  required,
  error,
  hint,
  rows = 6,
  placeholder,
  className = '',
}: BaseProps & { rows?: number; placeholder?: string }) {
  return (
    <div className={className}>
      <Label name={name} label={label} required={required} />
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={`${controlClass} resize-y ${error ? 'border-[#b3261e]' : 'border-line-strong'}`}
      />
      <Messages name={name} error={error} hint={hint} />
    </div>
  )
}

export function SelectField({
  name,
  label,
  required,
  error,
  hint,
  options,
  placeholder = '選択してください',
  className = '',
}: BaseProps & { options: string[]; placeholder?: string }) {
  return (
    <div className={className}>
      <Label name={name} label={label} required={required} />
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={`${controlClass} ${error ? 'border-[#b3261e]' : 'border-line-strong'}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Messages name={name} error={error} hint={hint} />
    </div>
  )
}

export function RadioField({
  name,
  label,
  required,
  error,
  hint,
  options,
  className = '',
}: BaseProps & { options: string[] }) {
  return (
    <fieldset
      className={className}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(name, error, hint)}
    >
      <legend className="flex items-center gap-2 text-sm font-bold text-ink">
        {label}
        {required ? (
          <span className="bg-blue px-1.5 py-0.5 text-[0.65rem] font-bold text-white">必須</span>
        ) : (
          <span className="border border-line-strong px-1.5 py-0.5 text-[0.65rem] text-ink-soft">
            任意
          </span>
        )}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-line-strong bg-white px-4 py-2 text-[0.9rem] text-ink transition-colors has-checked:border-navy has-checked:bg-navy has-checked:text-white"
          >
            <input
              type="radio"
              name={name}
              value={option}
              required={required}
              className="h-4 w-4 accent-current"
            />
            {option}
          </label>
        ))}
      </div>
      <Messages name={name} error={error} hint={hint} />
    </fieldset>
  )
}

export function ConsentField({
  name,
  error,
  children,
}: {
  name: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 border border-line-strong bg-white p-4 text-[0.9rem] leading-7 text-ink has-checked:border-navy has-checked:bg-sky-soft">
        <input
          id={name}
          type="checkbox"
          name={name}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className="mt-1.5 h-5 w-5 shrink-0 accent-[#0a3d73]"
        />
        <span>{children}</span>
      </label>
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-xs leading-6 font-bold text-[#b3261e]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/** スパム対策の hidden 項目（画面には表示されません） */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="company">この項目は入力しないでください</label>
      <input id="company" type="text" name="company" tabIndex={-1} autoComplete="off" />
    </div>
  )
}
