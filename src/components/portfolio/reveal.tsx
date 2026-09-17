import type { ReactNode } from 'react'
import { useInView } from '@/hooks/use-in-view'

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView({ rootMargin: '-40px', threshold: 0.05 })

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}s` : '0s' }}
    >
      {children}
    </div>
  )
}
