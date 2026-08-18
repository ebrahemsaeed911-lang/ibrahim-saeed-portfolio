import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, User, ShieldCheck, Clock } from 'lucide-react'

export default function DashboardAccount() {
  const [currentEmail, setCurrentEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sessionExpiry, setSessionExpiry] = useState<string>('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.expires_at) {
        const expires = new Date(data.session.expires_at * 1000)
        setSessionExpiry(expires.toLocaleString())
      }
    })
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setCurrentEmail(data.user.email)
    })
  }, [])

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')
    const { error: err } = await supabase.auth.updateUser({ email: newEmail })
    if (err) setError(err.message)
    else {
      setMessage('Confirmation sent to your new email!')
      setNewEmail('')
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) setError(err.message)
    else {
      setMessage('Password updated successfully!')
      setPassword('')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Account Settings</h2>
            <p className="text-sm text-muted-foreground">Manage your login credentials and security.</p>
          </div>
        </div>
      </div>

      {currentEmail && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Current email</p>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Mail size={14} className="text-primary" />
                {currentEmail}
              </p>
            </div>
          </div>
          {sessionExpiry && (
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>Session expires: {sessionExpiry}</span>
            </div>
          )}
        </div>
      )}

      {message && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-400">{message}</p>
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-5 flex items-center gap-2 text-sm font-medium text-foreground">
          <Mail size={15} className="text-primary" /> Change email
        </h3>
        <form onSubmit={handleUpdateEmail} className="flex gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New email address"
            required
            className="flex-1 rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60"
          />
          <button type="submit" className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90">
            Update
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-5 flex items-center gap-2 text-sm font-medium text-foreground">
          <Lock size={15} className="text-primary" /> Change password
        </h3>
        <form onSubmit={handleUpdatePassword} className="flex gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 6 chars)"
            required
            minLength={6}
            className="flex-1 rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-background/60"
          />
          <button type="submit" className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90">
            Update
          </button>
        </form>
      </div>
    </div>
  )
}
