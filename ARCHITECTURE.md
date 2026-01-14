# Shopping Planner - Architecture

## Overview

This document details the technical architecture for the rewritten Shopping Planner app, including project structure, data models, Firebase integration, and component architecture.

---

## Project Structure

```
shopping-planner/
├── public/
│   ├── icons/                    # PWA icons (192x192, 512x512)
│   └── manifest.json             # PWA manifest
├── src/
│   ├── main.tsx                  # App entry point
│   ├── App.tsx                   # Root component with routing
│   ├── index.css                 # Tailwind imports and global styles
│   ├── lib/
│   │   ├── firebase.ts           # Firebase initialization and config
│   │   ├── firestore.ts          # Firestore operations and Backend class
│   │   ├── slugify.ts            # Slug generation (MUST match old implementation)
│   │   └── utils.ts              # Utility functions (cn, prettify, etc.)
│   ├── hooks/
│   │   ├── use-list-data.ts      # Main hook for list/catalogue/planner data
│   │   ├── use-backend.ts        # Hook for Firestore mutations
│   │   ├── use-local-storage.ts  # localStorage persistence
│   │   ├── use-theme.ts          # Theme preference hook
│   │   ├── use-long-press.ts     # Long press gesture detection
│   │   └── use-media-query.ts    # Responsive breakpoint detection
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── app-bar.tsx       # Top navigation bar
│   │   │   ├── app-drawer.tsx    # Side menu drawer
│   │   │   └── bottom-nav.tsx    # List/Planner tab navigation
│   │   ├── items/
│   │   │   ├── item-chip.tsx     # Item display chip
│   │   │   ├── item-section.tsx  # Section card with items
│   │   │   └── empty-state.tsx   # Empty list placeholder
│   │   ├── dialogs/
│   │   │   ├── add-item-dialog.tsx
│   │   │   ├── edit-item-dialog.tsx
│   │   │   ├── add-planner-item-dialog.tsx
│   │   │   ├── edit-planner-item-dialog.tsx
│   │   │   ├── add-plan-to-list-dialog.tsx
│   │   │   ├── share-dialog.tsx
│   │   │   ├── open-dialog.tsx
│   │   │   └── about-dialog.tsx
│   │   ├── form/
│   │   │   ├── autocomplete.tsx       # Base autocomplete component
│   │   │   ├── item-autocomplete.tsx  # Item-specific autocomplete
│   │   │   ├── number-picker.tsx      # Quantity selector
│   │   │   ├── day-picker.tsx         # Day selector for planner
│   │   │   └── emoji-picker.tsx       # Emoji selection
│   │   ├── emoji/
│   │   │   ├── emoji.tsx              # Emoji display component
│   │   │   ├── custom-emojis.ts       # Custom emoji definitions
│   │   │   └── emoji-search.ts        # Emoji search logic
│   │   └── providers/
│   │       ├── firebase-provider.tsx  # Firebase context provider
│   │       └── theme-provider.tsx     # Theme context provider
│   ├── pages/
│   │   ├── home.tsx              # Home page (redirect logic)
│   │   ├── list.tsx              # Main list view
│   │   ├── planner.tsx           # Weekly planner view
│   │   ├── catalogue.tsx         # History/catalogue view
│   │   └── settings.tsx          # Settings page
│   ├── types/
│   │   ├── item.ts               # Item type definitions
│   │   ├── planner.ts            # Planner type definitions
│   │   └── catalogue.ts          # Catalogue type definitions
│   └── vite-env.d.ts
├── .env.local                    # Firebase config (gitignored)
├── components.json               # shadcn/ui config
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Data Models

### TypeScript Type Definitions

```typescript
// types/item.ts
export interface Item {
  name: string
  quantity: number
  done: boolean
}

export interface CatalogueEntry {
  section: string
  emoji: string | null
}

export interface ItemWithMetadata extends Item {
  slug: string
  emoji: string | null
  section: string
}

// types/planner.ts
export interface PlannerItem {
  type: "item" | "recipe"
  name: string  // slug reference
}

export interface PlannerDay {
  items: PlannerItem[]
}

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

// types/catalogue.ts
export interface Recipe {
  ingredients: Array<{ slug: string }>
  emoji: string | null
  image?: string
  description?: string
  instagram?: string
}
```

---

## Firebase Integration

### Configuration

**File:** `src/lib/firebase.ts`

```typescript
import { initializeApp } from "firebase/app"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Enable offline persistence (same as old app)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Persistence failed: Multiple tabs open")
  } else if (err.code === "unimplemented") {
    console.warn("Persistence not supported by browser")
  }
})
```

**Environment Variables** (`.env.local`):
```
VITE_FIREBASE_API_KEY=AIzaSyCtgligqZSkUwWkWIAcMOW0nIW2mfgVdcw
VITE_FIREBASE_AUTH_DOMAIN=shopping-list-app-de905.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shopping-list-app-de905
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=975596815491
VITE_FIREBASE_APP_ID=<your-app-id>
```

---

### Firestore Operations

**File:** `src/lib/firestore.ts`

```typescript
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  onSnapshot,
  Unsubscribe 
} from "firebase/firestore"
import { db } from "./firebase"
import { slugify } from "./slugify"
import type { Item, CatalogueEntry, PlannerDay, PlannerItem } from "@/types"

export class FirestoreBackend {
  private listId: string
  private unsubscribers: Unsubscribe[] = []
  
  constructor(listId: string) {
    this.listId = listId
  }
  
  // Collection references
  private get listRef() {
    return doc(db, "lists", this.listId)
  }
  
  private get itemsRef() {
    return collection(this.listRef, "items")
  }
  
  private get catalogueRef() {
    return collection(this.listRef, "catalogue")
  }
  
  private get plannerRef() {
    return collection(this.listRef, "planner")
  }
  
  // Real-time listeners
  subscribeToItems(callback: (items: Item[]) => void): Unsubscribe {
    const unsub = onSnapshot(this.itemsRef, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data() as Item)
      callback(items)
    })
    this.unsubscribers.push(unsub)
    return unsub
  }
  
  subscribeToCatalogue(callback: (catalogue: Record<string, CatalogueEntry>) => void): Unsubscribe {
    const unsub = onSnapshot(this.catalogueRef, (snapshot) => {
      const catalogue = snapshot.docs.reduce((acc, doc) => ({
        ...acc,
        [doc.id]: doc.data() as CatalogueEntry
      }), {} as Record<string, CatalogueEntry>)
      callback(catalogue)
    })
    this.unsubscribers.push(unsub)
    return unsub
  }
  
  subscribeToPlanner(callback: (planner: Record<string, PlannerDay>) => void): Unsubscribe {
    const unsub = onSnapshot(this.plannerRef, (snapshot) => {
      const planner = snapshot.docs.reduce((acc, doc) => ({
        ...acc,
        [doc.id]: doc.data() as PlannerDay
      }), {} as Record<string, PlannerDay>)
      callback(planner)
    })
    this.unsubscribers.push(unsub)
    return unsub
  }
  
  // Item operations
  async addItem(item: string, section: string, quantity = 1, emoji: string | null = null) {
    const slug = slugify(item)
    const batch = writeBatch(db)
    
    batch.set(doc(this.itemsRef, slug), {
      name: item,
      quantity,
      done: false,
    })
    
    batch.set(doc(this.catalogueRef, slug), {
      section,
      emoji,
    })
    
    await batch.commit()
  }
  
  async editItem(
    oldItem: string, 
    newItem: string, 
    section: string, 
    quantity: number, 
    emoji: string | null
  ) {
    const oldSlug = slugify(oldItem)
    const newSlug = slugify(newItem)
    const batch = writeBatch(db)
    
    if (oldSlug !== newSlug) {
      batch.delete(doc(this.itemsRef, oldSlug))
    }
    
    batch.set(doc(this.itemsRef, newSlug), {
      name: newItem,
      quantity,
      done: false,
    })
    
    batch.set(doc(this.catalogueRef, newSlug), {
      section,
      emoji,
    })
    
    await batch.commit()
  }
  
  async toggleItemDone(item: string, currentDone: boolean) {
    const slug = slugify(item)
    await updateDoc(doc(this.itemsRef, slug), {
      done: !currentDone,
    })
  }
  
  async deleteItem(item: string) {
    const slug = slugify(item)
    await deleteDoc(doc(this.itemsRef, slug))
  }
  
  async sweepDoneItems(items: Item[]) {
    const batch = writeBatch(db)
    
    items
      .filter(item => item.done)
      .forEach(item => {
        batch.delete(doc(this.itemsRef, slugify(item.name)))
      })
    
    await batch.commit()
  }
  
  // Planner operations
  async addToPlannerItem(
    day: string,
    name: string,
    type: "item" | "recipe",
    emoji: string | null = null,
    ingredients?: string[]
  ) {
    const slug = slugify(name)
    const batch = writeBatch(db)
    
    // Get existing planner day
    const dayRef = doc(this.plannerRef, day)
    // Note: Need to fetch existing items first or use arrayUnion
    batch.set(dayRef, {
      items: [{ type, name: slug }], // Simplified - need proper merge logic
    }, { merge: true })
    
    // Update catalogue
    batch.set(doc(this.catalogueRef, slug), {
      section: "",
      emoji,
    }, { merge: true })
    
    await batch.commit()
  }
  
  // Cleanup
  disconnect() {
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []
  }
}

// Helper to generate new list IDs
export function generateListId(): string {
  return doc(collection(db, "lists")).id
}
```

---

### Critical: Slugify Implementation

**File:** `src/lib/slugify.ts`

```typescript
/**
 * CRITICAL: This must match the old implementation exactly
 * Old implementation: src/helpers.js lines 8-14
 * 
 * Convert a string to a URL-safe slug for use as Firestore document ID
 * 
 * Example: "Whole Milk" -> "whole-milk"
 */
export function slugify(s: string | undefined | null): string {
  return (
    s
      ?.toString()
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[\s\W-]+/g, "-")
      ?.replace(/^-+|-+$/g, "") || ""
  )
}

/**
 * Convert a slug back to a readable string
 * Example: "whole-milk" -> "Whole Milk"
 */
export function prettify(s: string | undefined | null): string {
  return (
    s
      ?.split("-")
      ?.filter(Boolean)
      ?.map((word) => word[0]?.toUpperCase() + word.slice(1))
      ?.join(" ") || ""
  )
}
```

---

## Custom Hooks

### useListData - Main Data Hook

**File:** `src/hooks/use-list-data.ts`

```typescript
import { useEffect, useState } from "react"
import { FirestoreBackend } from "@/lib/firestore"
import type { Item, CatalogueEntry, PlannerDay } from "@/types"

export function useListData(listId: string) {
  const [items, setItems] = useState<Item[]>([])
  const [catalogue, setCatalogue] = useState<Record<string, CatalogueEntry>>({})
  const [planner, setPlanner] = useState<Record<string, PlannerDay>>({})
  const [loading, setLoading] = useState(true)
  const [backend] = useState(() => new FirestoreBackend(listId))
  
  useEffect(() => {
    const unsubItems = backend.subscribeToItems(setItems)
    const unsubCatalogue = backend.subscribeToCatalogue(setCatalogue)
    const unsubPlanner = backend.subscribeToPlanner(setPlanner)
    
    // Mark as loaded after initial snapshots
    const timer = setTimeout(() => setLoading(false), 500)
    
    return () => {
      unsubItems()
      unsubCatalogue()
      unsubPlanner()
      backend.disconnect()
      clearTimeout(timer)
    }
  }, [listId, backend])
  
  return { items, catalogue, planner, loading, backend }
}
```

---

### useBackend - Mutations Hook

**File:** `src/hooks/use-backend.ts`

```typescript
import { useContext } from "react"
import { FirebaseContext } from "@/components/providers/firebase-provider"

export function useBackend() {
  const context = useContext(FirebaseContext)
  
  if (!context) {
    throw new Error("useBackend must be used within FirebaseProvider")
  }
  
  return context.backend
}
```

---

## Component Architecture

### Context Providers

```
App
└── ThemeProvider (light/dark/auto theme)
    └── Router
        └── FirebaseProvider (per listId, provides backend + data)
            └── Page Components
```

**Firebase Provider:**
```typescript
// src/components/providers/firebase-provider.tsx
import { createContext, ReactNode } from "react"
import { useListData } from "@/hooks/use-list-data"
import type { Item, CatalogueEntry, PlannerDay } from "@/types"
import type { FirestoreBackend } from "@/lib/firestore"

interface FirebaseContextValue {
  items: Item[]
  catalogue: Record<string, CatalogueEntry>
  planner: Record<string, PlannerDay>
  loading: boolean
  backend: FirestoreBackend
}

export const FirebaseContext = createContext<FirebaseContextValue | null>(null)

export function FirebaseProvider({ 
  listId, 
  children 
}: { 
  listId: string
  children: ReactNode 
}) {
  const data = useListData(listId)
  
  return (
    <FirebaseContext.Provider value={data}>
      {children}
    </FirebaseContext.Provider>
  )
}
```

---

### Item Sorting & Grouping

**File:** `src/pages/list.tsx`

```typescript
import { slugify } from "@/lib/slugify"
import { useBackend } from "@/hooks/use-backend"
import { useContext } from "react"
import { FirebaseContext } from "@/components/providers/firebase-provider"

export function ListPage() {
  const { items, catalogue } = useContext(FirebaseContext)!
  
  // Group items by section
  const itemsBySection = items.reduce((acc, item) => {
    const catalogueEntry = catalogue[slugify(item.name)]
    const section = catalogueEntry?.section || ""
    
    return {
      ...acc,
      [section]: [
        ...(acc[section] || []),
        { ...item, emoji: catalogueEntry?.emoji }
      ]
    }
  }, {} as Record<string, ItemWithMetadata[]>)
  
  // Sort sections: not-done first, then done
  const notDoneSections = Object.keys(itemsBySection)
    .filter(section => 
      itemsBySection[section].some(item => !item.done)
    )
    .sort()
  
  const doneSections = Object.keys(itemsBySection)
    .filter(section => 
      itemsBySection[section].every(item => item.done)
    )
    .sort()
  
  const orderedSections = [...notDoneSections, ...doneSections]
  
  // Sort items within section: not-done first, then done
  const sortedItemsBySection = orderedSections.reduce((acc, section) => {
    const sectionItems = itemsBySection[section]
    const notDone = sectionItems.filter(i => !i.done).sort((a, b) => a.name.localeCompare(b.name))
    const done = sectionItems.filter(i => i.done).sort((a, b) => a.name.localeCompare(b.name))
    
    return {
      ...acc,
      [section]: [...notDone, ...done]
    }
  }, {} as Record<string, ItemWithMetadata[]>)
  
  return (
    <div>
      {orderedSections.map(section => (
        <ItemSection
          key={section}
          section={section}
          items={sortedItemsBySection[section]}
        />
      ))}
    </div>
  )
}
```

---

## Routing

**File:** `src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HomePage } from "@/pages/home"
import { SettingsPage } from "@/pages/settings"
import { ListLayout } from "@/components/layout/list-layout"
import { ListPage } from "@/pages/list"
import { PlannerPage } from "@/pages/planner"
import { CataloguePage } from "@/pages/catalogue"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/list/:listId" element={<ListLayout />}>
          <Route index element={<ListPage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="catalogue" element={<CataloguePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

**ListLayout wraps FirebaseProvider:**
```typescript
// src/components/layout/list-layout.tsx
import { useParams, Outlet } from "react-router-dom"
import { FirebaseProvider } from "@/components/providers/firebase-provider"
import { AppBar } from "./app-bar"
import { BottomNav } from "./bottom-nav"

export function ListLayout() {
  const { listId } = useParams<{ listId: string }>()
  
  if (!listId) return null
  
  return (
    <FirebaseProvider listId={listId}>
      <div className="min-h-screen flex flex-col">
        <AppBar />
        <main className="flex-1 pb-16">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </FirebaseProvider>
  )
}
```

---

## Styling with Tailwind + shadcn/ui

### Theme Configuration

**File:** `tailwind.config.js`

```javascript
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... shadcn/ui color tokens
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### CSS Variables for Theme

**File:** `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 174 62% 47%; /* Teal like current app */
    /* ... other tokens */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode tokens */
  }
}
```

---

## PWA Configuration

**File:** `vite.config.ts`

```typescript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "Shopping Planner",
        short_name: "Shopping Planner",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#009688",
        icons: [
          {
            src: "/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
})
```

---

## Build & Deploy

### Build Configuration

**File:** `package.json` (scripts section)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit",
    "deploy:staging": "yarn build && firebase deploy --only hosting:shoppingplanner-beta",
    "deploy:prod": "yarn build && firebase deploy --only hosting:shoppingplanner"
  }
}
```

### Firebase Hosting Configuration

**File:** `firebase.json`

```json
{
  "hosting": [
    {
      "target": "shoppingplanner",
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "shoppingplanner-beta",
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

---

## Performance Considerations

### Bundle Size Optimization
- Use React lazy loading for dialogs: `const AddItemDialog = lazy(() => import("./dialogs/add-item-dialog"))`
- Tree-shake Firebase: Only import used functions from modular SDK
- Use Vite's code splitting automatically

### Runtime Performance
- Memoize expensive computations (section grouping, sorting)
- Use `React.memo` for item chips to prevent unnecessary re-renders
- Debounce autocomplete search
- Virtualize long lists if needed (though goal is single-screen view)

### Firestore Optimization
- Use `includeMetadataChanges: false` to reduce listener triggers
- Batch all multi-document writes
- Index fields if queries become slow (unlikely with current structure)

---

## Testing Strategy

### Type Safety
- Strict TypeScript mode enabled
- All Firebase data typed with interfaces
- No `any` types except where truly unavoidable

### Unit Testing (Optional)
- Vitest for unit tests
- Test `slugify` function thoroughly (critical for compatibility)
- Test sorting/grouping logic
- Test dialog state reducers

### Integration Testing
- Manual testing checklist (see REWRITE_PLAN.md)
- Cross-browser testing (Chrome, Safari, Firefox)
- Mobile device testing (iOS, Android)
- Offline behavior testing

---

## Migration Checklist

- [ ] Firebase config matches production project
- [ ] Slugify function generates identical slugs
- [ ] Item sorting matches old app exactly
- [ ] Section sorting matches old app exactly
- [ ] All Firestore operations tested
- [ ] Real-time listeners working correctly
- [ ] Offline persistence enabled
- [ ] PWA manifest configured
- [ ] Service worker caching correctly
- [ ] All routes working with deep links
- [ ] Theme switching working
- [ ] localStorage keys match or migrate
- [ ] Bundle size is acceptable
- [ ] Lighthouse scores meet targets

---

## References

- Firebase v10 docs: https://firebase.google.com/docs/web/modular-upgrade
- Vite PWA plugin: https://vite-pwa-org.netlify.app/
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/
- React Router v6: https://reactrouter.com/en/main
