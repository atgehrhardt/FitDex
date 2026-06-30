import { useFitDexStore } from '../store/useFitDexStore'
import { MonsterCard, HpBar } from './MonsterCard'

export function BattleScreen() {
  const collection = useFitDexStore((s) => s.collection)
  const battle = useFitDexStore((s) => s.battle)
  const startBattle = useFitDexStore((s) => s.startBattle)
  const battleAction = useFitDexStore((s) => s.battleAction)
  const endBattle = useFitDexStore((s) => s.endBattle)

  if (collection.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Battle Arena</h2>
        <div className="text-center py-16 px-6 rounded-3xl bg-surface-raised border border-dashed border-slate-600">
          <div className="text-6xl mb-4">⚔️</div>
          <h3 className="text-xl font-bold text-slate-300">No fighters available</h3>
          <p className="text-slate-500 mt-2">Roll for monsters before entering battle!</p>
        </div>
      </div>
    )
  }

  if (!battle) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Battle Arena</h2>
          <p className="text-slate-400 mt-1">
            Pick a monster to fight wild opponents. Win battles to earn XP!
          </p>
        </div>

        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-400/30 text-sm text-slate-300">
          <strong className="text-orange-300">Type advantages:</strong> Fire → Grass/Shadow,
          Water → Fire/Earth, Grass → Water/Earth, Electric → Water/Light, Earth → Electric/Fire,
          Shadow → Light/Grass, Light → Shadow/Electric. Use Special attacks for 1.4× damage!
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
                ⚔️ Battle
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { playerMonster, enemyMonster, log, isPlayerTurn, status } = battle
  const isOver = status !== 'active'

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Battle!</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-surface-raised border-2 border-cyan-400/40">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">Your Monster</div>
          <div className="flex items-center gap-4">
            <span className="text-6xl">{playerMonster.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-xl text-white">{playerMonster.name} Lv.{playerMonster.level}</div>
              <HpBar
                current={playerMonster.currentHp}
                max={playerMonster.stats.hp}
                label="HP"
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-raised border-2 border-red-400/40">
          <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Wild Monster</div>
          <div className="flex items-center gap-4">
            <span className="text-6xl">{enemyMonster.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-xl text-white">{enemyMonster.name} Lv.{enemyMonster.level}</div>
              <HpBar
                current={enemyMonster.currentHp}
                max={enemyMonster.stats.hp}
                label="HP"
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-black/30 border border-slate-700 h-48 overflow-y-auto scrollbar-thin space-y-1">
        {log.map((entry, i) => (
          <div
            key={i}
            className={`text-sm ${
              entry.type === 'damage' ? 'text-orange-300'
              : entry.type === 'victory' ? 'text-green-400 font-bold'
              : entry.type === 'defeat' ? 'text-red-400 font-bold'
              : 'text-slate-400'
            }`}
          >
            {entry.message}
          </div>
        ))}
      </div>

      {isOver ? (
        <div className="flex flex-col items-center gap-4">
          <div className={`text-4xl font-black ${status === 'won' ? 'text-green-400' : 'text-red-400'}`}>
            {status === 'won' ? '🏆 Victory!' : '💀 Defeat'}
          </div>
          <button
            type="button"
            onClick={endBattle}
            className="px-8 py-3 rounded-xl bg-surface-overlay border border-slate-600 text-white font-bold hover:border-cyan-400 transition-colors"
          >
            Back to Arena
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => battleAction('attack')}
            disabled={!isPlayerTurn}
            className="py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold disabled:opacity-40 hover:brightness-110 transition-all"
          >
            ⚔️ Attack
          </button>
          <button
            type="button"
            onClick={() => battleAction('special')}
            disabled={!isPlayerTurn}
            className="py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold disabled:opacity-40 hover:brightness-110 transition-all"
          >
            ✨ Special
          </button>
          <button
            type="button"
            onClick={() => battleAction('defend')}
            disabled={!isPlayerTurn}
            className="py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold disabled:opacity-40 hover:brightness-110 transition-all"
          >
            🛡️ Defend
          </button>
        </div>
      )}

      {!isPlayerTurn && !isOver && (
        <p className="text-center text-slate-400 text-sm animate-pulse">Enemy is attacking...</p>
      )}
    </div>
  )
}
