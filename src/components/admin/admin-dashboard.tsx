import { useState } from 'react'
import { usePortfolioData, type PortfolioData } from '@/data/use-portfolio-data'
import DashboardProfile from './dashboard-profile'
import DashboardHero from './dashboard-hero'
import DashboardAbout from './dashboard-about'
import DashboardSkills from './dashboard-skills'
import DashboardExperience from './dashboard-experience'
import DashboardProjects from './dashboard-projects'
import DashboardServices from './dashboard-services'
import DashboardSocial from './dashboard-social'
import DashboardContact from './dashboard-contact'
import DashboardAccount from './dashboard-account'

interface Props {
  onLogout: () => void
  onClose: () => void
}

type Tab = 'profile' | 'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'services' | 'social' | 'contact' | 'account'

const tabs: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'social', label: 'Social' },
  { id: 'contact', label: 'Contact' },
  { id: 'account', label: 'Account' },
]

export default function AdminDashboard({ onLogout, onClose }: Props) {
  const { data: initialData, save, loading } = usePortfolioData()
  const [tab, setTab] = useState<Tab>('hero')
  const [draft, setDraft] = useState<PortfolioData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const data = draft ?? initialData

  function handleChange(newData: PortfolioData) {
    setDraft(newData)
  }

  async function handleSave() {
    if (!draft) return
    setSaving(true)
    await save(draft)
    setDraft(null)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex bg-background">
      <aside className="sticky top-0 flex h-screen w-56 flex-col border-r border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <span className="font-mono text-sm font-semibold">Admin</span>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                tab === t.id
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={handleSave}
            disabled={saving || !draft}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
          </button>
          <button
            onClick={onLogout}
            className="mt-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen flex-1 p-8">
        <div className="mx-auto max-w-2xl">
          {tab === 'profile' && <DashboardProfile data={data} onChange={handleChange} />}
          {tab === 'hero' && <DashboardHero data={data} onChange={handleChange} />}
          {tab === 'about' && <DashboardAbout data={data} onChange={handleChange} />}
          {tab === 'skills' && <DashboardSkills data={data} onChange={handleChange} />}
          {tab === 'experience' && <DashboardExperience data={data} onChange={handleChange} />}
          {tab === 'projects' && <DashboardProjects data={data} onChange={handleChange} />}
          {tab === 'services' && <DashboardServices data={data} onChange={handleChange} />}
          {tab === 'social' && <DashboardSocial data={data} onChange={handleChange} />}
          {tab === 'contact' && <DashboardContact data={data} onChange={handleChange} />}
          {tab === 'account' && <DashboardAccount />}
        </div>
      </main>
    </div>
  )
}
