# Shopping Planner

[shoppingplanner.web.app](https://shoppingplanner.web.app) - A collaborative shopping list and weekly planner

## Status: Rewrite in Progress

This branch (`rewrite`) contains the planning and implementation for a complete rewrite of the Shopping Planner app using modern technologies while maintaining 100% backward compatibility with existing data and URLs.

### Documentation

- **[REWRITE_PLAN.md](./REWRITE_PLAN.md)** - High-level overview, phases, and implementation roadmap
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture, data models, and Firebase integration
- **[FEATURES.md](./FEATURES.md)** - Detailed feature specifications with implementation notes
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Firebase staging setup and deployment instructions
- **[AGENTS.md](./AGENTS.md)** - Coding guidelines for AI agents (legacy reference)

### Tech Stack

**New:**
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Firebase v10 (modular SDK)
- React Router v6
- Vite PWA Plugin

**Old (archived):**
- Create React App + React 16
- Material-UI v4 + styled-components
- Firebase v7 (compat SDK)

### Getting Started

1. **Bootstrap new Vite project** (next step after planning)
2. Follow implementation phases in `REWRITE_PLAN.md`
3. Deploy to staging site for testing: `shoppingplanner-beta.web.app`
4. After validation, deploy to production: `shoppingplanner.web.app`

### Key Features

- Real-time collaborative shopping lists
- Section memory (items remember their categories)
- Weekly meal planner
- Item history/catalogue
- Dark mode
- Offline support (PWA)
- Multi-device sync
