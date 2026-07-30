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
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
          setScrolled(scrollTop > 24)
          ticking = false
        })
        ticking = true
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    nav.links.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [nav.links])

  const go = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 animate-slide-down"
      >
        <nav
          className={`flex w-full max-w-5xl items-center justify-between rounded-full px-3 py-2.5 transition-all duration-300 md:px-5 ${
            scrolled ? 'glass glow-ring' : 'border border-transparent'
          }`}
        >
          <button
            onClick={handleLogoClicks}
            className="group flex items-center gap-2 pl-2 font-mono text-sm font-semibold tracking-tight"
          >
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-12">
              {data.profile.initials}
            </span>
            <span className="hidden text-foreground sm:inline">{data.profile.name}</span>
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.links.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {active === l.id && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-secondary" />
                  )}
                  <span className={active === l.id ? 'text-foreground' : undefined}>
                    {l.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => go('contact')}
              className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:scale-105 sm:block"
            >
              {nav.talkText}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-foreground md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      <div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-primary to-accent"
        style={{ transform: `scaleX(${progress})` }}
      />

      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-xl md:hidden animate-fade-in"
        >
          {nav.links.map((l, i) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`text-2xl font-medium animate-fade-slide-up ${
                active === l.id ? 'text-gradient' : 'text-muted-foreground'
              }`}
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
            >
              {l.label}
            </button>
          ))}
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
