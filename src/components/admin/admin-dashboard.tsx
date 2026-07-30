import { useState } from 'react'
import { usePortfolioData, type PortfolioData } from '@/data/use-portfolio-data'
import {
  User, Layout, Info, Code2, Briefcase, FolderGit2, Wrench, Share2, Mail, Settings,
  LogOut, X, Save, EllipsisVertical,
} from 'lucide-react'
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

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'hero', label: 'Hero', icon: Layout },
  { id: 'about', label: 'About', icon: Info },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'social', label: 'Social', icon: Share2 },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'account', label: 'Account', icon: Settings },
]

export default function AdminDashboard({ onLogout, onClose }: Props) {
  const { data: initialData, save, loading } = usePortfolioData()
  const [tab, setTab] = useState<Tab>('hero')
  const [draft, setDraft] = useState<PortfolioData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const data = draft ?? initialData
  const hasChanges = draft !== null

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

  function handleTabChange(id: Tab) {
    setTab(id)
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const ActiveIcon = tabs.find(t => t.id === tab)?.icon || Settings

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:static md:translate-x-0`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Dashboard</p>
              <p className="text-[11px] text-muted-foreground">Content manager</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden">
            <X size={14} />
          </button>
        </div>

        {/* Tab navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">Sections</p>
          {tabs.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`group mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                  active
                    ? 'bg-primary/12 font-medium text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon size={16} className={active ? 'text-primary' : 'text-muted-foreground/60 group-hover:text-foreground'} />
                <span className="flex-1">{t.label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="space-y-2 border-t border-border p-3">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              saved
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-primary text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40'
            }`}
          >
            <Save size={15} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
          </button>
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-h-screen flex-1 flex-col overflow-y-auto">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-6 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
            >
              <EllipsisVertical size={16} />
            </button>
            <ActiveIcon size={18} className="text-primary" />
            <h1 className="text-base font-semibold text-foreground capitalize">{tab}</h1>
          </div>
          {hasChanges && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-medium text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Unsaved changes
            </span>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 p-6 md:p-8">
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
        </div>

        {/* Bottom save bar (mobile) */}
        <div className="sticky bottom-0 border-t border-border bg-background/80 p-4 backdrop-blur-xl md:hidden">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              saved
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-primary text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40'
            }`}
          >
            <Save size={15} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
          </button>
        </div>
      </main>
    </div>
  )
}
