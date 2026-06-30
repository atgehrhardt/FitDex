import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { loadGameState, saveGameState } from '../lib/gameSync'
import { useFitDexStore } from '../store/useFitDexStore'

const SYNC_DEBOUNCE_MS = 1500

export function useGameSync() {
  const { user, configured } = useAuth()
  const hydrateFromCloud = useFitDexStore((s) => s.hydrateFromCloud)
  const getPersistedSlice = useFitDexStore((s) => s.getPersistedSlice)

  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'syncing' | 'saved' | 'error'>('idle')
  const [syncError, setSyncError] = useState<string | null>(null)
  const cloudUpdatedAt = useRef<string | null>(null)
  const skipNextSync = useRef(true)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load cloud save when user signs in
  useEffect(() => {
    if (!configured || !user) {
      setSyncStatus('idle')
      cloudUpdatedAt.current = null
      skipNextSync.current = true
      return
    }

    let cancelled = false

    async function load() {
      setSyncStatus('loading')
      setSyncError(null)

      try {
        const cloud = await loadGameState(user!.id)

        if (cancelled) return

        if (cloud) {
          hydrateFromCloud(cloud.state)
          cloudUpdatedAt.current = cloud.updatedAt
        } else {
          await saveGameState(user!.id, getPersistedSlice())
          cloudUpdatedAt.current = new Date().toISOString()
        }

        skipNextSync.current = true
        setSyncStatus('saved')
      } catch (err) {
        if (cancelled) return
        setSyncStatus('error')
        setSyncError(err instanceof Error ? err.message : 'Failed to load save data')
      }
    }

    load()
    return () => { cancelled = true }
  }, [user?.id, configured, hydrateFromCloud, getPersistedSlice])

  // Debounced push on game state changes
  useEffect(() => {
    if (!configured || !user) return

    const unsubscribe = useFitDexStore.subscribe((state, prev) => {
      const changed =
        state.profile !== prev.profile
        || state.workouts !== prev.workouts
        || state.collection !== prev.collection
        || state.pendingRolls !== prev.pendingRolls

      if (!changed) return

      if (skipNextSync.current) {
        skipNextSync.current = false
        return
      }

      if (debounceTimer.current) clearTimeout(debounceTimer.current)

      debounceTimer.current = setTimeout(async () => {
        setSyncStatus('syncing')
        try {
          const updatedAt = await saveGameState(user.id, getPersistedSlice())
          cloudUpdatedAt.current = updatedAt
          setSyncStatus('saved')
          setSyncError(null)
        } catch (err) {
          setSyncStatus('error')
          setSyncError(err instanceof Error ? err.message : 'Failed to sync')
        }
      }, SYNC_DEBOUNCE_MS)
    })

    return () => {
      unsubscribe()
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [user?.id, configured, getPersistedSlice])

  return { syncStatus, syncError }
}
