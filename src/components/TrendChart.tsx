export interface TrendPoint {
  date: string
  value: number
}

export function TrendChart({ points }: { points: TrendPoint[] }) {
  const chronological = [...points].sort((a, b) => a.date.localeCompare(b.date))
  if (chronological.length < 2) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-black/40 dark:text-white/40">
        Log at least 2 entries to see a trend
      </div>
    )
  }

  const width = 320
  const height = 120
  const padding = 12

  const values = chronological.map((p) => p.value)
  const min = Math.min(...values) - 1
  const max = Math.max(...values) + 1
  const range = Math.max(max - min, 1)

  const points2d = chronological.map((point, i) => {
    const x = padding + (i * (width - padding * 2)) / (chronological.length - 1)
    const y = height - padding - ((point.value - min) / range) * (height - padding * 2)
    return { x, y }
  })

  const path = points2d.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full">
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={0}
          x2={width}
          y1={(height / 3) * i}
          y2={(height / 3) * i}
          stroke="currentColor"
          strokeOpacity={0.08}
        />
      ))}
      <path d={path} fill="none" stroke="#1d4ed8" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {points2d.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#3b82f6" stroke="white" strokeWidth={1.5} />
      ))}
    </svg>
  )
}
