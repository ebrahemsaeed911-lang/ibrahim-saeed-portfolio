import type { ReactNode } from 'react'
import { Reveal } from './reveal'

export function SectionHeading({
  index,
  label,
  title,
  description,
  align = 'left',
}: {
  index: string
  label: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
}) {
  const centered = align === 'center'

  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <Reveal>
        <p
          className={`flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground ${
            centered ? 'justify-center' : ''
          }`}
        >
          <span className="text-primary">{index}</span>
          <span className="text-border">/</span>
          <span>{label}</span>
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.1}>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">{description}</p>
        </Reveal>
      ) : null}
    </div>
  )
}
