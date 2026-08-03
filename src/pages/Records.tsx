import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, RECORD_TYPES, RECORD_TYPE_LABELS, type RecordType } from '../db/db'
import { todayISO, formatDate } from '../lib/date'
import { Button, Card, Dialog, TextField } from '../components/ui'
import { PlusIcon, TrashIcon } from '../components/icons'

export function Records() {
  const [showAdd, setShowAdd] = useState(false)
  const [type, setType] = useState<RecordType>('BLOOD_PRESSURE')
  const [value, setValue] = useState('')
  const [note, setNote] = useState('')

  const records = useLiveQuery(() => db.healthRecords.orderBy('date').reverse().toArray(), [])

  async function addRecord() {
    if (!value.trim()) return
    await db.healthRecords.add({ date: todayISO(), type, value: value.trim(), note: note.trim(), recordedAt: Date.now() })
    setValue('')
    setNote('')
    setType('BLOOD_PRESSURE')
    setShowAdd(false)
  }

  async function removeRecord(id: number) {
    await db.healthRecords.delete(id)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black dark:text-white">Health records</h1>
        <Button onClick={() => setShowAdd(true)} className="!p-2" aria-label="Add record">
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {(records ?? []).map((record) => (
          <Card key={record.id} className="flex items-center gap-3">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                {RECORD_TYPE_LABELS[record.type]}
              </span>
              <p className="mt-1 font-medium text-black dark:text-white">{record.value}</p>
              <p className="text-sm text-black/60 dark:text-white/60">
                {formatDate(record.date)}
                {record.note ? ` · ${record.note}` : ''}
              </p>
            </div>
            <button
              onClick={() => removeRecord(record.id!)}
              className="text-black/40 hover:text-red-600 dark:text-white/40"
              aria-label="Delete record"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </Card>
        ))}
        {records?.length === 0 && (
          <p className="text-sm text-black/50 dark:text-white/50">
            No records yet. Log vitals, lab reports, or symptoms to keep a history.
          </p>
        )}
      </div>

      <Dialog open={showAdd} title="Add health record" onClose={() => setShowAdd(false)}>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/70 dark:text-white/70">Type</span>
            <select
              className="rounded-lg border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-brand dark:border-white/15"
              value={type}
              onChange={(e) => setType(e.target.value as RecordType)}
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {RECORD_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <TextField label="Value (e.g. 128/82 mmHg)" value={value} onChange={(e) => setValue(e.target.value)} />
          <TextField label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={addRecord} disabled={!value.trim()}>
              Add
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
