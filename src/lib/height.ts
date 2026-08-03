const KEY = 'wellness_height_cm'
const DEFAULT_HEIGHT_CM = 176

export function getHeightCm(): number {
  const raw = localStorage.getItem(KEY)
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_HEIGHT_CM
}

export function setHeightCm(value: number) {
  localStorage.setItem(KEY, String(value))
}

export function bmiFor(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}
