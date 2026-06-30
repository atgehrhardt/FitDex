import { useFitDexStore } from '../store/useFitDexStore'
import { MonsterCard } from './MonsterCard'
import { BattleArena } from './BattleArena'

export function BattleScreen() {
  const collection = useFitDexStore((s) => s.collection)
  const battle = useFitDexStore((s) => s.battle)
  const startBattle = useFitDexStore((s) => s.startBattle)
  const endBattle = useFitDexStore((s) => s.endBattle)

  if (collection.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Battle Arena</h2>
        <div className="text-center py-16 px-6 rounded-3xl bg-surface-raised border border-dashed border-slate-600">
          <h3 className="text-xl font-bold text-slate-300">No fighters available</h3>
          <p className="text-slate-500 mt-2">Roll for monsters before entering battle!</p>
        </div>
      </div>
    )
  }

  if (battle) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Battle!</h2>
        <BattleArena onEnd={endBattle} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Battle Arena</h2>
        <p className="text-slate-400 mt-1">
          Pick a monster to fight wild opponents. Equip moves from the Dex tab first!
        </p>
      </div>

      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-400/30 text-sm text-slate-300">
        <strong className="text-orange-300">Battle tips:</strong> Basic Strike is always available.
        Equip up to 3 purchased moves per monster. Type advantages deal 1.5× damage.
        Buy moves in the Shop tab with move points from workouts.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collection.map((monster) => (
          <div key={monster.instanceId} className="relative group">
            <MonsterCard monster={monster} />
            <button
              type="button"
              onClick={() => startBattle(monster.instanceId)}
              className="absolute inset-x-3 bottom-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              Battle
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
