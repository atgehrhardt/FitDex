import { useMemo, useState } from 'react'
import type { ElementType, Rarity } from '../types'
import { ELEMENT_COLORS, RARITY_COLORS } from '../types'
import { useFitDexStore } from '../store/useFitDexStore'
import { MonsterCard } from './MonsterCard'
import { MoveLoadoutPanel } from './MoveShopScreen'

type SortKey = 'recent' | 'level' | 'rarity' | 'name'

const RARITY_ORDER: Record<Rarity, number> = {
  legendary: 5,
  epic: 4,
  rare: 3,
  uncommon: 2,
  common: 1,
}

export function CollectionScreen() {
  const collection = useFitDexStore((s) => s.collection)
  const releaseMonster = useFitDexStore((s) => s.releaseMonster)
  const [filterElement, setFilterElement] = useState<ElementType | 'all'>('all')
  const [filterRarity, setFilterRarity] = useState<Rarity | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('recent')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...collection]
    if (filterElement !== 'all') list = list.filter((m) => m.element === filterElement)
    if (filterRarity !== 'all') list = list.filter((m) => m.rarity === filterRarity)

    switch (sort) {
      case 'level':
        list.sort((a, b) => b.level - a.level || b.stats.atk - a.stats.atk)
        break
      case 'rarity':
        list.sort((a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity])
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        list.sort((a, b) => b.acquiredAt - a.acquiredAt)
    }
    return list
  }, [collection, filterElement, filterRarity, sort])

  const speciesCount = new Set(collection.map((m) => m.id)).size

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Collection</h2>
          <p className="text-slate-400 mt-1">
            {collection.length} monsters · {speciesCount} unique species
          </p>
        </div>
      </div>

      {collection.length === 0 ? (
        <div className="text-center py-16 px-6 rounded-3xl bg-surface-raised border border-dashed border-slate-600">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-slate-300">No monsters yet</h3>
          <p className="text-slate-500 mt-2">Log a workout and roll to start your collection!</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <select
              value={filterElement}
              onChange={(e) => setFilterElement(e.target.value as ElementType | 'all')}
              className="px-3 py-2 rounded-lg bg-surface-overlay border border-slate-600 text-sm text-white"
            >
              <option value="all">All Elements</option>
              {(Object.keys(ELEMENT_COLORS) as ElementType[]).map((el) => (
                <option key={el} value={el}>{el}</option>
              ))}
            </select>
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value as Rarity | 'all')}
              className="px-3 py-2 rounded-lg bg-surface-overlay border border-slate-600 text-sm text-white"
            >
              <option value="all">All Rarities</option>
              {(Object.keys(RARITY_COLORS) as Rarity[]).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-3 py-2 rounded-lg bg-surface-overlay border border-slate-600 text-sm text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="level">Highest Level</option>
              <option value="rarity">Rarity</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((monster) => (
              <MonsterCard
                key={monster.instanceId}
                monster={monster}
                selected={selectedId === monster.instanceId}
                onClick={() =>
                  setSelectedId(selectedId === monster.instanceId ? null : monster.instanceId)
                }
              />
            ))}
          </div>

          {selectedId && (() => {
            const selected = collection.find((m) => m.instanceId === selectedId)
            if (!selected) return null
            return (
            <div className="space-y-4">
              <MoveLoadoutPanel monster={selected} />
              <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Release this monster? This cannot be undone.')) {
                    releaseMonster(selectedId)
                    setSelectedId(null)
                  }
                }}
                className="px-6 py-3 rounded-xl bg-danger/90 text-white font-bold shadow-lg hover:bg-danger transition-colors"
              >
                Release Selected
              </button>
              </div>
            </div>
            )
          })()}
        </>
      )}
    </div>
  )
}
