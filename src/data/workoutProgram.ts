import type { WorkoutCategory } from '../db/db'

export type Equipment = 'dumbbell' | 'bench' | 'cable' | 'lat_pulldown' | 'leg_press' | 'smith_machine'

export interface WorkoutExercise {
  name: string
  muscleGroup: string
  equipment: Equipment
  /** Folder name under public/exercises/ containing 0.jpg and 1.jpg (source: free-exercise-db, public domain) */
  imageId: string
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
      { name: 'Flat Dumbbell Bench Press', muscleGroup: 'Chest', equipment: 'bench', imageId: 'Dumbbell_Bench_Press' },
      { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', equipment: 'bench', imageId: 'Incline_Dumbbell_Press' },
      { name: 'Dumbbell Bench Fly', muscleGroup: 'Chest', equipment: 'bench', imageId: 'Dumbbell_Flyes' },
      { name: 'Cable Triceps Pushdown', muscleGroup: 'Triceps', equipment: 'cable', imageId: 'Triceps_Pushdown' },
      { name: 'Seated Overhead Triceps Extension', muscleGroup: 'Triceps', equipment: 'bench', imageId: 'Seated_Triceps_Press' },
      { name: 'Bench Skull Crushers', muscleGroup: 'Triceps', equipment: 'bench', imageId: 'EZ-Bar_Skullcrusher' },
    ],
  },
  {
    category: 'BACK_BICEPS',
    label: 'Back & Biceps',
    exercises: [
      { name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'lat_pulldown', imageId: 'Wide-Grip_Lat_Pulldown' },
      { name: 'Seated Cable Row', muscleGroup: 'Back', equipment: 'cable', imageId: 'Seated_Cable_Rows' },
      { name: 'Bent-Over Dumbbell Row', muscleGroup: 'Back', equipment: 'dumbbell', imageId: 'Bent_Over_Two-Dumbbell_Row' },
      { name: 'Cable Bicep Curl', muscleGroup: 'Biceps', equipment: 'cable', imageId: 'Standing_Biceps_Cable_Curl' },
      { name: 'Standing Dumbbell Bicep Curl', muscleGroup: 'Biceps', equipment: 'dumbbell', imageId: 'Dumbbell_Bicep_Curl' },
      { name: 'Hammer Curl', muscleGroup: 'Biceps', equipment: 'dumbbell', imageId: 'Hammer_Curls' },
    ],
  },
  {
    category: 'LEGS_SHOULDERS',
    label: 'Legs & Shoulders',
    exercises: [
      { name: 'Leg Press', muscleGroup: 'Legs', equipment: 'leg_press', imageId: 'Leg_Press' },
      { name: 'Smith Machine Squat', muscleGroup: 'Legs', equipment: 'smith_machine', imageId: 'Smith_Machine_Squat' },
      { name: 'Dumbbell Romanian Deadlift', muscleGroup: 'Legs', equipment: 'dumbbell', imageId: 'Stiff-Legged_Dumbbell_Deadlift' },
      { name: 'Seated Dumbbell Shoulder Press', muscleGroup: 'Shoulders', equipment: 'bench', imageId: 'Seated_Dumbbell_Press' },
      { name: 'Lateral Raise', muscleGroup: 'Shoulders', equipment: 'dumbbell', imageId: 'Side_Lateral_Raise' },
      { name: 'Front Raise', muscleGroup: 'Shoulders', equipment: 'dumbbell', imageId: 'Front_Dumbbell_Raise' },
    ],
  },
]

export function getWorkoutCategory(category: WorkoutCategory): WorkoutCategoryInfo {
  const info = WORKOUT_PROGRAM.find((c) => c.category === category)
  if (!info) throw new Error(`Unknown workout category: ${category}`)
  return info
}
