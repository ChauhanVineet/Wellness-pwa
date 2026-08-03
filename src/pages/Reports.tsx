import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  db,
  TEST_CATEGORIES,
  TEST_CATEGORY_LABELS,
  type TestCategory,
  type HealthParameter,
  type HealthReport,
} from '../db/db'
import { todayISO, formatDate } from '../lib/date'
import { Button, Card, Dialog, TextField } from '../components/ui'
import { PlusIcon, TrashIcon } from '../components/icons'
import { TrendChart } from '../components/TrendChart'

function openReportFile(report: HealthReport) {
  const url = URL.createObjectURL(report.fileBlob)
  window.open(url, '_blank', 'noopener')
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function Reports() {
  const [showUpload, setShowUpload] = useState(false)
  const [showAddParam, setShowAddParam] = useState(false)

  const [title, setTitle] = useState('')
  const [labName, setLabName] = useState('')
  const [uploadDate, setUploadDate] = useState(todayISO())
  const [file, setFile] = useState<File | null>(null)

  const [paramCategory, setParamCategory] = useState<TestCategory>('LIVER')
  const [paramName, setParamName] = useState('')
  const [paramValue, setParamValue] = useState('')
  const [paramUnit, setParamUnit] = useState('')
  const [paramRange, setParamRange] = useState('')
  const [paramDate, setParamDate] = useState(todayISO())
  const [paramReportId, setParamReportId] = useState<string>('')

  const reports = useLiveQuery(() => db.healthReports.orderBy('date').reverse().toArray(), [])
  const parameters = useLiveQuery(() => db.healthParameters.orderBy('date').reverse().toArray(), [])

  async function addReport() {
    if (!file || !title.trim()) return
    await db.healthReports.add({
      date: uploadDate,
      title: title.trim(),
      labName: labName.trim(),
      fileBlob: file,
      fileName: file.name,
      fileType: file.type,
      uploadedAt: Date.now(),
    })
    setTitle('')
    setLabName('')
    setFile(null)
    setUploadDate(todayISO())
    setShowUpload(false)
  }

  async function deleteReport(id: number) {
    await db.healthReports.delete(id)
  }

  async function addParameter() {
    const value = Number(paramValue)
    if (!paramName.trim() || !Number.isFinite(value)) return
    await db.healthParameters.add({
      category: paramCategory,
      name: paramName.trim(),
      value,
      unit: paramUnit.trim(),
      referenceRange: paramRange.trim(),
      date: paramDate,
      reportId: paramReportId ? Number(paramReportId) : undefined,
      recordedAt: Date.now(),
    })
    setParamName('')
    setParamValue('')
    setParamUnit('')
    setParamRange('')
    setParamReportId('')
    setShowAddParam(false)
  }

  async function deleteParameter(id: number) {
    await db.healthParameters.delete(id)
  }

  const byCategory = new Map<TestCategory, HealthParameter[]>()
  for (const p of parameters ?? []) {
    const list = byCategory.get(p.category) ?? []
    list.push(p)
    byCategory.set(p.category, list)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-black dark:text-white">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowUpload(true)} className="!p-2" aria-label="Upload report">
            Upload
          </Button>
          <Button onClick={() => setShowAddParam(true)} className="!p-2" aria-label="Add parameter">
            <PlusIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">Uploaded reports</h2>
        {(reports ?? []).length === 0 && (
          <p className="text-sm text-black/50 dark:text-white/50">No reports uploaded yet.</p>
        )}
        {(reports ?? []).map((report) => (
          <Card key={report.id} className="flex items-center gap-3">
            <button className="flex-1 text-left" onClick={() => openReportFile(report)}>
              <p className="font-medium text-black dark:text-white">{report.title}</p>
              <p className="text-sm text-black/60 dark:text-white/60">
                {formatDate(report.date)}
                {report.labName ? ` · ${report.labName}` : ''}
              </p>
            </button>
            <button
              onClick={() => report.id && deleteReport(report.id)}
              className="text-black/40 hover:text-red-600 dark:text-white/40"
              aria-label="Delete report"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-black/70 dark:text-white/70">Trends by test type</h2>
        {TEST_CATEGORIES.map((category) => {
          const items = byCategory.get(category)
          if (!items || items.length === 0) return null

          const byName = new Map<string, HealthParameter[]>()
          for (const p of items) {
            const list = byName.get(p.name) ?? []
            list.push(p)
            byName.set(p.name, list)
          }

          return (
            <div key={category} className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-brand">{TEST_CATEGORY_LABELS[category]}</p>
              {[...byName.entries()].map(([name, entries]) => {
                const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
                const latest = sorted[0]
                return (
                  <Card key={name}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-black dark:text-white">{name}</p>
                      <p className="text-sm text-black/60 dark:text-white/60">
                        {latest.value} {latest.unit}
                      </p>
                    </div>
                    {latest.referenceRange && (
                      <p className="text-xs text-black/40 dark:text-white/40">Reference: {latest.referenceRange}</p>
                    )}
                    <div className="mt-2">
                      <TrendChart points={entries.map((e) => ({ date: e.date, value: e.value }))} />
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      {sorted.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between text-sm text-black/60 dark:text-white/60">
                          <span>
                            {formatDate(entry.date)} · {entry.value} {entry.unit}
                          </span>
                          <button
                            onClick={() => entry.id && deleteParameter(entry.id)}
                            className="text-black/40 hover:text-red-600 dark:text-white/40"
                            aria-label="Delete entry"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })}
            </div>
          )
        })}
        {(parameters ?? []).length === 0 && (
          <p className="text-sm text-black/50 dark:text-white/50">
            No parameters logged yet. Add one to start tracking trends.
          </p>
        )}
      </div>

      <Dialog open={showUpload} title="Upload report" onClose={() => setShowUpload(false)}>
        <div className="flex flex-col gap-3">
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Annual Checkup" />
          <TextField label="Lab name (optional)" value={labName} onChange={(e) => setLabName(e.target.value)} />
          <TextField label="Date" type="date" value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/70 dark:text-white/70">File (PDF or photo)</span>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm text-black/70 dark:text-white/70"
            />
          </label>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowUpload(false)}>
              Cancel
            </Button>
            <Button onClick={addReport} disabled={!file || !title.trim()}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={showAddParam} title="Add parameter" onClose={() => setShowAddParam(false)}>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-black/70 dark:text-white/70">Category</span>
            <select
              className="rounded-lg border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-brand dark:border-white/15"
              value={paramCategory}
              onChange={(e) => setParamCategory(e.target.value as TestCategory)}
            >
              {TEST_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {TEST_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </label>
          <TextField label="Parameter name (e.g. ALT / SGPT)" value={paramName} onChange={(e) => setParamName(e.target.value)} />
          <div className="flex gap-2">
            <TextField
              label="Value"
              type="number"
              inputMode="decimal"
              value={paramValue}
              onChange={(e) => setParamValue(e.target.value)}
              className="flex-1"
            />
            <TextField label="Unit" value={paramUnit} onChange={(e) => setParamUnit(e.target.value)} className="flex-1" />
          </div>
          <TextField label="Reference range (optional)" value={paramRange} onChange={(e) => setParamRange(e.target.value)} />
          <TextField label="Date" type="date" value={paramDate} onChange={(e) => setParamDate(e.target.value)} />
          {(reports ?? []).length > 0 && (
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-black/70 dark:text-white/70">Link to report (optional)</span>
              <select
                className="rounded-lg border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-brand dark:border-white/15"
                value={paramReportId}
                onChange={(e) => setParamReportId(e.target.value)}
              >
                <option value="">None</option>
                {(reports ?? []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({formatDate(r.date)})
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAddParam(false)}>
              Cancel
            </Button>
            <Button onClick={addParameter} disabled={!paramName.trim() || !paramValue}>
              Add
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
