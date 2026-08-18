import type { WorkoutCategory } from '../db/db'

export type Equipment = 'dumbbell' | 'bench' | 'cable' | 'lat_pulldown' | 'leg_press' | 'smith_machine'

export interface WorkoutExercise {
  name: string
  muscleGroup: string
  equipment: Equipment
}

export interface WorkoutCategoryInfo {
  category: WorkoutCategory
  label: string
  exercises: WorkoutExercise[]
}

export const SETS_PER_EXERCISE = 3
export const REPS_PER_SET = 10
export const REST_SECONDS = 90
export const SECONDS_PER_REP = 2.2

export const WORKOUT_PROGRAM: WorkoutCategoryInfo[] = [
  {
    category: 'CHEST_TRICEPS',
    label: 'Chest & Triceps',
    exercises: [
      { name: 'Flat Dumbbell Bench Press', muscleGroup: 'Chest', equipment: 'bench' },
      { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', equipment: 'bench' },
      { name: 'Dumbbell Bench Fly', muscleGroup: 'Chest', equipment: 'bench' },
      { name: 'Cable Triceps Pushdown', muscleGroup: 'Triceps', equipment: 'cable' },
      { name: 'Seated Overhead Triceps Extension', muscleGroup: 'Triceps', equipment: 'bench' },
      { name: 'Bench Skull Crushers', muscleGroup: 'Triceps', equipment: 'bench' },
    ],
  },
  {
    category: 'BACK_BICEPS',
    label: 'Back & Biceps',
    exercises: [
      { name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'lat_pulldown' },
      { name: 'Seated Cable Row', muscleGroup: 'Back', equipment: 'cable' },
      { name: 'Bent-Over Dumbbell Row', muscleGroup: 'Back', equipment: 'dumbbell' },
      { name: 'Cable Bicep Curl', muscleGroup: 'Biceps', equipment: 'cable' },
      { name: 'Standing Dumbbell Bicep Curl', muscleGroup: 'Biceps', equipment: 'dumbbell' },
      { name: 'Hammer Curl', muscleGroup: 'Biceps', equipment: 'dumbbell' },
    ],
  },
  {
    category: 'LEGS_SHOULDERS',
    label: 'Legs & Shoulders',
    exercises: [
      { name: 'Leg Press', muscleGroup: 'Legs', equipment: 'leg_press' },
      { name: 'Smith Machine Squat', muscleGroup: 'Legs', equipment: 'smith_machine' },
      { name: 'Dumbbell Romanian Deadlift', muscleGroup: 'Legs', equipment: 'dumbbell' },
      { name: 'Seated Dumbbell Shoulder Press', muscleGroup: 'Shoulders', equipment: 'bench' },
      { name: 'Lateral Raise', muscleGroup: 'Shoulders', equipment: 'dumbbell' },
      { name: 'Front Raise', muscleGroup: 'Shoulders', equipment: 'dumbbell' },
    ],
  },
]

export function getWorkoutCategory(category: WorkoutCategory): WorkoutCategoryInfo {
  const info = WORKOUT_PROGRAM.find((c) => c.category === category)
  if (!info) throw new Error(`Unknown workout category: ${category}`)
  return info
}
