import type { PortfolioData } from '@/data/use-portfolio-data'
import ImageUploader from './image-uploader'
import { User, Type, Hash, Image, Text } from 'lucide-react'

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

export default function DashboardProfile({ data, onChange }: Props) {
  const p = data.profile

  function set(field: string, val: string) {
    onChange({ ...data, profile: { ...p, [field]: val } })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            <p className="text-sm text-muted-foreground">Manage your personal information and branding.</p>
          </div>
        </div>
      </div>

      {/* Basic info */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-medium text-foreground">Basic Information</h3>
        <div className="flex flex-col gap-4">
          <Field icon={User} label="Full name">
            <input value={p.name} onChange={(e) => set('name', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>

          <Field icon={Type} label="Initials (nav logo)">
            <input value={p.initials} onChange={(e) => set('initials', e.target.value)} maxLength={4} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm font-mono text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>

          <Field icon={Hash} label="Main title">
            <input value={p.mainTitle} onChange={(e) => set('mainTitle', e.target.value)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-medium text-foreground">Images</h3>
        <div className="flex flex-col gap-5">
          <ImageUploader label="Profile image (hero section)" value={p.profileImage} onChange={(v) => set('profileImage', v)} />
          <ImageUploader label="About image" value={p.aboutImage} onChange={(v) => set('aboutImage', v)} />
        </div>
      </div>

      {/* Favicon */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
          <Image size={15} className="text-primary" />
          Browser Tab Icon
        </h3>
        <div className="flex flex-col gap-5">
          <Field icon={Text} label="Favicon text">
            <input value={p.faviconText} onChange={(e) => set('faviconText', e.target.value)} maxLength={6} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm font-mono text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60" />
          </Field>
          <ImageUploader label="Favicon image (overrides text)" value={p.favicon} onChange={(v) => set('favicon', v)} />
        </div>
      </div>
    </div>
  )
}
