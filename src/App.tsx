import { lazy, Suspense, useEffect } from 'react'
import { CustomCursor } from '@/components/portfolio/custom-cursor'
import { Particles } from '@/components/portfolio/particles'
import { Navbar } from '@/components/portfolio/navbar'
import { Hero } from '@/components/portfolio/hero'
import { usePortfolioData } from '@/data/use-portfolio-data'

const aboutImp = import('@/components/portfolio/about')
const skillsImp = import('@/components/portfolio/skills')
const experienceImp = import('@/components/portfolio/experience')
const projectsImp = import('@/components/portfolio/projects')
const servicesImp = import('@/components/portfolio/services')
const contactImp = import('@/components/portfolio/contact')
const footerImp = import('@/components/portfolio/footer')

const About = lazy(() => aboutImp)
const Skills = lazy(() => skillsImp)
const Experience = lazy(() => experienceImp)
const Projects = lazy(() => projectsImp)
const Services = lazy(() => servicesImp)
const Contact = lazy(() => contactImp)
const Footer = lazy(() => footerImp)

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
  }, [data.profile.name, data.profile.mainTitle, data.profile.favicon, data.profile.faviconText])

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
