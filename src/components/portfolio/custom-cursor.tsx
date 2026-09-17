import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [suppressed, setSuppressed] = useState(false)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const sync = () => {
      const inAdmin = Boolean(document.querySelector('[data-admin]'))
      setSuppressed(inAdmin)
      document.documentElement.classList.toggle('cursor-none-fine', !inAdmin)
    }

    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true })
    sync()

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: target.x, y: target.y }
    let hovering = false
    let animId = 0

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      const el = e.target as HTMLElement | null
      hovering = Boolean(el?.closest('a, button, [role="button"], input, textarea, select'))
    }

    const render = () => {
      ring.x += (target.x - ring.x) * 0.18
      ring.y += (target.y - ring.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%) scale(${hovering ? 1.7 : 1})`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.x}px, ${target.y}px) translate(-50%, -50%)`
      }
      animId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMove)
    animId = requestAnimationFrame(render)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
      observer.disconnect()
      document.documentElement.classList.remove('cursor-none-fine')
    }
  }, [])

  if (!enabled || suppressed) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998] hidden md:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-8 w-8 rounded-full border border-primary/70 transition-[width,height] duration-200"
      />
      <div ref={dotRef} className="absolute left-0 top-0 h-1 w-1 rounded-full bg-primary" />
    </div>
  )
}
