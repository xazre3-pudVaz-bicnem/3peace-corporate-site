import type { Faq } from '@/data/faq'

/**
 * details/summary で実装した FAQ。
 * JavaScript を追加せずにキーボード操作・スクリーンリーダーへ対応します。
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null

  return (
    <div className="border-t border-line">
      {faqs.map((faq) => (
        <details key={faq.id} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-start gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="mt-0.5 text-sm font-bold text-blue">
              Q
            </span>
            <span className="flex-1 text-[1.0625rem] font-bold text-ink">{faq.question}</span>
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-blue transition-transform duration-200 group-open:rotate-45"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 2v12M2 8h12" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <div className="flex gap-4 pb-6">
            <span aria-hidden="true" className="text-sm font-bold text-ink-soft">
              A
            </span>
            <div className="flex-1 space-y-3 text-[0.95rem] leading-8 text-ink-soft">
              {faq.answer.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </details>
      ))}
    </div>
  )
}
