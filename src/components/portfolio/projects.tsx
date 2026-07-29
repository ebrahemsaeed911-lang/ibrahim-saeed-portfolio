import { motion } from 'motion/react'
import { ArrowUpRight, ExternalLink, Code } from 'lucide-react'
import { Reveal } from './reveal'
import { GithubIcon } from './brand-icons'

type ProjectType = 'Web App' | 'Desktop App'

interface Project {
  title: string
  desc: string
  image: string
  tags: string[]
  type: ProjectType
  demo: string
  github?: string
}

const projects: Project[] = [
  {
    title: 'Noor Islamic Web',
    desc: 'Comprehensive Islamic app: full Quran with reciters, athkar, prayer times, tasbeeh, ruqyah, and more.',
    image: '/project-noor.png',
    tags: ['JavaScript', 'HTML', 'CSS', 'PWA'],
    type: 'Web App',
    demo: 'https://noor-islamic-web.vercel.app',
  },
  {
    title: 'Work Time Tracker',
    desc: 'Track attendance, calculate work hours, expected salary, and deductions. Export reports to PDF and CSV.',
    image: '/project-wtt.png',
    tags: ['JavaScript', 'HTML', 'CSS', 'PWA'],
    type: 'Web App',
    demo: 'https://work-time-tracker-ibrahim.vercel.app/',
  },
  {
    title: 'Personal Portfolio',
    desc: 'Interactive portfolio with dark mode, glassmorphism, smooth animations, custom cursor, particles, and email integration.',
    image: '/project-portfolio.png',
    tags: ['React', 'JavaScript', 'Tailwind CSS', 'TypeScript'],
    type: 'Web App',
    demo: '#home',
  },
  {
    title: 'Weather App',
    desc: 'Desktop weather app built with Python and Tkinter. Fetches real-time temperature, humidity, wind speed, and pressure using the OpenWeatherMap API.',
    image: '/project-weather.png',
    tags: ['Python', 'Tkinter', 'API'],
    type: 'Desktop App',
    demo: '#',
    github: 'https://github.com/ebrahemsaeed911-lang/weather-app/blob/main/weather%20-app.py',
  },
  {
    title: 'Text Editor',
    desc: 'Multi-tab text editor built with Python and Tkinter. Features file management, keyboard shortcuts, sidebar controls, and tabbed interface.',
    image: '/project-text-editor.png',
    tags: ['Python', 'Tkinter', 'GUI'],
    type: 'Desktop App',
    demo: '#',
    github: 'https://github.com/ebrahemsaeed911-lang/text-editor/blob/main/text_editor%20.py',
  },
]

const badgeStyles: Record<ProjectType, string> = {
  'Web App': 'border-primary/30 bg-primary/15 text-primary',
  'Desktop App': 'border-sky-500/30 bg-sky-500/15 text-sky-400',
}

const overlayStyles: Record<ProjectType, string> = {
  'Web App': 'from-card via-card/20 to-transparent',
  'Desktop App': 'from-card via-sky-950/20 to-transparent',
}

export function Projects() {
  return (
    <section id="projects" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-primary">Selected Work</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">Projects I'm proud of</h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A selection of recent builds — each crafted with attention to detail, performance, and delightful interaction.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto grid max-w-4xl gap-7 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border transition-transform duration-300 hover:-translate-y-2 ${
                p.type === 'Desktop App'
                  ? 'glass border-sky-500/10 hover:border-sky-500/30'
                  : 'glass hover:border-primary/30'
              }`}
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <img
                  src={p.image}
                  alt={`${p.title} preview`}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${overlayStyles[p.type]}`} />
                <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider backdrop-blur-sm ${badgeStyles[p.type]}`}>
                  {p.type}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full px-3 py-1 font-mono text-xs ${
                        p.type === 'Desktop App' ? 'bg-sky-500/10 text-sky-400' : 'bg-secondary text-primary'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

                <div className="mt-6 flex items-center gap-3">
                  {p.demo && p.demo !== '#' && (
                    p.demo === '#home' ? (
                      <button
                        onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
                      >
                        Visit Site <ExternalLink size={15} />
                      </button>
                    ) : (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] ${
                          p.type === 'Desktop App' ? 'bg-sky-500 hover:bg-sky-400' : 'bg-primary'
                        }`}
                      >
                        {p.type === 'Desktop App' ? 'View Source' : 'Visit Site'}
                        {p.type === 'Desktop App' ? <Code size={15} /> : <ExternalLink size={15} />}
                      </a>
                    )
                  )}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                    >
                      <GithubIcon size={16} /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
