import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'motion/react'

interface Props {
  onAuth: () => void
  onClose: () => void
}

export default function AdminAuth({ onAuth, onClose }: Props) {
  const [mode, setMode] = useState<'signup' | 'login'>('login')
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
        className="glass relative w-full max-w-sm rounded-3xl p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

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
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background/40 px-4 py-3 pr-11 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 0 11.205 6.575 1 1 0 0 1 1 .726 10.747 10.747 0 0 0 6.683 3.201 1 1 0 0 1-.97 1.683A10.75 10.75 0 0 1 17.654 21.33a1 1 0 0 1-.933-.606A10.746 10.746 0 0 1 3.27 14.768a1 1 0 0 1 1-.725 10.748 10.748 0 0 0 6.683-3.202 1 1 0 0 1 .97-1.683z"/><path d="M17.09 14.548a4.5 4.5 0 0 0-6.364-6.364"/><path d="m9.5 10.5 1.5 1.5"/><path d="m9.5 13.5 1.5-1.5"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
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

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === 'signup' ? (
            <>Already have an account?{' '}
              <button type="button" onClick={() => { setMode('login'); setError('') }} className="text-primary underline-offset-2 hover:underline">Sign In</button>
            </>
          ) : (
            <>Don't have an account?{' '}
              <button type="button" onClick={() => { setMode('signup'); setError('') }} className="text-primary underline-offset-2 hover:underline">Create Account</button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  )
}
