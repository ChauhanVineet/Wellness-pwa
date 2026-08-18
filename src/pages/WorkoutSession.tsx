import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db, WORKOUT_CATEGORIES, type WorkoutCategory } from '../db/db'
import { todayISO } from '../lib/date'
import { speak, cancelSpeech } from '../lib/speech'
import { requestWakeLock, releaseWakeLock } from '../lib/wakeLock'
import {
  SETS_PER_EXERCISE,
  REPS_PER_SET,
  REST_SECONDS,
  SECONDS_PER_REP,
  getWorkoutCategory,
} from '../data/workoutProgram'
import { EXERCISE_POSES } from '../data/exerciseAnimations'
import { ExerciseAnimation } from '../components/ExerciseAnimation'
import { Button, Card } from '../components/ui'

type Phase = 'idle' | 'active' | 'resting' | 'complete'

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'))
    const timeout = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timeout)
      reject(new DOMException('Aborted', 'AbortError'))
    }, { once: true })
  })
}

export function WorkoutSession() {
  const { category: categoryParam } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const validCategory = WORKOUT_CATEGORIES.includes(categoryParam as WorkoutCategory)
    ? (categoryParam as WorkoutCategory)
    : null

  const [started, setStarted] = useState(false)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [currentSet, setCurrentSet] = useState(1)
  const [currentRep, setCurrentRep] = useState(0)
  const [restRemaining, setRestRemaining] = useState(REST_SECONDS)
  const [justCompleted, setJustCompleted] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    cancelSpeech()
    setStarted(false)
    setExerciseIndex(0)
    setPhase('idle')
    setCurrentSet(1)
    setCurrentRep(0)
    setRestRemaining(REST_SECONDS)
    setJustCompleted(false)
  }, [categoryParam])

  useEffect(() => {
    requestWakeLock()
    return () => {
      abortRef.current?.abort()
      cancelSpeech()
      releaseWakeLock()
    }
  }, [])

  if (!validCategory) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-black/60 dark:text-white/60">Unknown workout category.</p>
        <Button onClick={() => navigate('/workout')}>Back to Workout</Button>
      </div>
    )
  }

  const category = validCategory
  const info = getWorkoutCategory(category)
  const exercise = info.exercises[exerciseIndex]
  const pose = EXERCISE_POSES[exercise.name]

  async function runExercise(index: number, signal: AbortSignal) {
    const ex = info.exercises[index]
    setPhase('active')
    setJustCompleted(false)
    speak(`${ex.name}. Set 1 of ${SETS_PER_EXERCISE}.`)

    try {
      for (let set = 1; set <= SETS_PER_EXERCISE; set++) {
        setCurrentSet(set)
        setCurrentRep(0)

        for (let rep = 1; rep <= REPS_PER_SET; rep++) {
          await sleep(SECONDS_PER_REP * 1000, signal)
          setCurrentRep(rep)
          speak(String(rep))
        }

        if (set < SETS_PER_EXERCISE) {
          setPhase('resting')
          speak('Rest for 1 minute.')
          for (let remaining = REST_SECONDS; remaining >= 1; remaining--) {
            setRestRemaining(remaining)
            if (remaining === 10) speak('10 seconds left.')
            await sleep(1000, signal)
          }
          setPhase('active')
          speak(`Set ${set + 1} of ${SETS_PER_EXERCISE}.`)
        }
      }

      if (index === info.exercises.length - 1) {
        await db.workoutSessions.add({ category, date: todayISO(), completedAt: Date.now() })
        setPhase('complete')
        speak('Workout complete. Great job.')
      } else {
        setExerciseIndex(index + 1)
        setJustCompleted(true)
        setPhase('idle')
        speak('Exercise complete. Tap start for the next exercise.')
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') throw err
    }
  }

  function handleStart() {
    if (phase !== 'idle') return
    const controller = new AbortController()
    abortRef.current = controller
    runExercise(exerciseIndex, controller.signal)
  }

  function handleEndWorkout() {
    abortRef.current?.abort()
    cancelSpeech()
    navigate('/workout')
  }

  if (!started) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-semibold text-black dark:text-white">{info.label}</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            Today's lineup — {info.exercises.length} exercises, {SETS_PER_EXERCISE} sets × {REPS_PER_SET} reps each.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {info.exercises.map((ex, i) => (
            <Card key={ex.name} className="flex items-center gap-3">
              <ExerciseAnimation pose={EXERCISE_POSES[ex.name]} className="h-16 w-16 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-black dark:text-white">
                  {i + 1}. {ex.name}
                </p>
                <p className="text-sm text-black/60 dark:text-white/60">
                  {ex.muscleGroup} · {SETS_PER_EXERCISE} × {REPS_PER_SET}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <Button onClick={() => setStarted(true)}>Start Workout</Button>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-2xl font-semibold text-black dark:text-white">Workout complete!</p>
        <p className="text-sm text-black/60 dark:text-white/60">{info.label} — {info.exercises.length} exercises done.</p>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-black/60 dark:text-white/60">
          {info.label} · Exercise {exerciseIndex + 1} of {info.exercises.length}
        </p>
        <h1 className="text-xl font-semibold text-black dark:text-white">{exercise.name}</h1>
        <p className="text-sm text-black/60 dark:text-white/60">
          {exercise.muscleGroup} · {SETS_PER_EXERCISE} sets × {REPS_PER_SET} reps
        </p>
      </div>

      <Card className="flex flex-col items-center gap-2 py-6 text-center">
        <ExerciseAnimation pose={pose} className="h-40 w-40" />

        {phase === 'idle' && (
          <>
            <p className="text-black/70 dark:text-white/70">
              {justCompleted ? 'Nice work! Ready for the next exercise?' : 'Ready to begin?'}
            </p>
            <Button onClick={handleStart}>Start</Button>
          </>
        )}

        {phase === 'active' && (
          <>
            <p className="text-sm text-black/60 dark:text-white/60">Set {currentSet} of {SETS_PER_EXERCISE}</p>
            <p className="text-6xl font-bold text-brand">{currentRep || '—'}</p>
            <p className="text-sm text-black/50 dark:text-white/50">of {REPS_PER_SET} reps</p>
          </>
        )}

        {phase === 'resting' && (
          <>
            <p className="text-sm text-black/60 dark:text-white/60">Rest</p>
            <p className="text-6xl font-bold text-brand">{restRemaining}</p>
            <p className="text-sm text-black/50 dark:text-white/50">seconds · next up: set {currentSet + 1}</p>
          </>
        )}
      </Card>

      <Button variant="ghost" onClick={handleEndWorkout}>
        End workout
      </Button>
    </div>
  )
}
