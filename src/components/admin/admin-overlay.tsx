import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import AdminAuth from './admin-auth'
import AdminDashboard from './admin-dashboard'

interface Props {
  onClose: () => void
}

export default function AdminOverlay({ onClose }: Props) {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setAuthed(true)
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setAuthed(true)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  function handleEsc(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  if (checking) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] overflow-y-auto bg-background"
      >
        {!isSupabaseConfigured ? (
          <div className="flex min-h-screen items-center justify-center bg-background p-6">
            <div className="glass w-full max-w-sm rounded-3xl p-8 text-center">
              <p className="text-sm text-red-400">Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.</p>
              <button onClick={onClose} className="mt-4 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Close</button>
            </div>
          </div>
        ) : authed ? (
          <AdminDashboard onLogout={() => { supabase.auth.signOut(); setAuthed(false) }} onClose={onClose} />
        ) : (
          <AdminAuth onAuth={() => setAuthed(true)} onClose={onClose} />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
