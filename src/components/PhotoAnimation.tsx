import { useEffect, useState } from 'react'

export function PhotoAnimation({ exerciseId, className = '' }: { exerciseId: string; className?: string }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-black/5 dark:bg-white/5 ${className}`}>
      <img
        src={`/exercises/${exerciseId}/0.jpg`}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${frame === 0 ? 'opacity-100' : 'opacity-0'}`}
      />
      <img
        src={`/exercises/${exerciseId}/1.jpg`}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${frame === 1 ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
