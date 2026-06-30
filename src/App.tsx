import { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { WorkoutForm } from './components/WorkoutForm'
import { RollScreen } from './components/RollScreen'
import { CollectionScreen } from './components/CollectionScreen'
import { MergeScreen } from './components/MergeScreen'
import { BattleScreen } from './components/BattleScreen'
import { useFitDexStore } from './store/useFitDexStore'

type Tab = 'home' | 'workout' | 'roll' | 'collection' | 'merge' | 'battle'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'workout', label: 'Workout', icon: '🏋️' },
  { id: 'roll', label: 'Roll', icon: '🎲' },
  { id: 'collection', label: 'Dex', icon: '📖' },
  { id: 'merge', label: 'Merge', icon: '🔮' },
  { id: 'battle', label: 'Battle', icon: '⚔️' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const pendingRolls = useFitDexStore((s) => s.pendingRolls)
  const resetGame = useFitDexStore((s) => s.resetGame)

  const renderTab = () => {
    switch (tab) {
      case 'home': return <Dashboard />
      case 'workout': return <WorkoutForm />
      case 'roll': return <RollScreen />
      case 'collection': return <CollectionScreen />
      case 'merge': return <MergeScreen />
      case 'battle': return <BattleScreen />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-surface/80 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💪</span>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">FitDex</h1>
              <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest">
                Workout Monster Collector
              </p>
            </div>
          </div>
          {pendingRolls > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-sm font-bold animate-pulse">
              {pendingRolls} roll{pendingRolls !== 1 ? 's' : ''} ready
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-28">
        {renderTab()}
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
