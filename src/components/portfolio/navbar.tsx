import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
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
  const clickCount = useRef(0)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

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
    const onScroll = () => setScrolled(window.scrollY > 24)
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
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
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
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-secondary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
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
      </motion.header>

      <motion.div
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-primary to-accent"
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-xl md:hidden"
          >
            {nav.links.map((l, i) => (
              <motion.button
                key={l.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => go(l.id)}
                className={`text-2xl font-medium ${
                  active === l.id ? 'text-gradient' : 'text-muted-foreground'
                }`}
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {showAdmin && (
        <Suspense fallback={null}>
          <AdminOverlay onClose={() => setShowAdmin(false)} />
        </Suspense>
      )}
    </>
  )
}
