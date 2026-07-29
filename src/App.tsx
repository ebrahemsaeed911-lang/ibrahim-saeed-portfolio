import { lazy, Suspense, useEffect } from 'react'
import { Loader } from '@/components/portfolio/loader'
import { CustomCursor } from '@/components/portfolio/custom-cursor'
import { Particles } from '@/components/portfolio/particles'
import { Navbar } from '@/components/portfolio/navbar'
import { Hero } from '@/components/portfolio/hero'
import { usePortfolioData } from '@/data/use-portfolio-data'

const About = lazy(() => import('@/components/portfolio/about').then(m => ({ default: m.About })))
const Skills = lazy(() => import('@/components/portfolio/skills').then(m => ({ default: m.Skills })))
const Experience = lazy(() => import('@/components/portfolio/experience').then(m => ({ default: m.Experience })))
const Projects = lazy(() => import('@/components/portfolio/projects').then(m => ({ default: m.Projects })))
const Services = lazy(() => import('@/components/portfolio/services').then(m => ({ default: m.Services })))
const Contact = lazy(() => import('@/components/portfolio/contact').then(m => ({ default: m.Contact })))
const Footer = lazy(() => import('@/components/portfolio/footer').then(m => ({ default: m.Footer })))

export default function App() {
  const { data } = usePortfolioData()

  useEffect(() => {
    document.title = `${data.profile.name} — ${data.profile.mainTitle}`

    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (link && data.profile.favicon) {
      link.href = data.profile.favicon
    }
  }, [data.profile.name, data.profile.mainTitle, data.profile.favicon])

  return (
    <>
      <Loader />
      <CustomCursor />
      <Particles />
      <Navbar />
      <main className="relative">
        <Hero />
        <Suspense fallback={null}><About /></Suspense>
        <Suspense fallback={null}><Skills /></Suspense>
        <Suspense fallback={null}><Experience /></Suspense>
        <Suspense fallback={null}><Projects /></Suspense>
        <Suspense fallback={null}><Services /></Suspense>
        <Suspense fallback={null}><Contact /></Suspense>
      </main>
      <Suspense fallback={null}><Footer /></Suspense>
    </>
  )
}
