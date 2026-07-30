import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { usePortfolioData } from '@/data/use-portfolio-data'

const floats = [
  { label: '</>', top: '18%', left: '8%', delay: 0, dur: 6 },
  { label: '{ }', top: '26%', right: '10%', delay: 0.5, dur: 7 },
  { label: 'CSS', bottom: '24%', left: '12%', delay: 1, dur: 8 },
  { label: 'JS', bottom: '30%', right: '14%', delay: 1.5, dur: 6.5 },
]

export function Hero() {
  const { data } = usePortfolioData()
  const ref = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const { hero } = data

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = ref.current?.getBoundingClientRect()
          if (rect) {
            const progress = Math.min(1, Math.max(0, -rect.top / rect.height))
            const y = progress * 160
            const opacity = Math.max(0, 1 - progress / 0.7)
            if (contentRef.current) {
              contentRef.current.style.transform = `translateY(${y}px)`
              contentRef.current.style.opacity = String(opacity)
            }
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 -z-10 h-[320px] w-[320px] rounded-full bg-accent/20 blur-[120px]" />

      {floats.map((f, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="glass absolute hidden rounded-2xl px-4 py-3 font-mono text-sm text-primary md:block"
          style={{ top: f.top, left: f.left, right: f.right, bottom: f.bottom, animation: `float ${f.dur}s ease-in-out ${f.delay}s infinite` }}
        >
          {f.label}
        </div>
      ))}

      <div ref={contentRef} className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:text-left">
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <div
            className="glass mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted-foreground animate-fade-slide-up"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {hero.badge}
          </div>

          <p
            className="mb-3 flex items-center gap-2 font-mono text-sm uppercase tracking-[0.3em] text-primary animate-fade-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <Sparkles size={14} /> Hi, I'm {data.profile.name}
          </p>

          <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            {hero.title.split('').map((c, i) => (
              <span
                key={i}
                className="inline-block animate-fade-slide-up"
                style={{ animationDelay: `${0.2 + i * 0.03}s`, animationFillMode: 'both' }}
              >
                {c === ' ' ? '\u00A0' : c}
              </span>
            ))}
            <br />
            <span className="text-gradient">{hero.subtitle}</span>
          </h1>

          <p
            className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground animate-fade-in"
            style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
          >
            {hero.description}
          </p>

          <div
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:items-start animate-fade-slide-up"
            style={{ animationDelay: '0.85s', animationFillMode: 'both' }}
          >
            <button
              onClick={() => go(hero.buttons.primary.action)}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground transition-transform hover:scale-105"
            >
              {hero.buttons.primary.text}
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => go(hero.buttons.secondary.action)}
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium text-foreground transition-colors hover:border-primary/50"
            >
              {hero.buttons.secondary.text}
            </button>
          </div>
        </div>

        <div
          className="relative shrink-0 animate-fade-scale-in"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/40 to-accent/40 blur-3xl" />
          <div className="relative h-64 w-64 overflow-hidden rounded-full border-2 border-border bg-secondary sm:h-72 sm:w-72 md:h-80 md:w-80">
            <img
              src={data.profile.profileImage + '?width=400'}
              alt={data.profile.name}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => go('about')}
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground animate-fade-in"
        style={{ animationDelay: '1.2s', animationFillMode: 'both' }}
      >
        <span className="block animate-bounce-arrow" style={{ animationDuration: '1.6s' }}>
          <ArrowDown size={22} />
        </span>
      </button>
    </section>
  )
}
