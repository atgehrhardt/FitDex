import { useState } from 'react'
import type { Monster } from '../types'
import { useFitDexStore } from '../store/useFitDexStore'
import { MonsterCard } from './MonsterCard'

export function RollScreen() {
  const pendingRolls = useFitDexStore((s) => s.pendingRolls)
  const useRoll = useFitDexStore((s) => s.useRoll)
  const useAllRolls = useFitDexStore((s) => s.useAllRolls)
  const [revealed, setRevealed] = useState<Monster[]>([])
  const [rolling, setRolling] = useState(false)

  const handleSingleRoll = () => {
    if (pendingRolls <= 0 || rolling) return
    setRolling(true)
    setRevealed([])

    setTimeout(() => {
      const monster = useRoll()
      if (monster) setRevealed([monster])
      setRolling(false)
    }, 800)
  }

  const handleRollAll = () => {
    if (pendingRolls <= 0 || rolling) return
    setRolling(true)
    setRevealed([])

    setTimeout(() => {
      const monsters = useAllRolls()
      setRevealed(monsters)
      setRolling(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Monster Roll</h2>
        <p className="text-slate-400 mt-1">
          Spend workout rolls to discover new monsters. Duplicates can be merged to level up!
        </p>
      </div>

      <div className="relative flex flex-col items-center py-12 px-6 rounded-3xl bg-surface-raised border border-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.08),transparent_70%)]" />

        <div className="relative text-center">
          <div className="text-8xl mb-4 animate-float">
            {rolling ? '🌀' : pendingRolls > 0 ? '🎲' : '💤'}
          </div>
          <div className="text-5xl font-black text-white mb-2">{pendingRolls}</div>
          <div className="text-slate-400 font-medium">
            {pendingRolls === 0 ? 'No rolls — log a workout first!' : 'rolls available'}
          </div>
        </div>

        <div className="relative flex gap-3 mt-8">
          <button
            type="button"
            onClick={handleSingleRoll}
            disabled={pendingRolls <= 0 || rolling}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-lg shadow-purple-500/30 animate-pulse-glow disabled:animate-none"
          >
            {rolling ? 'Rolling...' : 'Roll ×1'}
          </button>
          {pendingRolls > 1 && (
            <button
              type="button"
              onClick={handleRollAll}
              disabled={rolling}
              className="px-8 py-4 rounded-2xl bg-surface-overlay border-2 border-purple-400/50 text-purple-300 font-bold text-lg disabled:opacity-40 hover:bg-purple-400/10 transition-all"
            >
              Roll All ({pendingRolls})
            </button>
          )}
        </div>
      </div>

      {revealed.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">
            {revealed.length === 1 ? 'You caught:' : `You caught ${revealed.length} monsters:`}
          </h3>
          <div className={`grid gap-4 ${revealed.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {revealed.map((monster) => (
              <div key={monster.instanceId} className="animate-roll-reveal">
                <MonsterCard monster={monster} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-surface-overlay border border-slate-700">
        <h4 className="font-semibold text-slate-300 mb-2">How rolls work</h4>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• Longer workouts earn more rolls</li>
          <li>• HIIT and high-intensity sessions boost roll count</li>
          <li>• Higher intensity shifts odds toward rare & legendary monsters</li>
          <li>• Catch duplicates to merge them into stronger, higher-level forms</li>
        </ul>
      </div>
    </div>
  )
}
