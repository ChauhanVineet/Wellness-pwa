# Wellness (PWA)

A local-first Progressive Web App for tracking daily exercises, weight/BMI, and health records. Built with React + TypeScript + Vite, data stored entirely in the browser (IndexedDB via Dexie) — no backend, no account, works offline once loaded.

This is the web rebuild of the original native Android app plan, done after the native Android toolchain (Gradle/emulator) proved unworkable on this machine's hardware. See [`../WellnessApp`](../WellnessApp) for the native project, which is untouched.

## Features (v1)

- **Dashboard** — today's exercise progress and latest weight at a glance
- **Exercises** — daily checklist (seeded with Morning walk, Stretching, Strength training, Evening walk), add/delete your own, progress bar
- **Weight** — log entries, BMI card (editable height, defaults to 176cm), a trend chart, full history
- **Records** — free-form log of Blood Pressure, Blood Sugar, Lab Report, Symptom, or Note entries with date

**Not included in v1** (by explicit choice, not oversight):
- **Medications tracking** — dropped from scope for this build. Can be added later as a plain taken/skipped log.
- **Reminders/alarms** — PWAs can't reliably fire notifications once fully closed without a backend push server, so this was deferred rather than half-built. See the "Adding reminders later" note below if you want this.
- **Deployment** — runs on the local dev server only for now. Deploying to a public HTTPS host (e.g. Vercel/Netlify) is what makes it installable on your phone; that's a separate step.

## Running it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Install it as an app via the browser's "Install" icon in the address bar (Chrome/Edge) once you're viewing it there.

To verify the production build (this is what actually generates the PWA manifest and offline service worker — dev mode skips that for speed):

```bash
npm run build
npm run preview
```

## Data & persistence

Everything lives in IndexedDB in the browser (database name `wellness`). Clearing site data/browser storage will erase it — there's no cloud backup. If you want to move to a different browser or device, that data won't follow automatically (a future export/import feature would fix this).

## Adding reminders later

If you want medication-style reminders back:
- **Cheap option**: in-app notifications via the Service Worker while the app is open/installed — no infrastructure, but won't fire if the app is fully closed.
- **Real option**: Web Push via a small backend (e.g. a free-tier serverless function + the Push API) — fires even when closed, works well on Android, partial support on iOS 16.4+. Needs a server component.

## Known items

- `npm audit` flags a high-severity advisory in `react-router` related to RSC (React Server Components) mode CSRF handling — not applicable here since this is a client-only SPA with no server actions, and it only runs locally. Worth revisiting before any public deployment.
