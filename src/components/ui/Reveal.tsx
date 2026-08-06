'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** 表示開始の遅延（ミリ秒） */
  delay?: number
  className?: string
  as?: ElementType
}

/**
 * スクロールで控えめにフェードインさせるだけの軽量コンポーネント。
 *
 * 再レンダリングを起こさないよう、状態ではなく data 属性を直接書き換えています。
 * prefers-reduced-motion: reduce の場合は CSS 側でアニメーションを無効化しており、
 * IntersectionObserver が使えない環境では即座に表示されます。
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => {
      el.dataset.visible = 'true'
    }

    if (typeof IntersectionObserver === 'undefined') {
      show()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show()
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-visible="false"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
