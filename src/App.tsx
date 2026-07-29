import { useEffect, useState } from 'react'
import { CustomCursor } from '@/components/portfolio/custom-cursor'
import { Particles } from '@/components/portfolio/particles'
import { Navbar } from '@/components/portfolio/navbar'
import { Hero } from '@/components/portfolio/hero'
import About from '@/components/portfolio/about'
import Skills from '@/components/portfolio/skills'
import Experience from '@/components/portfolio/experience'
import Projects from '@/components/portfolio/projects'
import Services from '@/components/portfolio/services'
import Contact from '@/components/portfolio/contact'
import Footer from '@/components/portfolio/footer'
import { usePortfolioData } from '@/data/use-portfolio-data'

export default function App() {
  const { data } = usePortfolioData()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.title = `${data.profile.name} — ${data.profile.mainTitle}`

    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (link && data.profile.favicon) {
      link.href = data.profile.favicon
    }
  }, [data.profile.name, data.profile.mainTitle, data.profile.favicon])

  useEffect(() => { setReady(true) }, [])

  return (
    <>
      <CustomCursor />
      <Particles />
      <Navbar />
      <main className="relative">
        <Hero />
        {ready && (
          <>
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Services />
            <Contact />
          </>
        )}
      </main>
      {ready && <Footer />}
    </>
  )
}
