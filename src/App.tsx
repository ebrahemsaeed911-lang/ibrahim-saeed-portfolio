import { lazy, Suspense, useEffect } from 'react'
import { Navbar } from '@/components/portfolio/navbar'
import { Hero } from '@/components/portfolio/hero'
import { usePortfolioData } from '@/data/use-portfolio-data'

const CustomCursor = lazy(() => import('@/components/portfolio/custom-cursor').then(m => ({ default: m.CustomCursor })))
const Particles = lazy(() => import('@/components/portfolio/particles').then(m => ({ default: m.Particles })))
const SectionsLazy = lazy(() => import('@/components/portfolio/sections-lazy'))

export default function App() {
  const { data } = usePortfolioData()

  useEffect(() => {
    document.title = `${data.profile.name} — ${data.profile.mainTitle}`

    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (link) {
      const txt = data.profile.faviconText || 'IS'
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0c1014"/><text x="16" y="22" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#e2e8f0">${txt}</text></svg>`
      link.href = data.profile.favicon || 'data:image/svg+xml,' + encodeURIComponent(svg)
    }

    import('@/components/portfolio/sections-lazy')
  }, [data.profile.name, data.profile.mainTitle, data.profile.favicon, data.profile.faviconText])

  return (
    <>
      <Suspense fallback={null}><CustomCursor /></Suspense>
      <Suspense fallback={null}><Particles /></Suspense>
      <Navbar />
      <main className="relative">
        <Hero />
        <Suspense fallback={null}>
          <SectionsLazy />
        </Suspense>
      </main>
    </>
  )
}
