import { useEffect, useRef } from 'react'
import type { PortfolioData } from '@/data/use-portfolio-data'
import ImageUploader from './image-uploader'
import { FolderGit2, Type, AlignLeft, Plus, Trash2, Tag } from 'lucide-react'

interface Props {
  data: PortfolioData
  onChange: (data: PortfolioData) => void
}

function Field({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon size={13} /> {label}
      </span>
      {children}
    </label>
  )
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
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <FolderGit2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Projects</h2>
              <p className="text-sm text-muted-foreground">Showcase your best work and side projects.</p>
            </div>
          </div>
          <button onClick={addItem} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90">
            <Plus size={15} /> Add Project
          </button>
        </div>
      </div>

      <Field icon={Type} label="Section title">
        <input value={p.sectionTitle} onChange={(e) => onChange({ ...data, projects: { ...p, sectionTitle: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
      </Field>

      <Field icon={Type} label="Heading">
        <input value={p.heading} onChange={(e) => onChange({ ...data, projects: { ...p, heading: e.target.value } })} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
      </Field>

      <Field icon={AlignLeft} label="Description">
        <textarea value={p.description} onChange={(e) => onChange({ ...data, projects: { ...p, description: e.target.value } })} rows={2} className="resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
      </Field>

      <div ref={itemsRef} className="flex flex-col gap-4">
        {p.items.map((proj, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                <span className="text-sm font-medium text-foreground">{proj.title || `Project ${i + 1}`}</span>
              </div>
              <button onClick={() => removeItem(i)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
                <Trash2 size={12} /> Remove
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <input value={proj.title} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="Project title" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
              <textarea value={proj.desc} onChange={(e) => updateItem(i, 'desc', e.target.value)} rows={2} placeholder="Project description" className="resize-none rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />

              <ImageUploader label="" value={proj.image} onChange={(v) => updateItem(i, 'image', v)} />

              <div className="grid grid-cols-2 gap-3">
                <select value={proj.type} onChange={(e) => updateItem(i, 'type', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60">
                  <option>Web App</option>
                  <option>Desktop App</option>
                </select>
                <input value={proj.demo} onChange={(e) => updateItem(i, 'demo', e.target.value)} placeholder="Demo link" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
                <input value={proj.github || ''} onChange={(e) => updateItem(i, 'github', e.target.value)} placeholder="GitHub link (optional)" className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Tag size={12} /> Tags
                </span>
                <button onClick={() => addTag(i)} className="text-xs text-primary hover:underline">+ Add tag</button>
              </div>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
