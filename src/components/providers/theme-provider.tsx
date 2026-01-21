import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

type Theme = "light" | "dark" | "auto"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  effectiveTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>(
    "brightnessPreference",
    "auto"
  )
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    "light"
  )

  useEffect(() => {
    const root = window.document.documentElement

    const updateTheme = () => {
      let resolvedTheme: "light" | "dark" = "light"

      if (theme === "auto") {
        // Use system preference
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        resolvedTheme = isDark ? "dark" : "light"
      } else {
        resolvedTheme = theme
      }

      setEffectiveTheme(resolvedTheme)

      // Update document class
      root.classList.remove("light", "dark")
      root.classList.add(resolvedTheme)
    }

    updateTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      if (theme === "auto") {
        updateTheme()
      }
    }

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
