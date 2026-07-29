import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { usePortfolioData } from '@/data/use-portfolio-data'

const steps = [
  { label: 'Initializing', range: [0, 15] },
  { label: 'Loading assets', range: [15, 40] },
  { label: 'Compiling modules', range: [40, 65] },
  { label: 'Optimizing render', range: [65, 85] },
  { label: 'Almost ready', range: [85, 100] },
]

export function Loader() {
  const { data } = usePortfolioData()
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    let frame: number
    let startTime = performance.now()
    const duration = 800

    function animate(now: number) {
      const elapsed = now - startTime
      const raw = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - raw, 3)
      const pct = eased * 100
      setProgress(pct)
      if (pct < 100) {
        frame = requestAnimationFrame(animate)
      } else {
        setShow(false)
      }
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const currentStep = steps.findLast((s) => progress >= s.range[0]) ?? steps[0]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <div className="flex w-80 flex-col items-center gap-10">
            {/* Name */}
            <p className="text-2xl font-bold tracking-widest text-foreground">
              {data.profile.name}
            </p>

            {/* Line in the middle with fill/unfill scan effect */}
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-secondary">
              {/* Base fill bar */}
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.15 }}
              />
              {/* Scanning glow */}
              <motion.div
                className="absolute inset-y-0 w-12 rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent blur-sm"
                animate={{
                  left: ['-20%', '120%'],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Percentage and status */}
            <div className="flex w-full items-center justify-between text-sm">
              <motion.span
                key={currentStep.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-muted-foreground"
              >
                {currentStep.label}...
              </motion.span>
              <span className="font-semibold tabular-nums text-foreground">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
