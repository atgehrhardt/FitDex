import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthScreen } from './components/AuthScreen'
import { AccountMenu, SyncIndicator } from './components/AccountMenu'
import { Dashboard } from './components/Dashboard'
import { WorkoutForm } from './components/WorkoutForm'
import { RollScreen } from './components/RollScreen'
import { CollectionScreen } from './components/CollectionScreen'
import { MergeScreen } from './components/MergeScreen'
import { BattleScreen } from './components/BattleScreen'
import { MoveShopScreen } from './components/MoveShopScreen'
import { useGameSync } from './hooks/useGameSync'
import { useFitDexStore } from './store/useFitDexStore'

type Tab = 'home' | 'workout' | 'roll' | 'collection' | 'merge' | 'battle' | 'shop'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'workout', label: 'Workout', icon: '🏋️' },
  { id: 'roll', label: 'Roll', icon: '🎲' },
  { id: 'collection', label: 'Dex', icon: '📖' },
  { id: 'shop', label: 'Shop', icon: '🛒' },
  { id: 'merge', label: 'Merge', icon: '🔮' },
  { id: 'battle', label: 'Battle', icon: '⚔️' },
]

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl animate-float mb-4">💪</div>
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  )
}

function AppGate() {
  const { user, loading, configured } = useAuth()

  if (configured && loading) return <LoadingScreen />
  if (configured && !user) return <AuthScreen />

  return <MainApp requireAuth={configured} />
}

function MainApp({ requireAuth }: { requireAuth: boolean }) {
  const [tab, setTab] = useState<Tab>('home')
  const pendingRolls = useFitDexStore((s) => s.pendingRolls)
  const movePoints = useFitDexStore((s) => s.profile.movePoints)
  const resetGame = useFitDexStore((s) => s.resetGame)
  const { syncStatus, syncError } = useGameSync()

  const renderTab = () => {
    switch (tab) {
      case 'home': return <Dashboard />
      case 'workout': return <WorkoutForm />
      case 'roll': return <RollScreen />
      case 'collection': return <CollectionScreen />
      case 'merge': return <MergeScreen />
      case 'battle': return <BattleScreen />
      case 'shop': return <MoveShopScreen />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-surface/80 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl shrink-0">💪</span>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-white tracking-tight">FitDex</h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest">
                  Workout Monster Collector
                </p>
                {requireAuth && <SyncIndicator status={syncStatus} error={syncError} />}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {pendingRolls > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-sm font-bold animate-pulse">
                {pendingRolls} roll{pendingRolls !== 1 ? 's' : ''}
              </div>
            )}
            {movePoints > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-bold">
                {movePoints} pts
              </div>
            )}
            {requireAuth && <AccountMenu />}
          </div>
        </div>
      </header>

      {!requireAuth && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-200">
          Local-only mode — configure Supabase for secure cloud accounts (see README).
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-28">
        {syncStatus === 'loading' && requireAuth ? (
          <div className="py-20 text-center">
            <div className="text-4xl animate-float mb-3">💪</div>
            <p className="text-slate-400">Loading your cloud save...</p>
          </div>
        ) : renderTab()}
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl bg-surface/90 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-2 py-2 flex justify-around">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`
                flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-[3rem]
                ${tab === id
                  ? 'text-cyan-400 bg-cyan-400/10'
                  : 'text-slate-500 hover:text-slate-300'}
              `}
            >
              <span className="text-xl relative">
                {icon}
                {id === 'roll' && pendingRolls > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-purple-500 text-[9px] font-bold text-white flex items-center justify-center">
                    {pendingRolls > 9 ? '9+' : pendingRolls}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <footer className="fixed bottom-20 right-4 z-30">
        <button
          type="button"
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) resetGame()
          }}
          className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
        >
          reset
        </button>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  )
}
