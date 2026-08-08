import { Photo } from '@/components/ui/Photo'
import { Reveal } from '@/components/ui/Reveal'
import type { ColumnSection } from '@/data/columns'

/** 記事の目次 */
export function TableOfContents({ sections }: { sections: ColumnSection[] }) {
  if (sections.length === 0) return null

  return (
    <nav aria-labelledby="toc-heading" className="border border-line bg-mist p-6 sm:p-7">
      <h2 id="toc-heading" className="text-sm font-bold text-ink">
        この記事の内容
      </h2>
      <ol className="mt-4 space-y-2.5">
        {sections.map((section, index) => (
          <li key={section.id} className="flex gap-3 text-[0.9rem] leading-6">
            <span aria-hidden="true" className="font-mono text-xs text-blue tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <a href={`#${section.id}`} className="link-underline">
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** 記事本文の描画 */
export function ColumnBody({ sections }: { sections: ColumnSection[] }) {
  return (
    <div className="space-y-14">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <Reveal>
            <h2 className="border-l-4 border-blue pl-4 text-xl leading-snug font-bold text-ink sm:text-2xl">
              {section.heading}
            </h2>

            {section.body ? (
              <div className="mt-6 space-y-5 text-[0.975rem] leading-9 text-ink-soft">
                {section.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {section.image ? (
              <figure className="mt-8">
                <div className="relative aspect-16/9 overflow-hidden bg-sky-soft">
                  <Photo
                    src={section.image.src}
                    alt={section.image.alt}
                    fill
                    sizes="(min-width: 768px) 48rem, 92vw"
                    fallback="hide"
                  />
                </div>
                {section.image.caption ? (
                  <figcaption className="mt-2 text-xs text-ink-soft">
                    {section.image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            {section.list ? (
              <ul className="mt-6 border-t border-line">
                {section.list.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-line py-3.5 text-[0.95rem] leading-7 text-ink"
                  >
                    <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 bg-blue" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {section.steps ? (
              <ol className="mt-6 border-l border-line">
                {section.steps.map((step, index) => (
                  <li key={step.title} className="relative pb-7 pl-7 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue font-mono text-[0.65rem] font-bold text-white tabular-nums"
                    >
                      {index + 1}
                    </span>
                    <h3 className="text-base font-bold text-ink">{step.title}</h3>
                    <p className="mt-2 text-[0.925rem] leading-8 text-ink-soft">{step.body}</p>
                  </li>
                ))}
              </ol>
            ) : null}

            {section.subsections ? (
              <div className="mt-8 space-y-8">
                {section.subsections.map((sub) => (
                  <div key={sub.heading}>
                    <h3 className="text-base font-bold text-navy sm:text-lg">{sub.heading}</h3>
                    <div className="mt-3 space-y-4 text-[0.95rem] leading-9 text-ink-soft">
                      {sub.body.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {section.note ? (
              <p className="mt-8 border-l-4 border-blue bg-sky-soft p-5 text-[0.925rem] leading-8 text-ink">
                {section.note}
              </p>
            ) : null}
          </Reveal>
        </section>
      ))}
    </div>
  )
}
