import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, BattleLogEntry, BattleState, Monster, Workout, WorkoutType } from '../types'
import {
  calculateDamage,
  createWorkout,
  findMergeGroups,
  generateWildMonster,
  getCollectionPower,
  healMonster,
  mergeMonsters,
  rollMonster,
} from '../utils/gameLogic'
import { MONSTER_SPECIES } from '../data/monsters'

interface FitDexStore extends AppState {
  battle: BattleState | null

  logWorkout: (
    type: WorkoutType,
    name: string,
    durationMinutes: number,
    intensity: 1 | 2 | 3 | 4 | 5,
    notes?: string,
  ) => Workout
  useRoll: () => Monster | null
  useAllRolls: () => Monster[]
  mergeGroup: (instanceIds: string[]) => Monster | null
  releaseMonster: (instanceId: string) => void
  startBattle: (playerMonsterId: string) => void
  battleAction: (action: 'attack' | 'defend' | 'special') => void
  endBattle: () => void
  resetGame: () => void
}

const initialProfile = {
  name: 'Trainer',
  totalWorkouts: 0,
  totalRolls: 0,
  battlesWon: 0,
  battlesLost: 0,
  xp: 0,
}

const initialState: AppState & { battle: BattleState | null } = {
  profile: initialProfile,
  workouts: [],
  collection: [],
  pendingRolls: 0,
  battle: null,
}

function addLog(
  log: BattleLogEntry[],
  turn: number,
  message: string,
  type: BattleLogEntry['type'],
): BattleLogEntry[] {
  return [...log, { turn, message, type }]
}

function enemyTurn(
  battle: BattleState,
): { battle: BattleState; playerHp: number } {
  const damage = calculateDamage(battle.enemyMonster, battle.playerMonster, 1, battle.playerDefending)
  const playerHp = Math.max(0, battle.playerMonster.currentHp - damage)
  const defMsg = battle.playerDefending ? ' (reduced!)' : ''

  let log = addLog(
    battle.log,
    battle.turn,
    `${battle.enemyMonster.emoji} ${battle.enemyMonster.name} attacks for ${damage} damage${defMsg}!`,
    'damage',
  )

  if (playerHp <= 0) {
    log = addLog(log, battle.turn, 'You were defeated...', 'defeat')
    return {
      battle: {
        ...battle,
        playerMonster: { ...battle.playerMonster, currentHp: 0 },
        log,
        status: 'lost',
        isPlayerTurn: false,
        playerDefending: false,
      },
      playerHp: 0,
    }
  }

  return {
    battle: {
      ...battle,
      playerMonster: { ...battle.playerMonster, currentHp: playerHp },
      turn: battle.turn + 1,
      log,
      isPlayerTurn: true,
      playerDefending: false,
    },
    playerHp,
  }
}

export const useFitDexStore = create<FitDexStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      logWorkout: (type, name, durationMinutes, intensity, notes) => {
        const workout = createWorkout(type, name, durationMinutes, intensity, notes)
        set((state) => ({
          workouts: [workout, ...state.workouts],
          pendingRolls: state.pendingRolls + workout.rollsEarned,
          profile: {
            ...state.profile,
            totalWorkouts: state.profile.totalWorkouts + 1,
            xp: state.profile.xp + workout.rollsEarned * 10 + durationMinutes,
          },
        }))
        return workout
      },

      useRoll: () => {
        const { pendingRolls, workouts } = get()
        if (pendingRolls <= 0) return null

        const lastWorkout = workouts[0]
        const intensity = lastWorkout?.intensity ?? 3
        const monster = rollMonster(intensity)

        set((state) => ({
          pendingRolls: state.pendingRolls - 1,
          collection: [...state.collection, monster],
          profile: {
            ...state.profile,
            totalRolls: state.profile.totalRolls + 1,
          },
        }))

        return monster
      },

      useAllRolls: () => {
        const { pendingRolls, workouts } = get()
        if (pendingRolls <= 0) return []

        const lastWorkout = workouts[0]
        const intensity = lastWorkout?.intensity ?? 3
        const rolled: Monster[] = []

        for (let i = 0; i < pendingRolls; i++) {
          rolled.push(rollMonster(intensity))
        }

        set((state) => ({
          pendingRolls: 0,
          collection: [...state.collection, ...rolled],
          profile: {
            ...state.profile,
            totalRolls: state.profile.totalRolls + rolled.length,
          },
        }))

        return rolled
      },

      mergeGroup: (instanceIds) => {
        const { collection } = get()
        const monsters = instanceIds
          .map((id) => collection.find((m) => m.instanceId === id))
          .filter((m): m is Monster => m !== undefined)

        const merged = mergeMonsters(monsters)
        if (!merged) return null

        const toRemove = new Set(instanceIds.slice(0, 3))
        set((state) => ({
          collection: [
            ...state.collection.filter((m) => !toRemove.has(m.instanceId)),
            merged,
          ],
          profile: {
            ...state.profile,
            xp: state.profile.xp + merged.level * 25,
          },
        }))

        return merged
      },

      releaseMonster: (instanceId) => {
        set((state) => ({
          collection: state.collection.filter((m) => m.instanceId !== instanceId),
        }))
      },

      startBattle: (playerMonsterId) => {
        const { collection } = get()
        const playerMonster = collection.find((m) => m.instanceId === playerMonsterId)
        if (!playerMonster) return

        const healed = healMonster(playerMonster)
        const avgLevel = getCollectionPower(collection)
        const enemy = generateWildMonster(Math.max(1, Math.floor(avgLevel / 25)))

        const playerFirst = healed.stats.spd >= enemy.stats.spd
        let battle: BattleState = {
          playerMonster: healed,
          enemyMonster: enemy,
          turn: 1,
          log: addLog(
            [],
            1,
            `A wild ${enemy.emoji} ${enemy.name} (Lv.${enemy.level}) appeared!`,
            'info',
          ),
          isPlayerTurn: playerFirst,
          status: 'active',
          playerDefending: false,
        }

        if (!playerFirst) {
          battle.log = addLog(battle.log, 1, `${enemy.name} moves first!`, 'info')
          const result = enemyTurn(battle)
          battle = result.battle
        }

        set({ battle })
      },

      battleAction: (action) => {
        const { battle, profile } = get()
        if (!battle || battle.status !== 'active') return

        if (!battle.isPlayerTurn) return

        let updated = { ...battle, playerDefending: false }
        const { playerMonster, enemyMonster } = updated

        if (action === 'defend') {
          updated.log = addLog(
            updated.log,
            updated.turn,
            `${playerMonster.emoji} ${playerMonster.name} braces for impact!`,
            'info',
          )
          updated.playerDefending = true
          updated.isPlayerTurn = false
          const result = enemyTurn(updated)
          set({ battle: result.battle })
          if (result.battle.status === 'lost') {
            set({ profile: { ...profile, battlesLost: profile.battlesLost + 1 } })
          }
          return
        }

        const movePower = action === 'special' ? 1.4 : 1
        const actionLabel = action === 'special' ? 'uses a special attack' : 'attacks'
        const damage = calculateDamage(playerMonster, enemyMonster, movePower)
        const enemyHp = Math.max(0, enemyMonster.currentHp - damage)

        updated.log = addLog(
          updated.log,
          updated.turn,
          `${playerMonster.emoji} ${playerMonster.name} ${actionLabel} for ${damage} damage!`,
          'damage',
        )
        updated.enemyMonster = { ...enemyMonster, currentHp: enemyHp }

        if (enemyHp <= 0) {
          updated.log = addLog(updated.log, updated.turn, 'Victory! You won the battle!', 'victory')
          updated.status = 'won'
          set({
            battle: { ...updated, isPlayerTurn: false },
            profile: {
              ...profile,
              battlesWon: profile.battlesWon + 1,
              xp: profile.xp + enemyMonster.level * 15,
            },
          })
          return
        }

        updated.isPlayerTurn = false
        const result = enemyTurn(updated)
        set({ battle: result.battle })
        if (result.battle.status === 'lost') {
          set({ profile: { ...profile, battlesLost: profile.battlesLost + 1 } })
        }
      },

      endBattle: () => set({ battle: null }),

      resetGame: () => set({ ...initialState, battle: null }),
    }),
    {
      name: 'fitdex-storage',
      partialize: (state) => ({
        profile: state.profile,
        workouts: state.workouts,
        collection: state.collection,
        pendingRolls: state.pendingRolls,
      }),
    },
  ),
)

export { findMergeGroups, MONSTER_SPECIES }
