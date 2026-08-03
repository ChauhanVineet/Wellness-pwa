import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import { todayISO, formatDate } from '../lib/date'
import { bmiCategory, bmiFor, getHeightCm, setHeightCm } from '../lib/height'
import { Button, Card, Dialog, TextField } from '../components/ui'
import { PlusIcon, TrashIcon } from '../components/icons'
import { WeightChart } from '../components/WeightChart'

export function Weight() {
  const [showAdd, setShowAdd] = useState(false)
  const [showHeight, setShowHeight] = useState(false)
  const [weightText, setWeightText] = useState('')
  const [note, setNote] = useState('')
  const [heightText, setHeightText] = useState(String(getHeightCm()))

  const entries = useLiveQuery(() => db.weightEntries.orderBy('date').reverse().toArray(), [])
  const latest = entries?.[0]
  const heightCm = getHeightCm()

  async function addEntry() {
    const weightKg = Number(weightText)
    if (!Number.isFinite(weightKg) || weightKg <= 0) return
    await db.weightEntries.add({ date: todayISO(), weightKg, note: note.trim(), recordedAt: Date.now() })
    setWeightText('')
    setNote('')
    setShowAdd(false)
  }

  async function removeEntry(id: number) {
    await db.weightEntries.delete(id)
  }

  function saveHeight() {
    const value = Number(heightText)
    if (Number.isFinite(value) && value > 0) setHeightCm(value)
    setShowHeight(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black dark:text-white">Weight trend</h1>
        <Button onClick={() => setShowAdd(true)} className="!p-2" aria-label="Log weight">
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>

      {latest && (
        <Card>
          <p className="text-2xl font-semibold text-black dark:text-white">{latest.weightKg} kg</p>
          <button className="text-sm text-black/60 underline decoration-dotted dark:text-white/60" onClick={() => setShowHeight(true)}>
            BMI {bmiFor(latest.weightKg, heightCm).toFixed(1)} · {bmiCategory(bmiFor(latest.weightKg, heightCm))} · height {heightCm} cm
          </button>
        </Card>
      )}

      <Card>
        <WeightChart entries={(entries ?? []).slice(0, 30)} />
      </Card>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">History</h2>
        {(entries ?? []).map((entry) => (
          <Card key={entry.id} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-medium text-black dark:text-white">{entry.weightKg} kg</p>
              <p className="text-sm text-black/60 dark:text-white/60">
                {formatDate(entry.date)}
                {entry.note ? ` · ${entry.note}` : ''}
              </p>
            </div>
            <button
              onClick={() => removeEntry(entry.id!)}
              className="text-black/40 hover:text-red-600 dark:text-white/40"
              aria-label="Delete entry"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </Card>
        ))}
        {entries?.length === 0 && <p className="text-sm text-black/50 dark:text-white/50">No entries yet.</p>}
      </div>

      <Dialog open={showAdd} title="Log weight" onClose={() => setShowAdd(false)}>
        <div className="flex flex-col gap-3">
          <TextField label="Weight (kg)" type="number" inputMode="decimal" value={weightText} onChange={(e) => setWeightText(e.target.value)} />
          <TextField label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={addEntry} disabled={!weightText}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={showHeight} title="Height" onClose={() => setShowHeight(false)}>
        <div className="flex flex-col gap-3">
          <TextField label="Height (cm)" type="number" inputMode="decimal" value={heightText} onChange={(e) => setHeightText(e.target.value)} />
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowHeight(false)}>
              Cancel
            </Button>
            <Button onClick={saveHeight}>Save</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
