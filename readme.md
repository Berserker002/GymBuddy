# AI Gym Partner (Expo skeleton)

This repository scaffolds the mobile front-end for **AI Gym Partner** using Expo + React Native. It mirrors the main flows from the PRD: onboarding, dashboard, editable workout, active workout logging, summary, history, and an exercise guide.

## Current status

- ✅ Navigation shell wired for all MVP screens (onboarding → dashboard → editable/active workout → summary, plus history and exercise guide).
- ✅ Shared theming, ExerciseCard component, and a lightweight Zustand store for workout state and API-backed flows.
- ✅ Backend API integration for program initialization, today's workout, swaps, logging, finishing, history, and exercise guides (token provided via `EXPO_PUBLIC_API_TOKEN`).
- ⚠️ Supabase auth, offline caching, form validation, and final design polish (typography, spacing, dark mode, icons) remain to be implemented.

## Project structure
- `App.tsx` sets up the navigation stack for all MVP screens.
- `src/theme.ts` centralizes colors, spacing, and radii.
- `src/state/useWorkoutStore.ts` provides a small Zustand store with a sample workout plan and logging helpers.
- `src/components/ExerciseCard.tsx` renders the shared workout card UI.
- `src/screens/` contains placeholder UI for each feature described in the PRD.
- `app.json` and `babel.config.js` contain Expo defaults; `assets/README.md` notes where icons/splash assets belong.

## Getting started
Install dependencies and start the Expo dev server:

```bash
npm install
npm run start
```

### Windows/WSL note
- If you work from Windows and the repo lives under a WSL path (e.g. `\\wsl.localhost\\Ubuntu\\home\\...\\GymBuddy`), run `npm run start` from a Linux shell inside WSL with a Linux Node/Expo install, or move the repo under a Windows drive (e.g. `C:\\Users\\<you>\\GymBuddy`). The `npm start` script will exit early with guidance if it detects an unsupported UNC path so Expo doesn't fall back to `C:\\Windows`.

Use the in-app navigation to explore each MVP screen with live API calls. Ensure `EXPO_PUBLIC_API_TOKEN` is set in your environment when hitting the backend locally at `http://localhost:8000` (copy `.env.example` to `.env` and provide your real token).
