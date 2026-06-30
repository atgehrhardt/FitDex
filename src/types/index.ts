export type ElementType = 'fire' | 'water' | 'grass' | 'electric' | 'earth' | 'shadow' | 'light'

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export type WorkoutType = 'cardio' | 'strength' | 'flexibility' | 'hiit' | 'sports'

export interface MonsterSpecies {
  id: string
  name: string
  element: ElementType
  rarity: Rarity
  emoji: string
  description: string
  baseStats: Stats
}

export interface Stats {
  hp: number
  atk: number
  def: number
  spd: number
}

export interface Monster extends MonsterSpecies {
  instanceId: string
  level: number
  currentHp: number
  stats: Stats
  acquiredAt: number
}

export interface Workout {
  id: string
  type: WorkoutType
  name: string
  durationMinutes: number
  intensity: 1 | 2 | 3 | 4 | 5
  notes?: string
  completedAt: number
  rollsEarned: number
}

export interface BattleLogEntry {
  turn: number
  message: string
  type: 'info' | 'damage' | 'heal' | 'victory' | 'defeat'
}

export interface BattleState {
  playerMonster: Monster
  enemyMonster: Monster
  turn: number
  log: BattleLogEntry[]
  isPlayerTurn: boolean
  status: 'active' | 'won' | 'lost'
  playerDefending: boolean
}

export interface PlayerProfile {
  name: string
  totalWorkouts: number
  totalRolls: number
  battlesWon: number
  battlesLost: number
  xp: number
}

export interface AppState {
  profile: PlayerProfile
  workouts: Workout[]
  collection: Monster[]
  pendingRolls: number
}

export const MERGE_REQUIRED = 3
export const MAX_LEVEL = 10

export const ELEMENT_COLORS: Record<ElementType, string> = {
  fire: '#f97316',
  water: '#3b82f6',
  grass: '#22c55e',
  electric: '#eab308',
  earth: '#a16207',
  shadow: '#7c3aed',
  light: '#fbbf24',
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#94a3b8',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
}

export const WORKOUT_LABELS: Record<WorkoutType, string> = {
  cardio: 'Cardio',
  strength: 'Strength',
  flexibility: 'Flexibility',
  hiit: 'HIIT',
  sports: 'Sports',
}

export const WORKOUT_EMOJI: Record<WorkoutType, string> = {
  cardio: '🏃',
  strength: '🏋️',
  flexibility: '🧘',
  hiit: '⚡',
  sports: '⚽',
}
