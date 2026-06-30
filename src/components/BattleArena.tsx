import { useEffect, useState } from 'react'
import { useFitDexStore } from '../store/useFitDexStore'
import { MonsterSprite } from './MonsterSprite'
import { HpBar } from './MonsterCard'
import { BASIC_ATTACK_ID, ELEMENT_COLORS } from '../types'
import { resolveMove } from '../utils/gameLogic'
import { getMoveById } from '../data/moves'

interface BattleArenaProps {
  onEnd: () => void
}

export function BattleArena({ onEnd }: BattleArenaProps) {
  const battle = useFitDexStore((s) => s.battle)!
  const battleAction = useFitDexStore((s) => s.battleAction)
  const advanceBattlePhase = useFitDexStore((s) => s.advanceBattlePhase)

  const [showFightMenu, setShowFightMenu] = useState(false)

  const { playerMonster, enemyMonster, isPlayerTurn, status, phase, message, playerShaking, enemyShaking, showMoveMenu } = battle
  const isOver = status !== 'active'
  const canAct = isPlayerTurn && phase === 'select' && !isOver

  useEffect(() => {
    if (phase === 'player-attack' || phase === 'enemy-attack') {
      const timer = setTimeout(() => advanceBattlePhase(), 800)
      return () => clearTimeout(timer)
    }
    if (phase === 'select') {
      setShowFightMenu(false)
    }
  }, [phase, advanceBattlePhase])

  const equippedMoves = playerMonster.equippedMoveIds
    .map((id) => getMoveById(id))
    .filter(Boolean)

  const basicMove = resolveMove(BASIC_ATTACK_ID, playerMonster.element)

  return (
    <div className="space-y-4">
      {/* Battle field */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 battle-field min-h-[340px]">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-surface-raised to-emerald-900/30" />

        {/* Enemy side - top left */}
        <div className="absolute top-4 left-4 right-1/2 z-10">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="inline-block px-3 py-1.5 rounded-lg bg-black/50 border border-red-400/30 backdrop-blur-sm">
                <div className="text-sm font-bold text-white">{enemyMonster.name}</div>
                <div className="text-xs text-red-300">Lv.{enemyMonster.level}</div>
                <HpBar
                  current={enemyMonster.currentHp}
                  max={enemyMonster.stats.hp}
                  className="mt-1 w-36"
                />
              </div>
            </div>
            <MonsterSprite
              speciesId={enemyMonster.id}
              element={enemyMonster.element}
              size="lg"
              facing="left"
              shaking={enemyShaking}
              attacking={phase === 'enemy-attack'}
            />
          </div>
        </div>

        {/* Player side - bottom right */}
        <div className="absolute bottom-4 right-4 left-1/3 z-10">
          <div className="flex items-end justify-end gap-3">
            <MonsterSprite
              speciesId={playerMonster.id}
              element={playerMonster.element}
              size="xl"
              facing="right"
              shaking={playerShaking}
              attacking={phase === 'player-attack'}
            />
            <div className="inline-block px-3 py-1.5 rounded-lg bg-black/50 border border-cyan-400/30 backdrop-blur-sm mb-2">
              <div className="text-sm font-bold text-white">{playerMonster.name}</div>
              <div className="text-xs text-cyan-300">Lv.{playerMonster.level}</div>
              <HpBar
                current={playerMonster.currentHp}
                max={playerMonster.stats.hp}
                className="mt-1 w-40"
              />
            </div>
          </div>
        </div>

        {/* Grass foreground */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-emerald-800/50 to-transparent pointer-events-none" />
      </div>

      {/* Dialogue / action panel */}
      <div className="rounded-2xl border-2 border-slate-600 bg-surface-raised overflow-hidden">
        <div className="p-4 min-h-[72px] flex items-center">
          <p className={`text-white font-medium ${phase !== 'select' ? 'animate-pulse' : ''}`}>
            {message}
          </p>
        </div>

        {isOver ? (
          <div className="border-t border-slate-700 p-4 flex justify-center">
            <button
              type="button"
              onClick={onEnd}
              className={`px-8 py-3 rounded-xl font-bold text-white ${
                status === 'won'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
              }`}
            >
              {status === 'won' ? 'Victory!' : 'Retreat'} — Back to Arena
            </button>
          </div>
        ) : showMoveMenu && canAct ? (
          <div className="border-t border-slate-700">
            {!showFightMenu ? (
              <div className="grid grid-cols-2 gap-px bg-slate-700">
                <ActionButton label="Fight" color="from-orange-500 to-red-500" onClick={() => setShowFightMenu(true)} />
                <ActionButton label="Defend" color="from-blue-500 to-cyan-500" onClick={() => battleAction('defend')} />
              </div>
            ) : (
              <div className="p-3 grid grid-cols-2 gap-2 bg-surface-overlay">
                <MoveButton
                  name={basicMove.name}
                  element={basicMove.element}
                  onClick={() => battleAction(BASIC_ATTACK_ID)}
                />
                {equippedMoves.map((move) => move && (
                  <MoveButton
                    key={move.id}
                    name={move.name}
                    element={move.element}
                    onClick={() => battleAction(move.id)}
                  />
                ))}
                {equippedMoves.length < 3 &&
                  Array.from({ length: 3 - equippedMoves.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="py-3 px-4 rounded-xl bg-black/20 border border-dashed border-slate-600 text-slate-500 text-sm text-center">
                      Empty slot
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={() => setShowFightMenu(false)}
                  className="col-span-2 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        ) : !isOver ? (
          <div className="border-t border-slate-700 p-4 text-center text-slate-400 text-sm animate-pulse">
            {phase === 'player-attack' && 'Attack lands!'}
            {phase === 'enemy-attack' && 'Enemy is attacking...'}
          </div>
        ) : null}
      </div>

      {/* Compact battle log */}
      <div className="p-3 rounded-xl bg-black/30 border border-slate-700 max-h-28 overflow-y-auto scrollbar-thin space-y-0.5">
        {battle.log.slice(-6).map((entry, i) => (
          <div
            key={i}
            className={`text-xs ${
              entry.type === 'damage' ? 'text-orange-300'
              : entry.type === 'super-effective' ? 'text-yellow-300 font-semibold'
              : entry.type === 'not-effective' ? 'text-slate-500'
              : entry.type === 'victory' ? 'text-green-400 font-bold'
              : entry.type === 'defeat' ? 'text-red-400 font-bold'
              : 'text-slate-400'
            }`}
          >
            {entry.message}
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionButton({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-4 bg-gradient-to-r ${color} text-white font-bold hover:brightness-110 transition-all`}
    >
      {label}
    </button>
  )
}

function MoveButton({ name, element, onClick }: { name: string; element: string; onClick: () => void }) {
  const color = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] ?? '#94a3b8'
  return (
    <button
      type="button"
      onClick={onClick}
      className="py-3 px-4 rounded-xl border-2 text-left font-bold text-white hover:brightness-110 transition-all"
      style={{ borderColor: color, background: `${color}22` }}
    >
      <span className="text-[10px] uppercase tracking-wider block" style={{ color }}>{element}</span>
      {name}
    </button>
  )
}
