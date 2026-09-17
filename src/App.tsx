import { lazy, Suspense, useEffect } from 'react'
import { Navbar } from '@/components/portfolio/navbar'
import { Hero } from '@/components/portfolio/hero'
import { usePortfolioData } from '@/data/use-portfolio-data'

const CustomCursor = lazy(() =>
  import('@/components/portfolio/custom-cursor').then((m) => ({ default: m.CustomCursor }))
)
const Particles = lazy(() =>
  import('@/components/portfolio/particles').then((m) => ({ default: m.Particles }))
)
const SectionsLazy = lazy(() => import('@/components/portfolio/sections-lazy'))

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export default function App() {
  const { data } = usePortfolioData()

  useEffect(() => {
    document.title = `${data.profile.name} — ${data.profile.mainTitle}`

    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (link) {
      const txt = data.profile.faviconText || 'IS'
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#08090a"/><text x="16" y="22" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#fafafa">${escapeXml(txt)}</text></svg>`
      link.href = data.profile.favicon || 'data:image/svg+xml,' + encodeURIComponent(svg)
    }

    import('@/components/portfolio/sections-lazy')
  }, [data.profile.name, data.profile.mainTitle, data.profile.favicon, data.profile.faviconText])

  return (
    <>
      <div aria-hidden="true" className="bg-grid pointer-events-none fixed inset-0 -z-10" />
      <Suspense fallback={null}>
        <Particles />
      </Suspense>
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>
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
