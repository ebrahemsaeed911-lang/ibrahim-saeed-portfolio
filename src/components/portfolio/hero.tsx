import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { usePortfolioData } from '@/data/use-portfolio-data'

const metadata = [
  { label: 'ROLE', key: 'role' },
  { label: 'FOCUS', key: 'focus' },
  { label: 'STATUS', key: 'status' },
  { label: 'LEARNING', key: 'learning' },
] as const

export function Hero() {
  const { data } = usePortfolioData()
  const { hero } = data

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const values: Record<(typeof metadata)[number]['key'], string> = {
    role: `${hero.title} ${hero.subtitle}`,
    focus: 'React · TypeScript · Next.js',
    status: hero.badge,
    learning: 'Node.js · Supabase',
  }

  return (
    <section id="home" className="relative overflow-hidden px-6 pb-24 pt-36 md:pb-32 md:pt-44">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-20 h-[640px]" />
      <div aria-hidden="true" className="ambient-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20">
        <div className="max-w-2xl">
          <div
            className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-border bg-card/60 px-3.5 py-1.5"
            style={{ animationDelay: '0.05s' }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-mono text-xs tracking-wide text-muted-foreground">
              {hero.badge}
            </span>
          </div>

          <h1
            className="animate-fade-up mt-7 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            style={{ animationDelay: '0.12s' }}
          >
            {data.profile.name}
          </h1>

          <p
            className="animate-fade-up mt-4 font-mono text-sm uppercase tracking-[0.18em] text-primary md:text-base"
            style={{ animationDelay: '0.2s' }}
          >
            {hero.title} {hero.subtitle}
            <span
              aria-hidden="true"
              className="animate-caret ms-1.5 inline-block h-3.5 w-[2px] translate-y-0.5 rounded-full bg-primary align-middle md:h-4"
            />
          </p>

          <p
            className="animate-fade-up mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ animationDelay: '0.28s' }}
          >
            {hero.description}
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: '0.36s' }}
          >
            <button
              onClick={() => go(hero.buttons.primary.action)}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              {hero.buttons.primary.text}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
            <button
              onClick={() => go(hero.buttons.secondary.action)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/40"
            >
              {hero.buttons.secondary.text}
            </button>
          </div>

          <button
            onClick={() => go('about')}
            aria-label="Scroll to about"
            className="animate-fade-up mt-12 hidden items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            style={{ animationDelay: '0.44s' }}
          >
            <ArrowDown size={14} />
            Scroll
          </button>
        </div>

        <div className="animate-fade-up flex flex-col gap-6" style={{ animationDelay: '0.18s' }}>
          <div className="relative mx-auto w-full max-w-[300px] lg:mx-0 lg:max-w-none">
            <div className="rounded-2xl border border-border bg-card p-1.5 shadow-[0_30px_90px_-56px_rgba(124,92,255,0.75),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
                <img
                  src={data.profile.profileImage}
                  alt={data.profile.name}
                  width={340}
                  height={425}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <dl className="w-full rounded-2xl border border-border bg-card/60 p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
            {metadata.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="text-right font-mono text-xs text-foreground">
                  {values[row.key]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
