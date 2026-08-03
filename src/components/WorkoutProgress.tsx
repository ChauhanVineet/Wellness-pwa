import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import { isoDateOffset, isSameMonth, todayISO, weekdayLabel } from '../lib/date'
import { WORKOUT_PROGRAM } from '../data/workoutProgram'
import { Card } from './ui'

export function WorkoutProgress() {
  const sessions = useLiveQuery(() => db.workoutSessions.toArray(), [])
  const today = todayISO()

  const last7Days = Array.from({ length: 7 }, (_, i) => isoDateOffset(6 - i))
  const doneDates = new Set((sessions ?? []).map((s) => s.date))

  const monthSessions = (sessions ?? []).filter((s) => isSameMonth(s.date))
  const countByCategory = new Map<string, number>()
  for (const s of monthSessions) {
    countByCategory.set(s.category, (countByCategory.get(s.category) ?? 0) + 1)
  }

  return (
    <Card>
      <p className="text-sm font-semibold text-black/70 dark:text-white/70">This week</p>
      <div className="mt-2 flex justify-between">
        {last7Days.map((day) => (
          <div key={day} className="flex flex-col items-center gap-1">
            <span className="text-xs text-black/40 dark:text-white/40">{weekdayLabel(day)}</span>
            <span
              className={`h-3 w-3 rounded-full ${
                doneDates.has(day) ? 'bg-brand' : 'bg-black/10 dark:bg-white/10'
              } ${day === today ? 'ring-2 ring-brand/40 ring-offset-1' : ''}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-black/10 pt-3 dark:border-white/10">
        <p className="text-sm font-semibold text-black/70 dark:text-white/70">
          This month · {monthSessions.length} workout{monthSessions.length === 1 ? '' : 's'}
        </p>
        <ul className="mt-1 flex flex-col gap-0.5">
          {WORKOUT_PROGRAM.map((info) => (
            <li key={info.category} className="flex justify-between text-sm text-black/60 dark:text-white/60">
              <span>{info.label}</span>
              <span>{countByCategory.get(info.category) ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
