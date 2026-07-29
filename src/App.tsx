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
