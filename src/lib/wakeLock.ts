let activeLock: WakeLockSentinel | null = null

export async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return
  try {
    activeLock = await navigator.wakeLock.request('screen')
  } catch {
    activeLock = null
  }
}

export async function releaseWakeLock() {
  if (activeLock) {
    try {
      await activeLock.release()
    } catch {
      // already released
    }
    activeLock = null
  }
}
