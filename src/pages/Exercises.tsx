import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import { todayISO } from '../lib/date'
import { Button, Card, Dialog, ProgressBar, TextField } from '../components/ui'
import { PlusIcon, TrashIcon } from '../components/icons'

export function Exercises() {
  const today = todayISO()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')

  const exercises = useLiveQuery(
    () => db.exercises.filter((e) => e.active).sortBy('sortOrder'),
    [],
  )
  const completions = useLiveQuery(() => db.exerciseCompletions.where('date').equals(today).toArray(), [today])

  const completedIds = new Set((completions ?? []).map((c) => c.exerciseId))
  const total = exercises?.length ?? 0
  const done = exercises ? exercises.filter((e) => completedIds.has(e.id!)).length : 0
  const progress = total === 0 ? 0 : done / total

  async function toggle(exerciseId: number, checked: boolean) {
    if (checked) {
      await db.exerciseCompletions.add({ exerciseId, date: today, completedAt: Date.now() })
    } else {
      const existing = await db.exerciseCompletions.where({ exerciseId, date: today }).first()
      if (existing?.id) await db.exerciseCompletions.delete(existing.id)
    }
  }

  async function addExercise() {
    if (!name.trim()) return
    const maxOrder = exercises && exercises.length > 0 ? Math.max(...exercises.map((e) => e.sortOrder)) : -1
    await db.exercises.add({ name: name.trim(), target: target.trim(), sortOrder: maxOrder + 1, active: true })
    setName('')
    setTarget('')
    setShowAdd(false)
  }

  async function removeExercise(id: number) {
    await db.exercises.delete(id)
    await db.exerciseCompletions.where('exerciseId').equals(id).delete()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black dark:text-white">Today's routine</h1>
        <Button onClick={() => setShowAdd(true)} className="!p-2" aria-label="Add exercise">
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <ProgressBar value={progress} />
        <p className="text-sm text-black/60 dark:text-white/60">
          {done} of {total} done
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {(exercises ?? []).map((exercise) => (
          <Card key={exercise.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5 accent-brand"
              checked={completedIds.has(exercise.id!)}
              onChange={(e) => toggle(exercise.id!, e.target.checked)}
            />
            <div className="flex-1">
              <p className="font-medium text-black dark:text-white">{exercise.name}</p>
              <p className="text-sm text-black/60 dark:text-white/60">{exercise.target}</p>
            </div>
            <button
              onClick={() => removeExercise(exercise.id!)}
              className="text-black/40 hover:text-red-600 dark:text-white/40"
              aria-label="Delete exercise"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </Card>
        ))}
        {total === 0 && <p className="text-sm text-black/50 dark:text-white/50">No exercises yet. Add one to get started.</p>}
      </div>

      <Dialog open={showAdd} title="Add exercise" onClose={() => setShowAdd(false)}>
        <div className="flex flex-col gap-3">
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Target (e.g. 20 minutes)" value={target} onChange={(e) => setTarget(e.target.value)} />
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={addExercise} disabled={!name.trim()}>
              Add
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
