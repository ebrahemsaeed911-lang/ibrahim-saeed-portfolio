import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'
import { useRef } from 'react'

const floats = [
  { label: '</>', top: '18%', left: '8%', delay: 0, dur: 6 },
  { label: '{ }', top: '26%', right: '10%', delay: 0.5, dur: 7 },
  { label: 'CSS', bottom: '24%', left: '12%', delay: 1, dur: 8 },
  { label: 'JS', bottom: '30%', right: '14%', delay: 1.5, dur: 6.5 },
]

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 160])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 -z-10 h-[320px] w-[320px] rounded-full bg-accent/20 blur-[120px]" />

      {floats.map((f, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="glass absolute hidden rounded-2xl px-4 py-3 font-mono text-sm text-primary md:block"
          style={{ top: f.top, left: f.left, right: f.right, bottom: f.bottom }}
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {f.label}
        </motion.div>
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:text-left">
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Open to opportunities
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-3 flex items-center gap-2 font-mono text-sm uppercase tracking-[0.3em] text-primary"
          >
            <Sparkles size={14} /> Hi, I&apos;m Ibrahim Saeed
          </motion.p>

          <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            {'Front-End'.split('').map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {c === ' ' ? '\u00A0' : c}
              </motion.span>
            ))}
            <br />
            <span className="text-gradient">Developer</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            A passionate self-taught developer learning to build clean,
            responsive websites and applications with React, HTML, CSS,
            JavaScript, and Python.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:items-start"
          >
            <button
              onClick={() => go('projects')}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground transition-transform hover:scale-105"
            >
              View Projects
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => go('contact')}
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium text-foreground transition-colors hover:border-primary/50"
            >
              Contact Me
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative shrink-0"
        >
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/40 to-accent/40 blur-3xl" />
          <div className="relative h-64 w-64 overflow-hidden rounded-full border-2 border-border sm:h-72 sm:w-72 md:h-80 md:w-80">
            <img
              src="/profile.png"
              alt="Ibrahim Saeed"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => go('about')}
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="block"
        >
          <ArrowDown size={22} />
        </motion.span>
      </motion.button>
    </section>
  )
}
