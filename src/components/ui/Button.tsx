import Link from 'next/link'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost' | 'light' | 'lightOutline'
type Size = 'md' | 'lg'

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 text-[0.95rem] font-bold tracking-wide transition-colors duration-200'

const variants: Record<Variant, string> = {
  primary: 'bg-navy text-white hover:bg-blue',
  outline: 'border border-navy text-navy hover:bg-navy hover:text-white',
  ghost: 'text-navy underline underline-offset-4 hover:text-blue',
  light: 'bg-white text-navy hover:bg-sky',
  lightOutline: 'border border-white/70 text-white hover:bg-white hover:text-navy',
}

const sizes: Record<Size, string> = {
  md: '',
  lg: 'sm:min-h-13 sm:px-8 sm:text-base',
}

type LinkProps = {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  /** 外部リンク */
  external?: boolean
  'aria-label'?: string
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  external = false,
  ...rest
}: LinkProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (external || href.startsWith('tel:') || href.startsWith('http')) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  )
}

export function ArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M3 10h13M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PhoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 ${className}`}
      fill="currentColor"
    >
      <path d="M6.6 2.3a1.3 1.3 0 0 1 1.8.5l1.2 2.2a1.3 1.3 0 0 1-.3 1.6l-1 .8a9 9 0 0 0 4.3 4.3l.8-1a1.3 1.3 0 0 1 1.6-.3l2.2 1.2a1.3 1.3 0 0 1 .5 1.8l-.9 1.5a2.2 2.2 0 0 1-2.5 1A15.6 15.6 0 0 1 3.2 6.2a2.2 2.2 0 0 1 1-2.5l1.5-.9Z" />
    </svg>
  )
}
