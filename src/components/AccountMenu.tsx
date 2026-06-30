import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useFitDexStore } from '../store/useFitDexStore'

export function AccountMenu() {
  const { user, signOut } = useAuth()
  const clearForSignOut = useFitDexStore((s) => s.clearForSignOut)
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  if (!user) return null

  const displayName = user.user_metadata?.display_name as string | undefined
  const initial = (displayName?.[0] ?? user.email?.[0] ?? '?').toUpperCase()

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      clearForSignOut()
    } finally {
      setSigningOut(false)
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-black">
          {initial}
        </span>
        <span className="hidden sm:block text-sm text-slate-300 max-w-[120px] truncate">
          {displayName ?? user.email}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl bg-surface-raised border border-slate-700 shadow-xl py-2">
            <div className="px-4 py-2 border-b border-slate-700">
              <div className="text-sm font-semibold text-white truncate">
                {displayName ?? 'Trainer'}
              </div>
              <div className="text-xs text-slate-400 truncate">{user.email}</div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
            >
              {signingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function SyncIndicator({ status, error }: { status: string; error: string | null }) {
  if (status === 'idle') return null

  const labels: Record<string, string> = {
    loading: 'Loading save…',
    syncing: 'Syncing…',
    saved: 'Saved',
    error: 'Sync failed',
  }

  const colors: Record<string, string> = {
    loading: 'text-slate-400',
    syncing: 'text-cyan-400',
    saved: 'text-green-400',
    error: 'text-red-400',
  }

  return (
    <span
      className={`text-[10px] font-medium ${colors[status] ?? 'text-slate-400'}`}
      title={error ?? undefined}
    >
      {labels[status] ?? status}
    </span>
  )
}
