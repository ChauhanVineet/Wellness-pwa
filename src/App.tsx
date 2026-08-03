import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { seedDatabase } from './db/db'
import { Dashboard } from './pages/Dashboard'
import { Exercises } from './pages/Exercises'
import { Weight } from './pages/Weight'
import { Records } from './pages/Records'

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    seedDatabase().then(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <HashRouter>
      <div className="mx-auto flex min-h-svh max-w-md flex-col bg-[#f6f9f7] dark:bg-[#10201a]">
        <main className="flex-1 overflow-y-auto p-4 pb-2">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/weight" element={<Weight />} />
            <Route path="/records" element={<Records />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  )
}

export default App
