import { Container } from '@/components/ui/Container'
import { site } from '@/data/site'

/**
 * 臨時休業のお知らせ（トップページ最上部）。
 *
 * ヒーローより上に置き、ページを開いた瞬間に必ず目に入るようにしています。
 * 表示の切り替えと文言は src/data/site.ts の temporaryClosure で管理します。
 */
export function ClosureNotice() {
  const { title, message } = site.temporaryClosure

  return (
    <section
      aria-labelledby="closure-heading"
      className="border-y-4 border-navy bg-sky-soft"
    >
      <Container>
        <div className="py-12 text-center sm:py-16 lg:py-20">
          <p className="inline-flex items-center gap-2 bg-navy px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-white">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="10" cy="10" r="7.5" />
              <path d="M10 6v4.5" strokeLinecap="round" />
              <circle cx="10" cy="13.75" r="0.6" fill="currentColor" />
            </svg>
            重要なお知らせ
          </p>
          <h2
            id="closure-heading"
            className="mt-6 text-[2rem] leading-[1.25] font-bold tracking-tight text-navy-deep sm:text-5xl lg:text-6xl"
          >
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[0.975rem] leading-8 text-ink-soft sm:text-base sm:leading-9">
            {message}
          </p>
        </div>
      </Container>
    </section>
  )
}
