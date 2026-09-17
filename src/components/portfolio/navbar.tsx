import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePortfolioData } from '@/data/use-portfolio-data'

const AdminOverlay = lazy(() => import('@/components/admin/admin-overlay'))

export function Navbar() {
  const { data } = usePortfolioData()
  const { nav } = data
  const [showAdmin, setShowAdmin] = useState(false)
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const clickCount = useRef(0)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleLogoClicks() {
    clickCount.current++
    if (clickTimer.current) clearTimeout(clickTimer.current)
    if (clickCount.current >= 3) {
      clickCount.current = 0
      setShowAdmin(true)
      return
    }
    clickTimer.current = setTimeout(() => { clickCount.current = 0 }, 1500)
  }

  useEffect(() => {
    let ticking = false
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0)
      setScrolled(scrollTop > 24)

      const marker = window.innerHeight * 0.35
      let current = nav.links[0]?.id ?? 'home'
      for (const l of nav.links) {
        const el = document.getElementById(l.id)
        if (el && el.getBoundingClientRect().top <= marker) current = l.id
      }
      if (docHeight > 0 && scrollTop >= docHeight - 2 && nav.links.length) {
        current = nav.links[nav.links.length - 1].id
      }
      setActive(current)
    }
    const schedule = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
    }
  }, [nav.links])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header className="animate-slide-down fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav
          aria-label="Primary"
          className={`relative flex w-full max-w-5xl items-center justify-between overflow-hidden rounded-2xl px-2.5 py-2 transition-all duration-300 md:px-3 ${
            scrolled || open
              ? 'glass shadow-[0_12px_40px_-24px_rgba(0,0,0,0.9)]'
              : 'border border-transparent'
          }`}
        >
          <button
            onClick={handleLogoClicks}
            aria-label={`${data.profile.name} — home`}
            className="group flex items-center gap-2.5 rounded-xl px-2 py-1"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-card font-mono text-[11px] font-semibold text-foreground transition-colors duration-300 group-hover:border-primary/50 group-hover:text-primary">
              {data.profile.initials}
            </span>
            <span className="hidden text-sm font-medium tracking-tight text-foreground sm:inline">
              {data.profile.name}
            </span>
          </button>

          <ul className="hidden items-center gap-0.5 md:flex">
            {nav.links.map((l) => {
              const isActive = active === l.id
              return (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {l.label}
                    <span
                      className={`absolute inset-x-3 bottom-0.5 h-px origin-center bg-primary transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go('contact')}
              className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 sm:block"
            >
              {nav.talkText}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary md:hidden"
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-primary transition-transform duration-150 ease-out"
            style={{ transform: `scaleX(${progress})` }}
          />
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-background/95 px-6 pb-10 pt-24 backdrop-blur-xl md:hidden animate-fade-in">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Navigate
          </p>
          <ul className="mt-6 flex flex-1 flex-col">
            {nav.links.map((l, i) => {
              const isActive = active === l.id
              return (
                <li key={l.id} className="border-b border-border/70">
                  <button
                    onClick={() => go(l.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className="flex w-full items-center gap-4 py-4 text-left"
                  >
                    <span
                      className={`font-mono text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-2xl font-medium tracking-tight transition-colors ${
                        isActive ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {l.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            onClick={() => go('contact')}
            className="mt-8 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-medium text-primary-foreground"
          >
            {nav.talkText}
          </button>
        </div>
      )}

      {showAdmin && (
        <Suspense fallback={null}>
          <AdminOverlay onClose={() => setShowAdmin(false)} />
        </Suspense>
      )}
    </>
  )
}
