import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, BattleLogEntry, BattleState, Monster, Workout, WorkoutType } from '../types'
import { BASIC_ATTACK_ID, MAX_EQUIPPED_MOVES } from '../types'
import { getMoveById } from '../data/moves'
import {
  calculateDamage,
  canEquipMove,
  createWorkout,
  equipMoveOnMonster,
  findMergeGroups,
  generateWildMonster,
  getCollectionPower,
  healMonster,
  mergeMonsters,
  normalizeMonster,
  pickEnemyMove,
  resolveMove,
  rollMonster,
  unequipMoveFromMonster,
} from '../utils/gameLogic'
import { MONSTER_SPECIES } from '../data/monsters'
import { canSpeciesLearn } from '../data/moves'

interface FitDexStore extends AppState {
  battle: BattleState | null

  hydrateFromCloud: (state: Pick<AppState, 'profile' | 'workouts' | 'collection' | 'pendingRolls'>) => void
  getPersistedSlice: () => Pick<AppState, 'profile' | 'workouts' | 'collection' | 'pendingRolls'>
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
  purchaseMove: (moveId: string) => boolean
  equipMove: (instanceId: string, moveId: string) => boolean
  unequipMove: (instanceId: string, moveId: string) => void
  startBattle: (playerMonsterId: string) => void
  battleAction: (moveId: string | 'defend') => void
  advanceBattlePhase: () => void
  endBattle: () => void
  resetGame: () => void
  clearForSignOut: () => void
}

const initialProfile = {
  name: 'Trainer',
  totalWorkouts: 0,
  totalRolls: 0,
  battlesWon: 0,
  battlesLost: 0,
  xp: 0,
  movePoints: 0,
  ownedMoveIds: [] as string[],
}

const initialState: AppState & { battle: BattleState | null } = {
  profile: initialProfile,
  workouts: [],
  collection: [],
  pendingRolls: 0,
  battle: null,
}

function normalizeProfile(profile: AppState['profile']): AppState['profile'] {
  return {
    ...profile,
    movePoints: profile.movePoints ?? 0,
    ownedMoveIds: profile.ownedMoveIds ?? [],
  }
}

function addLog(
  log: BattleLogEntry[],
  turn: number,
  message: string,
  type: BattleLogEntry['type'],
): BattleLogEntry[] {
  return [...log, { turn, message, type }]
}

function enemyTurn(battle: BattleState): BattleState {
  const moveId = pickEnemyMove(battle.enemyMonster)
  const move = resolveMove(moveId, battle.enemyMonster.element)
  const { damage, label } = calculateDamage(
    battle.enemyMonster,
    battle.playerMonster,
    move,
    battle.playerDefending,
  )
  const playerHp = Math.max(0, battle.playerMonster.currentHp - damage)
  const defMsg = battle.playerDefending ? ' (reduced!)' : ''

  let log = addLog(
    battle.log,
    battle.turn,
    `${battle.enemyMonster.name} used ${move.name} for ${damage} damage${defMsg}!`,
    'damage',
  )
  if (label) {
    log = addLog(log, battle.turn, label, label.includes('super') ? 'super-effective' : 'not-effective')
  }

  if (playerHp <= 0) {
    log = addLog(log, battle.turn, 'You were defeated...', 'defeat')
    return {
      ...battle,
      playerMonster: { ...battle.playerMonster, currentHp: 0 },
      log,
      status: 'lost',
      isPlayerTurn: false,
      playerDefending: false,
      phase: 'ended',
      message: 'You were defeated...',
      playerShaking: true,
      enemyShaking: false,
      showMoveMenu: false,
    }
  }

  return {
    ...battle,
    playerMonster: { ...battle.playerMonster, currentHp: playerHp },
    turn: battle.turn + 1,
    log,
    isPlayerTurn: true,
    playerDefending: false,
    phase: 'select',
    message: `What will ${battle.playerMonster.name} do?`,
    playerShaking: true,
    enemyShaking: false,
    showMoveMenu: true,
  }
}

export const useFitDexStore = create<FitDexStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      hydrateFromCloud: (state) => {
        set({
          profile: normalizeProfile(state.profile),
          workouts: state.workouts.map((w) => ({ ...w, pointsEarned: w.pointsEarned ?? 0 })),
          collection: state.collection.map(normalizeMonster),
          pendingRolls: state.pendingRolls,
          battle: null,
        })
      },

      getPersistedSlice: () => {
        const { profile, workouts, collection, pendingRolls } = get()
        return { profile, workouts, collection, pendingRolls }
      },

      logWorkout: (type, name, durationMinutes, intensity, notes) => {
        const workout = createWorkout(type, name, durationMinutes, intensity, notes)
        set((state) => ({
          workouts: [workout, ...state.workouts],
          pendingRolls: state.pendingRolls + workout.rollsEarned,
          profile: {
            ...state.profile,
            totalWorkouts: state.profile.totalWorkouts + 1,
            movePoints: state.profile.movePoints + workout.pointsEarned,
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

      purchaseMove: (moveId) => {
        const { profile } = get()
        const move = getMoveById(moveId)
        if (!move) return false
        if (profile.ownedMoveIds.includes(moveId)) return false
        if (profile.movePoints < move.cost) return false

        set((state) => ({
          profile: {
            ...state.profile,
            movePoints: state.profile.movePoints - move.cost,
            ownedMoveIds: [...state.profile.ownedMoveIds, moveId],
          },
        }))
        return true
      },

      equipMove: (instanceId, moveId) => {
        const { collection, profile } = get()
        const monster = collection.find((m) => m.instanceId === instanceId)
        if (!monster || !canEquipMove(monster, moveId, profile.ownedMoveIds)) return false

        set((state) => ({
          collection: state.collection.map((m) =>
            m.instanceId === instanceId ? equipMoveOnMonster(m, moveId) : m,
          ),
        }))
        return true
      },

      unequipMove: (instanceId, moveId) => {
        set((state) => ({
          collection: state.collection.map((m) =>
            m.instanceId === instanceId ? unequipMoveFromMonster(m, moveId) : m,
          ),
        }))
      },

      startBattle: (playerMonsterId) => {
        const { collection } = get()
        const playerMonster = collection.find((m) => m.instanceId === playerMonsterId)
        if (!playerMonster) return

        const healed = healMonster(normalizeMonster(playerMonster))
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
            `A wild ${enemy.name} (Lv.${enemy.level}) appeared!`,
            'info',
          ),
          isPlayerTurn: playerFirst,
          status: 'active',
          playerDefending: false,
          phase: playerFirst ? 'select' : 'enemy-attack',
          message: playerFirst
            ? `What will ${healed.name} do?`
            : `${enemy.name} moves first!`,
          playerShaking: false,
          enemyShaking: false,
          showMoveMenu: playerFirst,
        }

        if (!playerFirst) {
          battle.log = addLog(battle.log, 1, `${enemy.name} moves first!`, 'info')
        }

        set({ battle })
      },

      battleAction: (action) => {
        const { battle, profile, collection } = get()
        if (!battle || battle.status !== 'active') return
        if (!battle.isPlayerTurn || battle.phase !== 'select') return

        let updated = { ...battle, playerDefending: false, showMoveMenu: false }
        const { playerMonster, enemyMonster } = updated

        if (action === 'defend') {
          updated.log = addLog(
            updated.log,
            updated.turn,
            `${playerMonster.name} braces for impact!`,
            'info',
          )
          updated.playerDefending = true
          updated.isPlayerTurn = false
          updated.phase = 'enemy-attack'
          updated.message = `${playerMonster.name} is defending...`
          set({ battle: updated })
          return
        }

        const move = resolveMove(action, playerMonster.element)
        const { damage, label } = calculateDamage(playerMonster, enemyMonster, move)
        const enemyHp = Math.max(0, enemyMonster.currentHp - damage)

        updated.log = addLog(
          updated.log,
          updated.turn,
          `${playerMonster.name} used ${move.name} for ${damage} damage!`,
          'damage',
        )
        if (label) {
          updated.log = addLog(updated.log, updated.turn, label, label.includes('super') ? 'super-effective' : 'not-effective')
        }
        updated.enemyMonster = { ...enemyMonster, currentHp: enemyHp }
        updated.phase = 'player-attack'
        updated.message = `${playerMonster.name} used ${move.name}!`
        updated.enemyShaking = true
        updated.playerShaking = false

        if (enemyHp <= 0) {
          updated.log = addLog(updated.log, updated.turn, 'Victory! You won the battle!', 'victory')
          updated.status = 'won'
          updated.phase = 'ended'
          updated.message = 'Victory! You won the battle!'
          updated.isPlayerTurn = false

          const healedPlayer = healMonster(playerMonster)
          set({
            battle: updated,
            collection: collection.map((m) =>
              m.instanceId === playerMonster.instanceId ? healedPlayer : m,
            ),
            profile: {
              ...profile,
              battlesWon: profile.battlesWon + 1,
              xp: profile.xp + enemyMonster.level * 15,
            },
          })
          return
        }

        updated.isPlayerTurn = false
        updated.phase = 'enemy-attack'
        set({ battle: updated })
      },

      advanceBattlePhase: () => {
        const { battle, profile } = get()
        if (!battle || battle.status !== 'active') return

        if (battle.phase === 'player-attack') {
          const next = {
            ...battle,
            phase: 'enemy-attack' as const,
            playerShaking: false,
            message: `${battle.enemyMonster.name} is attacking...`,
          }
          set({ battle: next })
          return
        }

        if (battle.phase === 'enemy-attack') {
          const result = enemyTurn(battle)
          set({ battle: result })
          if (result.status === 'lost') {
            set({ profile: { ...profile, battlesLost: profile.battlesLost + 1 } })
          }
        }
      },

      endBattle: () => set({ battle: null }),

      resetGame: () => set({ ...initialState, battle: null }),

      clearForSignOut: () => {
        set({ ...initialState, battle: null })
        localStorage.removeItem('fitdex-storage')
      },
    }),
    {
      name: 'fitdex-storage',
      partialize: (state) => ({
        profile: state.profile,
        workouts: state.workouts,
        collection: state.collection,
        pendingRolls: state.pendingRolls,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState> | undefined
        if (!p) return current
        return {
          ...current,
          ...p,
          profile: normalizeProfile({ ...initialProfile, ...p.profile }),
          collection: (p.collection ?? []).map((m) => normalizeMonster(m as Monster)),
          workouts: (p.workouts ?? []).map((w) => ({
            ...w,
            pointsEarned: w.pointsEarned ?? 0,
          })),
        }
      },
    },
  ),
)

export { findMergeGroups, MONSTER_SPECIES, canSpeciesLearn, MAX_EQUIPPED_MOVES, BASIC_ATTACK_ID }
