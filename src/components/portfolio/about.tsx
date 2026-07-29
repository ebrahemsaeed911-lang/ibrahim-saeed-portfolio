import { motion } from 'motion/react'
import { Reveal } from './reveal'

const stats = [
  { value: '1+', label: 'Year Learning' },
  { value: '+5', label: 'Projects Built' },
  { value: '100%', label: 'Self-Taught' },
]

export function About() {
  return (
    <section id="about" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <Reveal>
          <div className="group relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/30 to-accent/30 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
            <div className="glass overflow-hidden rounded-[1.75rem] p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
                <img
                  src="/profile.png"
                  alt="Portrait of Ibrahim Saeed, front-end developer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="glass absolute -bottom-5 -right-3 rounded-2xl px-4 py-3 text-sm"
            >
              <p className="font-mono text-primary">{'<coder/>'}</p>
              <p className="text-xs text-muted-foreground">Clean &amp; modern</p>
            </motion.div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-3 font-mono text-sm uppercase tracking-[0.3em] text-primary">About Me</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Turning ideas into refined web experiences
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              I&apos;m a passionate front-end developer learning React and
              modern web technologies. I enjoy turning ideas into clean,
              responsive interfaces that look great and work smoothly
              across every device.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Currently focused on React, TypeScript, and building projects
              that solve real problems. Every line of code is a step forward
              in my learning journey.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center transition-transform hover:-translate-y-1">
                  <p className="text-2xl font-semibold text-gradient sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
