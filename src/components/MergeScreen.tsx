import { useState } from 'react'
import { MERGE_REQUIRED } from '../types'
import { findMergeGroups } from '../utils/gameLogic'
import { useFitDexStore } from '../store/useFitDexStore'
import { MonsterCard } from './MonsterCard'

export function MergeScreen() {
  const collection = useFitDexStore((s) => s.collection)
  const mergeGroup = useFitDexStore((s) => s.mergeGroup)
  const groups = findMergeGroups(collection)
  const [mergedResult, setMergedResult] = useState<ReturnType<typeof mergeGroup>>(null)
  const [merging, setMerging] = useState(false)

  const handleMerge = (instanceIds: string[]) => {
    setMerging(true)
    setMergedResult(null)
    setTimeout(() => {
      const result = mergeGroup(instanceIds)
      setMergedResult(result)
      setMerging(false)
    }, 600)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Merge & Level Up</h2>
        <p className="text-slate-400 mt-1">
          Combine {MERGE_REQUIRED} identical monsters (same species & level) into a stronger, higher-level form.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-400/30">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔮</span>
          <div>
            <div className="font-semibold text-purple-300">Merge Formula</div>
            <div className="text-sm text-slate-400">
              3× Lv.{`{n}`} {`{species}`} → 1× Lv.{`{n+1}`} {`{species}`} with +12% stats per level
            </div>
          </div>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-3xl bg-surface-raised border border-dashed border-slate-600">
          <div className="text-6xl mb-4">🧬</div>
          <h3 className="text-xl font-bold text-slate-300">No duplicates to merge</h3>
          <p className="text-slate-500 mt-2">
            Keep rolling! When you get 3 of the same monster at the same level, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div
              key={`${group.speciesId}-${group.level}`}
              className={`p-5 rounded-2xl border-2 transition-all ${
                group.canMerge
                  ? 'border-purple-400/50 bg-purple-500/5'
                  : 'border-slate-700 bg-surface-raised'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {group.monsters[0].emoji} {group.monsters[0].name}{' '}
                    <span className="text-slate-400 font-normal">Lv.{group.level}</span>
                  </h3>
                  <p className="text-sm text-slate-400">
                    {group.monsters.length} copies
                    {group.canMerge ? ' — ready to merge!' : ` — need ${MERGE_REQUIRED - group.monsters.length} more`}
                  </p>
                </div>
                {group.canMerge && (
                  <button
                    type="button"
                    onClick={() =>
                      handleMerge(group.monsters.map((m) => m.instanceId))
                    }
                    disabled={merging}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold disabled:opacity-50 hover:brightness-110 transition-all"
                  >
                    {merging ? 'Merging...' : `Merge ${MERGE_REQUIRED}`}
                  </button>
                )}
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {group.monsters.slice(0, 6).map((monster) => (
                  <MonsterCard key={monster.instanceId} monster={monster} compact />
                ))}
                {group.monsters.length > 6 && (
                  <div className="flex items-center justify-center rounded-2xl bg-surface-overlay text-slate-400 font-bold">
                    +{group.monsters.length - 6} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {mergedResult && (
        <div className="animate-roll-reveal">
          <div className="p-4 rounded-xl bg-success/10 border border-success/30 mb-4">
            <p className="text-success font-bold text-lg">✨ Merge successful!</p>
          </div>
          <MonsterCard monster={mergedResult} />
        </div>
      )}
    </div>
  )
}
