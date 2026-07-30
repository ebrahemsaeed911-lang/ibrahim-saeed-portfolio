import About from '@/components/portfolio/about'
import Skills from '@/components/portfolio/skills'
import Experience from '@/components/portfolio/experience'
import Projects from '@/components/portfolio/projects'
import Services from '@/components/portfolio/services'
import Contact from '@/components/portfolio/contact'
import Footer from '@/components/portfolio/footer'

export default function SectionsLazy() {
  return (
    <>
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Services />
      <Contact />
      <Footer />
    </>
  )
}
