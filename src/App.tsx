import { HashRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Dashboard } from './pages/Dashboard'
import { Workout } from './pages/Workout'
import { WorkoutSession } from './pages/WorkoutSession'
import { Weight } from './pages/Weight'
import { Records } from './pages/Records'
import { Reports } from './pages/Reports'

function App() {
  return (
    <HashRouter>
      <div className="mx-auto flex min-h-svh max-w-md flex-col bg-[#f5f8ff] dark:bg-[#0b1220]">
        <main className="flex-1 overflow-y-auto p-4 pb-2">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/workout/:category" element={<WorkoutSession />} />
            <Route path="/weight" element={<Weight />} />
            <Route path="/records" element={<Records />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  )
}

export default App
