import { lazy, Suspense, useEffect } from 'react'
import { CustomCursor } from '@/components/portfolio/custom-cursor'
import { Particles } from '@/components/portfolio/particles'
import { Navbar } from '@/components/portfolio/navbar'
import { Hero } from '@/components/portfolio/hero'
import { usePortfolioData } from '@/data/use-portfolio-data'

const About = lazy(() => import('@/components/portfolio/about'))
const Skills = lazy(() => import('@/components/portfolio/skills'))
const Experience = lazy(() => import('@/components/portfolio/experience'))
const Projects = lazy(() => import('@/components/portfolio/projects'))
const Services = lazy(() => import('@/components/portfolio/services'))
const Contact = lazy(() => import('@/components/portfolio/contact'))
const Footer = lazy(() => import('@/components/portfolio/footer'))

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
