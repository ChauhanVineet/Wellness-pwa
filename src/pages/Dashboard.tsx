import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db } from '../db/db'
import { formatDate } from '../lib/date'
import { Card } from '../components/ui'
import { WeightIcon } from '../components/icons'
import { WorkoutProgress } from '../components/WorkoutProgress'

export function Dashboard() {
  const latestWeight = useLiveQuery(() => db.weightEntries.orderBy('date').reverse().first(), [])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-black dark:text-white">
        {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
      </h1>

      <Link to="/workout">
        <WorkoutProgress />
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

      <Link to="/records">
        <Card className="text-sm text-black/70 dark:text-white/70">View health records →</Card>
      </Link>

      <Link to="/reports">
        <Card className="text-sm text-black/70 dark:text-white/70">View health reports →</Card>
      </Link>
    </div>
  )
}
