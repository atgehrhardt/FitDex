import { useFitDexStore } from '../store/useFitDexStore'
import { formatRelativeTime } from '../utils/gameLogic'
import { WORKOUT_EMOJI, WORKOUT_LABELS } from '../types'
import { MonsterCard } from './MonsterCard'

export function Dashboard() {
  const profile = useFitDexStore((s) => s.profile)
  const workouts = useFitDexStore((s) => s.workouts)
  const collection = useFitDexStore((s) => s.collection)
  const pendingRolls = useFitDexStore((s) => s.pendingRolls)

  const topMonsters = [...collection]
    .sort((a, b) => {
      const powerA = a.stats.hp + a.stats.atk + a.stats.def + a.stats.spd
      const powerB = b.stats.hp + b.stats.atk + b.stats.def + b.stats.spd
      return powerB - powerA
    })
    .slice(0, 3)

  const recentWorkouts = workouts.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-surface-raised border border-cyan-400/20 p-8">
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Welcome, {profile.name}! 💪
          </h1>
          <p className="text-slate-300 mt-2 text-lg">
            Train hard. Roll monsters. Battle champions.
          </p>
        </div>
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <StatBox label="Workouts" value={profile.totalWorkouts} icon="🏋️" />
          <StatBox label="Rolls Used" value={profile.totalRolls} icon="🎲" />
          <StatBox label="Monsters" value={collection.length} icon="👾" />
          <StatBox label="Pending Rolls" value={pendingRolls} icon="✨" highlight />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-bold text-white mb-4">⚡ Top Monsters</h2>
          {topMonsters.length === 0 ? (
            <div className="p-6 rounded-2xl bg-surface-raised border border-slate-700 text-center text-slate-500">
              No monsters yet — log a workout to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {topMonsters.map((m) => (
                <MonsterCard key={m.instanceId} monster={m} compact />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4">📋 Recent Workouts</h2>
          {recentWorkouts.length === 0 ? (
            <div className="p-6 rounded-2xl bg-surface-raised border border-slate-700 text-center text-slate-500">
              No workouts logged yet.
            </div>
          ) : (
            <div className="space-y-2">
              {recentWorkouts.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-raised border border-slate-700"
                >
                  <span className="text-2xl">{WORKOUT_EMOJI[w.type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{w.name}</div>
                    <div className="text-xs text-slate-400">
                      {WORKOUT_LABELS[w.type]} · {w.durationMinutes}min · Intensity {w.intensity}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-cyan-400 font-bold">+{w.rollsEarned} 🎲</div>
                    <div className="text-xs text-slate-500">{formatRelativeTime(w.completedAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <MiniStat label="Battles Won" value={profile.battlesWon} color="#22c55e" />
        <MiniStat label="Battles Lost" value={profile.battlesLost} color="#ef4444" />
        <MiniStat label="Trainer XP" value={profile.xp} color="#fbbf24" />
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: number
  icon: string
  highlight?: boolean
}) {
  return (
    <div
      className={`p-4 rounded-2xl ${
        highlight ? 'bg-cyan-400/15 border border-cyan-400/40' : 'bg-black/20 border border-white/5'
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-black ${highlight ? 'text-cyan-400' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-xs text-slate-400 font-medium">{label}</div>
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-4 rounded-xl bg-surface-raised border border-slate-700 text-center">
      <div className="text-2xl font-black" style={{ color }}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  )
}
