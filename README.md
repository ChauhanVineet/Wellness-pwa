# Wellness (PWA)

A local-first Progressive Web App for guided dumbbell workouts, weight/BMI tracking, health records, and lab report trends. Built with React + TypeScript + Vite, data stored entirely in the browser (IndexedDB via Dexie) — no backend, no account, works offline once loaded.

This is the web rebuild of the original native Android app plan, done after the native Android toolchain (Gradle/emulator) proved unworkable on this machine's hardware. See [`../WellnessApp`](../WellnessApp) for the native project, which is untouched.

## Features

- **Dashboard** — weekly/monthly workout progress, latest weight, quick links
- **Workout** — 3-split dumbbell + bench + machine program (Chest & Triceps / Back & Biceps / Legs & Shoulders), 6 exercises each at 3×10. Tap a split to preview the day's exercises, then start: reps are voiced automatically at a steady pace, with a spoken rest countdown between sets, and a manual tap to advance between exercises. Each exercise shows a real reference photo pair (start/end position) sourced from [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (public domain).
- **Weight** — log entries, BMI card (editable height, defaults to 176cm), a trend chart, full history
- **Records** — free-form log of Blood Pressure, Blood Sugar, Lab Report, Symptom, or Note entries with date
- **Reports** — upload lab report files (PDF/photo), log individual parameter values by hand, and see trend charts grouped by test type (Liver, Kidney, Heart, Thyroid, Blood Sugar, Lipid Profile, CBC, Vitamins, Other)

**Not included** (by explicit choice, not oversight):
- **Medications tracking** — dropped from scope. Can be added later as a plain taken/skipped log.
- **Reminders/alarms outside the active workout screen** — PWAs can't reliably fire notifications once fully closed without a backend push server. See "Adding reminders later" below.
- **Automatic report data extraction** — no OCR/AI parsing of uploaded reports; that would require a backend service, a real architecture change from this fully local, no-server app.

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

Everything lives in IndexedDB in the browser (database name `wellness`), including uploaded report files (stored as Blobs). Clearing site data/browser storage will erase it — there's no cloud backup. If you want to move to a different browser or device, that data won't follow automatically (a future export/import feature would fix this).

## Exercise reference photos

The two reference photos per exercise (`public/exercises/<id>/0.jpg` and `1.jpg`) come from [free-exercise-db](https://github.com/yuhonas/free-exercise-db), released under the Unlicense (public domain) — no attribution required, free for commercial and personal use. They're bundled locally and precached by the service worker, so they work offline like everything else.

## Adding reminders later

If you want medication-style reminders back:
- **Cheap option**: in-app notifications via the Service Worker while the app is open/installed — no infrastructure, but won't fire if the app is fully closed.
- **Real option**: Web Push via a small backend (e.g. a free-tier serverless function + the Push API) — fires even when closed, works well on Android, partial support on iOS 16.4+. Needs a server component.

## Known items

- `npm audit` flags a high-severity advisory in `react-router` related to RSC (React Server Components) mode CSRF handling — not applicable here since this is a client-only SPA with no server actions, and it only runs locally. Worth revisiting before any public deployment.
