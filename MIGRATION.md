# Migration: MUI + styled-components → React Aria + Vanilla Extract

## Overview

Replace the runtime CSS-in-JS stack (styled-components + MUI/Emotion) with a build-time
CSS solution. The goal is zero runtime style injection, cleaner component code, and
removal of the dual CSS-in-JS dependency (the project currently ships both
`styled-components` and `@emotion/*` via MUI).

## Current stack

| Layer | Library |
|---|---|
| CSS | `styled-components` v5 |
| Component library | `@mui/material` v7 (uses Emotion internally) |
| Icons | `@mui/icons-material` v7 |
| Toast | MUI `Snackbar` |
| Build | Vite 6 + `@vitejs/plugin-react` |
| Language | TypeScript (`.tsx` files throughout `src/`) |

## Target stack

| Layer | Library |
|---|---|
| CSS | `@vanilla-extract/css` + `@vanilla-extract/vite-plugin` |
| Components | `react-aria-components` |
| Drawer | `vaul` (swipe gesture support) |
| Icons | `lucide-react` |
| Toast | `sonner` |

**Remove entirely:** `styled-components`, `@types/styled-components`, `@mui/material`,
`@mui/icons-material`, `@emotion/react`, `@emotion/styled`

---

## Codebase reference

### Project structure

```
src/
  index.tsx                         Entry point, global styles, router, toast
  theme.css.ts                      (NEW) Vanilla Extract theme contract + tokens
  styles/
    global.css.ts                   (NEW) Global VE styles (resets, body, fonts)
  components/
    ThemeProvider.tsx               Dark mode context + DarkModeToggle
    App.tsx                         Main routes, BottomNavigation, FAB
    Alert.tsx
    Home.tsx
    Settings.tsx                    Settings page with Switch toggles
    Catalogue.tsx                   History table view
    Planner.tsx                     Weekly planner table
    Recipe.tsx
    Recipes/
    AppBar/
      index.tsx                     App header with progress bar
      Menu.tsx                      SwipeableDrawer navigation
      OpenDialog.tsx
      ShareDialog.tsx
      AboutDialog.tsx
    Chip/
      index.tsx                     Shopping item chip (done/outline variants)
      useLongPress.ts
    ShoppingLists/
      index.tsx
      Placeholder/index.tsx
    Dialogs/
      Dialog.tsx                    Base dialog wrapper (used by all 9 variants)
      AddItemDialog/
      EditItemDialog/
      AddPlannerItemDialog/
      EditPlannerItemDialog/
      AddPlanToListDialog/
      DayPicker.tsx
      NumberPicker.tsx
      index.ts
    Autocomplete/
      Autocomplete.tsx              Base autocomplete with fuzzy filter + emoji
      index.tsx                     4 typed variants (Item, Section, ItemOrRecipe, Ingredient)
    Emoji/
      EmojiPicker.tsx               Emoji picker in a Popover
      Emoji.tsx
      emojiSearch.ts
      emojiData.ts
    Backend/
```

### Current theme tokens

The existing `ThemeProvider.tsx` builds a MUI theme with these custom tokens on
`theme.app.*` (in addition to MUI's standard `theme.palette.*`):

```ts
app: {
  border: string           // subtle border colour (light/dark)
  chrome: string           // nav/surface colour
  shell: string            // backdrop colour for nav bar
  primaryGradient: string  // gradient for FAB/primary buttons
  accentGradient: string   // subtle background tint (used on cards)
  chip: string             // shopping chip background
  chipDone: string         // ticked chip background (muted)
  floatShadow: string      // FAB drop shadow
  softShadow: string       // card drop shadow
  shellShadow: string      // nav bar drop shadow
}
```

Light/dark values are defined inline in `buildTheme(mode)`. Both colour schemes are
fully defined — they just swap at the function level.

Typography uses two font families loaded from Google Fonts in `index.html`:
- `Outfit` — sans-serif body font
- `Cormorant Garamond` — serif heading font (h1–h6)

### Key styled-components patterns in use

1. **Theme-interpolated values** — `${({ theme }) => theme.app.chip}` throughout
2. **Prop-based conditional styles** — `${({ done }) => done ? ... : ...}`
3. **MUI component wrapping** — `styled(MuiAppBar)`, `styled(Paper)`, etc.
4. **MUI specificity hacks** — `&& { ... }` to override Emotion-injected styles
5. **`createGlobalStyle`** — for body/root/universal styles in `index.tsx`

---

## Phase 1 — Infrastructure

### 1.1 Update `package.json`

**Add to `dependencies`:**
```json
"react-aria-components": "^1.x",
"vaul": "^1.x",
"lucide-react": "^0.x",
"sonner": "^1.x"
```

**Add to `devDependencies`:**
```json
"@vanilla-extract/css": "^1.x",
"@vanilla-extract/vite-plugin": "^4.x",
"@vanilla-extract/recipes": "^0.x"
```

**Remove from `dependencies`:**
```
styled-components
@mui/material
@mui/icons-material
@emotion/react
@emotion/styled
```

**Remove from `devDependencies`:**
```
@types/styled-components
```

### 1.2 Update `vite.config.mjs`

Add the Vanilla Extract Vite plugin. It must come **before** the React plugin:

```ts
import { defineConfig } from "vite"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
})
```

Remove the `esbuild` and `optimizeDeps` JSX loader overrides — they were needed for
`.js` files but the project uses `.tsx`.

### 1.3 Create `src/theme.css.ts`

This is the centrepiece of the migration. It replaces `buildTheme()` in
`ThemeProvider.tsx`.

Use `createThemeContract` to define all token names, then `createGlobalTheme` twice —
once for `:root` (light) and once for `[data-theme="dark"]`.

```ts
import { createThemeContract, createGlobalTheme } from "@vanilla-extract/css"

export const vars = createThemeContract({
  color: {
    primary: null,
    primaryLight: null,
    primaryDark: null,
    primaryContrast: null,
    secondary: null,
    bg: null,
    surface: null,
    text: null,
    textMuted: null,
    border: null,
    divider: null,
    chip: null,
    chipDone: null,
    actionSelected: null,
    focus: null,
  },
  gradient: {
    primary: null,
    accent: null,
    shell: null,
  },
  shadow: {
    float: null,
    soft: null,
    shell: null,
  },
  font: {
    sans: null,
    serif: null,
  },
  radius: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
    full: null,
  },
})

// Light theme — applied to :root
createGlobalTheme(":root", vars, {
  color: {
    primary: "#5a8a68",
    primaryLight: "#7ba587",
    primaryDark: "#3d6a4c",
    primaryContrast: "#fbfcfb",
    secondary: "#a38560",
    bg: "#f7f3ed",
    surface: "#fffcf7",
    text: "#2d3630",
    textMuted: "rgba(45, 54, 48, 0.50)",
    border: "rgba(45, 54, 48, 0.06)",
    divider: "rgba(45, 54, 48, 0.08)",
    chip: "rgba(45, 54, 48, 0.025)",
    chipDone: "rgba(45, 54, 48, 0.012)",
    actionSelected: "rgba(45, 54, 48, 0.06)",
    focus: "rgba(90, 138, 104, 0.4)",
  },
  gradient: {
    primary: "linear-gradient(135deg, #6d9b79 0%, #4a7e58 100%)",
    accent: "rgba(90, 138, 104, 0.04)",
    shell: "rgba(255, 252, 247, 0.95)",
  },
  shadow: {
    float: "0 8px 32px rgba(45, 54, 48, 0.08)",
    soft: "0 2px 8px rgba(45, 54, 48, 0.04)",
    shell: "0 4px 16px rgba(45, 54, 48, 0.06)",
  },
  font: {
    sans: '"Outfit", sans-serif',
    serif: '"Cormorant Garamond", serif',
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },
})

// Dark theme — applied when document.documentElement has data-theme="dark"
createGlobalTheme('[data-theme="dark"]', vars, {
  color: {
    primary: "#8fb89a",
    primaryLight: "#aed0b6",
    primaryDark: "#6d9b79",
    primaryContrast: "#0d1a10",
    secondary: "#c4a882",
    bg: "#171c19",
    surface: "#1e241f",
    text: "#e6e0d8",
    textMuted: "rgba(230, 224, 216, 0.50)",
    border: "rgba(230, 224, 216, 0.06)",
    divider: "rgba(230, 224, 216, 0.08)",
    chip: "rgba(230, 224, 216, 0.04)",
    chipDone: "rgba(230, 224, 216, 0.015)",
    actionSelected: "rgba(230, 224, 216, 0.08)",
    focus: "rgba(143, 184, 154, 0.4)",
  },
  gradient: {
    primary: "linear-gradient(135deg, #8fb89a 0%, #6d9b79 100%)",
    accent: "rgba(143, 184, 154, 0.06)",
    shell: "rgba(30, 36, 31, 0.95)",
  },
  shadow: {
    float: "0 8px 32px rgba(0, 0, 0, 0.25)",
    soft: "0 2px 8px rgba(0, 0, 0, 0.15)",
    shell: "0 4px 16px rgba(0, 0, 0, 0.2)",
  },
  font: {
    sans: '"Outfit", sans-serif',
    serif: '"Cormorant Garamond", serif',
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },
})
```

### 1.4 Create `src/styles/global.css.ts`

Replaces `createGlobalStyle` from `index.tsx`:

```ts
import { globalStyle } from "@vanilla-extract/css"
import { vars } from "../theme.css"

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
})

globalStyle("body", {
  margin: 0,
  padding: 0,
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontFamily: vars.font.sans,
  minHeight: "100dvh",
  backgroundAttachment: "fixed",
  WebkitFontSmoothing: "antialiased",
})

globalStyle("#root", {
  minHeight: "100dvh",
})

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
})

// Sync color-scheme with the active theme for native browser UI
globalStyle(":root", {
  colorScheme: "light",
})

globalStyle('[data-theme="dark"]', {
  colorScheme: "dark",
})
```

### 1.5 Rewrite `src/components/ThemeProvider.tsx`

Strip out all MUI/styled-components. The new file:

- Manages `brightnessPreference` in `localStorage` (`"light" | "dark" | "auto"`)
- Syncs `document.documentElement.dataset.theme` on mount and whenever preference changes
- Listens to `prefers-color-scheme` media query for the `"auto"` case
- Exports a `useDarkMode()` hook and `DarkModeToggle` component
- `DarkModeToggle` uses React Aria `ToggleButtonGroup` + `ToggleButton` (see Phase 3e)
- No MUI providers, no styled-components ThemeProvider — the VE CSS variables handle
  theming at the CSS level without any React context

```tsx
import React, { createContext, useContext, useEffect, FC, ReactNode } from "react"
import useLocalStorage from "../useLocalStorage"

// Import side-effect: registers the theme CSS variables
import "../theme.css"
import "../styles/global.css"

type Preference = "light" | "dark" | "auto"

interface DarkModeContextType {
  preference: Preference
  setPreference: (v: Preference) => void
}

const DarkModeContext = createContext<DarkModeContextType | null>(null)

export const useDarkMode = () => {
  const ctx = useContext(DarkModeContext)
  if (!ctx) throw new Error("useDarkMode must be used inside ThemeProvider")
  return ctx
}

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [preference, setPreference] = useLocalStorage<Preference>(
    "brightnessPreference",
    "auto"
  )

  useEffect(() => {
    const applyTheme = (pref: Preference) => {
      if (pref === "auto") {
        const dark = window.matchMedia("(prefers-color-scheme: dark)").matches
        document.documentElement.dataset.theme = dark ? "dark" : "light"
      } else {
        document.documentElement.dataset.theme = pref
      }
    }

    applyTheme(preference)

    if (preference === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = () => applyTheme("auto")
      mq.addEventListener("change", handler)
      return () => mq.removeEventListener("change", handler)
    }
  }, [preference])

  return (
    <DarkModeContext.Provider value={{ preference, setPreference }}>
      {children}
    </DarkModeContext.Provider>
  )
}
```

`DarkModeToggle` is implemented separately in Phase 3e once React Aria is set up.

---

## Phase 2 — Icons

Replace all `@mui/icons-material` imports with `lucide-react` across the codebase.
All 21 icons have direct equivalents:

| MUI icon | Lucide icon |
|---|---|
| `Add` | `Plus` |
| `AddCircleOutline` | `PlusCircle` |
| `AddShoppingCart` | `ShoppingCart` (or `ShoppingCartPlus` if available) |
| `ArrowBack` | `ArrowLeft` |
| `Brightness3` | `Moon` |
| `Brightness5` | `Sun` |
| `BrightnessAuto` | `SunMoon` |
| `ChevronLeft` | `ChevronLeft` |
| `Delete` | `Trash2` |
| `DeleteSweep` | `Trash` |
| `Event` | `CalendarDays` |
| `History` | `Clock` |
| `InfoOutlined` | `Info` |
| `InsertEmoticon` | `Smile` |
| `Instagram` | `Instagram` |
| `Menu` | `Menu` |
| `RemoveCircleOutline` | `MinusCircle` |
| `Share` | `Share2` |
| `ShoppingCart` | `ShoppingCart` |
| `SwapHoriz` | `ArrowLeftRight` |
| `Tune` | `SlidersHorizontal` |

Lucide icons default to `size={24}` and `strokeWidth={2}`. Pass `size={20}` where MUI
was using `fontSize="small"`. All icons accept a `className` prop for VE class application.

---

## Phase 3 — Component migration

Work bottom-up: simple leaf components first, complex interactive ones last.
After each step the app should still build and render correctly.

### 3a. `Chip/index.tsx`

The first showcase of VE's `recipe()` API. This component currently uses prop-interpolated
template literals for `done` and `outline` variants.

Create `src/components/Chip/chip.css.ts`:

```ts
import { recipe } from "@vanilla-extract/recipes"
import { style } from "@vanilla-extract/css"
import { vars } from "../../theme.css"

export const chip = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    fontSize: 15,
    lineHeight: "24px",
    borderRadius: vars.radius.full,
    padding: "8px 14px",
    minHeight: 44,
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
    transition: "transform 0.2s ease, background 0.3s ease",
    border: `1px solid ${vars.color.border}`,
    selectors: {
      "&:active": { transform: "scale(0.98)" },
    },
  },
  variants: {
    done: {
      true: {
        background: vars.color.chipDone,
        color: vars.color.textMuted,
        borderColor: vars.color.border,
      },
      false: {
        background: vars.color.chip,
        color: vars.color.text,
        borderColor: vars.color.actionSelected,
      },
    },
    outline: {
      true: {
        boxShadow: `inset 0 0 0 1px ${vars.color.textMuted}`,
      },
    },
  },
  defaultVariants: {
    done: false,
  },
})

export const chipEmoji = style({
  height: 16,
  width: 16,
  margin: "4px 4px 4px 0",
})

export const chipEmojiDone = style({
  filter: "grayscale(1) opacity(0.4)",
})

export const chipValue = recipe({
  base: { fontWeight: 500 },
  variants: {
    done: {
      true: { textDecoration: "line-through" },
      false: {},
    },
  },
})

export const chipQty = style({
  display: "inline-flex",
  alignItems: "center",
  lineHeight: "16px",
  backgroundColor: vars.color.actionSelected,
  borderRadius: vars.radius.full,
  padding: "5px 8px",
  marginLeft: 8,
})
```

Update the component to use `className={chip({ done, outline })}` etc. No more
styled-components, no more prop interpolation.

### 3b. `ShoppingLists/Placeholder/index.tsx`

Replace all `styled.*` calls with VE `style({})` objects in a `.css.ts` file alongside
the component. No interactive components — purely structural.

### 3c. `AppBar/index.tsx`

- `Shell` (`styled.div`) → VE `style({ position: "sticky", top: 0, zIndex: 20, ... })`
- `Bar` (`styled(MuiAppBar)`) → `<header>` with VE style
- `Title` (`styled(Typography)`) → `<h1>` or `<span>` with VE style
- `SideSlot`, `ProgressTrack` → VE `style({})`
- `LinearProgress` (indeterminate loading indicator) → custom `<div>` with a VE
  `keyframes` animation:

```ts
const indeterminate = keyframes({
  "0%":   { left: "-40%", width: "40%" },
  "60%":  { left: "100%", width: "40%" },
  "100%": { left: "100%", width: "0%" },
})
```

- `IconButton` usages → `<button>` elements with a shared VE button-reset style

### 3d. `Settings.tsx`

- `Screen` → VE `style({})` on `<div>`
- `Hero` (`styled(Paper)`) → `<div>` with VE style using `vars.gradient.accent` as background
- `Card` (`styled(Paper)`) → `<div>` with VE style using `vars.shadow.soft`
- `Label` (`styled(FormControlLabel)`) → plain `<label>` with VE flex layout
- `Caption`, `BetaPill` → VE `style({})`
- `Switch` → React Aria `Switch` component, styled with VE:

```tsx
import { Switch } from "react-aria-components"
```

React Aria's `Switch` renders an accessible `<label>` + hidden input + visible thumb.
You style it via the `data-selected` attribute that React Aria applies:

```ts
// switch.css.ts
export const switchTrack = style({
  width: 44,
  height: 26,
  borderRadius: vars.radius.full,
  background: vars.color.actionSelected,
  border: `1px solid ${vars.color.border}`,
  transition: "background 0.2s",
  selectors: {
    '[data-selected] &': {
      background: vars.color.primary,
    },
  },
})

export const switchThumb = style({
  width: 20,
  height: 20,
  borderRadius: vars.radius.full,
  background: vars.color.surface,
  boxShadow: vars.shadow.soft,
  transform: "translateX(2px)",
  transition: "transform 0.2s",
  selectors: {
    '[data-selected] &': {
      transform: "translateX(22px)",
    },
  },
})
```

### 3e. `ThemeProvider.tsx` — DarkModeToggle

Implement `DarkModeToggle` using React Aria's `ToggleButtonGroup`:

```tsx
import { ToggleButtonGroup, ToggleButton } from "react-aria-components"
import { useDarkMode } from "./ThemeProvider"
import { Sun, Moon, SunMoon } from "lucide-react"

export const DarkModeToggle = () => {
  const { preference, setPreference } = useDarkMode()
  return (
    <ToggleButtonGroup
      selectionMode="single"
      selectedKeys={new Set([preference])}
      onSelectionChange={keys => {
        const val = [...keys][0] as string
        if (val) setPreference(val as "light" | "dark" | "auto")
      }}
      className={toggleGroup}
    >
      <ToggleButton id="light" className={toggleBtn}><Sun size={18} /></ToggleButton>
      <ToggleButton id="dark"  className={toggleBtn}><Moon size={18} /></ToggleButton>
      <ToggleButton id="auto"  className={toggleBtn}><SunMoon size={18} /></ToggleButton>
    </ToggleButtonGroup>
  )
}
```

Style the group and buttons using VE `recipe()` with `data-selected` as the variant
signal (React Aria applies `data-selected` to the selected button).

### 3f. `AppBar/Menu.tsx` — Drawer

Replace `SwipeableDrawer` with `vaul`:

```tsx
import { Drawer } from "vaul"

// vaul API
<Drawer.Root open={open} onOpenChange={v => v ? onOpen() : onClose()}>
  <Drawer.Portal>
    <Drawer.Overlay className={overlay} />
    <Drawer.Content className={drawerContent}>
      {/* drawer contents */}
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

`vaul` drawers slide up from the bottom by default. For a side drawer (left/right), pass
`direction="left"` or `direction="right"` to `Drawer.Root`. Check the current app to
confirm which direction the MUI `SwipeableDrawer` used (likely `anchor="left"`).

- `List`/`ListItem`/`ListItemButton` → `<nav>`/`<ul>`/`<li>` + `<button>` with VE
- `Divider` → `<hr>` with VE (`border: none; borderTop: 1px solid vars.color.divider`)
- `Box sx={{ mt: "auto" }}` → `<div style={{ marginTop: "auto" }}>` (one-off inline is fine)
- `IconButton` → `<button>` with shared VE icon-button style

### 3g. Dialog system — `Dialogs/Dialog.tsx` (base) + all 9 variants

The base `Dialog.tsx` drives all 9 dialogs. Migrate it first; the variants follow the
same pattern.

React Aria dialog structure:

```tsx
import { Modal, ModalOverlay, Dialog } from "react-aria-components"

const AppDialog = ({ open, onClose, onSubmit, children }) => (
  <ModalOverlay
    isOpen={open}
    onOpenChange={v => !v && onClose()}
    className={overlay}
  >
    <Modal className={modal}>
      <Dialog className={dialog}>
        <form onSubmit={onSubmit} autoComplete="off" className={form}>
          {children}
        </form>
      </Dialog>
    </Modal>
  </ModalOverlay>
)
```

Key points:
- `ModalOverlay` handles backdrop + focus trap + Escape to close
- React Aria applies `data-entering` and `data-exiting` attributes during transitions —
  use these in VE `selectors` to trigger the CSS slide-up animation instead of MUI's
  `<Slide>` component
- Full-screen on mobile: use a CSS `@media (max-width: 600px)` rule inside the modal VE
  style — no `useMediaQuery` hook needed
- Remove `useTheme()` and `useMediaQuery()` imports entirely

```ts
// dialog.css.ts
export const overlay = style({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(8px)",
  zIndex: 100,
})

export const modal = style({
  position: "fixed",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(460px, calc(100vw - 24px))",
  maxHeight: "100dvh",
  outline: "none",
  "@media": {
    "(max-width: 600px)": {
      width: "100%",
      bottom: 0,
      left: 0,
      transform: "none",
    },
  },
})
```

**The 9 dialog variants** (`AddItemDialog`, `EditItemDialog`, `AddPlannerItemDialog`,
`EditPlannerItemDialog`, `AddPlanToListDialog`, `OpenDialog`, `ShareDialog`,
`AboutDialog`, and `DayPicker`/`NumberPicker`) all just replace:
- Their `open`/`onClose` prop handling (already matches the new API)
- `DialogTitle` → `<header>` with VE style
- `DialogContent` → `<div>` with VE style
- `DialogActions` → `<footer>` with VE style
- `Button` → React Aria `Button` (see below)
- `TextField` → React Aria `TextField` + `Input` with VE styles

React Aria `Button`:
```tsx
import { Button } from "react-aria-components"
// Styled via className prop with VE recipe (variant: "contained" | "outlined" | "text")
```

React Aria `TextField`:
```tsx
import { TextField, Label, Input } from "react-aria-components"

<TextField>
  <Label className={label}>Item name</Label>
  <Input className={input} />
</TextField>
```

### 3h. `Autocomplete/Autocomplete.tsx`

Replace `MuiAutocomplete` with React Aria's `ComboBox`. The custom `fuzzy` filter
function is **self-contained** and ports directly — no changes needed.

React Aria `ComboBox` structure:

```tsx
import { ComboBox, Label, Input, Button, Popover, ListBox, ListBoxItem } from "react-aria-components"

<ComboBox
  items={filteredItems}
  inputValue={inputValue}
  onInputChange={onInputChange}
  allowsCustomValue  // equivalent to freeSolo
>
  <Label>{label}</Label>
  <div className={inputWrapper}>
    {emojiButton}
    <Input className={comboInput} />
  </div>
  <Popover className={popover}>
    <ListBox className={listbox}>
      {item => (
        <ListBoxItem id={item} className={listItem}>
          {onDelete ? <Option option={item} onDelete={onDelete} /> : item}
        </ListBoxItem>
      )}
    </ListBox>
  </Popover>
</ComboBox>
```

Apply the `fuzzy` function to filter options before passing to `items`:

```ts
const filteredItems = useMemo(
  () => fuzzy(options, { inputValue }),
  [options, inputValue]
)
```

**Emoji popover:** Replace MUI `Popover` (with `anchorEl`) with React Aria `Popover`
triggered by a React Aria `DialogTrigger`:

```tsx
<DialogTrigger>
  <Button className={emojiBtn}><Smile size={20} /></Button>
  <Popover>
    <Dialog>
      <EmojiPicker onSelect={...} />
    </Dialog>
  </Popover>
</DialogTrigger>
```

**`IngredientAutocomplete` (multi-select):** MUI's `multiple` prop is not natively
supported in React Aria's `ComboBox`. Replace with a tag-input pattern:

- Selected items rendered as `<Chip>` components (already migrated) in a wrapping div
  above the input
- `ComboBox` operates in single-select mode; on selection, the item is added to the
  `string[]` array and the input is cleared
- Each chip has a remove button calling `onChange(value.filter(v => v !== item))`
- This is a better UX than MUI's multi Autocomplete on mobile

### 3i. `App.tsx` — BottomNavigation + FAB

**BottomNavigation** — no React Aria equivalent. Use a custom `<nav>` with styled
`<Link>` components from `react-router-dom`. Active state detected via `useLocation()`:

```tsx
const tabs = [
  { to: `/list/${listId}`, label: "List", icon: ShoppingCart },
  { to: `/list/${listId}/planner`, label: "Planner", icon: CalendarDays },
]

<nav className={bottomNav}>
  {tabs.map(tab => (
    <Link
      key={tab.to}
      to={tab.to}
      className={navItem({ active: pathname === tab.to })}
    >
      <tab.icon size={22} />
      <span>{tab.label}</span>
    </Link>
  ))}
</nav>
```

Use a VE `recipe()` with `active: { true: {...}, false: {...} }` variant.

**FAB** — React Aria `Button` with a VE style using `vars.gradient.primary`:

```ts
export const fab = style({
  position: "fixed",
  bottom: "calc(78px + max(10px, env(safe-area-inset-bottom)))",
  right: 20,
  zIndex: 16,
  width: 56,
  height: 56,
  borderRadius: vars.radius.full,
  background: vars.gradient.primary,
  boxShadow: vars.shadow.float,
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: vars.color.primaryContrast,
  transition: "filter 0.15s",
  selectors: {
    "&:hover": { filter: "brightness(1.05)" },
    "&[data-disabled]": {
      background: vars.color.divider,
      color: vars.color.textMuted,
      boxShadow: "none",
    },
  },
})
```

**`Zoom` transition on FAB** → CSS transition: `opacity` + `transform` with `transition`
property in VE. Toggle with a data attribute or conditional class.

### 3j. `Planner.tsx` + `Catalogue.tsx` — Tables

The tables here don't require React Aria's full table model (no sorting, no row
selection). Use plain semantic HTML with VE styles:

```tsx
<div className={tableContainer}>  // overflow: auto
  <table className={table}>
    <thead>
      <tr>
        <th className={th}>Day</th>
        ...
      </tr>
    </thead>
    <tbody>
      {rows.map(row => (
        <tr key={row.id} className={tr}>
          <td className={td}>{row.day}</td>
          ...
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

Map current MUI styled components:
- `TableContainer` → `<div>` with `style({ overflowX: "auto" })`
- `Table` → `<table>` with VE `style({ width: "100%", borderCollapse: "collapse" })`
- `TableHead`/`TableBody` → `<thead>`/`<tbody>` (no styling needed)
- `TableRow` → `<tr>` with optional hover style
- `TableCell`/`ChipTableCell` → `<td>` / `<th>` with VE styles

### 3k. `index.tsx` — Entry point

- Remove `createGlobalStyle` and the `GlobalStyle` component — global styles are now
  applied by importing `src/styles/global.css.ts`
- Import the global styles file: `import "./styles/global.css"` (the import itself
  registers the styles via the VE vite plugin)
- Replace `<Snackbar>` with `sonner`:

```tsx
import { Toaster, toast } from "sonner"

// In Root render:
<Toaster position="bottom-center" />

// Where notifications are triggered:
toast("You are now online!")
toast.error("You have been disconnected")
```

- Remove `ThemeProvider` from MUI, `CssBaseline` — the new `ThemeProvider` from Phase
  1.5 is already a pure React context with no MUI dependency

---

## Phase 4 — Cleanup

1. Remove all MUI + styled-components from `package.json` (see Phase 1.1)
2. Run `npm install` to sync `node_modules`
3. Run `npm run build` — fix any remaining TypeScript errors
4. Run `npm run dev` — smoke test:
   - Light/dark mode toggle (check CSS variable switching)
   - Dialog open/close + form submission
   - Autocomplete with fuzzy filter
   - Drawer swipe gesture on mobile (or DevTools mobile emulation)
   - BottomNavigation active state
   - FAB disabled state
   - Chip done/outline variants

---

## Shared UI primitives to create

These patterns appear across many components. Define them once in
`src/styles/primitives.css.ts` (or per-component `.css.ts` files — your preference):

### Icon button
```ts
export const iconButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: vars.radius.md,
  border: "none",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  transition: "background 0.15s",
  selectors: {
    "&:hover": { background: vars.color.actionSelected },
    "&[data-focus-visible]": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
})
```

### Card / surface
```ts
export const card = style({
  background: vars.color.surface,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  boxShadow: vars.shadow.soft,
})
```

### Page container
```ts
export const pageContainer = style({
  maxWidth: 720,
  margin: "0 auto",
  padding: "0 16px",
  minHeight: "100dvh",
})
```

### Section label (uppercase eyebrow text)
```ts
export const sectionLabel = style({
  margin: 0,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: vars.color.textMuted,
})
```

---

## React Aria focus / interaction state reference

React Aria applies data attributes that you target in VE `selectors`:

| State | Data attribute |
|---|---|
| Focused (keyboard) | `[data-focus-visible]` |
| Hovered | `[data-hovered]` |
| Pressed | `[data-pressed]` |
| Selected | `[data-selected]` |
| Disabled | `[data-disabled]` |
| Invalid | `[data-invalid]` |
| Entering (modal) | `[data-entering]` |
| Exiting (modal) | `[data-exiting]` |

Use these instead of `:hover`, `:focus`, etc. for consistent cross-platform behaviour
(React Aria normalises touch/pointer/keyboard interactions).

Example:
```ts
export const button = style({
  // ...base styles
  selectors: {
    "&[data-hovered]": { filter: "brightness(1.05)" },
    "&[data-pressed]": { transform: "scale(0.97)" },
    "&[data-focus-visible]": { outline: `2px solid ${vars.color.focus}` },
    "&[data-disabled]": { opacity: 0.45, cursor: "not-allowed" },
  },
})
```

---

## Notes on tricky parts

### Emotion/MUI specificity (no longer relevant after migration)
The current `&&` hacks in styled-components exist to override Emotion-injected MUI
styles. Once MUI is removed these are gone entirely. Do not carry them forward.

### `vaul` drawer direction
`vaul` defaults to bottom sheet. For a side navigation drawer, pass
`direction="left"` to `<Drawer.Root>`. Check that the swipe-to-close gesture works on
mobile after implementing — vaul supports left/right/top/bottom swipe-close directions.

### Dialog animations with React Aria
React Aria does not animate modals itself. To replicate the MUI `<Slide direction="up">`
transition, use `data-entering` and `data-exiting` attributes in your VE styles:

```ts
export const modal = style({
  // ...
  transform: "translateY(100%)",
  transition: "transform 0.25s ease",
  selectors: {
    "&[data-entering]": { transform: "translateY(0)" },
    "&[data-exiting]": { transform: "translateY(100%)" },
  },
})
```

Note: for exit animations to work, React Aria needs a transition duration to know when
the animation is complete. Pass `isDismissable` and let React Aria manage timing, or
use the `useIsSSR` / `useTransition` approach from the React Aria docs if needed.

### IngredientAutocomplete multi-select
The `multiple` mode in MUI Autocomplete does not map to any single React Aria component.
The recommended implementation:
1. Render selected items as `<Chip>` components above the `ComboBox` input
2. On `ComboBox` selection (`onSelectionChange`), push the selected item to the array
   and clear the input value
3. Each `Chip` has a small remove button (React Aria `Button`) that filters the item out
4. This pattern is more accessible and works better on mobile than a multi-value input field

### `react-masonry-css`
This package is used in `ShoppingLists/index.tsx`. It is not MUI-related and can remain
unchanged. Ensure it is kept in `dependencies`.

### Firebase, react-router-dom, emoji-mart
None of these are affected by this migration. Leave them unchanged.

### TypeScript
The project is already TypeScript. React Aria Components ships its own types — no
`@types/react-aria-components` needed. VE is fully typed. `lucide-react` is typed.
`vaul` is typed. `sonner` is typed.

---

## File-by-file checklist

- [ ] `vite.config.mjs` — add VE plugin
- [ ] `package.json` — update deps
- [ ] `src/theme.css.ts` — create (NEW)
- [ ] `src/styles/global.css.ts` — create (NEW)
- [ ] `src/components/ThemeProvider.tsx` — rewrite
- [ ] `src/index.tsx` — remove GlobalStyle/Snackbar/MUI providers, add sonner
- [ ] `src/components/App.tsx` — BottomNavigation, FAB
- [ ] `src/components/AppBar/index.tsx` — header, progress bar
- [ ] `src/components/AppBar/Menu.tsx` — vaul drawer, nav list
- [ ] `src/components/AppBar/OpenDialog.tsx`
- [ ] `src/components/AppBar/ShareDialog.tsx`
- [ ] `src/components/AppBar/AboutDialog.tsx`
- [ ] `src/components/Chip/index.tsx` — VE recipe
- [ ] `src/components/ShoppingLists/index.tsx`
- [ ] `src/components/ShoppingLists/Placeholder/index.tsx`
- [ ] `src/components/Settings.tsx`
- [ ] `src/components/Planner.tsx`
- [ ] `src/components/Catalogue.tsx`
- [ ] `src/components/Recipe.tsx`
- [ ] `src/components/Recipes/` (directory)
- [ ] `src/components/Dialogs/Dialog.tsx` — React Aria Modal base
- [ ] `src/components/Dialogs/AddItemDialog/`
- [ ] `src/components/Dialogs/EditItemDialog/`
- [ ] `src/components/Dialogs/AddPlannerItemDialog/`
- [ ] `src/components/Dialogs/EditPlannerItemDialog/`
- [ ] `src/components/Dialogs/AddPlanToListDialog/`
- [ ] `src/components/Dialogs/DayPicker.tsx`
- [ ] `src/components/Dialogs/NumberPicker.tsx`
- [ ] `src/components/Autocomplete/Autocomplete.tsx` — React Aria ComboBox
- [ ] `src/components/Autocomplete/index.tsx` — 4 variants + tag-input for multi
- [ ] `src/components/Emoji/EmojiPicker.tsx` — React Aria Popover
- [ ] `src/components/Alert.tsx`
- [ ] `src/components/Home.tsx`
