import Dexie, { type EntityTable } from 'dexie'

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

export const WORKOUT_CATEGORIES = ['CHEST_TRICEPS', 'BACK_BICEPS', 'LEGS_SHOULDERS'] as const
export type WorkoutCategory = (typeof WORKOUT_CATEGORIES)[number]

export interface WorkoutSession {
  id?: number
  category: WorkoutCategory
  date: string // YYYY-MM-DD
  completedAt: number
}

export const TEST_CATEGORIES = [
  'LIVER',
  'KIDNEY',
  'HEART',
  'THYROID',
  'BLOOD_SUGAR',
  'LIPID_PROFILE',
  'CBC',
  'VITAMINS',
  'OTHER',
] as const
export type TestCategory = (typeof TEST_CATEGORIES)[number]

export const TEST_CATEGORY_LABELS: Record<TestCategory, string> = {
  LIVER: 'Liver',
  KIDNEY: 'Kidney',
  HEART: 'Heart',
  THYROID: 'Thyroid',
  BLOOD_SUGAR: 'Blood Sugar',
  LIPID_PROFILE: 'Lipid Profile',
  CBC: 'Complete Blood Count',
  VITAMINS: 'Vitamins',
  OTHER: 'Other',
}

export interface HealthReport {
  id?: number
  date: string // YYYY-MM-DD
  title: string
  labName: string
  fileBlob: Blob
  fileName: string
  fileType: string
  uploadedAt: number
}

export interface HealthParameter {
  id?: number
  reportId?: number
  category: TestCategory
  name: string
  value: number
  unit: string
  referenceRange: string
  date: string // YYYY-MM-DD
  recordedAt: number
}

class WellnessDatabase extends Dexie {
  weightEntries!: EntityTable<WeightEntry, 'id'>
  healthRecords!: EntityTable<HealthRecord, 'id'>
  workoutSessions!: EntityTable<WorkoutSession, 'id'>
  healthReports!: EntityTable<HealthReport, 'id'>
  healthParameters!: EntityTable<HealthParameter, 'id'>

  constructor() {
    super('wellness')
    this.version(1).stores({
      exercises: '++id, sortOrder',
      exerciseCompletions: '++id, exerciseId, date, [exerciseId+date]',
      weightEntries: '++id, date',
      healthRecords: '++id, date',
    })
    this.version(2)
      .stores({
        exercises: null,
        exerciseCompletions: null,
        weightEntries: '++id, date',
        healthRecords: '++id, date',
        workoutSessions: '++id, category, date',
        healthReports: '++id, date',
        healthParameters: '++id, category, name, date, [category+name]',
      })
  }
}

export const db = new WellnessDatabase()
