# AI Gym Partner (Expo skeleton)

This repository scaffolds the mobile front-end for **AI Gym Partner** using Expo + React Native. It mirrors the main flows from the PRD: onboarding, dashboard, editable workout, active workout logging, summary, history, and an exercise guide.

## Current status

- ✅ Navigation shell wired for all MVP screens (onboarding → dashboard → editable/active workout → summary, plus history and exercise guide).
- ✅ Shared theming, ExerciseCard component, and a lightweight Zustand store with mocked workout data to demonstrate UI interactions.
- ⚠️ All API calls are still stubbed; real Supabase auth, program generation, workout updates/logging, and history fetching need integration.
- ⚠️ Offline caching, form validation, and error handling are not implemented yet.
- ⚠️ Design polish (final typography, spacing, dark mode, icons) remains to be applied once real data flows in.

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

Use the in-app navigation to explore each MVP screen and stub interactions. API calls are mocked or represented with placeholder text so backend integration can be added incrementally.
