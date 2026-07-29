import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Lock } from 'lucide-react'

export default function DashboardAccount() {
  const [currentEmail, setCurrentEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
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
      setMessage('Confirmation sent to new email!')
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
      setMessage('Password updated!')
      setPassword('')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold">Account Settings</h2>

      {currentEmail && (
        <div className="glass rounded-2xl p-5">
          <p className="mb-1 text-xs text-muted-foreground">Current email</p>
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-primary" />
            <span className="font-medium text-foreground">{currentEmail}</span>
          </div>
        </div>
      )}

      {message && (
        <p className="rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-400">{message}</p>
      )}
      {error && (
        <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-400">{error}</p>
      )}

      <form onSubmit={handleUpdateEmail} className="glass rounded-2xl p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <Mail size={14} className="text-primary" /> Change email
        </p>
        <div className="flex gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="New email address"
            required
            className="flex-1 rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/60"
          />
          <button type="submit" className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
            Update
          </button>
        </div>
      </form>

      <form onSubmit={handleUpdatePassword} className="glass rounded-2xl p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <Lock size={14} className="text-primary" /> Change password
        </p>
        <div className="flex gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 6 chars)"
            required
            minLength={6}
            className="flex-1 rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none focus:border-primary/60"
          />
          <button type="submit" className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
            Update
          </button>
        </div>
      </form>
    </div>
  )
}
