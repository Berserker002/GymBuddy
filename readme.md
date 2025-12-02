# AI Gym Partner (Expo skeleton)

This repository scaffolds the mobile front-end for **AI Gym Partner** using Expo + React Native. It mirrors the main flows from the PRD: onboarding, dashboard, editable workout, active workout logging, summary, history, and an exercise guide.

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
