import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'motion/react'

interface Props {
  onAuth: () => void
}

export default function AdminAuth({ onAuth }: Props) {
  const [mode, setMode] = useState<'signup' | 'login'>('login')
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await supabase.rpc('get_auth_user_count')
        if (!error && data > 0) setMode('login')
        else setMode('signup')
      } catch {
        setMode('signup')
      }
      setChecking(false)
    })()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } =
      mode === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (mode === 'signup') {
      setMode('login')
      setError('Account created! Please sign in.')
      return
    }

    onAuth()
  }

  if (checking) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-sm rounded-3xl p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === 'signup'
              ? 'Set your admin credentials'
              : 'Enter your admin credentials'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted-foreground">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-muted-foreground">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border border-border bg-background/40 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
            />
          </label>

          {error && (
            <p className={`text-sm ${error.includes('created') ? 'text-emerald-400' : 'text-red-400'}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* No toggle between signup/login — auto-detected based on existing data */}
      </motion.div>
    </div>
  )
}
