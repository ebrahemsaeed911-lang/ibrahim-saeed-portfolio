import { useEffect, useState } from 'react'
import About from '@/components/portfolio/about'
import Skills from '@/components/portfolio/skills'
import Experience from '@/components/portfolio/experience'
import Projects from '@/components/portfolio/projects'
import Services from '@/components/portfolio/services'
import Contact from '@/components/portfolio/contact'
import Footer from '@/components/portfolio/footer'

export default function SectionsLazy() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= 7) return
    const t = setTimeout(() => setStep(s => s + 1), 60)
    return () => clearTimeout(t)
  }, [step])

  return (
    <>
      {step >= 1 && <About />}
      {step >= 2 && <Skills />}
      {step >= 3 && <Experience />}
      {step >= 4 && <Projects />}
      {step >= 5 && <Services />}
      {step >= 6 && <Contact />}
      {step >= 7 && <Footer />}
    </>
  )
}
