import type { AppState } from '../types'
import { supabase } from './supabase'

export interface CloudSavePayload {
  profile: AppState['profile']
  workouts: AppState['workouts']
  collection: AppState['collection']
  pending_rolls: number
  updated_at: string
}

export function toCloudPayload(state: Pick<AppState, 'profile' | 'workouts' | 'collection' | 'pendingRolls'>): Omit<CloudSavePayload, 'updated_at'> {
  return {
    profile: state.profile,
    workouts: state.workouts,
    collection: state.collection,
    pending_rolls: state.pendingRolls,
  }
}

export function fromCloudPayload(row: CloudSavePayload): Pick<AppState, 'profile' | 'workouts' | 'collection' | 'pendingRolls'> {
  return {
    profile: row.profile,
    workouts: row.workouts,
    collection: row.collection,
    pendingRolls: row.pending_rolls,
  }
}

export async function loadGameState(userId: string): Promise<{
  state: Pick<AppState, 'profile' | 'workouts' | 'collection' | 'pendingRolls'>
  updatedAt: string
} | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('player_saves')
    .select('profile, workouts, collection, pending_rolls, updated_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    state: fromCloudPayload(data as CloudSavePayload),
    updatedAt: data.updated_at,
  }
}

export async function saveGameState(
  userId: string,
  state: Pick<AppState, 'profile' | 'workouts' | 'collection' | 'pendingRolls'>,
): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured')

  const payload = toCloudPayload(state)
  const { data, error } = await supabase
    .from('player_saves')
    .upsert(
      { user_id: userId, ...payload, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    )
    .select('updated_at')
    .single()

  if (error) throw error
  return data.updated_at
}
