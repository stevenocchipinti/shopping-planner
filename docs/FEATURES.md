# Shopping Planner - Feature Specifications

## Overview

This document provides detailed specifications for all features in the Shopping Planner rewrite, with references to the original implementation for accurate replication.

---

## 1. Home Page

### Purpose

Landing page that redirects users to their last-used list or creates a new list.

### Behavior

1. Check `localStorage` for `listName` key
2. If exists: redirect to `/list/{listName}`
3. If not exists:
   - Generate new Firebase document ID
   - Save to `localStorage.listName`
   - Redirect to `/list/{newId}`

### Original Implementation

- **File:** `src/components/Home.js`
- **Key Logic:** Lines 10-20

### New Implementation Notes

```typescript
// src/pages/home.tsx
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { generateListId } from "@/lib/firestore"

export function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    const listName = localStorage.getItem("listName")

    if (listName) {
      navigate(`/list/${listName}`)
    } else {
      const newListId = generateListId()
      localStorage.setItem("listName", newListId)
      navigate(`/list/${newListId}`)
    }
  }, [navigate])

  return <div>Loading...</div>
}
```

---

## 2. Shopping List View

### Layout

- **Route:** `/list/:listId`
- **Components:** AppBar (top) + List content + Bottom navigation + FAB (add button)
- **Sections:** Items grouped by section in cards
- **Compact:** All items visible without scrolling on typical mobile screen

### Item Display (Chip Component)

**Visual Elements:**

- Emoji (if set and enabled)
- Item name
- Quantity badge (only if > 1, displayed as "x2", "x3", etc.)
- Done state: strikethrough + muted color

**Interactions:**

- **Tap/Click:** Toggle done state
- **Long press (300ms):** Open edit dialog

**Original Implementation:**

- **File:** `src/components/Chip/index.js`
- **Key Features:** Lines 38-95
- **Long press hook:** `src/components/Chip/useLongPress.js`

### Section Display

**Section Card:**

- Section name as header (or "Unsorted" if empty)
- All items in that section
- Visual indicator if all items done (muted card)

**Original Implementation:**

- **File:** `src/components/ShoppingLists/index.js`
- **Grouping logic:** Lines 70-80
- **Section sorting:** Lines 82-89
- **Item sorting:** Lines 54-56

### Sorting Rules

**Section Order:**

1. Sections with any unchecked items (alphabetically)
2. Sections with all items done (alphabetically)

**Item Order Within Section:**

1. Unchecked items (alphabetically by name)
2. Checked items (alphabetically by name)

### Empty State

**When:** No items in list

**Display:**

- Cute food image (random selection if setting enabled)
- Friendly message ("Empty list", "Have a great day", etc.)
- Click to randomize image/message

**Original Implementation:**

- **File:** `src/components/ShoppingLists/Placeholder/index.js`
- **Images:** Lines 9-22
- **Messages:** Lines 24-32

### App Bar Actions

**Left side:**

- Menu icon (opens drawer)

**Right side:**

- Sweep icon (trash) - removes all done items
- Conditional: only shows if there are done items

**Original Implementation:**

- **File:** `src/components/App.js`
- **Sweep logic:** Lines 96-103

### Bottom Navigation

**Two tabs:**

- List (shopping cart icon) - `/list/:listId`
- Planner (calendar icon) - `/list/:listId/planner`

**Original Implementation:**

- **File:** `src/components/App.js`
- **Tabs setup:** Lines 65-73

### FAB (Floating Action Button)

**Position:** Bottom right
**Action:** Opens Add Item Dialog
**Icon:** Plus/Add icon

**Original Implementation:**

- **File:** `src/components/App.js`
- **FAB setup:** Lines 114-127

---

## 3. Add Item Dialog

### Fields

| Field        | Type          | Required | Autocomplete   | Notes                                    |
| ------------ | ------------- | -------- | -------------- | ---------------------------------------- |
| **Item**     | Text input    | Yes      | From catalogue | Focus on open                            |
| **Section**  | Text input    | No       | From catalogue | Auto-fills from catalogue if item exists |
| **Quantity** | Number picker | Yes      | N/A            | Default: 1, min: 1                       |
| **Emoji**    | Emoji picker  | No       | N/A            | Opens popover with emoji-mart            |

### Smart Button Label

The submit button label changes based on the state:

| Condition                                | Button Label      | Enabled     |
| ---------------------------------------- | ----------------- | ----------- |
| Item is empty                            | "Add"             | ❌ Disabled |
| New item (not in list)                   | "Add"             | ✅ Enabled  |
| Item exists, same section, same quantity | "Already exists!" | ❌ Disabled |
| Item exists, same section, done=true     | "Uncheck"         | ✅ Enabled  |
| Item exists, different section           | "Move"            | ✅ Enabled  |
| Item exists, different quantity          | "Update"          | ✅ Enabled  |

**Original Implementation:**

- **File:** `src/components/Dialogs/AddItemDialog/useDialogState.js`
- **State reducer:** Lines 18-89
- **Smart label logic:** Lines 33-51

### Autocomplete Behavior

**Item Autocomplete:**

- Shows items from catalogue
- Fuzzy search
- When item selected: auto-fill section and emoji from catalogue
- Display format: "Item Name" with emoji

**Section Autocomplete:**

- Shows unique sections from catalogue
- Exact match or create new

**Original Implementation:**

- **File:** `src/components/Autocomplete/index.js`
- **Item autocomplete:** Lines 10-41
- **Section autocomplete:** Lines 43-59
- **Base autocomplete:** `src/components/Autocomplete/Autocomplete.js`

### Emoji Picker

**Trigger:** Click emoji button
**Library:** emoji-mart
**Features:**

- Search emojis
- Categories
- Recently used
- Custom emojis (food-related)

**Original Implementation:**

- **File:** `src/components/Emoji/EmojiPicker.js`
- **Custom emojis:** `src/components/Emoji/customEmojis/index.js`

### Submit Action

**Behavior:**

1. Slugify item name
2. Check action type (add/move/update/uncheck)
3. Write to Firestore:
   - Create/update item document
   - Update catalogue entry
4. Close dialog
5. Reset form state

**Original Implementation:**

- **File:** `src/components/Dialogs/AddItemDialog/index.js`
- **Submit handler:** Lines 43-52

---

## 4. Edit Item Dialog

### Trigger

Long press (300ms) on item chip

### Initial State

Pre-populated with current item values:

- Item name
- Section (from catalogue)
- Quantity
- Emoji (from catalogue)

### Fields

Same as Add Item Dialog

### Smart Button Label

| Condition                | Button Label      | Enabled     |
| ------------------------ | ----------------- | ----------- |
| No changes made          | "Save"            | ❌ Disabled |
| Renamed to existing item | "Already exists!" | ❌ Disabled |
| Changes made             | "Save"            | ✅ Enabled  |

**Original Implementation:**

- **File:** `src/components/Dialogs/EditItemDialog/useDialogState.js`
- **State reducer:** Lines 18-109

### Delete Button

- Located in dialog footer
- Opens confirmation (or deletes immediately)
- Removes from items collection only (catalogue persists)

**Original Implementation:**

- **File:** `src/components/Dialogs/EditItemDialog/index.js`
- **Delete handler:** Lines 37-41

---

## 5. Planner View

### Layout

- **Route:** `/list/:listId/planner`
- **Display:** 7-column grid (Monday-Sunday)
- **Mobile:** Horizontal scroll or stacked view

### Day Column

**Header:** Day name
**Content:**

- List of planned items/recipes
- Each item shows emoji + name
- Click item: edit
- Empty state: "No plans"

**Add Button:**

- Plus icon at bottom of each day
- Opens Add Planner Item Dialog with day pre-selected

**Original Implementation:**

- **File:** `src/components/Planner.js`
- **Grid layout:** Lines 49-57
- **Day display:** Lines 58-110

### App Bar Actions (Planner View)

**Right side:**

- Clear icon (sweep) - removes all planner items
- Only shows if planner has items

**Original Implementation:**

- **File:** `src/components/App.js`
- **Clear planner:** Lines 137-144

### FAB (Planner View)

**Action:** Add all planned items to shopping list
**Label:** "Add to List" or cart icon
**Dialog:** Opens Add Plan to List Dialog

**Original Implementation:**

- **File:** `src/components/App.js`
- **FAB logic:** Lines 152-167

---

## 6. Add Planner Item Dialog

### Fields

| Field           | Type           | Required | Notes                              |
| --------------- | -------------- | -------- | ---------------------------------- |
| **Item/Recipe** | Text input     | Yes      | Autocomplete from items OR recipes |
| **Day**         | Toggle buttons | Yes      | Mon-Sun selection                  |
| **Ingredients** | Multi-select   | No       | Only if creating recipe            |
| **Emoji**       | Emoji picker   | No       | Visual identifier                  |

### Item Type Detection

**Simple Item:** No ingredients specified
**Recipe:** Ingredients specified

**Firestore Structure:**

```typescript
// Simple item
plannerRef.doc("monday").set({
  items: [{ type: "item", name: "pizza" }],
})

// Recipe
plannerRef.doc("monday").set({
  items: [{ type: "recipe", name: "tacos" }],
})
recipesRef.doc("tacos").set({
  ingredients: [{ slug: "ground-beef" }, { slug: "cheese" }],
  emoji: "taco",
})
```

**Original Implementation:**

- **File:** `src/components/Dialogs/AddPlannerItemDialog/index.js`
- **Submit handler:** Lines 38-58

### Day Picker Component

**Display:** 7 toggle buttons (M, T, W, Th, F, Sa, Su)
**Selection:** Single day selected
**Styling:** Selected day highlighted

**Original Implementation:**

- **File:** `src/components/Dialogs/DayPicker.js`

### Ingredients Multi-Select

**Display:** Chip array of selected ingredients
**Add:** Autocomplete input below chips
**Remove:** Click X on chip

**Original Implementation:**

- **File:** `src/components/Autocomplete/index.js`
- **Ingredient autocomplete:** Lines 76-116

---

## 7. Edit Planner Item Dialog

### Trigger

Click on planner item chip

### Fields

Same as Add Planner Item Dialog, pre-populated

### Delete Button

Removes item from planner day
If recipe type: recipe document persists (catalogue item)

**Original Implementation:**

- **File:** `src/components/Dialogs/EditPlannerItemDialog/index.js`
- **Delete handler:** Lines 36-41

---

## 8. Add Plan to List Dialog

### Trigger

FAB on planner view

### Behavior

1. **Extract all ingredients:**
   - Simple items: add directly
   - Recipes: expand to ingredients
2. **Calculate quantities:**
   - Same ingredient planned multiple times = higher quantity
   - Already on list: add to existing quantity
3. **Display checklist:**
   - All ingredients with checkboxes (all checked by default)
   - User can deselect items they don't want to add
4. **Submit:**
   - Add checked items to shopping list
   - Use catalogue for section/emoji

**Original Implementation:**

- **File:** `src/components/Dialogs/AddPlanToListDialog/index.js`
- **Ingredient extraction:** Lines 32-65
- **Submit logic:** Lines 67-75

---

## 9. Catalogue/History View

### Layout

- **Route:** `/list/:listId/catalogue`
- **Display:** Table or list of all items ever added

### Columns/Fields

- Item name (with emoji)
- Section
- Delete button

### Sorting

Alphabetical by item name

### Delete Action

Removes item from catalogue only
Does NOT remove from current shopping list if present

**Original Implementation:**

- **File:** `src/components/Catalogue.js`
- **Table layout:** Lines 41-93
- **Delete handler:** Lines 68-71

---

## 10. Settings Page

### Layout

- **Route:** `/settings`
- **Display:** Simple list of toggle switches

### Settings

| Setting               | Key                | Default  | Options     |
| --------------------- | ------------------ | -------- | ----------- |
| **Emoji Support**     | `emojiSupport`     | `"auto"` | auto/on/off |
| **Cute Placeholders** | `cutePlaceholders` | `"auto"` | auto/on/off |

**Auto behavior:** Defaults to "on" (true)

**Original Implementation:**

- **File:** `src/components/Settings.js`
- **Toggle setup:** Lines 29-56

### Setting Hook

**Hook:** `useSetting(key)`
**Returns:** `[value, setValue]` like useState
**Storage:** localStorage

**Original Implementation:**

- **File:** `src/useSetting.js`

---

## 11. Theme / Dark Mode

### Modes

| Mode      | Behavior                                            |
| --------- | --------------------------------------------------- |
| **Light** | Always light theme                                  |
| **Dark**  | Always dark theme                                   |
| **Auto**  | Follow system preference via `prefers-color-scheme` |

### Storage

- **Key:** `brightnessPreference`
- **Location:** localStorage
- **Default:** `"auto"`

### Theme Toggle Component

**Display:** Three-button toggle group

- Sun icon = Light
- Moon icon = Dark
- Auto icon = Auto

**Location:** App drawer menu

**Original Implementation:**

- **File:** `src/components/ThemeProvider.js`
- **Toggle component:** Lines 25-48
- **Theme provider:** Lines 50-112

### CSS Implementation

Use Tailwind's dark mode with class strategy:

```html
<html class="dark"></html>
```

**System preference detection:**

```typescript
const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
```

---

## 12. App Drawer / Menu

### Trigger

Click menu icon in app bar

### Menu Items

| Item                | Action                                |
| ------------------- | ------------------------------------- |
| **Share Live List** | Opens share dialog                    |
| **Change list**     | Opens open/switch list dialog         |
| **History**         | Navigate to `/list/:listId/catalogue` |
| **Settings**        | Navigate to `/settings`               |
| **About**           | Opens about dialog                    |
| **Theme Toggle**    | Inline toggle component               |

**Original Implementation:**

- **File:** `src/components/AppBar/Menu.js`
- **Menu items:** Lines 48-118

---

## 13. Share Dialog

### Purpose

Share current list URL with others

### Methods

**Web Share API (if supported):**

- Opens native share sheet
- URL: `https://shoppingplanner.web.app/list/{listId}`

**Fallback:**

- Display URL
- Copy to clipboard button

**Original Implementation:**

- **File:** `src/components/AppBar/ShareDialog.js`
- **Share logic:** Lines 16-31

---

## 14. Open/Switch List Dialog

### Purpose

- Open existing list by ID/URL
- View list history (MRU)
- Create new list

### Features

**Input field:**

- Paste full URL: extract listId
- Paste listId directly
- Autocomplete from MRU

**List MRU:**

- Display recently used list IDs
- Click to open
- Stored in `localStorage.listMRU` as JSON array

**Create new button:**

- Generate new Firebase doc ID
- Navigate to new list
- Add to MRU

**Original Implementation:**

- **File:** `src/components/AppBar/OpenDialog.js`
- **MRU logic:** Lines 40-55
- **Submit handler:** Lines 58-77

---

## 15. About Dialog

### Content

- App name and version
- Creator/attribution
- Link to source code (if applicable)
- Credits

**Original Implementation:**

- **File:** `src/components/AppBar/AboutDialog.js`

---

## 16. Number Picker

### Purpose

Select item quantity in dialogs

### UI

- Text input (center)
- Minus button (left)
- Plus button (right)

### Behavior

- Min: 1
- Buttons wrap around text input
- Click buttons: increment/decrement
- Type directly: validate >= 1

**Original Implementation:**

- **File:** `src/components/Dialogs/NumberPicker.js`

---

## 17. Emoji System

### Emoji Display

**Component:** `<Emoji emoji="milk_glass" />`

**Types:**

- Standard Unicode emoji
- Custom emoji (from custom-emojis.ts)

**Original Implementation:**

- **File:** `src/components/Emoji/Emoji.js`
- **Custom emojis:** `src/components/Emoji/customEmojis/index.js`

### Emoji Search

**Features:**

- Search standard emojis via emoji-mart
- Search custom emojis by name/keywords
- Strip plurals when searching (milk → milk, milks)

**Original Implementation:**

- **File:** `src/components/Emoji/emojiSearch.js`

### Auto-Emoji Suggestion

When typing item name in autocomplete:

- If item exists in catalogue: use catalogue emoji
- If new item: suggest emoji based on item name
  - Example: "milk" → 🥛 (milk_glass)
  - Example: "bread" → 🍞 (bread)

**Original Implementation:**

- **File:** `src/components/Autocomplete/index.js`
- **Auto-suggest logic:** Lines 21-26

---

## 18. Offline Support

### Features

- **Firestore persistence:** IndexedDB caching enabled
- **Service worker:** Cache app shell and assets
- **Online/offline notifications:** Toast when connection changes

### Notifications

**Online:**

- Message: "You are now online!"
- Duration: 3 seconds

**Offline:**

- Message: "You have been disconnected"
- Duration: 5 seconds (or persistent)

**Original Implementation:**

- **File:** `src/index.js`
- **Event listeners:** Lines 46-53

### PWA Manifest

**File:** `public/manifest.json`

```json
{
  "name": "Shopping Planner",
  "short_name": "Shopping Planner",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#009688",
  "icons": [
    {
      "src": "/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 19. Loading States

### Initial Load

- Show loading spinner while Firebase data loads
- Use `loading` boolean from useListData hook

### Optimistic Updates

- Item actions (add, edit, delete, mark) should feel instant
- Firestore handles conflict resolution

---

## 20. Responsive Behavior

### Breakpoints

**Mobile (< 768px):**

- Single column layout
- Bottom navigation
- Full-screen dialogs

**Tablet (768px - 1024px):**

- Two-column layout for list
- Slide-up dialogs

**Desktop (> 1024px):**

- Max-width container
- Modal dialogs
- Keyboard shortcuts (optional)

**Original Implementation:**

- **File:** `src/components/Dialogs/Dialog.js`
- **Responsive check:** Lines 11-12 (useMediaQuery)

---

## Implementation Priority

| Priority     | Feature                                                                   |
| ------------ | ------------------------------------------------------------------------- |
| **Critical** | Shopping list view, add/edit items, section memory, Firestore integration |
| **High**     | Planner, catalogue, sorting logic, offline support                        |
| **Medium**   | Theme switching, settings, sharing, list switching                        |
| **Low**      | About dialog, cute placeholders, emoji search enhancements                |

---

## Testing Checklist

### Core Features

- [ ] Add item to list
- [ ] Item appears in correct section
- [ ] Add same item again → section auto-fills
- [ ] Edit item: rename, change section, change quantity
- [ ] Delete item from list
- [ ] Mark item as done (visual changes)
- [ ] Sweep done items (all removed at once)
- [ ] Sections sort correctly (unchecked first)
- [ ] Items sort correctly (unchecked first)

### Planner

- [ ] Add item to planner day
- [ ] Add recipe with ingredients to planner
- [ ] Edit planner item
- [ ] Delete planner item
- [ ] Clear entire planner
- [ ] Add plan to list → ingredients expand
- [ ] Deselect items in add-to-list dialog

### Catalogue

- [ ] View all items in history
- [ ] Delete item from catalogue
- [ ] Deleted item no longer suggests section

### Settings & Theme

- [ ] Toggle emoji support on/off
- [ ] Toggle cute placeholders on/off
- [ ] Switch theme light/dark/auto
- [ ] Theme persists across reload
- [ ] Auto theme follows system preference

### Sharing & Lists

- [ ] Share list URL via Web Share API
- [ ] Copy list URL to clipboard
- [ ] Open list by URL
- [ ] Open list by ID
- [ ] Create new list
- [ ] Switch between lists
- [ ] List MRU persists

### Offline & PWA

- [ ] App works offline
- [ ] Online/offline notifications show
- [ ] PWA installs on mobile
- [ ] Service worker caches assets
- [ ] Firestore persistence works

### Compatibility

- [ ] Open existing production list URL
- [ ] Data from old app displays correctly
- [ ] Add item in new app → appears in old app
- [ ] Add item in old app → appears in new app
- [ ] Slug generation matches exactly
- [ ] Section sorting matches exactly

---

## References

- Old codebase exploration results
- REWRITE_PLAN.md for phases and scope
- ARCHITECTURE.md for technical implementation details
