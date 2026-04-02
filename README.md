Shopping Planner
================

[ShoppingPlanner.web.app](shoppingplanner.web.app) - A colaborative shopping list and
weekly planner

Development
-----------

- `npm install`
- `npm run dev`
- `npm run build`
- `npm test -- --run`

Notes
-----

- The app now uses Vite, React 18, React Router 6, Firebase modular SDK, and MUI 7.
- Firebase config is loaded from `VITE_FIREBASE_*` environment variables when present.
- The previous public Firebase config is still used as a fallback so the app can boot without extra setup.
