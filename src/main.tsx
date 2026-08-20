import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

const UPDATE_CHECK_INTERVAL_MS = 60 * 1000

registerSW({
  immediate: true,
  onRegisteredSW(swScriptUrl, registration) {
    if (!registration) return
    setInterval(async () => {
      if (registration.installing || !navigator.onLine) return
      const resp = await fetch(swScriptUrl, { cache: 'no-store' })
      if (resp.status === 200) await registration.update()
    }, UPDATE_CHECK_INTERVAL_MS)
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
