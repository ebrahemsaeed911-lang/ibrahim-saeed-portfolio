import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'motion/react'

const BAN_DURATION_MS = 15 * 60 * 1000
const BAN_KEY = 'admin_login_ban'

function getBanUntil(): number {
  try { return parseInt(localStorage.getItem(BAN_KEY) || '0', 10) } catch { return 0 }
}

function setBanUntilStorage(ts: number) {
  try { localStorage.setItem(BAN_KEY, String(ts)) } catch {}
}

function clearAuthLockout() {
  try { localStorage.removeItem(BAN_KEY) } catch {}
}

interface Props {
  onAuth: () => void
  onClose: () => void
}

export default function AdminAuth({ onAuth, onClose }: Props) {
  const [mode, setMode] = useState<'signup' | 'login'>('login')
  const [hasUsers, setHasUsers] = useState(false)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [banUntil, setBanUntilState] = useState(getBanUntil)
  const [remaining, setRemaining] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isBanned = banUntil > Date.now()

  useEffect(() => {
    function tick() {
      const left = Math.max(0, banUntil - Date.now())
      setRemaining(left)
      if (left <= 0 && timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
        clearAuthLockout()
        setBanUntilState(0)
      }
    }
    tick()
    timerRef.current = setInterval(tick, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [banUntil])

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await supabase.rpc('get_auth_user_count')
        if (!error && data > 0) {
          setHasUsers(true)
          setMode('login')
        } else {
          setHasUsers(false)
          setMode('signup')
        }
      } catch {
        setHasUsers(false)
        setMode('signup')
      }
      setChecking(false)
    })()
  }, [])

  function formatTime(ms: number) {
    const totalSec = Math.ceil(ms / 1000)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isBanned) {
      setLoading(false)
      setError(`Too many attempts. Try again in ${formatTime(remaining)}.`)
      return
    }

    if (mode === 'signup' && hasUsers) {
      setLoading(false)
      setError('Registration is closed.')
      return
    }

    if (mode === 'signup') {
      const { error: authError } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (authError) {
        setError(authError.message)
      } else {
        setHasUsers(true)
        setMode('login')
        setError('Account created! Please sign in.')
      }
      return
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)

      if (authError) {
        setError(authError.message)
        return
      }

      clearAuthLockout()
      onAuth()
    } catch {
      setLoading(false)
      setError('Cannot connect to server. Check your internet connection.')
    }
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

        {isBanned ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
            <p className="text-sm font-medium text-red-400">Account locked</p>
            <p className="mt-2 text-2xl font-bold text-red-400 tabular-nums">{formatTime(remaining)}</p>
            <p className="mt-1 text-xs text-red-400/70">Too many failed attempts. Try again later.</p>
          </div>
        ) : (
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
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {hasUsers ? (
            <span className="text-muted-foreground/60">Admin access only</span>
          ) : mode === 'signup' ? (
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
