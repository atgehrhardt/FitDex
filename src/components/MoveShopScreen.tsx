import { useState } from 'react'
import { MOVES, SPECIES_LEARNSETS, canSpeciesLearn } from '../data/moves'
import { useFitDexStore, MAX_EQUIPPED_MOVES } from '../store/useFitDexStore'
import { ELEMENT_COLORS } from '../types'
import type { ElementType, Monster } from '../types'
import { MonsterSprite } from './MonsterSprite'

export function MoveShopScreen() {
  const movePoints = useFitDexStore((s) => s.profile.movePoints)
  const ownedMoveIds = useFitDexStore((s) => s.profile.ownedMoveIds)
  const purchaseMove = useFitDexStore((s) => s.purchaseMove)
  const collection = useFitDexStore((s) => s.collection)

  const [filterElement, setFilterElement] = useState<ElementType | 'all'>('all')
  const [lastPurchase, setLastPurchase] = useState<string | null>(null)

  const learnableSpecies = new Set(
    collection.flatMap((m) => SPECIES_LEARNSETS[m.id] ?? []),
  )

  const filtered = filterElement === 'all'
    ? MOVES
    : MOVES.filter((m) => m.element === filterElement)

  const handlePurchase = (moveId: string) => {
    if (purchaseMove(moveId)) {
      setLastPurchase(moveId)
      setTimeout(() => setLastPurchase(null), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Move Shop</h2>
          <p className="text-slate-400 mt-1">
            Spend move points earned from workouts to unlock new attacks.
          </p>
        </div>
        <div className="px-5 py-3 rounded-xl bg-amber-500/15 border border-amber-400/40">
          <div className="text-xs text-amber-300 font-semibold uppercase">Move Points</div>
          <div className="text-3xl font-black text-amber-400">{movePoints}</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-400/30 text-sm text-slate-300">
        Only monsters with matching learnsets can equip purchased moves. Equip up to 3 moves per monster in the Dex tab.
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterButton active={filterElement === 'all'} onClick={() => setFilterElement('all')} label="All" />
        {(Object.keys(ELEMENT_COLORS) as ElementType[]).map((el) => (
          <FilterButton
            key={el}
            active={filterElement === el}
            onClick={() => setFilterElement(el)}
            label={el}
            color={ELEMENT_COLORS[el]}
          />
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((move) => {
          const owned = ownedMoveIds.includes(move.id)
          const canAfford = movePoints >= move.cost
          const relevant = learnableSpecies.has(move.id)

          return (
            <div
              key={move.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                owned ? 'border-green-500/40 bg-green-500/5' : 'border-slate-700 bg-surface-raised'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${ELEMENT_COLORS[move.element]}33`, color: ELEMENT_COLORS[move.element] }}
                  >
                    {move.element}
                  </span>
                  <h3 className="font-bold text-white mt-1">{move.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{move.description}</p>
                  <p className="text-xs text-slate-500 mt-1">Power: {move.power.toFixed(2)}×</p>
                  {!relevant && collection.length > 0 && (
                    <p className="text-xs text-amber-400/70 mt-1">No monsters in collection can learn this yet</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {owned ? (
                    <span className="text-green-400 font-bold text-sm">Owned</span>
                  ) : (
                    <>
                      <div className="text-amber-400 font-black text-lg">{move.cost}</div>
                      <div className="text-[10px] text-slate-500">pts</div>
                      <button
                        type="button"
                        onClick={() => handlePurchase(move.id)}
                        disabled={!canAfford}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold disabled:opacity-40 hover:brightness-110 transition-all"
                      >
                        {lastPurchase === move.id ? 'Purchased!' : 'Buy'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean
  onClick: () => void
  label: string
  color?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
        active ? 'text-white' : 'text-slate-400 bg-surface-overlay border border-slate-700'
      }`}
      style={active ? { backgroundColor: color ? `${color}33` : '#22d3ee33', color: color ?? '#22d3ee', border: `1px solid ${color ?? '#22d3ee'}66` } : undefined}
    >
      {label}
    </button>
  )
}

export function MoveLoadoutPanel({ monster }: { monster: Monster }) {
  const ownedMoveIds = useFitDexStore((s) => s.profile.ownedMoveIds)
  const equipMove = useFitDexStore((s) => s.equipMove)
  const unequipMove = useFitDexStore((s) => s.unequipMove)

  const learnable = MOVES.filter(
    (m) => canSpeciesLearn(monster.id, m.id) && ownedMoveIds.includes(m.id),
  )
  const equipped = monster.equippedMoveIds

  return (
    <div className="p-4 rounded-xl bg-surface-overlay border border-slate-600 space-y-4">
      <div className="flex items-center gap-3">
        <MonsterSprite speciesId={monster.id} element={monster.element} size="sm" />
        <div>
          <h3 className="font-bold text-white">{monster.name} — Move Loadout</h3>
          <p className="text-xs text-slate-400">
            Basic Strike is always available. Equip up to {MAX_EQUIPPED_MOVES} moves.
          </p>
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Equipped ({equipped.length}/{MAX_EQUIPPED_MOVES})</div>
        <div className="space-y-2">
          {equipped.length === 0 ? (
            <p className="text-sm text-slate-500">No moves equipped — using basic attack only.</p>
          ) : (
            equipped.map((moveId) => {
              const move = MOVES.find((m) => m.id === moveId)
              if (!move) return null
              return (
                <div key={moveId} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                  <span className="text-sm text-white font-medium">{move.name}</span>
                  <button
                    type="button"
                    onClick={() => unequipMove(monster.instanceId, moveId)}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold"
                  >
                    Unequip
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {learnable.length > 0 && equipped.length < MAX_EQUIPPED_MOVES && (
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Available to Equip</div>
          <div className="space-y-2">
            {learnable
              .filter((m) => !equipped.includes(m.id))
              .map((move) => (
                <div key={move.id} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                  <div>
                    <span className="text-sm text-white font-medium">{move.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{move.power.toFixed(2)}×</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => equipMove(monster.instanceId, move.id)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Equip
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {learnable.length === 0 && (
        <p className="text-sm text-slate-500">
          Purchase moves in the Shop tab that this species can learn.
        </p>
      )}
    </div>
  )
}
