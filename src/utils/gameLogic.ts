import type { ElementType, Monster, MonsterSpecies, Rarity, Stats, Workout, WorkoutType } from '../types'
import { MAX_LEVEL } from '../types'
import { MONSTER_SPECIES, RARITY_WEIGHTS, TYPE_CHART } from '../data/monsters'

const RARITY_MULTIPLIER: Record<Rarity, number> = {
  common: 1,
  uncommon: 1.15,
  rare: 1.35,
  epic: 1.6,
  legendary: 2,
}

const LEVEL_GROWTH = 0.12

export function generateId(): string {
  return crypto.randomUUID()
}

export function calculateStats(species: MonsterSpecies, level: number): Stats {
  const mult = RARITY_MULTIPLIER[species.rarity] * (1 + (level - 1) * LEVEL_GROWTH)
  return {
    hp: Math.round(species.baseStats.hp * mult),
    atk: Math.round(species.baseStats.atk * mult),
    def: Math.round(species.baseStats.def * mult),
    spd: Math.round(species.baseStats.spd * mult),
  }
}

export function createMonster(species: MonsterSpecies, level = 1): Monster {
  const stats = calculateStats(species, level)
  return {
    ...species,
    instanceId: generateId(),
    level,
    stats,
    currentHp: stats.hp,
    acquiredAt: Date.now(),
  }
}

export function calculateRolls(
  type: WorkoutType,
  durationMinutes: number,
  intensity: number,
): number {
  let base = 1

  switch (type) {
    case 'cardio':
      base = Math.max(1, Math.floor(durationMinutes / 10))
      break
    case 'strength':
      base = Math.max(1, Math.floor(durationMinutes / 15))
      break
    case 'flexibility':
      base = Math.max(1, Math.floor(durationMinutes / 20))
      break
    case 'hiit':
      base = Math.max(1, Math.floor(durationMinutes / 8))
      break
    case 'sports':
      base = Math.max(1, Math.floor(durationMinutes / 12))
      break
  }

  const intensityBonus = Math.floor(intensity / 2)
  return base + intensityBonus
}

export function rollRarity(intensity: number, bonusWeight = 0): Rarity {
  const weights = { ...RARITY_WEIGHTS }
  const shift = intensity * 0.5 + bonusWeight

  weights.common = Math.max(20, weights.common - shift * 3)
  weights.uncommon = weights.uncommon + shift * 1.2
  weights.rare = weights.rare + shift * 1
  weights.epic = weights.epic + shift * 0.5
  weights.legendary = weights.legendary + shift * 0.3

  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  let roll = Math.random() * total

  const order: Rarity[] = ['legendary', 'epic', 'rare', 'uncommon', 'common']
  for (const rarity of order) {
    roll -= weights[rarity]
    if (roll <= 0) return rarity
  }
  return 'common'
}

export function rollMonster(intensity = 3): Monster {
  const rarity = rollRarity(intensity)
  const pool = MONSTER_SPECIES.filter((s) => s.rarity === rarity)
  const species = pool[Math.floor(Math.random() * pool.length)]
  return createMonster(species)
}

export function getTypeMultiplier(attacker: ElementType, defender: ElementType): number {
  const chart = TYPE_CHART[attacker]
  if (chart.strong.includes(defender)) return 1.5
  if (chart.weak.includes(defender)) return 0.67
  return 1
}

export function calculateDamage(
  attacker: Monster,
  defender: Monster,
  movePower = 1,
  defending = false,
): number {
  const typeMult = getTypeMultiplier(attacker.element, defender.element)
  const defMult = defending ? 1.5 : 1
  const raw = (attacker.stats.atk * movePower * typeMult) / (defender.stats.def * defMult * 0.5)
  return Math.max(1, Math.round(raw))
}

export function healMonster(monster: Monster): Monster {
  return { ...monster, currentHp: monster.stats.hp }
}

export function isDuplicate(a: Monster, b: Monster): boolean {
  return a.id === b.id && a.level === b.level
}

export interface MergeGroup {
  speciesId: string
  level: number
  monsters: Monster[]
  canMerge: boolean
}

export function findMergeGroups(collection: Monster[]): MergeGroup[] {
  const groups = new Map<string, Monster[]>()

  for (const monster of collection) {
    if (monster.level >= MAX_LEVEL) continue
    const key = `${monster.id}-${monster.level}`
    const existing = groups.get(key) ?? []
    existing.push(monster)
    groups.set(key, existing)
  }

  return Array.from(groups.entries())
    .filter(([, monsters]) => monsters.length >= 2)
    .map(([key, monsters]) => {
      const [speciesId, levelStr] = key.split('-')
      const level = parseInt(levelStr, 10)
      return {
        speciesId,
        level,
        monsters,
        canMerge: monsters.length >= 3,
      }
    })
    .sort((a, b) => b.monsters.length - a.monsters.length)
}

export function mergeMonsters(monsters: Monster[]): Monster | null {
  if (monsters.length < 3) return null
  const first = monsters[0]
  const species = MONSTER_SPECIES.find((s) => s.id === first.id)
  if (!species || first.level >= MAX_LEVEL) return null

  const toMerge = monsters.slice(0, 3)
  if (!toMerge.every((m) => isDuplicate(m, first))) return null

  return createMonster(species, first.level + 1)
}

export function createWorkout(
  type: WorkoutType,
  name: string,
  durationMinutes: number,
  intensity: 1 | 2 | 3 | 4 | 5,
  notes?: string,
): Workout {
  const rollsEarned = calculateRolls(type, durationMinutes, intensity)
  return {
    id: generateId(),
    type,
    name,
    durationMinutes,
    intensity,
    notes,
    completedAt: Date.now(),
    rollsEarned,
  }
}

export function generateWildMonster(playerLevel: number): Monster {
  const avgLevel = Math.max(1, Math.min(MAX_LEVEL, Math.round(playerLevel)))
  const intensity = Math.min(5, avgLevel)
  const monster = rollMonster(intensity)
  monster.level = Math.max(1, avgLevel + Math.floor(Math.random() * 3) - 1)
  monster.stats = calculateStats(
    MONSTER_SPECIES.find((s) => s.id === monster.id)!,
    monster.level,
  )
  monster.currentHp = monster.stats.hp
  return monster
}

export function getCollectionPower(collection: Monster[]): number {
  if (collection.length === 0) return 1
  const total = collection.reduce(
    (sum, m) => sum + m.stats.hp + m.stats.atk + m.stats.def + m.stats.spd,
    0,
  )
  return Math.round(total / collection.length / 4)
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}
