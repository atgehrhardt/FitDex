import type { ElementType, Monster, Rarity } from '../types'
import { ELEMENT_COLORS, RARITY_COLORS } from '../types'

interface MonsterCardProps {
  monster: Monster
  selected?: boolean
  compact?: boolean
  onClick?: () => void
  showHp?: boolean
}

export function MonsterCard({ monster, selected, compact, onClick, showHp }: MonsterCardProps) {
  const borderColor = selected ? '#22d3ee' : RARITY_COLORS[monster.rarity]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full text-left rounded-2xl border-2 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:brightness-110' : 'cursor-default'}
        ${selected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0f1419]' : ''}
        ${compact ? 'p-3' : 'p-4'}
      `}
      style={{
        borderColor,
        background: `linear-gradient(135deg, ${RARITY_COLORS[monster.rarity]}15, #1a2332)`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`${compact ? 'text-3xl' : 'text-5xl'} animate-float shrink-0`}
          style={{ filter: `drop-shadow(0 0 8px ${ELEMENT_COLORS[monster.element]}66)` }}
        >
          {monster.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-bold text-white truncate ${compact ? 'text-sm' : 'text-lg'}`}>
              {monster.name}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/30 text-slate-300">
              Lv.{monster.level}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <TypeBadge type={monster.element} />
            <RarityBadge rarity={monster.rarity} />
          </div>
          {!compact && (
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{monster.description}</p>
          )}
          <StatRow stats={monster.stats} compact={compact} />
          {showHp && (
            <HpBar current={monster.currentHp} max={monster.stats.hp} className="mt-2" />
          )}
        </div>
      </div>
    </button>
  )
}

function TypeBadge({ type }: { type: ElementType }) {
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${ELEMENT_COLORS[type]}33`, color: ELEMENT_COLORS[type] }}
    >
      {type}
    </span>
  )
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${RARITY_COLORS[rarity]}22`, color: RARITY_COLORS[rarity] }}
    >
      {rarity}
    </span>
  )
}

function StatRow({ stats, compact }: { stats: Monster['stats']; compact?: boolean }) {
  const items = [
    { label: 'HP', value: stats.hp, color: '#ef4444' },
    { label: 'ATK', value: stats.atk, color: '#f97316' },
    { label: 'DEF', value: stats.def, color: '#3b82f6' },
    { label: 'SPD', value: stats.spd, color: '#22c55e' },
  ]

  return (
    <div className={`grid grid-cols-4 gap-1 ${compact ? 'mt-2' : 'mt-3'}`}>
      {items.map(({ label, value, color }) => (
        <div key={label} className="text-center">
          <div className="text-[9px] text-slate-500 font-semibold">{label}</div>
          <div
            className={`font-bold ${compact ? 'text-xs' : 'text-sm'}`}
            style={{ color }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}

export function HpBar({
  current,
  max,
  className = '',
  label,
}: {
  current: number
  max: number
  className?: string
  label?: string
}) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100))
  const color = pct > 50 ? '#22c55e' : pct > 25 ? '#eab308' : '#ef4444'

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">{label}</span>
          <span className="text-slate-300 font-mono">{current}/{max}</span>
        </div>
      )}
      <div className="h-2.5 bg-black/40 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
