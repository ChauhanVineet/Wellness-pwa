import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111c30] ${className}`}>
      {children}
    </div>
  )
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }) {
  const base = 'rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-brand text-white hover:bg-brand-light',
    outline: 'border border-brand text-brand hover:bg-brand/10',
    ghost: 'text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10',
  }
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />
}

export function TextField({ label, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-black/70 dark:text-white/70">{label}</span>
      <input
        className={`rounded-lg border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-brand dark:border-white/15 ${className}`}
        {...props}
      />
    </label>
  )
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
      <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  )
}

export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-[#111c30] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">{title}</h2>
        {children}
      </div>
    </div>
  )
}
