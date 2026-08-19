import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '@/lib/supabase'
import AdminAuth from './admin-auth'
import AdminDashboard from './admin-dashboard'

interface Props {
  onClose: () => void
}

export default function AdminOverlay({ onClose }: Props) {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
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
        {authed ? (
          <AdminDashboard onLogout={() => { supabase.auth.signOut(); setAuthed(false) }} onClose={onClose} />
        ) : (
          <AdminAuth onAuth={() => setAuthed(true)} onClose={onClose} />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
