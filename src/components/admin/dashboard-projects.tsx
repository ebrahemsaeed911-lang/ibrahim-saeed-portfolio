import { useEffect, useRef } from 'react'
import type { PortfolioData } from '@/data/use-portfolio-data'
import ImageUploader from './image-uploader'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

export default function DashboardProjects({ data, onChange }: Props) {
  const p = data.projects
  const itemsRef = useRef<HTMLDivElement>(null)
  const prevCount = useRef(p.items.length)

  useEffect(() => {
    if (p.items.length > prevCount.current) {
      const el = itemsRef.current?.lastElementChild
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    prevCount.current = p.items.length
  }, [p.items.length])

  function updateItem(index: number, field: string, val: any) {
    const items = [...p.items]
    items[index] = { ...items[index], [field]: val }
    onChange({ ...data, projects: { ...p, items } })
  }

  function updateTag(projIndex: number, tagIndex: number, val: string) {
    const items = [...p.items]
    const tags = [...items[projIndex].tags]
    tags[tagIndex] = val
    items[projIndex] = { ...items[projIndex], tags }
    onChange({ ...data, projects: { ...p, items } })
  }

  function removeItem(index: number) {
    onChange({ ...data, projects: { ...p, items: p.items.filter((_, i) => i !== index) } })
  }

  function addItem() {
    onChange({
      ...data,
      projects: {
        ...p,
        items: [...p.items, { title: '', desc: '', image: '', tags: [''], type: 'Web App', demo: '', github: '' }],
      },
    })
  }

  function addTag(projIndex: number) {
    const items = [...p.items]
    items[projIndex] = { ...items[projIndex], tags: [...items[projIndex].tags, ''] }
    onChange({ ...data, projects: { ...p, items } })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button onClick={addItem} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:scale-105 transition-transform">+ Add Project</button>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Section title</span>
        <input value={p.sectionTitle} onChange={(e) => onChange({ ...data, projects: { ...p, sectionTitle: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Heading</span>
        <input value={p.heading} onChange={(e) => onChange({ ...data, projects: { ...p, heading: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted-foreground">Description</span>
        <textarea value={p.description} onChange={(e) => onChange({ ...data, projects: { ...p, description: e.target.value } })} rows={2} className="resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none focus:border-primary/60" />
      </label>

      <div ref={itemsRef} className="flex flex-col gap-4">
        {p.items.map((proj, i) => (
        <div key={i} className="glass rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">{proj.title || `Project ${i + 1}`}</span>
            <button onClick={() => removeItem(i)} className="text-xs text-red-400">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={proj.title} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="Title" className="col-span-2 rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
            <textarea value={proj.desc} onChange={(e) => updateItem(i, 'desc', e.target.value)} rows={2} placeholder="Description" className="col-span-2 resize-none rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
            <div className="col-span-2">
              <ImageUploader label="" value={proj.image} onChange={(v) => updateItem(i, 'image', v)} />
            </div>
            <select value={proj.type} onChange={(e) => updateItem(i, 'type', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60">
              <option>Web App</option>
              <option>Desktop App</option>
            </select>
            <input value={proj.demo} onChange={(e) => updateItem(i, 'demo', e.target.value)} placeholder="Demo link" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
            <input value={proj.github || ''} onChange={(e) => updateItem(i, 'github', e.target.value)} placeholder="GitHub link (optional)" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60" />
          </div>
          <div className="mt-3">
            <p className="mb-2 text-xs text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-2">
              {proj.tags.map((tag, ti) => (
                <div key={ti} className="flex items-center gap-1 rounded-lg border border-border bg-background/40 px-3 py-1.5">
                  <input value={tag} onChange={(e) => updateTag(i, ti, e.target.value)} placeholder="Tag" className="w-20 bg-transparent text-xs text-foreground outline-none" />
                  <button onClick={() => {
                    const items = [...p.items]
                    items[i] = { ...items[i], tags: items[i].tags.filter((_, idx) => idx !== ti) }
                    onChange({ ...data, projects: { ...p, items } })
                  }} className="text-xs text-red-400 hover:text-red-300">✕</button>
                </div>
              ))}
              <button onClick={() => addTag(i)} className="text-xs text-primary hover:underline">+ tag</button>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
