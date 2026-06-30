import { useState } from 'react'
import type { WorkoutType } from '../types'
import { WORKOUT_EMOJI, WORKOUT_LABELS } from '../types'
import { calculateMovePoints, calculateRolls } from '../utils/gameLogic'
import { useFitDexStore } from '../store/useFitDexStore'

const WORKOUT_TYPES: WorkoutType[] = ['cardio', 'strength', 'flexibility', 'hiit', 'sports']

export function WorkoutForm() {
  const logWorkout = useFitDexStore((s) => s.logWorkout)
  const [type, setType] = useState<WorkoutType>('cardio')
  const [name, setName] = useState('')
  const [duration, setDuration] = useState(30)
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [notes, setNotes] = useState('')
  const [lastResult, setLastResult] = useState<{ rolls: number; points: number; workoutName: string } | null>(null)

  const previewRolls = calculateRolls(type, duration, intensity)
  const previewPoints = calculateMovePoints(type, duration, intensity)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const workoutName = name.trim() || `${WORKOUT_LABELS[type]} Session`
    const workout = logWorkout(type, workoutName, duration, intensity, notes.trim() || undefined)
    setLastResult({ rolls: workout.rollsEarned, points: workout.pointsEarned, workoutName })
    setName('')
    setNotes('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Log Workout</h2>
        <p className="text-slate-400 mt-1">
          Complete workouts to earn monster rolls and move points. Harder sessions = better odds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Workout Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {WORKOUT_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all
                  ${type === t
                    ? 'border-cyan-400 bg-cyan-400/10 text-white'
                    : 'border-slate-700 bg-surface-raised text-slate-400 hover:border-slate-500'}
                `}
              >
                <span className="text-2xl">{WORKOUT_EMOJI[t]}</span>
                <span className="text-xs font-semibold">{WORKOUT_LABELS[t]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="workout-name" className="block text-sm font-medium text-slate-300 mb-2">
              Session Name
            </label>
            <input
              id="workout-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`${WORKOUT_LABELS[type]} Session`}
              className="w-full px-4 py-3 rounded-xl bg-surface-overlay border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-300 mb-2">
              Duration: {duration} min
            </label>
            <input
              id="duration"
              type="range"
              min={5}
              max={120}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>5 min</span>
              <span>120 min</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Intensity: {intensity}/5
          </label>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setIntensity(level)}
                className={`
                  flex-1 py-2 rounded-lg font-bold text-sm transition-all
                  ${intensity >= level
                    ? 'bg-gradient-to-t from-orange-600 to-yellow-400 text-black'
                    : 'bg-surface-overlay text-slate-500 border border-slate-600'}
                `}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Higher intensity improves roll count, move points, and rare monster odds.
          </p>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="PR on bench, felt great..."
            className="w-full px-4 py-3 rounded-xl bg-surface-overlay border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-400/10 border border-cyan-400/30">
          <div className="flex gap-8">
            <div>
              <div className="text-sm text-cyan-300 font-medium">Rolls</div>
              <div className="text-3xl font-black text-cyan-400">{previewRolls}</div>
            </div>
            <div>
              <div className="text-sm text-amber-300 font-medium">Move Points</div>
              <div className="text-3xl font-black text-amber-400">{previewPoints}</div>
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-cyan-500/25"
          >
            Complete Workout
          </button>
        </div>
      </form>

      {lastResult && (
        <div className="p-4 rounded-xl bg-success/10 border border-success/30 animate-roll-reveal">
          <p className="text-success font-semibold">
            {lastResult.workoutName} logged! +{lastResult.rolls} roll{lastResult.rolls !== 1 ? 's' : ''} and +{lastResult.points} move points.
          </p>
          <p className="text-sm text-slate-400 mt-1">Roll for monsters or buy moves in the Shop tab!</p>
        </div>
      )}
    </div>
  )
}
