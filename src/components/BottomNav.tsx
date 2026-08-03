import { NavLink } from 'react-router-dom'
import { DashboardIcon, ExerciseIcon, WeightIcon, RecordsIcon } from './icons'

const items = [
  { to: '/', label: 'Home', icon: DashboardIcon, end: true },
  { to: '/exercises', label: 'Exercises', icon: ExerciseIcon, end: false },
  { to: '/weight', label: 'Weight', icon: WeightIcon, end: false },
  { to: '/records', label: 'Records', icon: RecordsIcon, end: false },
]

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 border-t border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#16281f]/90">
      <ul className="mx-auto flex max-w-md justify-around">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 text-xs ${
                  isActive ? 'text-brand' : 'text-black/50 dark:text-white/50'
                }`
              }
            >
              <Icon className="h-6 w-6" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
