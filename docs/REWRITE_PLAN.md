# Shopping Planner - Rewrite Plan

## Overview

This document outlines the plan to rewrite the Shopping Planner app using modern technologies while maintaining **100% backward compatibility** with the existing Firebase Firestore data and URL structure.

### Goals

1. **Modernize tech stack** - Move from CRA to Vite, add TypeScript, replace Material-UI with Tailwind + shadcn/ui
2. **Improve design** - Create a modern, polished UI that maintains the compact, single-screen layout
3. **Maintain compatibility** - Keep all existing URLs, data structures, and user workflows
4. **Preserve features** - Match feature parity with the current app (excluding Recipes)
5. **Safe deployment** - Test on a staging Firebase site before replacing production

---

## Tech Stack Comparison

| Aspect        | Current                       | New                     |
| ------------- | ----------------------------- | ----------------------- |
| Build Tool    | Create React App              | **Vite**                |
| React Version | 16.13                         | **React 18**            |
| Language      | JavaScript                    | **TypeScript**          |
| UI Framework  | Material-UI v4                | **shadcn/ui**           |
| Styling       | styled-components             | **Tailwind CSS**        |
| Firebase SDK  | v7 (compat)                   | **v10 (modular)**       |
| Router        | react-router-dom v5           | **react-router-dom v6** |
| PWA           | CRA service worker (disabled) | **Vite PWA plugin**     |

---

## Backward Compatibility Requirements

### URLs (MUST preserve exactly)

```
/                           -> Home (redirect to last list or create new)
/settings                   -> App settings
/list/:listId               -> Shopping list view
/list/:listId/planner       -> Weekly planner
/list/:listId/catalogue     -> History/catalogue view
```

### Firestore Collections (MUST remain compatible)

```
/lists/{listId}/
├── items/{slug}        -> { name: string, quantity: number, done: boolean }
├── catalogue/{slug}    -> { section: string, emoji: string | null }
├── planner/{day}       -> { items: Array<{type: "item"|"recipe", name: string}> }
└── recipes/{slug}      -> { ingredients, emoji, ... }  (read-only, legacy data)
```

### Document ID Format

- All document IDs are **slugified** item names
- Slug format: lowercase, trim whitespace, replace `[\s\W-]+` with `-`, remove leading/trailing `-`
- Example: `"Whole Milk"` → `"whole-milk"`

### Firebase Project

- **Project ID:** `shopping-list-app-de905`
- **Production Site:** `shoppingplanner`
- **Staging Site:** `shoppingplanner-beta` (to be created)

---

## Features Scope

### ✅ Features to Include

| Feature             | Priority | Description                                          |
| ------------------- | -------- | ---------------------------------------------------- |
| **Shopping List**   | Critical | Main list view with sections, mark done, sweep       |
| **Add/Edit Items**  | Critical | Dialogs for adding and editing list items            |
| **Section Memory**  | Critical | Automatically places items in remembered sections    |
| **Planner**         | High     | Weekly meal planner (Mon-Sun) with add-to-list       |
| **Catalogue**       | High     | History view of all items ever added                 |
| **Dark Mode**       | Medium   | Can now be completely based on the system preference |
| **List Sharing**    | Medium   | Share list URL via Web Share API                     |
| **List Switching**  | Medium   | Switch between multiple lists                        |
| **Offline Support** | Medium   | PWA with service worker and Firestore persistence    |
| **Real-time Sync**  | Critical | Live updates across devices                          |

### ❌ Features to Exclude

| Feature          | Reason                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **Recipes**      | Menu item is commented out in current app, indicates incomplete/unused feature           |
| **Settings**     | The settings screen is no longer required                                                |
| **Dark mode UI** | The UI to switch and remember is no longer needed, it can just use the system preference |

---

## Implementation Phases

### Phase 1: Project Setup & Infrastructure

**Goal:** Bootstrap Vite project with all dependencies and Firebase configuration

**Tasks:**

- Initialize Vite + React + TypeScript project
- Install and configure Tailwind CSS
- Set up shadcn/ui component library
- Install Firebase v10 SDK
- Configure Firebase with existing project credentials
- Set up React Router v6
- Create basic project structure (`/lib`, `/components`, `/hooks`, `/types`)
- Configure TypeScript strict mode
- Set up ESLint and Prettier

**Outcome:** Clean, modern project ready for feature development

---

### Phase 2: Core Shopping List

**Goal:** Implement the main shopping list functionality

**Tasks:**

- Create Firebase hooks (`useFirestore`, `useListData`, `useBackend`)
- Implement Firestore operations (add, edit, delete, mark, sweep)
- Build Home page with list redirect logic
- Build shopping list view with section grouping
- Implement section sorting (unchecked first, then done)
- Implement item sorting (unchecked first, then done)
- Create Add Item Dialog with autocomplete
- Create Edit Item Dialog
- Build item chip component with emoji support
- Implement quantity display and editing
- Create number picker component
- Build section autocomplete from catalogue
- Build item autocomplete from catalogue
- Implement "sweep done items" functionality
- Create empty state placeholder

**Outcome:** Fully functional shopping list with feature parity to current app

---

### Phase 3: Weekly Planner

**Goal:** Implement the meal planning feature

**Tasks:**

- Build planner page layout (7-day grid)
- Create Add Planner Item Dialog
- Create Edit Planner Item Dialog
- Implement day picker component
- Build item/recipe autocomplete
- Implement "add plan to list" functionality
- Create Add Plan to List Dialog with deselection
- Implement "clear planner" functionality
- Handle planner item chips with long-press edit
- Create planner empty state

**Outcome:** Complete planner feature with add-to-list workflow

---

### Phase 4: Polish & Supporting Features

**Goal:** Add catalogue, settings, theming, and UI polish

**Tasks:**

- Build catalogue/history page
- Implement catalogue item deletion
- Implement theme switching (just based on the system preference)
- Build app drawer/menu
- Implement list sharing dialog (Web Share API)
- Implement list switching dialog
- Add cute placeholder images/messages (if setting enabled)
- Implement emoji picker integration
- Create custom emoji definitions (might need to refer to the old code for the list)
- Build emoji search functionality
- Add long-press gesture detection
- Implement responsive layout (mobile-first)
- Add loading states
- Add online/offline notifications
- Polish animations and transitions

**Outcome:** Complete, polished app with all supporting features

---

### Phase 5: PWA & Deployment

**Goal:** Add offline support and deploy to staging

**Tasks:**

- Configure Vite PWA plugin
- Set up service worker with cache-first strategy
- Test offline functionality
- Configure manifest.json with proper icons
- Update Firebase hosting configuration
- Create `shoppingplanner-beta` Firebase site
- Build production bundle
- Deploy to staging site
- Test all features on staging
- Test cross-device real-time sync
- Test offline behavior
- Document production deployment process

**Outcome:** Fully tested PWA deployed to staging, ready for production

---

## Design Guidelines

### Layout Principles

- **Mobile-first** - Optimize for single-handed phone use
- **Compact** - All items visible on one screen (no excessive scrolling)
- **Clean** - Modern, uncluttered interface
- **Responsive** - Works on all screen sizes
- **Accessible** - Keyboard navigation, screen reader support

### Visual Style

- **Modern** - Contemporary design patterns, not generic Material Design
- **Colorful but subtle** - Accent colors without overwhelming
- **Dark mode friendly** - High contrast, comfortable in low light
- **Emoji-enhanced** - Visual item identification without being childish

### Interaction Patterns

- **Fast input** - Quick add with smart autocomplete
- **Touch-optimized** - Large tap targets, swipe gestures
- **Obvious actions** - Clear CTAs, no hidden functionality
- **Forgiving** - Easy undo, confirm destructive actions
- **Real-time feedback** - Immediate visual response to actions

---

## Testing Strategy

### Manual Testing Checklist

- [ ] Add items to list with sections
- [ ] Edit items and change sections
- [ ] Mark items as done
- [ ] Sweep done items
- [ ] Section memory persists across app reloads
- [ ] Add items to planner for each day
- [ ] Edit planner items and change days
- [ ] Add planner items to shopping list
- [ ] Clear planner
- [ ] View catalogue and delete items
- [ ] Switch themes (via system preference)
- [ ] Share list URL
- [ ] Create new list and switch between lists
- [ ] Test offline behavior (disconnect network)
- [ ] Test real-time sync (open same list in two tabs/devices)
- [ ] Test all URL routes directly (deep linking)
- [ ] Test PWA installation
- [ ] Test responsive layouts (mobile, tablet, desktop)

### Compatibility Testing

- [ ] Open existing list URLs in new app
- [ ] Verify data from old app displays correctly
- [ ] Add/edit items in new app, verify in old app
- [ ] Add/edit items in old app, verify in new app
- [ ] Verify slug generation matches exactly
- [ ] Verify section sorting matches exactly
- [ ] Verify item sorting matches exactly

---

## Migration Plan

### Pre-Launch

1. Deploy new app to `shoppingplanner-beta.web.app`
2. Test all features on staging
3. Test compatibility with production data
4. Verify no breaking changes to data structures
5. Get user feedback if possible

### Launch

1. Update Firebase hosting target from `shoppingplanner` to new build
2. Deploy to production via `firebase deploy --only hosting:shoppingplanner`
3. Monitor for errors
4. Keep old codebase available for quick rollback if needed

### Post-Launch

1. Monitor Firebase usage and errors
2. Gather user feedback
3. Address any compatibility issues
4. Archive old codebase after stable period

---

## Risk Mitigation

| Risk                              | Mitigation                                         |
| --------------------------------- | -------------------------------------------------- |
| Data structure incompatibility    | Extensively test with production data on staging   |
| URL routing breaks user bookmarks | Maintain exact same URL patterns with React Router |
| Slug generation differs           | Copy exact slugify logic from old codebase         |
| Firebase SDK breaking changes     | Test all Firestore operations thoroughly           |
| Offline behavior differs          | Test offline scenarios extensively                 |
| Old devices not supported         | Test on older browsers/devices                     |
| Performance regression            | Compare bundle sizes, run Lighthouse audits        |
| Feature gaps                      | Cross-reference feature list with old app          |

---

## Success Criteria

- [ ] All existing URLs work identically
- [ ] All existing data displays correctly
- [ ] Section memory works across old/new apps
- [ ] Real-time sync works between old/new apps
- [ ] All features from Phase 1-5 implemented
- [ ] Lighthouse score: Performance > 90, Accessibility > 90
- [ ] Bundle size smaller than current app
- [ ] Zero TypeScript errors
- [ ] No console errors or warnings
- [ ] PWA installs successfully
- [ ] Works offline with cached data
- [ ] UI feels faster and more responsive than old app
- [ ] Design is modern and polished

---

## Next Steps

1. **Review this plan** - Ensure all stakeholders agree on scope and approach
2. **Create ARCHITECTURE.md** - Detailed technical architecture document
3. **Create FEATURES.md** - Detailed feature specifications with implementation notes
4. **Create DEPLOYMENT.md** - Firebase staging setup and deployment instructions
5. **Delete old code** - Clean slate for new implementation
6. **Bootstrap Vite project** - Initialize new project structure
7. **Begin Phase 1** - Start building!

---

## References

- Current codebase exploration results (3 task sessions)
- Firebase docs: <https://firebase.google.com/docs/web/setup>
- Vite docs: <https://vitejs.dev/>
- shadcn/ui docs: <https://ui.shadcn.com/>
- React Router v6 docs: <https://reactrouter.com/>
- The original code is available in the git history and checked out at ../shopping-list
