import type { WorkoutCategory } from '../db/db'

export interface WorkoutExercise {
  name: string
  muscleGroup: string
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
      { name: 'Dumbbell Floor Press', muscleGroup: 'Chest' },
      { name: 'Dumbbell Floor Fly', muscleGroup: 'Chest' },
      { name: 'Dumbbell Pullover', muscleGroup: 'Chest' },
      { name: 'Standing Overhead Triceps Extension', muscleGroup: 'Triceps' },
      { name: 'Triceps Kickback', muscleGroup: 'Triceps' },
      { name: 'Lying Triceps Extension', muscleGroup: 'Triceps' },
    ],
  },
  {
    category: 'BACK_BICEPS',
    label: 'Back & Biceps',
    exercises: [
      { name: 'Bent-Over Dumbbell Row', muscleGroup: 'Back' },
      { name: 'Single-Arm Dumbbell Row', muscleGroup: 'Back' },
      { name: 'Renegade Row', muscleGroup: 'Back' },
      { name: 'Standing Dumbbell Bicep Curl', muscleGroup: 'Biceps' },
      { name: 'Hammer Curl', muscleGroup: 'Biceps' },
      { name: 'Concentration Curl', muscleGroup: 'Biceps' },
    ],
  },
  {
    category: 'LEGS_SHOULDERS',
    label: 'Legs & Shoulders',
    exercises: [
      { name: 'Dumbbell Goblet Squat', muscleGroup: 'Legs' },
      { name: 'Dumbbell Lunges', muscleGroup: 'Legs' },
      { name: 'Dumbbell Romanian Deadlift', muscleGroup: 'Legs' },
      { name: 'Standing Dumbbell Shoulder Press', muscleGroup: 'Shoulders' },
      { name: 'Lateral Raise', muscleGroup: 'Shoulders' },
      { name: 'Front Raise', muscleGroup: 'Shoulders' },
    ],
  },
]

export function getWorkoutCategory(category: WorkoutCategory): WorkoutCategoryInfo {
  const info = WORKOUT_PROGRAM.find((c) => c.category === category)
  if (!info) throw new Error(`Unknown workout category: ${category}`)
  return info
}
