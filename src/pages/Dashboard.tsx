import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../db/db'
import { todayISO, formatDate } from '../lib/date'
import { Card } from '../components/ui'
import { ExerciseIcon, WeightIcon } from '../components/icons'

export function Dashboard() {
  const today = todayISO()

  const exercises = useLiveQuery(() => db.exercises.filter((e) => e.active).toArray(), [])
  const completions = useLiveQuery(() => db.exerciseCompletions.where('date').equals(today).toArray(), [today])
  const latestWeight = useLiveQuery(() => db.weightEntries.orderBy('date').reverse().first(), [])

  const total = exercises?.length ?? 0
  const done = new Set((completions ?? []).map((c) => c.exerciseId)).size

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-black dark:text-white">
        {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
      </h1>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/exercises">
          <Card className="bg-brand/5">
            <ExerciseIcon className="h-6 w-6 text-brand" />
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">Exercises</p>
            <p className="text-xl font-semibold text-black dark:text-white">
              {done}/{total}
            </p>
            <p className="text-sm text-black/60 dark:text-white/60">done today</p>
          </Card>
        </Link>
        <Link to="/weight">
          <Card className="bg-brand/5">
            <WeightIcon className="h-6 w-6 text-brand" />
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">Latest weight</p>
            <p className="text-xl font-semibold text-black dark:text-white">
              {latestWeight ? `${latestWeight.weightKg} kg` : '—'}
            </p>
            <p className="text-sm text-black/60 dark:text-white/60">
              {latestWeight ? formatDate(latestWeight.date) : 'Log your first weigh-in'}
            </p>
          </Card>
        </Link>
      </div>

      <Link to="/records">
        <Card className="text-sm text-black/70 dark:text-white/70">View health records →</Card>
      </Link>
    </div>
  )
}
