import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { db } from '../db/db'
import { formatDate } from '../lib/date'
import { WORKOUT_PROGRAM } from '../data/workoutProgram'
import { Card } from '../components/ui'

export function Workout() {
  const navigate = useNavigate()
  const sessions = useLiveQuery(() => db.workoutSessions.orderBy('date').reverse().toArray(), [])

  function lastDoneFor(category: string) {
    return sessions?.find((s) => s.category === category)?.date
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-black dark:text-white">Workout</h1>
      <p className="text-sm text-black/60 dark:text-white/60">
        Pick a split. Each exercise is 3 sets of 10 reps, voice-guided, with a 1 minute rest between sets.
      </p>

      <div className="flex flex-col gap-3">
        {WORKOUT_PROGRAM.map((info) => {
          const lastDone = lastDoneFor(info.category)
          return (
            <button key={info.category} onClick={() => navigate(`/workout/${info.category}`)} className="text-left">
              <Card className="hover:border-brand/40">
                <p className="text-lg font-semibold text-black dark:text-white">{info.label}</p>
                <p className="text-sm text-black/60 dark:text-white/60">{info.exercises.length} exercises</p>
                <p className="mt-1 text-sm text-black/50 dark:text-white/50">
                  {lastDone ? `Last done ${formatDate(lastDone)}` : 'Not done yet'}
                </p>
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
