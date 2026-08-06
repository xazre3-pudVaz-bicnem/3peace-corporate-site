import type { ElementType, ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

type SectionProps = {
  children: ReactNode
  id?: string
  /** 背景 */
  tone?: 'white' | 'mist' | 'sky' | 'navy'
  width?: 'narrow' | 'default' | 'wide'
  /** 上下の余白 */
  space?: 'normal' | 'tight' | 'loose'
  className?: string
  /** 上に区切り罫線を引く */
  divided?: boolean
  as?: ElementType
  'aria-labelledby'?: string
}

const tones = {
  white: 'bg-white',
  mist: 'bg-mist',
  sky: 'bg-sky-soft',
  navy: 'bg-navy-deep text-white',
}

const spaces = {
  tight: 'py-12 sm:py-16',
  normal: 'py-16 sm:py-24',
  loose: 'py-20 sm:py-32',
}

export function Section({
  children,
  id,
  tone = 'white',
  width = 'default',
  space = 'normal',
  className = '',
  divided = false,
  as: Tag = 'section',
  ...rest
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={`${tones[tone]} ${spaces[space]} ${divided ? 'border-t border-line' : ''} ${className}`}
      {...rest}
    >
      <Container width={width}>{children}</Container>
    </Tag>
  )
}

type HeadingProps = {
  /** 01, 02 などの通し番号やラベル */
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  id?: string
  level?: 2 | 3
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  level = 2,
  align = 'left',
  tone = 'dark',
  className = '',
}: HeadingProps) {
  const Tag: ElementType = level === 2 ? 'h2' : 'h3'
  const titleColor = tone === 'light' ? 'text-white' : 'text-ink'
  const leadColor = tone === 'light' ? 'text-sky' : 'text-ink-soft'

  return (
    <Reveal className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      {eyebrow ? (
        <p className={`eyebrow ${tone === 'light' ? 'text-sky' : ''} ${align === 'center' ? 'justify-center' : ''}`}>
          {eyebrow}
        </p>
      ) : null}
      <Tag
        id={id}
        className={`mt-4 text-2xl leading-snug sm:text-3xl lg:text-[2.125rem] ${titleColor}`}
      >
        {title}
      </Tag>
      {lead ? (
        <div className={`mt-5 max-w-3xl text-[0.975rem] leading-8 ${leadColor} ${align === 'center' ? 'mx-auto' : ''}`}>
          {lead}
        </div>
      ) : null}
    </Reveal>
  )
}
