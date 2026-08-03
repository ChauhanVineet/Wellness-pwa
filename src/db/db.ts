import Dexie, { type EntityTable } from 'dexie'

export interface Exercise {
  id?: number
  name: string
  target: string
  sortOrder: number
  active: boolean
}

export interface ExerciseCompletion {
  id?: number
  exerciseId: number
  date: string // YYYY-MM-DD
  completedAt: number
}

export interface WeightEntry {
  id?: number
  date: string // YYYY-MM-DD
  weightKg: number
  note: string
  recordedAt: number
}

export const RECORD_TYPES = [
  'BLOOD_PRESSURE',
  'BLOOD_SUGAR',
  'LAB_REPORT',
  'SYMPTOM',
  'NOTE',
] as const

export type RecordType = (typeof RECORD_TYPES)[number]

export const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  BLOOD_PRESSURE: 'Blood Pressure',
  BLOOD_SUGAR: 'Blood Sugar',
  LAB_REPORT: 'Lab Report',
  SYMPTOM: 'Symptom',
  NOTE: 'Note',
}

export interface HealthRecord {
  id?: number
  date: string // YYYY-MM-DD
  type: RecordType
  value: string
  note: string
  recordedAt: number
}

class WellnessDatabase extends Dexie {
  exercises!: EntityTable<Exercise, 'id'>
  exerciseCompletions!: EntityTable<ExerciseCompletion, 'id'>
  weightEntries!: EntityTable<WeightEntry, 'id'>
  healthRecords!: EntityTable<HealthRecord, 'id'>

  constructor() {
    super('wellness')
    this.version(1).stores({
      exercises: '++id, sortOrder',
      exerciseCompletions: '++id, exerciseId, date, [exerciseId+date]',
      weightEntries: '++id, date',
      healthRecords: '++id, date',
    })
  }
}

export const db = new WellnessDatabase()

const DEFAULT_EXERCISES: Omit<Exercise, 'id'>[] = [
  { name: 'Morning walk', target: '30 minutes', sortOrder: 0, active: true },
  { name: 'Stretching', target: '10 minutes', sortOrder: 1, active: true },
  { name: 'Strength training', target: '20 minutes', sortOrder: 2, active: true },
  { name: 'Evening walk', target: '20 minutes', sortOrder: 3, active: true },
]

export async function seedDatabase() {
  await db.transaction('rw', db.exercises, async () => {
    const count = await db.exercises.count()
    if (count === 0) {
      await db.exercises.bulkAdd(DEFAULT_EXERCISES)
    }
  })
}
