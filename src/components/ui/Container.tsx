import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** narrow: 読み物向け / default: 標準 / wide: 全幅寄り */
  width?: 'narrow' | 'default' | 'wide'
  className?: string
}

const widths = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
}

export function Container({ children, width = 'default', className = '' }: Props) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-6 lg:px-8 ${widths[width]} ${className}`}>
      {children}
    </div>
  )
}
